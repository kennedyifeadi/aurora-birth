'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
        {/* Backdrop overlay for mobile */}
        {isMobileNavOpen && (
          <div className={styles.backdrop} onClick={() => setIsMobileNavOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''} ${isMobileNavOpen ? styles.mobileOpen : ''}`}>
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
          <TopNav onMenuClick={() => setIsMobileNavOpen(true)} />

          {/* Content */}
          <main className={styles.pageContent}>
            {children}
          </main>
        </div>
      </UserProvider>
    </div>
  );
}

function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(2); // Mock starting count

  // Live Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => setSearchResults(data.results || []))
          .catch(err => console.error('Search failed:', err));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <>
      <header className={styles.topNav}>
        <button className={styles.mobileMenuBtn} onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search logs, readings, tips..." 
            className={styles.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Floating Search Results Dropdown */}
          {searchQuery.trim().length > 1 && (
            <div className={styles.searchResultsDropdown}>
              {searchResults.length > 0 ? (
                searchResults.map(item => (
                  <div key={item.id} className={styles.searchResultItem}>
                    <div className={styles.searchResultQuestion}>{item.question}</div>
                    <div className={styles.searchResultAnswer}>{item.response.substring(0, 60)}...</div>
                  </div>
                ))
              ) : (
                <div className={styles.searchNoResult}>No matches found.</div>
              )}
            </div>
          )}
        </div>

        <div className={styles.topNavRight}>
          <button 
            className={styles.iconButton} 
            onClick={() => { setIsNotificationsOpen(true); setUnreadCount(0); }}
          >
            <FiBell />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
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
