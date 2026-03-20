import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {children}
      </main>

      <nav className={styles.bottomNav}>
        <Link href="/dashboard" className={styles.navItem}>
          <span className={styles.navIcon}>🏠</span>
          <span className={styles.navLabel}>Dashboard</span>
        </Link>
        <Link href="/mother" className={styles.navItem}>
          <span className={styles.navIcon}>👩‍🍼</span>
          <span className={styles.navLabel}>Mother</span>
        </Link>
        <Link href="/baby" className={styles.navItem}>
          <span className={styles.navIcon}>👶</span>
          <span className={styles.navLabel}>Baby</span>
        </Link>
        <Link href="/aurora" className={styles.navItem}>
          <span className={styles.navIcon}>✨</span>
          <span className={styles.navLabel}>Aurora</span>
        </Link>
        <Link href="/profile" className={styles.navItem}>
          <span className={styles.navIcon}>👤</span>
          <span className={styles.navLabel}>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
