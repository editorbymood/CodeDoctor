import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db.js';

export const githubRouter = Router();

// Connect a repository
githubRouter.post('/connect', (req: Request, res: Response) => {
    const { github_url, name, owner, default_branch } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Repository name is required' });
    }

    const db = getDatabase();
    const id = uuidv4();

    db.prepare(`
    INSERT INTO repositories (id, github_url, name, owner, default_branch)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, github_url || null, name, owner || null, default_branch || 'main');

    res.status(201).json({
        id,
        name,
        github_url,
        owner,
        default_branch: default_branch || 'main',
        message: 'Repository connected successfully',
    });
});

// List connected repositories
githubRouter.get('/repos', (_req: Request, res: Response) => {
    const db = getDatabase();
    const repos = db.prepare(`
    SELECT * FROM repositories ORDER BY connected_at DESC
  `).all();

    res.json({ repositories: repos });
});

// Webhook receiver for PR events
githubRouter.post('/webhook', (req: Request, res: Response) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`📨 GitHub webhook received: ${event}`);

    if (event === 'pull_request') {
        const action = payload.action;
        const prNumber = payload.number;
        const repoName = payload.repository?.full_name;

        console.log(`  PR #${prNumber} ${action} on ${repoName}`);

        // In production, this would:
        // 1. Fetch PR diff from GitHub API
        // 2. Run the review pipeline on changed files
        // 3. Post review comments back to the PR

        res.status(200).json({
            status: 'received',
            event,
            action,
            pr_number: prNumber,
            message: 'Webhook processed. Review pipeline would be triggered in production.',
        });
    } else {
        res.status(200).json({ status: 'ignored', event });
    }
});

// Get webhook status
githubRouter.get('/status', (_req: Request, res: Response) => {
    res.json({
        github_integration: {
            configured: !!(process.env.GITHUB_APP_ID && process.env.GITHUB_PRIVATE_KEY),
            webhook_url: '/api/github/webhook',
            supported_events: ['pull_request'],
        },
    });
});
