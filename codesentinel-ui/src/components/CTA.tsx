import { Link } from 'react-router-dom';
import RevealWrapper from './RevealWrapper';
import styles from './CTA.module.css';

export default function CTA() {
    return (
        <RevealWrapper className={styles.ctaSection}>
            <div className="container">
                <div className={styles.ctaCard}>
                    <h2>Deploy better software, faster.</h2>
                    <p>Join the elite development teams permanently eliminating technical debt.</p>
                    <div className={styles.ctaActions}>
                        <Link to="/review" className={styles.btnPrimary}>
                            Start Code Review
                        </Link>
                        <Link to="https://github.com" target="_blank" rel="noreferrer" className={styles.btnSecondary}>
                            View GitHub
                        </Link>
                    </div>
                </div>
            </div>
        </RevealWrapper>
    );
}
