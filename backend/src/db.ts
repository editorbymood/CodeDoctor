import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const DB_PATH = path.join(__dirname, '..', 'data', 'codedoctor.db');

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initDatabase(): void {
  const database = getDatabase();

  database.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      filename TEXT,
      status TEXT DEFAULT 'pending',
      analysis_result TEXT,
      critique_result TEXT,
      refactor_result TEXT,
      final_result TEXT,
      performance_before INTEGER,
      performance_after INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      repository_id TEXT,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS repositories (
      id TEXT PRIMARY KEY,
      github_url TEXT,
      name TEXT NOT NULL,
      owner TEXT,
      default_branch TEXT DEFAULT 'main',
      connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_review_at DATETIME,
      total_reviews INTEGER DEFAULT 0,
      avg_quality_score REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS review_history (
      id TEXT PRIMARY KEY,
      repository_id TEXT,
      review_id TEXT NOT NULL,
      quality_score REAL,
      issues_critical INTEGER DEFAULT 0,
      issues_high INTEGER DEFAULT 0,
      issues_medium INTEGER DEFAULT 0,
      issues_low INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id),
      FOREIGN KEY (review_id) REFERENCES reviews(id)
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
    CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);
    CREATE INDEX IF NOT EXISTS idx_history_repo ON review_history(repository_id);
    CREATE INDEX IF NOT EXISTS idx_history_created ON review_history(created_at);
  `);
}
