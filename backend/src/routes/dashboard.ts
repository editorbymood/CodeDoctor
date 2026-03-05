import { Router, Request, Response } from 'express';
import { getDatabase } from '../db.js';

export const dashboardRouter = Router();

// Get aggregate stats
dashboardRouter.get('/stats', (_req: Request, res: Response) => {
    const db = getDatabase();

    const totalReviews = (db.prepare('SELECT COUNT(*) as count FROM reviews').get() as any).count;
    const completedReviews = (db.prepare('SELECT COUNT(*) as count FROM reviews WHERE status = ?').get('complete') as any).count;

    const avgScores = db.prepare(`
    SELECT 
      AVG(quality_score) as avg_quality,
      SUM(issues_critical) as total_critical,
      SUM(issues_high) as total_high,
      SUM(issues_medium) as total_medium,
      SUM(issues_low) as total_low
    FROM review_history
  `).get() as any;

    const recentReviews = db.prepare(`
    SELECT id, language, filename, status, performance_before, performance_after, created_at
    FROM reviews
    ORDER BY created_at DESC
    LIMIT 10
  `).all();

    res.json({
        overview: {
            total_reviews: totalReviews,
            completed_reviews: completedReviews,
            avg_quality_score: Math.round((avgScores?.avg_quality || 0) * 10) / 10,
            total_issues: {
                critical: avgScores?.total_critical || 0,
                high: avgScores?.total_high || 0,
                medium: avgScores?.total_medium || 0,
                low: avgScores?.total_low || 0,
            },
        },
        recent_reviews: recentReviews,
    });
});

// Get historical quality data for charts
dashboardRouter.get('/history', (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;

    const db = getDatabase();
    const history = db.prepare(`
    SELECT 
      DATE(created_at) as date,
      AVG(quality_score) as avg_score,
      COUNT(*) as review_count,
      SUM(issues_critical) as critical,
      SUM(issues_high) as high,
      SUM(issues_medium) as medium,
      SUM(issues_low) as low
    FROM review_history
    WHERE created_at >= datetime('now', ?)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all(`-${days} days`);

    res.json({ history, period_days: days });
});

// Get quality trends
dashboardRouter.get('/trends', (_req: Request, res: Response) => {
    const db = getDatabase();

    const languageBreakdown = db.prepare(`
    SELECT language, COUNT(*) as count,
      AVG(performance_before) as avg_perf_before,
      AVG(performance_after) as avg_perf_after
    FROM reviews
    WHERE status = 'complete'
    GROUP BY language
    ORDER BY count DESC
    LIMIT 10
  `).all();

    const weeklyTrend = db.prepare(`
    SELECT 
      strftime('%Y-W%W', created_at) as week,
      AVG(quality_score) as avg_score,
      COUNT(*) as reviews
    FROM review_history
    WHERE created_at >= datetime('now', '-90 days')
    GROUP BY week
    ORDER BY week ASC
  `).all();

    res.json({
        language_breakdown: languageBreakdown,
        weekly_trend: weeklyTrend,
    });
});
