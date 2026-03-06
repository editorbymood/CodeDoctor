'use client';

import RevealWrapper from './RevealWrapper';
import styles from './BentoGrid.module.css';

// Ultra-minimalist SVG Icons
const BrainIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /></svg>);
const CodeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);
const ShieldIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const ActivityIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>);
const BarChartIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>);

const features = [
    {
        title: 'Multi-Agent CI/CD',
        description: 'A sequential pipeline of Analyzer, Critic, and Refactor agents working automatically.',
        size: 'large',
        icon: <BrainIcon />,
        visual: 'pipeline',
    },
    {
        title: 'Universal Parser',
        description: 'Syntax detection and deep AST mapping across 50+ programming ecosystems.',
        size: 'medium',
        icon: <CodeIcon />,
        visual: 'languages',
    },
    {
        title: 'Security Auditing',
        description: 'Real-time architectural scanning mapped strictly against official CVE databases.',
        size: 'small',
        icon: <ShieldIcon />,
    },
    {
        title: 'SSE Telemetry',
        description: 'Monitor the exact reasoning steps live via sub-millisecond SSE streaming.',
        size: 'small',
        icon: <ActivityIcon />,
    },
    {
        title: 'Debt Analytics',
        description: 'Track aggregate technical debt elimination and velocity metrics organization-wide.',
        size: 'medium',
        icon: <BarChartIcon />,
        visual: 'chart',
    },
];

export default function BentoGrid() {
    return (
        <RevealWrapper className={styles.bentoSection}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <h2 className={styles.bentoTitle}>The architecture of perfection.</h2>
                    <p className={styles.bentoSubtitle}>Every tool required to maintain flawless zero-debt infrastructure, built into a single elegant platform.</p>
                </div>

                <div className={styles.bentoGrid}>
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`${styles.bentoCard} ${styles[feature.size]}`}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                            }}
                        >
                            <div className={styles.cardGlow}></div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardIcon}>{feature.icon}</div>
                                <div className={styles.cardText}>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>

                                {feature.visual === 'pipeline' && (
                                    <div className={styles.visualPipeline}>
                                        <div className={styles.pipeNode}>Analyzer</div>
                                        <div className={styles.pipeArrow}>→</div>
                                        <div className={styles.pipeNode}>Critic</div>
                                        <div className={styles.pipeArrow}>→</div>
                                        <div className={styles.pipeNode}>Refactor</div>
                                    </div>
                                )}

                                {feature.visual === 'languages' && (
                                    <div className={styles.visualLangs}>
                                        <div className={styles.langItem}>TS</div>
                                        <div className={styles.langItem}>PY</div>
                                        <div className={styles.langItem}>RS</div>
                                        <div className={styles.langItem}>GO</div>
                                        <div className={styles.langItem}>C++</div>
                                    </div>
                                )}

                                {feature.visual === 'chart' && (
                                    <div className={styles.visualChart}>
                                        {[40, 60, 45, 85, 55, 100].map((h, j) => (
                                            <div key={j} className={styles.chartBar}>
                                                <div className={styles.chartBarFill} style={{ height: `${h}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RevealWrapper>
    );
}
