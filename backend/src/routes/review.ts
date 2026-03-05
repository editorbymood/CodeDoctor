import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db.js';
import { runPipeline, subscribeToReview, type PipelineEvent } from '../agents/orchestrator.js';
import { detectLanguage } from '../utils/language-detect.js';
import { rateLimiter } from '../middleware/rate-limiter.js';

export const reviewRouter = Router();

// Submit code for review (rate limited)
reviewRouter.post('/', rateLimiter(10, 60_000), async (req: Request, res: Response) => {
    try {
        const { code, language, filename } = req.body;

        if (!code || typeof code !== 'string' || code.trim().length === 0) {
            return res.status(400).json({ error: 'Code is required' });
        }

        if (code.length > 100_000) {
            return res.status(400).json({ error: 'Code too large. Maximum 100,000 characters.' });
        }

        const detectedLanguage = language || detectLanguage(code, filename);
        const reviewId = uuidv4();

        const db = getDatabase();
        db.prepare(`
      INSERT INTO reviews (id, code, language, filename, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(reviewId, code, detectedLanguage, filename || null);

        // Start pipeline in background
        runPipeline(reviewId, code, detectedLanguage).catch(err => {
            console.error(`Pipeline error for ${reviewId}:`, err);
        });

        res.status(201).json({
            id: reviewId,
            status: 'pending',
            language: detectedLanguage,
            message: 'Review started. Connect to SSE stream for real-time updates.',
            stream_url: `/api/review/${reviewId}/stream`,
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// SSE stream for real-time pipeline updates
reviewRouter.get('/:id/stream', (req: Request, res: Response) => {
    const { id } = req.params;

    const db = getDatabase();
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id) as any;

    if (!review) {
        return res.status(404).json({ error: 'Review not found' });
    }

    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    // If already complete, send the final result
    if (review.status === 'complete' && review.final_result) {
        const finalEvent: PipelineEvent = {
            stage: 'complete',
            progress: 100,
            message: '🎉 Review complete!',
            data: JSON.parse(review.final_result),
            timestamp: new Date().toISOString(),
        };
        res.write(`data: ${JSON.stringify(finalEvent)}\n\n`);
        res.end();
        return;
    }

    // Subscribe to live events
    const unsubscribe = subscribeToReview(id, (event: PipelineEvent) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);

        if (event.stage === 'complete' || event.stage === 'error') {
            setTimeout(() => {
                res.end();
            }, 100);
        }
    });

    // Clean up on disconnect
    req.on('close', () => {
        unsubscribe();
    });
});

// Get completed review results
reviewRouter.get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const db = getDatabase();
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id) as any;

    if (!review) {
        return res.status(404).json({ error: 'Review not found' });
    }

    const result = {
        id: review.id,
        status: review.status,
        language: review.language,
        filename: review.filename,
        created_at: review.created_at,
        completed_at: review.completed_at,
        ...(review.final_result ? { result: JSON.parse(review.final_result) } : {}),
    };

    res.json(result);
});

// Export review as Markdown report
reviewRouter.get('/:id/export', (req: Request, res: Response) => {
    const { id } = req.params;

    const db = getDatabase();
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id) as any;

    if (!review) {
        return res.status(404).json({ error: 'Review not found' });
    }

    if (review.status !== 'complete' || !review.final_result) {
        return res.status(400).json({ error: 'Review is not yet complete' });
    }

    const data = JSON.parse(review.final_result);
    const analysis = data.analysis;
    const critique = data.critique;
    const refactor = data.refactor;

    const issueRows = (analysis?.issues || []).map((i: any) =>
        `| ${i.severity.toUpperCase()} | ${i.category} | ${i.title} | ${i.line_start}-${i.line_end} | ${i.cve_reference || '—'} |`
    ).join('\n');

    const testBlocks = (refactor?.unit_test_suggestions || []).map((t: any) =>
        `### ${t.test_name}\n${t.description}\n\`\`\`\n${t.test_code}\n\`\`\``
    ).join('\n\n');

    const timingRows = (data.timings || []).map((t: any) =>
        `| ${t.stage} | ${t.durationLabel} |`
    ).join('\n');

    const md = `# 🩺 Code Doctor — Review Report
**ID:** \`${id}\`
**Language:** ${review.language}
**Date:** ${new Date(review.created_at).toLocaleString()}
**Total Duration:** ${data.total_duration_ms ? (data.total_duration_ms / 1000).toFixed(1) + 's' : 'N/A'}

---

## 📊 Scores

| Metric | Before | After |
|--------|--------|-------|
| Performance | ${data.performance_before}/100 | ${data.performance_after}/100 |
| Security | ${analysis?.security_score || '—'}/100 | ${refactor?.security_score_after || '—'}/100 |
| Quality | ${analysis?.overall_quality_score || '—'}/100 | ${critique?.adjusted_scores?.overall_quality_score || '—'}/100 |

## 🐛 Issues Found

| Severity | Category | Title | Lines | CVE |
|----------|----------|-------|-------|-----|
${issueRows || '| — | — | No issues found | — | — |'}

## 📝 Executive Summary
${analysis?.summary || 'N/A'}

## ⚖️ Critique Summary
${critique?.critique_summary || 'N/A'}

## 🔧 Refactoring Summary
${refactor?.refactoring_summary || 'N/A'}

## ⏱️ Agent Timings

| Agent | Duration |
|-------|----------|
${timingRows || '| — | — |'}

## 🧪 Suggested Unit Tests

${testBlocks || '_No test suggestions available._'}

## 📄 Refactored Code

\`\`\`${review.language}
${refactor?.refactored_code || '// No refactored code available'}
\`\`\`

---

*Generated by Code Doctor • ${new Date().toISOString()}*
`;

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="code-doctor-report-${id.slice(0, 8)}.md"`);
    res.send(md);
});

// Delete a review
reviewRouter.delete('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const db = getDatabase();
    const review = db.prepare('SELECT id FROM reviews WHERE id = ?').get(id) as any;

    if (!review) {
        return res.status(404).json({ error: 'Review not found' });
    }

    db.prepare('DELETE FROM review_history WHERE review_id = ?').run(id);
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

    res.json({ message: 'Review deleted', id });
});

// List all reviews with pagination
reviewRouter.get('/', (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const db = getDatabase();

    const total = (db.prepare('SELECT COUNT(*) as count FROM reviews').get() as any).count;
    const reviews = db.prepare(`
    SELECT id, language, filename, status, performance_before, performance_after, created_at, completed_at
    FROM reviews
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);

    res.json({
        reviews,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
});
