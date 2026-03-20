'use client';

import styles from './mother.module.css';

export default function MotherPage() {
  const motherName = "Sarah Johnson";
  const pregnancyStage = "Week 24 (2nd Trimester)";
  const cervicalDilation = 3; // cm

  const appointments = [
    { id: 1, date: "Tuesday, March 24 at 10:00 AM", note: "Regular checkup with Dr. Aris" },
    { id: 2, date: "Friday, April 10 at 2:30 PM", note: "Anatomy Ultrasound" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <h1 className={styles.title}>{motherName}</h1>
        <div className={styles.subtitle}>
          <span>{pregnancyStage}</span>
          <span className={styles.tag}>Healthy</span>
        </div>
      </div>

      <div className={styles.sectionGrid}>
        {/* Contraction Card */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Contraction Activity</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B' }}>
              Mild
            </div>
            <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Last peak: 10m ago</span>
          </div>
          <div className={styles.waveContainer}>
            <svg viewBox="0 0 400 80" className={styles.waveSvg}>
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <path 
                className={styles.wavePath} 
                d="M 10 40 Q 50 10 90 40 T 170 40 T 250 40 T 330 40 T 390 40" 
              />
              <path 
                d="M 10 40 Q 50 10 90 40 T 170 10 T 250 40 T 330 10 T 390 40" 
                fill="none" 
                stroke="#FCD34D" 
                strokeWidth="2" 
                strokeDasharray="4 4" 
              />
            </svg>
          </div>
        </div>

        {/* Dilation Card */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Cervical Dilation</span>
          <div className={styles.dilationValue}>
            {cervicalDilation} <span style={{ fontSize: '1.25rem', fontWeight: 500, color: '#9CA3AF' }}>cm</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${(cervicalDilation / 10) * 100}%` }} 
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.5rem' }}>Target: 10 cm for delivery</p>
        </div>

        {/* Emergency Card */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Emergency Contact</span>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h4>Dr. Aris Thorne</h4>
              <p>Primary Obstetrician</p>
              <p style={{ fontWeight: 600, color: '#111827', marginTop: '0.25rem' }}>+1 (555) 234-5678</p>
            </div>
            <button className={styles.callBtn}>
              📞
            </button>
          </div>
        </div>

        {/* Appointments Card */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Upcoming Visits</span>
          <div className={styles.appointmentList}>
            {appointments.map(app => (
              <div key={app.id} className={styles.appointmentItem}>
                <div>
                  <div className={styles.appointmentDate}>{app.date}</div>
                  <div className={styles.appointmentNote}>{app.note}</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>🔔</span>
              </div>
            ))}
          </div>
          <button className={styles.addBtn}>+ Add Appointment</button>
        </div>
      </div>
    </div>
  );
}
