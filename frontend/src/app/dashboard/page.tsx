'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

// Hyper-Premium SVGs
const ActivityPulse = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
const ScanBorderIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
);
const ShieldCheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
);
const TerminalErrorIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
);

interface DashboardStats {
    overview: {
        total_reviews: number;
        completed_reviews: number;
        avg_quality_score: number;
        total_issues: { critical: number; high: number; medium: number; low: number; };
    };
    recent_reviews: any[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/dashboard/stats`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setStats({
                    overview: {
                        total_reviews: 0, completed_reviews: 0, avg_quality_score: 0,
                        total_issues: { critical: 0, high: 0, medium: 0, low: 0 },
                    },
                    recent_reviews: [],
                });
                setLoading(false);
            });
    }, []);

    const totalIssues = stats
        ? stats.overview.total_issues.critical + stats.overview.total_issues.high +
        stats.overview.total_issues.medium + stats.overview.total_issues.low
        : 0;

    // Chart Generation Logic
    const chartPoints = "0,80 10,70 20,75 30,50 40,60 50,40 60,45 70,25 80,35 90,15 100,20";

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.ambientGlowTop}></div>
            <Navbar />

            <main className={styles.main}>
                <div className="container">

                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerTitleGroup}>
                            <div className={styles.liveIndicator}>
                                <div className={styles.liveDot}></div>
                                <span>SYSTEM ONLINE</span>
                            </div>
                            <h1 className={styles.title}>Command Center</h1>
                            <p className={styles.subtitle}>Real-time telemetry and structural codebase analysis.</p>
                        </div>
                        <Link href="/review" className={styles.btnPrimary}>
                            [ Initialize New Scan ]
                        </Link>
                    </div>

                    {loading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.loadingSpinner}></div>
                        </div>
                    ) : (
                        <div className={styles.dashboardGrid}>

                            {/* Telemetry Row */}
                            <div className={styles.telemetryRow}>
                                <div className={styles.telemetryCard}>
                                    <div className={styles.tCardHeader}>
                                        <ScanBorderIcon /> <span>Total Scans</span>
                                    </div>
                                    <div className={styles.tCardValue}>{stats?.overview.total_reviews || 0}</div>
                                    <div className={styles.tCardSparkline}></div>
                                </div>

                                <div className={styles.telemetryCard}>
                                    <div className={styles.tCardHeader}>
                                        <ShieldCheckIcon /> <span style={{ color: '#10b981' }}>Clearance Rate</span>
                                    </div>
                                    <div className={styles.tCardValue}>
                                        {stats?.overview.total_reviews ? Math.round((stats.overview.completed_reviews / stats.overview.total_reviews) * 100) : 0}%
                                    </div>
                                    <div className={styles.tCardSparkline} style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }}></div>
                                </div>

                                <div className={styles.telemetryCard}>
                                    <div className={styles.tCardHeader}>
                                        <ActivityPulse /> <span style={{ color: '#c084fc' }}>Avg Quality</span>
                                    </div>
                                    <div className={styles.tCardValue}>
                                        {stats?.overview.avg_quality_score || 0}<span className={styles.tCardSuffix}>/100</span>
                                    </div>
                                    <div className={styles.tCardSparkline} style={{ background: 'linear-gradient(90deg, transparent, #c084fc, transparent)' }}></div>
                                </div>

                                <div className={styles.telemetryCard}>
                                    <div className={styles.tCardHeader}>
                                        <TerminalErrorIcon /> <span style={{ color: '#ef4444' }}>Vulnerabilities</span>
                                    </div>
                                    <div className={styles.tCardValue}>{totalIssues}</div>
                                    <div className={styles.tCardSparkline} style={{ background: 'linear-gradient(90deg, transparent, #ef4444, transparent)' }}></div>
                                </div>
                            </div>

                            {/* Main Body */}
                            <div className={styles.mainContent}>

                                {/* Left Column */}
                                <div className={styles.leftColumn}>
                                    {/* Quality Velocity Chart */}
                                    <div className={styles.glassPanel}>
                                        <div className={styles.panelHeader}>
                                            <h2 className={styles.panelTitle}>Quality Velocity</h2>
                                            <span className={styles.panelBadge}>Rolling 30 Days</span>
                                        </div>
                                        <div className={styles.chartContainer}>
                                            {/* SVG Glowing Line Chart */}
                                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svgChart}>
                                                <defs>
                                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                                                        <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                                                    </linearGradient>
                                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                        <feGaussianBlur stdDeviation="2" result="blur" />
                                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                    </filter>
                                                </defs>
                                                {/* Grid Lines */}
                                                <g className={styles.chartGrid}>
                                                    <line x1="0" y1="25" x2="100" y2="25" />
                                                    <line x1="0" y1="50" x2="100" y2="50" />
                                                    <line x1="0" y1="75" x2="100" y2="75" />
                                                </g>
                                                {/* Area Fill */}
                                                <polygon points={`0,100 ${chartPoints} 100,100`} fill="url(#areaGradient)" />
                                                {/* Line */}
                                                <polyline points={chartPoints} fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#glow)" />
                                            </svg>
                                            {/* X-Axis labels */}
                                            <div className={styles.chartLabels}>
                                                <span>Nov 1</span><span>Nov 15</span><span>Dec 1</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic Issue Breakdown Matrix */}
                                    <div className={styles.glassPanel}>
                                        <h2 className={styles.panelTitle}>Threat Matrix</h2>
                                        <div className={styles.matrixGrid}>
                                            <ThreatMatrixNode severity="CRITICAL" count={stats?.overview.total_issues.critical || 0} color="#ef4444" />
                                            <ThreatMatrixNode severity="HIGH" count={stats?.overview.total_issues.high || 0} color="#f97316" />
                                            <ThreatMatrixNode severity="MEDIUM" count={stats?.overview.total_issues.medium || 0} color="#eab308" />
                                            <ThreatMatrixNode severity="LOW" count={stats?.overview.total_issues.low || 0} color="#38bdf8" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Data Table */}
                                <div className={`${styles.glassPanel} ${styles.rightColumn}`}>
                                    <div className={styles.panelHeader}>
                                        <h2 className={styles.panelTitle}>Recent Executions</h2>
                                        <div className={styles.terminalCursor}>_</div>
                                    </div>

                                    {stats?.recent_reviews && stats.recent_reviews.length > 0 ? (
                                        <div className={styles.dataTable}>
                                            <div className={styles.dataTableHeader}>
                                                <div className={styles.colId}>TX_ID</div>
                                                <div className={styles.colStatus}>STATUS</div>
                                                <div className={styles.colDelta}>DELTA</div>
                                                <div className={styles.colAction}></div>
                                            </div>

                                            {stats.recent_reviews.map((review: any) => (
                                                <div key={review.id} className={styles.dataTableRow}>
                                                    <div className={styles.colId}>
                                                        <span className={styles.hashText}>{review.id.substring(0, 8)}</span>
                                                        <span className={styles.langTag}>{review.language}</span>
                                                    </div>
                                                    <div className={styles.colStatus}>
                                                        <div className={`${styles.statusIndicator} ${styles[`status_${review.status}`] || ''}`}>
                                                            <div className={styles.pulseDot}></div>
                                                            {review.status}
                                                        </div>
                                                    </div>
                                                    <div className={styles.colDelta}>
                                                        <span className={styles.deltaBefore}>{review.performance_before ?? '--'}</span>
                                                        <span className={styles.deltaArrow}>→</span>
                                                        <span className={styles.deltaAfter}>{review.performance_after ?? '--'}</span>
                                                    </div>
                                                    <div className={styles.colAction}>
                                                        <Link href={`/review/${review.id}`} className={styles.linkArrow}>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyTerminal}>
                                            <code>&gt; SELECT * FROM reviews LIMIT 10;</code>
                                            <code className={styles.emptyResult}>0 rows returned. System idling.</code>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function ThreatMatrixNode({ severity, count, color }: { severity: string; count: number; color: string }) {
    return (
        <div className={styles.matrixNode}>
            <div className={styles.mNodeHeader}>
                <div className={styles.mNodeDot} style={{ background: color, boxShadow: `0 0 10px ${color}` }}></div>
                <span className={styles.mNodeLabel}>{severity}</span>
            </div>
            <div className={styles.mNodeValue} style={{ color }}>
                {count.toString().padStart(2, '0')}
            </div>
        </div>
    );
}
