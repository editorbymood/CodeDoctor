'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import Footer from '../components/Footer';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import styles from './LandingPage.module.css';

// Ultra-minimalist SVG Icons
const BrainIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /></svg>);
const CodeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);
const ShieldIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const ActivityIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>);
const BarChartIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>);

const features = [
  {
    title: 'Agent Abuse System',
    description: 'We force three AI agents to look at your code so they can fix your mess.',
    size: 'large',
    icon: <BrainIcon />,
    visual: 'pipeline',
  },
  {
    title: 'Hack-Proofing Your Mess',
    description: 'Finding all the backdoors you accidentally left wide open.',
    size: 'small',
    icon: <ShieldIcon />,
  },
  {
    title: 'Real-Time Roasting',
    description: 'Watch our AI insult your variable names with sub-millisecond latency.',
    size: 'small',
    icon: <ActivityIcon />,
  },
  {
    title: 'Depressing Stats',
    description: 'Dashboards that show exactly how much technical debt you\'re hiding.',
    size: 'medium',
    icon: <BarChartIcon />,
    visual: 'chart',
  },
  {
    title: 'We Read Your Spaghett',
    description: 'We can parse your terrible code in multiple languages.',
    size: 'small',
    icon: <CodeIcon />,
    visual: 'languages',
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

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Global Background Handles Glows */}

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBg}></div>
          <div className={styles.heroGlow}></div>
          <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0 flex flex-col items-center relative z-10">
            <motion.div 
              className={styles.heroContent}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div 
                className={styles.pillBadge}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className={styles.pillBadgeInner}>Code Doctor 2.0</span>
                <span className={styles.pillBadgeText}>Don't be a dummy.</span>
              </motion.div>

              <motion.h1 
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Fix your trash code, <br />
                <span className={styles.titleGradient}>automatically.</span>
              </motion.h1>

              <motion.p 
                className={styles.subtitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Your code is a dumpster fire. Let our sassy AI agents roast it and actually fix your garbage before your boss finds out.
              </motion.p>

              <motion.div 
                className={styles.actions}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link to="/review" className={styles.btnPrimary}>
                  Roast My Code
                </Link>
                <Link to="/dashboard" className={styles.btnSecondary}>
                  Show Me The Damage
                </Link>
              </motion.div>
            </motion.div>

            {/* Framer-Style Floating Window */}
            <motion.div 
              className={styles.editorWrapper}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
            >
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
            </motion.div>
          </div>
        </section>

        {/* High-End Marquee */}
        <motion.section 
          className={styles.marqueeSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={revealVariants}
        >
          <p className={styles.marqueeLabel}>USED BY TEAMS WHO CAN'T WRITE GOOD CODE</p>
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
        </motion.section>

        {/* Framer-Style Bento Grid */}
        <motion.section 
          id="features"
          className={styles.bentoSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0">
            <motion.div variants={revealVariants} className={styles.sectionHeader}>
              <h2 className={styles.bentoTitle}>Why we're better than you.</h2>
              <p className={styles.bentoSubtitle}>Because let's face it, you need all the help you can get to write decent code.</p>
            </motion.div>

            <div className={styles.bentoGrid}>
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={revealVariants}
                  className={`${styles.bentoCard} ${styles[feature.size]}`}
                  onMouseMove={(e: any) => {
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
                    </div>         {feature.visual === 'pipeline' && (
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Additional Custom Sections */}
        <HowItWorks />
        <Pricing />
        <FAQ />

        {/* Minimalist CTA */}
        <motion.section 
          className={styles.ctaSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={revealVariants}
        >
          <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0">
            <div className={styles.ctaCard}>
              <h2>Stop deploying garbage.</h2>
              <p>Join the teams that finally admitted they need an AI to fix their technical debt.</p>
              <div className={styles.ctaActions}>
                <Link to="/review" className={styles.btnPrimary}>
                  Roast My Code
                </Link>
                <Link to="https://github.com" target="_blank" rel="noreferrer" className={styles.btnSecondary}>
                  Steal Our Code
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
