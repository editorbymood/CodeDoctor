import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerLayout}>
                    <div className={styles.footerBrand}>
                        <span className={styles.footerLogo}>Code Doctor</span>
                        <span className={styles.footerCopyright}>© {new Date().getFullYear()}</span>
                    </div>
                    <div className={styles.footerNav}>
                        <Link href="/review">Product</Link>
                        <Link href="/dashboard">Analytics</Link>
                        <Link href="#">Changelog</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
