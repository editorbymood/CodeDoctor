import { runAnalyzer, type AnalysisResult } from './analyzer.js';
import { runCritic, type CritiqueResult } from './critic.js';
import { runRefactor, type RefactorResult } from './refactor.js';
import { getDatabase } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { createPatch } from 'diff';
import { timed } from '../utils/ai-helpers.js';

export type PipelineStage = 'analyzing' | 'critiquing' | 'refactoring' | 'complete' | 'error';

export interface PipelineEvent {
    stage: PipelineStage;
    progress: number;       // 0-100
    message: string;
    data?: any;
    timestamp: string;
}

export interface StageTiming {
    stage: string;
    durationMs: number;
    durationLabel: string;
}

export interface FinalReviewResult {
    id: string;
    code: string;
    language: string;
    analysis: AnalysisResult;
    critique: CritiqueResult;
    refactor: RefactorResult;
    diff: string;
    performance_before: number;
    performance_after: number;
    timings: StageTiming[];
    total_duration_ms: number;
    created_at: string;
}

// Store active SSE connections
const activeStreams = new Map<string, ((event: PipelineEvent) => void)[]>();

export function subscribeToReview(reviewId: string, callback: (event: PipelineEvent) => void): () => void {
    if (!activeStreams.has(reviewId)) {
        activeStreams.set(reviewId, []);
    }
    activeStreams.get(reviewId)!.push(callback);

    return () => {
        const callbacks = activeStreams.get(reviewId);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
            if (callbacks.length === 0) activeStreams.delete(reviewId);
        }
    };
}

function emitEvent(reviewId: string, event: PipelineEvent): void {
    const callbacks = activeStreams.get(reviewId);
    if (callbacks) {
        callbacks.forEach(cb => cb(event));
    }
}

function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

export async function runPipeline(
    reviewId: string,
    code: string,
    language: string
): Promise<FinalReviewResult> {
    const db = getDatabase();
    const pipelineStart = performance.now();
    const timings: StageTiming[] = [];

    try {
        // Stage 1: Analysis
        emitEvent(reviewId, {
            stage: 'analyzing',
            progress: 10,
            message: '🔍 Analyzer Agent is scanning your code...',
            timestamp: new Date().toISOString(),
        });

        db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run('analyzing', reviewId);
        const { result: analysis, durationMs: analysisDuration } = await timed(() => runAnalyzer(code, language));
        timings.push({ stage: 'Analyzer', durationMs: analysisDuration, durationLabel: formatDuration(analysisDuration) });

        emitEvent(reviewId, {
            stage: 'analyzing',
            progress: 35,
            message: `✅ Analysis complete in ${formatDuration(analysisDuration)} — found ${analysis.issues.length} issues`,
            data: { issueCount: analysis.issues.length, durationMs: analysisDuration, scores: { performance: analysis.performance_score, security: analysis.security_score } },
            timestamp: new Date().toISOString(),
        });

        db.prepare('UPDATE reviews SET analysis_result = ? WHERE id = ?')
            .run(JSON.stringify(analysis), reviewId);

        // Stage 2: Critique
        emitEvent(reviewId, {
            stage: 'critiquing',
            progress: 40,
            message: '⚖️ Critic Agent is validating findings...',
            timestamp: new Date().toISOString(),
        });

        db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run('critiquing', reviewId);
        const { result: critique, durationMs: critiqueDuration } = await timed(() => runCritic(code, analysis));
        timings.push({ stage: 'Critic', durationMs: critiqueDuration, durationLabel: formatDuration(critiqueDuration) });

        emitEvent(reviewId, {
            stage: 'critiquing',
            progress: 65,
            message: `✅ Critique complete in ${formatDuration(critiqueDuration)} — ${critique.validated_issues.filter(v => v.status === 'confirmed').length} confirmed, ${critique.missed_issues.length} new`,
            data: { confirmed: critique.validated_issues.length, missed: critique.missed_issues.length, durationMs: critiqueDuration },
            timestamp: new Date().toISOString(),
        });

        db.prepare('UPDATE reviews SET critique_result = ? WHERE id = ?')
            .run(JSON.stringify(critique), reviewId);

        // Stage 3: Refactoring
        emitEvent(reviewId, {
            stage: 'refactoring',
            progress: 70,
            message: '🔧 Refactor Agent is generating improved code...',
            timestamp: new Date().toISOString(),
        });

        db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run('refactoring', reviewId);
        const { result: refactor, durationMs: refactorDuration } = await timed(() => runRefactor(code, language, analysis, critique));
        timings.push({ stage: 'Refactor', durationMs: refactorDuration, durationLabel: formatDuration(refactorDuration) });

        // Generate diff
        const diff = createPatch('code.' + getExtension(language), code, refactor.refactored_code, 'Original', 'Refactored');

        emitEvent(reviewId, {
            stage: 'refactoring',
            progress: 95,
            message: `✅ Refactoring complete in ${formatDuration(refactorDuration)} — ${refactor.changes_made.length} improvements applied`,
            data: { changesCount: refactor.changes_made.length, durationMs: refactorDuration },
            timestamp: new Date().toISOString(),
        });

        const totalDuration = Math.round(performance.now() - pipelineStart);

        // Finalize
        const finalResult: FinalReviewResult = {
            id: reviewId,
            code,
            language,
            analysis,
            critique,
            refactor,
            diff,
            performance_before: analysis.performance_score,
            performance_after: refactor.performance_score_after,
            timings,
            total_duration_ms: totalDuration,
            created_at: new Date().toISOString(),
        };

        db.prepare(`
      UPDATE reviews SET 
        status = 'complete',
        refactor_result = ?,
        final_result = ?,
        performance_before = ?,
        performance_after = ?,
        completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
            JSON.stringify(refactor),
            JSON.stringify(finalResult),
            analysis.performance_score,
            refactor.performance_score_after,
            reviewId
        );

        // Store in review_history
        const historyId = uuidv4();
        db.prepare(`
      INSERT INTO review_history (id, review_id, quality_score, issues_critical, issues_high, issues_medium, issues_low)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            historyId,
            reviewId,
            critique.adjusted_scores.overall_quality_score,
            analysis.issues.filter(i => i.severity === 'critical').length,
            analysis.issues.filter(i => i.severity === 'high').length,
            analysis.issues.filter(i => i.severity === 'medium').length,
            analysis.issues.filter(i => i.severity === 'low').length,
        );

        emitEvent(reviewId, {
            stage: 'complete',
            progress: 100,
            message: `🎉 Review complete in ${formatDuration(totalDuration)}!`,
            data: finalResult,
            timestamp: new Date().toISOString(),
        });

        return finalResult;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run('error', reviewId);

        emitEvent(reviewId, {
            stage: 'error',
            progress: 0,
            message: `❌ Pipeline error: ${errorMsg}`,
            timestamp: new Date().toISOString(),
        });

        throw error;
    }
}

function getExtension(language: string): string {
    const map: Record<string, string> = {
        javascript: 'js', typescript: 'ts', python: 'py', java: 'java',
        cpp: 'cpp', c: 'c', csharp: 'cs', go: 'go', rust: 'rs',
        ruby: 'rb', php: 'php', swift: 'swift', kotlin: 'kt',
        scala: 'scala', dart: 'dart', lua: 'lua', perl: 'pl',
        r: 'r', sql: 'sql', html: 'html', css: 'css',
    };
    return map[language.toLowerCase()] || 'txt';
}
