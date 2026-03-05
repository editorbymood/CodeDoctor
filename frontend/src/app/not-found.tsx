import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
    return (
        <>
            <Navbar />
            <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>404</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: 'bold' }}>Page Not Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        The doctor couldn't find the file you're looking for. It might have been moved or deleted.
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </>
    );
}
