import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import { reviewRouter } from './routes/review.js';
import { dashboardRouter } from './routes/dashboard.js';
import { githubRouter } from './routes/github.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Initialize database
initDatabase();

// Routes
app.use('/api/review', reviewRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/github', githubRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🩺 Code Doctor API running on http://localhost:${PORT}`);
});

export default app;
