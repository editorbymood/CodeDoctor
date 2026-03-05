'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

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

export default function Home() {
  const [codeVersion, setCodeVersion] = useState<'raw' | 'fixed'>('raw');
  const [typedCode, setTypedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const rawCode = `async function processPayment(req) {\n  const amount = req.body.amount;\n  const userId = req.body.userId;\n  // VULNERABLE: Direct DB array access\n  const userRecord = await db.query(\n    "SELECT * FROM wallets WHERE id="+userId\n  );\n  return { success: true, balance: userRecord[0] };\n}`;
  const fixedCode = `async function processPayment(req) {\n  const { amount, userId } = req.body;\n  // SECURE: Parameterized query\n  const userRecord = await db.query(\n    "SELECT * FROM wallets WHERE id=$1", [userId]\n  );\n  if (!userRecord || !userRecord[0]) throw new Error();\n  return { success: true, balance: userRecord[0] };\n}`;

  useEffect(() => {
    let currentCode = codeVersion === 'raw' ? rawCode : fixedCode;
    let index = 0;
    setTypedCode('');
    setIsTyping(true);

    const interval = setInterval(() => {
      setTypedCode(currentCode.substring(0, index));
      index++;
      if (index > currentCode.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setCodeVersion(prev => prev === 'raw' ? 'fixed' : 'raw'), 4000);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [codeVersion, rawCode, fixedCode]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll(`.${styles.revealSection}`);
    elements.forEach(el => observer.observe(el));
    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* Subtle Framer-style background glow */}
      <div className={styles.ambientGlowTop}></div>
      <div className={styles.ambientGlowBottom}></div>

      <Navbar />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={`${styles.heroContent} ${styles.revealSection}`}>
              <div className={styles.pillBadge}>
                <span className={styles.pillBadgeInner}>Code Doctor 2.0</span>
                <span className={styles.pillBadgeText}>The intelligence era.</span>
              </div>

              <h1 className={styles.title}>
                Code reviews, <br />
                <span className={styles.titleGradient}>automated.</span>
              </h1>

              <p className={styles.subtitle}>
                An elite multi-agent system that autonomously audits, critiques, and perfectly refactors your entire codebase in seconds.
              </p>

              <div className={styles.actions}>
                <Link href="/review" className={styles.btnPrimary}>
                  Start Free Review
                </Link>
                <Link href="/dashboard" className={styles.btnSecondary}>
                  View Dashboard
                </Link>
              </div>
            </div>

            {/* Framer-Style Floating Window */}
            <div className={`${styles.editorWrapper} ${styles.revealSection}`}>
              <div className={styles.glassWindow}>
                <div className={styles.glassHeader}>
                  <div className={styles.trafficLights}>
                    <span></span><span></span><span></span>
                  </div>
                  <div className={styles.tabName}>payment-service.ts</div>
                  <div className={styles.windowStatus}>
                    {isTyping ? (
                      <span className={styles.statusMuted}>Analyzing AST...</span>
                    ) : codeVersion === 'raw' ? (
                      <span className={styles.statusDanger}>SQL Injection Found</span>
                    ) : (
                      <span className={styles.statusSafe}>Secured & Optimal</span>
                    )}
                  </div>
                </div>
                <div className={styles.glassBody}>
                  <div className={styles.codeLines}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n}>{n}</div>)}
                  </div>
                  <pre className={styles.codeContent}>
                    <code>{typedCode}{isTyping && <span className={styles.cursor} />}</code>
                  </pre>
                </div>
                {/* Framer signature fade-out at bottom */}
                <div className={styles.glassFade}></div>
              </div>
            </div>
          </div>
        </section>

        {/* High-End Marquee */}
        <section className={`${styles.marqueeSection} ${styles.revealSection}`}>
          <p className={styles.marqueeLabel}>TRUSTED BY ADVANCED ENGINEERING TEAMS</p>
          <div className={styles.marqueeMask}>
            <div className={styles.marqueeTrack}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.marqueeItems}>
                  <span className={styles.companyName}>Vercel</span>
                  <span className={styles.companyName}>Linear</span>
                  <span className={styles.companyName}>Raycast</span>
                  <span className={styles.companyName}>Stripe</span>
                  <span className={styles.companyName}>Figma</span>
                  <span className={styles.companyName}>OpenAI</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Framer-Style Bento Grid */}
        <section className={`${styles.bentoSection} ${styles.revealSection}`}>
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
        </section>

        {/* Minimalist CTA */}
        <section className={`${styles.ctaSection} ${styles.revealSection}`}>
          <div className="container">
            <div className={styles.ctaCard}>
              <h2>Deploy better software, faster.</h2>
              <p>Join the elite development teams permanently eliminating technical debt.</p>
              <div className={styles.ctaActions}>
                <Link href="/review" className={styles.btnPrimary}>
                  Start Code Review
                </Link>
                <Link href="https://github.com" target="_blank" rel="noreferrer" className={styles.btnSecondary}>
                  View GitHub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerLayout}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>Code Doctor</span>
              <span className={styles.footerCopyright}>© {new Date().getFullYear()}</span>
            </div>
            <div className={styles.footerNav}>
              <Link href="/review">Product</Link>
              <Link href="/dashboard">Analytics</Link>
              <Link href="#">Changelog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
