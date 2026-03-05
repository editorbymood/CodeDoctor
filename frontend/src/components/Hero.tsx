'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RevealWrapper from './RevealWrapper';
import styles from './Hero.module.css';

export default function Hero() {
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

    return (
        <section className={styles.hero}>
            <div className="container">
                <RevealWrapper className={styles.heroContent}>
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
                </RevealWrapper>

                {/* Framer-Style Floating Window */}
                <RevealWrapper className={styles.editorWrapper}>
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
                </RevealWrapper>
            </div>
        </section>
    );
}
