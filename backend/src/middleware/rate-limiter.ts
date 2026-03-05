import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
    timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        entry.timestamps = entry.timestamps.filter(t => now - t < 60_000);
        if (entry.timestamps.length === 0) store.delete(key);
    }
}, 5 * 60_000);

export function rateLimiter(maxRequests: number = 10, windowMs: number = 60_000) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();

        if (!store.has(key)) {
            store.set(key, { timestamps: [] });
        }

        const entry = store.get(key)!;
        // Remove timestamps outside the window
        entry.timestamps = entry.timestamps.filter(t => now - t < windowMs);

        if (entry.timestamps.length >= maxRequests) {
            const retryAfter = Math.ceil((entry.timestamps[0] + windowMs - now) / 1000);
            res.status(429).json({
                error: 'Too many requests',
                message: `Rate limit exceeded. Max ${maxRequests} reviews per minute.`,
                retry_after_seconds: retryAfter,
            });
            return;
        }

        entry.timestamps.push(now);
        next();
    };
}
