'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DiffViewer from '@/components/DiffViewer';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

// SVGs
const CheckShield = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>);
const AlertTriangle = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>);
const ActivityPulse = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>);
const SearchIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const TargetIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
const TerminalIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>);
const WrenchIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>);
const InfoIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>);

interface PipelineEvent { stage: string; progress: number; message: string; data?: any; timestamp: string; }
interface Issue { id: string; severity: 'critical' | 'high' | 'medium' | 'low'; category: string; title: string; description: string; line_start: number; line_end: number; suggestion: string; cve_reference: string | null; }

const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const SEVERITY_COLORS: Record<string, string> = { critical: '#e11d48', high: '#f97316', medium: '#eab308', low: '#ea580c' };
const SEVERITY_BG: Record<string, string> = { critical: 'rgba(225, 29, 72, 0.1)', high: 'rgba(249, 115, 22, 0.1)', medium: 'rgba(234, 179, 8, 0.1)', low: 'rgba(234, 88, 12, 0.1)' };

const STAGE_ICONS: Record<string, React.ReactNode> = {
    analyzing: <SearchIcon />, critiquing: <TargetIcon />, refactoring: <WrenchIcon />, complete: <CheckShield />, error: <AlertTriangle />
};

export default function ReviewResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { showToast } = useToast();
    const [events, setEvents] = useState<PipelineEvent[]>([]);
    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isStreaming, setIsStreaming] = useState(true);
    const [filterSeverity, setFilterSeverity] = useState<string>('all');

    useEffect(() => {
        const eventSource = new EventSource(`${API_URL}/api/review/${id}/stream`);
        eventSource.onmessage = (event) => {
            const data: PipelineEvent = JSON.parse(event.data);
            setEvents(prev => [...prev, data]);
            if (data.stage === 'complete' && data.data) { setResult(data.data); setIsStreaming(false); eventSource.close(); }
            else if (data.stage === 'error') { setIsStreaming(false); eventSource.close(); }
        };
        eventSource.onerror = () => {
            fetch(`${API_URL}/api/review/${id}`).then(res => res.json()).then(data => { if (data.result) { setResult(data.result); setIsStreaming(false); } }).catch(() => { });
            eventSource.close();
            setIsStreaming(false);
        };
        return () => eventSource.close();
    }, [id]);

    const currentStage = events.length > 0 ? events[events.length - 1].stage : 'pending';
    const progress = events.length > 0 ? events[events.length - 1].progress : 0;
    const allIssues: Issue[] = result ? [...(result.analysis?.issues || []), ...(result.critique?.missed_issues || [])] : [];
    const filteredIssues = filterSeverity === 'all' ? allIssues : allIssues.filter(i => i.severity === filterSeverity);
    const sortedIssues = [...filteredIssues].sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99));

    const copyToClipboard = async (text: string) => {
        try { await navigator.clipboard.writeText(text); showToast('Copied to buffer', 'success'); }
        catch { showToast('Operation failed (HTTPS context required)', 'error'); }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'var(--accent-emerald)';
        if (score >= 70) return 'var(--accent-amber)';
        return 'var(--accent-violet)';
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.ambientGlowTop}></div>
            <Navbar />
            <main className={styles.main}>
                <div className="container">

                    {/* Core Telemetry Header */}
                    <div className={styles.header}>
                        <div className={styles.headerTitleGroup}>
                            <div className={styles.liveIndicator}>
                                {isStreaming ? (
                                    <><div className={styles.liveDot}></div> <span>STREAMING ACTIVE [TX: {id.split('-')[0]}]</span></>
                                ) : (
                                    <><CheckShield /> <span style={{ color: 'var(--accent-emerald)' }}>TELEMETRY COMPLETE</span></>
                                )}
                            </div>
                            <h1 className={styles.title}>Scan Report</h1>
                            <div className={styles.langTag}>{result ? result.language : 'ANALYZING...'}</div>
                        </div>
                        {!isStreaming && (
                            <button className={styles.ghostBtn} onClick={() => copyToClipboard(window.location.href)}>
                                [ SHARE REPORT ]
                            </button>
                        )}
                    </div>

                    <div className={styles.layoutGrid}>
                        {/* Left Column - Progress & Logs */}
                        <div className={styles.leftColumn}>
                            <div className={styles.glassPanel}>
                                <h2 className={styles.panelTitle}>Pipeline Status</h2>

                                <div className={styles.progressData}>
                                    <div className={styles.radialGraph}>
                                        <svg className={styles.progressSvg} viewBox="0 0 100 100">
                                            <circle className={styles.progressBg} cx="50" cy="50" r="45" />
                                            <circle className={styles.progressValue} cx="50" cy="50" r="45" style={{ strokeDashoffset: `${283 - (283 * progress) / 100}` }} />
                                        </svg>
                                        <div className={styles.percentageText}>{progress}%</div>
                                    </div>
                                    <div className={styles.stageData}>
                                        <div className={styles.stageLabel}>CURRENT STAGE</div>
                                        <div className={styles.stageActive}>{currentStage.toUpperCase()}</div>
                                    </div>
                                </div>

                                <div className={styles.eventLog}>
                                    {events.slice().reverse().map((event, idx) => (
                                        <div key={idx} className={`${styles.logEntry} ${idx === 0 && isStreaming ? styles.logActive : ''}`}>
                                            <div className={styles.logIcon}>
                                                {STAGE_ICONS[event.stage] || <ActivityPulse />}
                                            </div>
                                            <div className={styles.logContent}>
                                                <div className={styles.logHeader}>
                                                    <span className={styles.logStage}>{event.stage}</span>
                                                    <span className={styles.logTime}>{new Date(event.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                                <div className={styles.logMessage}>{event.message}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {events.length === 0 && (
                                        <div className={styles.logEntry}><div className={styles.logIcon}><ActivityPulse /></div><div className={styles.logContent}><div className={styles.logMessage}>Awaiting socket connection...</div></div></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Results */}
                        <div className={styles.rightColumn}>
                            {isStreaming && !result ? (
                                <div className={`${styles.glassPanel} ${styles.streamingPlaceholder}`}>
                                    <div className={styles.hologramScan}></div>
                                    <TerminalIcon />
                                    <h3>Processing AST Payload</h3>
                                    <p>Agents are actively engaging the codebase. Multi-stage structural and security analysis in progress...</p>
                                </div>
                            ) : result ? (
                                <div className={`${styles.glassPanel} ${styles.resultsPanel}`}>

                                    {/* Scores Overlay */}
                                    <div className={styles.scoreRow}>
                                        <div className={styles.scoreCard}>
                                            <span className={styles.sCardLabel}>Quality Score</span>
                                            <div className={styles.sCardValue} style={{ color: getScoreColor(result.analysis?.overall_quality_score || 0) }}>
                                                {result.analysis?.overall_quality_score || 0}
                                            </div>
                                        </div>
                                        <div className={styles.scoreCard}>
                                            <span className={styles.sCardLabel}>Security</span>
                                            <div className={styles.sCardValue} style={{ color: getScoreColor(result.analysis?.security_score || 0) }}>
                                                {result.analysis?.security_score || 0}
                                            </div>
                                        </div>
                                        <div className={styles.scoreCard}>
                                            <span className={styles.sCardLabel}>Performance</span>
                                            <div className={styles.sCardValue} style={{ color: getScoreColor(result.analysis?.performance_score || 0) }}>
                                                {result.analysis?.performance_score || 0} &rarr; {result.refactor?.performance_score_after || 0}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Tabs */}
                                    <div className={styles.tabNav}>
                                        {['overview', 'issues', 'diff', 'tests'].map(tab => (
                                            <button
                                                key={tab}
                                                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                [{tab.toUpperCase()}]
                                            </button>
                                        ))}
                                    </div>

                                    <div className={styles.tabBody}>
                                        {activeTab === 'overview' && (
                                            <div className={styles.overviewTab}>
                                                <div className={styles.oBox}>
                                                    <ActivityPulse />
                                                    <p>{result.analysis?.summary}</p>
                                                </div>
                                                {result.critique && (
                                                    <div className={styles.oBox}>
                                                        <TargetIcon />
                                                        <p>{result.critique.critique_summary}</p>
                                                    </div>
                                                )}
                                                {result.refactor && (
                                                    <div className={styles.oBox}>
                                                        <WrenchIcon />
                                                        <p>{result.refactor.refactoring_summary}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'issues' && (
                                            <div className={styles.issuesTab}>
                                                <div className={styles.filterRow}>
                                                    <span>FILTER SEVERITY:</span>
                                                    {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                                                        <button
                                                            key={sev}
                                                            className={`${styles.filterBtn} ${filterSeverity === sev ? styles.filterActive : ''}`}
                                                            onClick={() => setFilterSeverity(sev)}
                                                            style={filterSeverity === sev && sev !== 'all' ? { borderColor: SEVERITY_COLORS[sev], color: SEVERITY_COLORS[sev] } : {}}
                                                        >
                                                            {sev.toUpperCase()}
                                                        </button>
                                                    ))}
                                                </div>

                                                {sortedIssues.length === 0 ? (
                                                    <div className={styles.zeroState}>
                                                        <CheckShield />
                                                        <h3>No Issues Detected</h3>
                                                        <p>Code meets all architectural and security constraints.</p>
                                                    </div>
                                                ) : (
                                                    <div className={styles.issueList}>
                                                        {sortedIssues.map(issue => (
                                                            <div key={issue.id} className={styles.issueCard} style={{ borderLeftColor: SEVERITY_COLORS[issue.severity] }}>
                                                                <div className={styles.iCardHeader}>
                                                                    <div className={styles.iBadge} style={{ background: SEVERITY_BG[issue.severity], color: SEVERITY_COLORS[issue.severity] }}>
                                                                        {issue.severity.toUpperCase()}
                                                                    </div>
                                                                    <span className={styles.iLine}>L{issue.line_start}-{issue.line_end}</span>
                                                                </div>
                                                                <h4 className={styles.iTitle}>{issue.title}</h4>
                                                                <p className={styles.iDesc}>{issue.description}</p>
                                                                <div className={styles.iSuggest}>
                                                                    <strong>[SUGGESTION]</strong> {issue.suggestion}
                                                                </div>
                                                                {issue.cve_reference && (
                                                                    <div className={styles.iCve}>
                                                                        <AlertTriangle /> {issue.cve_reference}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'diff' && (
                                            <div className={styles.diffTab}>
                                                {result.refactor && result.refactor.refactored_code ? (
                                                    <div className={styles.diffContainer}>
                                                        <div className={styles.diffActions}>
                                                            <button className={styles.ghostBtn} onClick={() => copyToClipboard(result.refactor!.refactored_code)}>
                                                                [COPY REFACTORED CODE]
                                                            </button>
                                                        </div>
                                                        <DiffViewer
                                                            originalCode={result.code}
                                                            refactoredCode={result.refactor.refactored_code}
                                                            language={result.language}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={styles.zeroState}>
                                                        <InfoIcon />
                                                        <p>No refactoring changes were applied or agents are still processing.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'tests' && (
                                            <div className={styles.testsTab}>
                                                {result.refactor?.unit_test_suggestions && result.refactor.unit_test_suggestions.length > 0 ? (
                                                    <div className={styles.testList}>
                                                        {result.refactor.unit_test_suggestions.map((test: any, i: number) => (
                                                            <div key={i} className={styles.testCard}>
                                                                <div className={styles.tCardHeader}>
                                                                    <CheckShield /> {test.test_name}
                                                                </div>
                                                                <p className={styles.tCardDesc}>{test.description}</p>
                                                                <pre className={styles.tCardCode}><code>{test.test_code}</code></pre>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={styles.zeroState}>
                                                        <InfoIcon />
                                                        <p>No unit test suggestions available.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ) : null}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
