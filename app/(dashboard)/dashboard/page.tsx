'use client';

import styles from '../dashboard.module.css';

export default function DashboardPage() {
  const userName = "Sarah"; // Mock name
  const pregnancyWeek = 24;

  return (
    <div className={styles.greetingSection}>
      <div>
        <h1 className={styles.greetingText}>Good morning, {userName}</h1>
        <p className={styles.greetingSub}>We hope you are resting well today.</p>
      </div>

      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <h3>Week {pregnancyWeek}</h3>
          <p>Your baby is the size of a Cantaloupe 🍈</p>
        </div>
        <div className={styles.progressCircle}>
          60%
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Appointments Card */}
        <div className={styles.card}>
          <div className={styles.appointmentCardHeader}>
            <span className={styles.cardTitle}>Next Appointment</span>
            <button className={styles.addBtn}>+ Add</button>
          </div>
          <div className={styles.appointmentDetails}>
            <span className={styles.appointmentDate}>Tuesday, March 24 at 10:00 AM</span>
            <span className={styles.appointmentNote}>Regular checkup with Dr. Aris</span>
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Baby Heart Rate</span>
          <div className={styles.heartRateValue}>
            142 <span className={styles.unit}>bpm</span>
            <span className={styles.pulseIcon}>❤️</span>
          </div>
          <div className={styles.statusIndicator}>
            <span>●</span> Normal and steady
          </div>
        </div>

        {/* Heart Rate Chart */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Heart Rate History (Last 7 Days)</span>
          <div className={styles.chartContainer}>
            <svg viewBox="0 0 400 120" className={styles.chartSvg}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M 10 120 L 10 80 Q 60 70 120 50 T 220 80 T 310 40 T 390 55 L 390 120 Z" fill="url(#chartGrad)" />
              <path d="M 10 80 Q 60 70 120 50 T 220 80 T 310 40 T 390 55" fill="none" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
              <circle cx="120" cy="50" r="4" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
              <circle cx="220" cy="80" r="4" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
              <circle cx="310" cy="40" r="4" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
              <circle cx="390" cy="55" r="5" fill="#FFFFFF" stroke="#EC4899" strokeWidth="3" />
            </svg>
          </div>
          <div className={styles.chartLabels}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Movement Card */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Movement Tracker</span>
          <div className={styles.movementGrid}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Active</div>
              <p className={styles.subtext}>Last felt: 15 mins ago</p>
            </div>
            <span className={styles.badge}>Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
