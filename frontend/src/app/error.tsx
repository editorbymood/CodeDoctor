'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled runtime error:', error);
    }, [error]);

    return (
        <>
            <Navbar />
            <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '500px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💥</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: 'bold' }}>Something went wrong!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        We encountered an unexpected error while rendering this page.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => reset()}
                        >
                            Try again
                        </button>
                        <Link href="/" className="btn btn-secondary">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
