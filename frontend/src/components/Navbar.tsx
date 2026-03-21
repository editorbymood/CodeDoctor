'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Settings, CreditCard, HelpCircle, ScanLine, Activity } from 'lucide-react';
import styles from './Navbar.module.css';

const springTransition = { type: 'spring' as const, bounce: 0, duration: 0.6 };

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: '/#features', label: 'Features', href: '/#features', icon: <Sparkles size={16} /> },
        { id: '/#pricing', label: 'Pricing', href: '/#pricing', icon: <CreditCard size={16} /> },
        { id: '/#faq', label: 'FAQ', href: '/#faq', icon: <HelpCircle size={16} /> },
        { id: '/review', label: 'Scanner', href: '/review', icon: <ScanLine size={16} /> },
        { id: '/dashboard', label: 'Telemetry', href: '/dashboard', icon: <Activity size={16} /> }
    ];

    // Combine pathname and hash for solid active state logic
    const currentPath = location.pathname + location.hash;

    return (
        <div className={styles.navWrapper}>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.navInner}>

                {/* Logo / Brand */}
                <Link to="/" className={styles.brand}>
                    <div className={styles.logoMark}>
                        <div className={styles.logoDot}></div>
                    </div>
                    <span className={styles.brandText}>Code Doctor</span>
                </Link>

                {/* Global Links - The Liquid Navigation Dock */}
                <div 
                    className={styles.navLinks}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <AnimatePresence>
                        {navLinks.map((item) => {
                            const isActive = currentPath === item.href || (currentPath === '/' && item.href === '/#features'); 
                            const isHovered = hoveredItem === item.id;
                            const isExpanded = isHovered || isActive;

                            return (
                                <motion.a 
                                    key={item.id}
                                    href={item.href} 
                                    layout
                                    className={styles.liquidNavItem}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    animate={{
                                        backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
                                        color: isExpanded ? '#ffffff' : '#a1a1aa'
                                    }}
                                    transition={springTransition}
                                    style={{ borderRadius: 9999 }}
                                >
                                    <motion.div layout="position" className={styles.iconWrapper} transition={springTransition}>
                                        {item.icon}
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={false}
                                        animate={{ 
                                            width: isExpanded ? 'auto' : 0,
                                            opacity: isExpanded ? 1 : 0,
                                            paddingRight: isExpanded ? 14 : 0
                                        }}
                                        transition={springTransition}
                                        style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
                                    >
                                        <span className={styles.textWrapper}>{item.label}</span>
                                    </motion.div>
                                </motion.a>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Action Button */}
                <div className={styles.navActions}>
                    {/* Intentionally left empty to maintain space if needed, or removing entirely based on layout. 
                        Removing the specific button logic as requested. */}
                </div>

                </div>

            </nav>
        </div>
    );
}
