'use client';

import { useEffect, useRef, ReactNode } from 'react';
import styles from './RevealWrapper.module.css';

interface RevealWrapperProps {
    children: ReactNode;
    className?: string;
}

export default function RevealWrapper({ children, className = '' }: RevealWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                ref.current?.classList.add(styles.revealed);
            }
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`${styles.revealSection} ${className}`}>
            {children}
        </div>
    );
}
