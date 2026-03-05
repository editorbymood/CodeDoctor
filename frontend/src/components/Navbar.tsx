'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

// SVG Icons for Navbar
const TargetIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
const ChartIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>

                {/* Logo / Brand */}
                <Link href="/" className={styles.brand}>
                    <div className={styles.logoMark}>
                        <div className={styles.logoDot}></div>
                    </div>
                    <span className={styles.brandText}>Code Doctor</span>
                </Link>

                {/* Global Links */}
                <div className={styles.navLinks}>
                    <Link href="/review" className={`${styles.navItem} ${pathname === '/review' ? styles.active : ''}`}>
                        <TargetIcon />
                        <span>Scanner</span>
                    </Link>
                    <Link href="/dashboard" className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
                        <ChartIcon />
                        <span>Telemetry</span>
                    </Link>
                </div>

                {/* Action Button */}
                <div className={styles.navActions}>
                    <Link href="/review" className={styles.actionBtn}>
                        Deploy Agents
                    </Link>
                </div>

            </div>
        </nav>
    );
}
