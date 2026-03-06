'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

// Premium SVG Icons
const TargetIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
const ChartIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>);
const BookIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>);
const TagIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>);
const GithubIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>);
const MenuIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);
const CloseIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const navLinks = [
        { href: '/review', icon: <TargetIcon />, label: 'Scanner' },
        { href: '/dashboard', icon: <ChartIcon />, label: 'Telemetry' },
        { href: '#', icon: <BookIcon />, label: 'Docs' },
        { href: '#', icon: <TagIcon />, label: 'Pricing' },
    ];

    return (
        <>
            <div className={styles.navWrapper}>
                <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                    <div className={styles.container}>
                        
                        {/* Brand */}
                        <Link href="/" className={styles.brand}>
                            <div className={styles.logoMark}>
                                <div className={styles.logoRing}></div>
                                <div className={styles.logoDot}></div>
                            </div>
                            <span className={styles.brandText}>Code Doctor</span>
                        </Link>

                        {/* Desktop Web Links */}
                        <div className={styles.navLinksCenter}>
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.label} href={link.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                                        <span className={styles.itemIcon}>{link.icon}</span>
                                        <span className={styles.itemLabel}>{link.label}</span>
                                        {isActive && <div className={styles.activePill}></div>}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Actions */}
                        <div className={styles.navActionsRight}>
                            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.githubBtn} aria-label="GitHub">
                                <GithubIcon />
                            </Link>
                            <Link href="/review" className={styles.shimmerBtn}>
                                <span className={styles.shimmerText}>Deploy Agents</span>
                                <div className={styles.shimmerWave}></div>
                            </Link>
                            
                            {/* Mobile Menu Toggle */}
                            <button 
                                className={styles.mobileToggle} 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>

                    </div>
                </nav>
            </div>

            {/* Mobile Fullscreen Menu */}
            <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                <div className={styles.mobileMenuContainer}>
                    {navLinks.map((link, i) => (
                        <Link 
                            key={link.label} 
                            href={link.href} 
                            className={styles.mobileNavItem}
                            style={{ animationDelay: `${i * 0.05}s` }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className={styles.mobileIcon}>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                    <div className={styles.mobileBottomActions}>
                        <Link href="/review" className={styles.mobileDeployBtn} onClick={() => setMobileMenuOpen(false)}>
                            Deploy Code Agents
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
