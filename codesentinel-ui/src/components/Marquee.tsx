'use client';

import RevealWrapper from './RevealWrapper';
import styles from './Marquee.module.css';

const companies = ['Vercel', 'Linear', 'Raycast', 'Stripe', 'Figma', 'OpenAI'];

export default function Marquee() {
    return (
        <RevealWrapper className={styles.marqueeSection}>
            <p className={styles.marqueeLabel}>TRUSTED BY ADVANCED ENGINEERING TEAMS</p>
            <div className={styles.marqueeMask}>
                <div className={styles.marqueeTrack}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={styles.marqueeItems}>
                            {companies.map(company => (
                                <span key={company} className={styles.companyName}>{company}</span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </RevealWrapper>
    );
}
