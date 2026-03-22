'use client';

import { useState } from 'react';
import styles from './mother.module.css';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useUser } from '../context/UserContext';
import AppointmentModal from '@/components/AppointmentModal';

const waveData = [
  { value: 10 }, { value: 25 }, { value: 60 }, { value: 20 },
  { value: 40 }, { value: 80 }, { value: 30 }, { value: 10 },
];

export default function MotherPage() {
  const { user, appointments, addAppointment } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const motherName = user?.name || "Lovely Mother";
  const pregnancyStage = "Week 24 (2nd Trimester)";
  const cervicalDilation = 3; // cm

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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FCD34D" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={3} fill="url(#waveGrad)" />
              </AreaChart>
            </ResponsiveContainer>
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
              <div key={app._id} className={styles.appointmentItem}>
                <div>
                  <div className={styles.appointmentDate}>
                    {new Date(app.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(app.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className={styles.appointmentNote}>{app.note}</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>🔔</span>
              </div>
            ))}
            {appointments.length === 0 && (
              <div style={{ color: '#6B7280', fontSize: '0.9rem', padding: '1rem 0' }}>No upcoming visits.</div>
            )}
          </div>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>+ Add Appointment</button>
        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addAppointment}
      />
    </div>
  );
}
