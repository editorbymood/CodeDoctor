import { GoogleGenerativeAI } from '@google/generative-ai';
import { CRITIC_PROMPT } from './prompts.js';
import type { AnalysisResult } from './analyzer.js';
import { extractJSON, withRetry } from '../utils/ai-helpers.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface CritiqueValidation {
    original_id: string;
    status: 'confirmed' | 'disputed' | 'severity-adjusted';
    adjusted_severity: string | null;
    reasoning: string;
    additional_context: string | null;
}

export interface CritiqueMissedIssue {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    line_start: number;
    line_end: number;
    suggestion: string;
    cve_reference: string | null;
}

export interface CritiqueResult {
    validated_issues: CritiqueValidation[];
    missed_issues: CritiqueMissedIssue[];
    false_positives: string[];
    adjusted_scores: {
        performance_score: number;
        security_score: number;
        maintainability_score: number;
        overall_quality_score: number;
    };
    critique_summary: string;
}

function getMockCritique(analysis: AnalysisResult): CritiqueResult {
    return {
        validated_issues: analysis.issues.map((issue) => ({
            original_id: issue.id,
            status: 'confirmed' as const,
            adjusted_severity: null,
            reasoning: `Confirmed: ${issue.title} is a valid finding. ${issue.description}`,
            additional_context: issue.severity === 'critical'
                ? 'This should be addressed immediately before deployment.'
                : null,
        })),
        missed_issues: [
            {
                id: 'MISS-001',
                severity: 'medium',
                category: 'security',
                title: 'Missing rate limiting',
                description: 'No rate limiting detected. This could lead to denial-of-service or brute-force attacks.',
                line_start: 1,
                line_end: 1,
                suggestion: 'Implement rate limiting using a middleware or library like express-rate-limit.',
                cve_reference: null,
            },
        ],
        false_positives: [],
        adjusted_scores: {
            performance_score: Math.max(0, analysis.performance_score - 3),
            security_score: Math.max(0, analysis.security_score - 5),
            maintainability_score: analysis.maintainability_score,
            overall_quality_score: Math.max(0, analysis.overall_quality_score - 4),
        },
        critique_summary: `Reviewed ${analysis.issues.length} findings from the Analyzer. Confirmed all findings as valid. Identified 1 additional missed issue (rate limiting). Adjusted security score down by 5 points due to the additional vulnerability. Overall quality score adjusted to ${Math.max(0, analysis.overall_quality_score - 4)}/100.`,
    };
}

export async function runCritic(code: string, analysis: AnalysisResult): Promise<CritiqueResult> {
    if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  No GEMINI_API_KEY set — using mock critique');
        return getMockCritique(analysis);
    }

    try {
        return await withRetry(async () => {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `Original code:\n\`\`\`\n${code}\n\`\`\`\n\nAnalyzer's findings:\n${JSON.stringify(analysis, null, 2)}`;

            const result = await model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: CRITIC_PROMPT }] },
                    { role: 'model', parts: [{ text: 'I understand. I will critically review the analysis findings, validate or dispute each issue, identify missed issues, and return structured JSON.' }] },
                    { role: 'user', parts: [{ text: prompt }] },
                ],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json',
                },
            });

            const text = result.response.text();
            return extractJSON<CritiqueResult>(text);
        }, { label: 'Critic Agent', maxRetries: 3 });
    } catch (error) {
        console.error('Critic error after retries, falling back to mock:', error);
        return getMockCritique(analysis);
    }
}
