'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiHome, FiHeart, FiSmile, FiUser, FiLogOut, FiMenu, FiSearch, FiBell } from 'react-icons/fi';
import { PiSparkle } from 'react-icons/pi'; 
import styles from './dashboard.module.css';
import { UserProvider, useUser } from './context/UserContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { name: 'Mother', href: '/mother', icon: <FiHeart /> },
    { name: 'Baby', href: '/baby', icon: <FiSmile /> },
    { name: 'Aurora AI', href: '/aurora', icon: <PiSparkle /> },
    { name: 'Profile', href: '/profile', icon: <FiUser /> },
  ];

  const handleSignOut = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <div className={styles.layoutWrapper}>
      <UserProvider>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.sidebarHeader}>
            {!isSidebarCollapsed && <h2 className={styles.logo}>Aurora Birth</h2>}
            <button className={styles.toggleBtn} onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <FiMenu />
            </button>
          </div>

          <nav className={styles.sideNav}>
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`${styles.sideNavItem} ${pathname === item.href ? styles.active : ''}`}
              >
                <span className={styles.sideItemIcon}>{item.icon}</span>
                {!isSidebarCollapsed && <span className={styles.sideItemLabel}>{item.name}</span>}
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <button className={styles.signOutBtn} onClick={handleSignOut}>
              <FiLogOut />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={styles.mainArea}>
          <TopNav />

          {/* Content */}
          <main className={styles.pageContent}>
            {children}
          </main>
        </div>
      </UserProvider>
    </div>
  );
}

function TopNav() {
  const { user } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <header className={styles.topNav}>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search logs, readings, tips..." className={styles.searchInput} />
        </div>

        <div className={styles.topNavRight}>
          <button className={styles.iconButton} onClick={() => setIsNotificationsOpen(true)}>
            <FiBell />
          </button>
          <div className={styles.profileDropdownTrigger} onClick={() => window.location.href = '/profile'}>
            <div className={styles.avatar}>{user?.name?.[0] || 'U'}</div>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      {isNotificationsOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsNotificationsOpen(false)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>Notifications</h3>
              <button className={styles.closeBtn} onClick={() => setIsNotificationsOpen(false)}>×</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.notificationItem}>
                <div className={styles.notifyPoint}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Time for Prenatal Vitamins</div>
                  <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>Scheduled for 10:00 AM</div>
                </div>
              </div>
              <div className={styles.notificationItem}>
                <div className={styles.notifyPoint}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Weekly Update Ready</div>
                  <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>Read what to expect in week 24</div>
                </div>
              </div>
              <div style={{ padding: '1rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8rem', marginTop: 'auto' }}>
                No more notifications
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
