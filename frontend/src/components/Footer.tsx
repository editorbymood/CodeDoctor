import Link from 'next/link';
import styles from './Footer.module.css';

const GithubIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>);
const XIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M4 4l16 16M4 20L20 4"/></svg>);
const DiscordIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M9 12h.01M15 12h.01M7.5 7.5A11 11 0 0 1 12 6a11 11 0 0 1 4.5 1.5L18 10l1.5 8c0 2-2 2-2 2H6.5s-2 0-2-2L6 10l1.5-2.5z"/></svg>);

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.footerLogoLink}>
                            <div className={styles.logoMark}>
                                <div className={styles.logoDot}></div>
                            </div>
                            <span className={styles.footerLogo}>Code Doctor</span>
                        </Link>
                        <p className={styles.footerDescription}>
                            Advanced AST analysis and automated code remediation powered by multi-agent AI architecture.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialIcon}><XIcon /></a>
                            <a href="#" className={styles.socialIcon}><GithubIcon /></a>
                            <a href="#" className={styles.socialIcon}><DiscordIcon /></a>
                        </div>
                    </div>

                    <div className={styles.footerLinksColumn}>
                        <h4>Product</h4>
                        <Link href="/review">Scanner</Link>
                        <Link href="/dashboard">Telemetry</Link>
                        <Link href="#">Changelog</Link>
                        <Link href="#">Pricing</Link>
                    </div>

                    <div className={styles.footerLinksColumn}>
                        <h4>Resources</h4>
                        <Link href="#">Documentation</Link>
                        <Link href="#">API Reference</Link>
                        <Link href="#">Blog</Link>
                        <Link href="#">Community</Link>
                    </div>

                    <div className={styles.footerLinksColumn}>
                        <h4>Company</h4>
                        <Link href="#">About</Link>
                        <Link href="#">Contact</Link>
                        <Link href="#">Careers</Link>
                        <Link href="#">Legal</Link>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <span className={styles.footerCopyright}>© {new Date().getFullYear()} Code Doctor. All rights reserved.</span>
                    <div className={styles.footerLegal}>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
