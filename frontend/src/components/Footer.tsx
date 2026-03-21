import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Code2, ArrowUpRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <footer className={styles.footerWrapper}>
            {/* Top Glowing Divider */}
            <div className={styles.topDivider}>
                <div className={styles.glowLine} />
            </div>

            <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0 relative z-10">
                <motion.div
                    className={styles.footerGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className={styles.brandSection}>
                        <Link to="/" className={styles.brandLink}>
                            <div className={styles.logoIcon}>
                                <Code2 className="w-5 h-5 text-orange-500" />
                            </div>
                            <span className={styles.brandName}>Code Doctor</span>
                        </Link>
                        <p className={styles.brandDescription}>
                            The elite intelligence standard for automated code reviews. Permanently eliminate technical debt with multi-agent architecture.
                        </p>
                    </motion.div>

                    {/* Navigation Column 1 */}
                    <motion.div variants={itemVariants} className={styles.navSection}>
                        <h4 className={styles.navString}>Product</h4>
                        <ul className={styles.navList}>
                            <li>
                                <Link to="/review" className={styles.navLink}>
                                    Scanner <ArrowUpRight className={styles.linkIcon} />
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className={styles.navLink}>
                                    Telemetry <ArrowUpRight className={styles.linkIcon} />
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className={styles.navLink}>
                                    Changelog <ArrowUpRight className={styles.linkIcon} />
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Navigation Column 2 */}
                    <motion.div variants={itemVariants} className={styles.navSection}>
                        <h4 className={styles.navString}>Company</h4>
                        <ul className={styles.navList}>
                            <li>
                                <Link to="#" className={styles.navLink}>About Us</Link>
                            </li>
                            <li>
                                <Link to="#" className={styles.navLink}>Careers</Link>
                            </li>
                            <li>
                                <Link to="#" className={styles.navLink}>Privacy Policy</Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Socials & Connect Column */}
                    <motion.div variants={itemVariants} className={styles.socialSection}>
                        <h4 className={styles.navString}>Connect</h4>
                        <div className={styles.socialGrid}>
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialIcon}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    className={styles.bottomBar}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <p className={styles.copyright}>© {currentYear} Code Doctor Intelligence. All rights reserved.</p>
                    <div className={styles.statusPill}>
                        <span className={styles.statusDot}></span>
                        All systems operational
                    </div>
                </motion.div>
            </div>

            {/* Background Ambient Glow */}
            <div className={styles.ambientBackground}></div>
        </footer>
    );
}
