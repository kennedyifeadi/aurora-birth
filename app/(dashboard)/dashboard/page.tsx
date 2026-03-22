'use client';

import { useState } from 'react';
import styles from '../dashboard.module.css';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { useUser } from '../context/UserContext';
import AppointmentModal from '@/components/AppointmentModal';

const chartData = [
  { name: 'Mon', bpm: 135 },
  { name: 'Tue', bpm: 140 },
  { name: 'Wed', bpm: 142 },
  { name: 'Thu', bpm: 138 },
  { name: 'Fri', bpm: 145 },
  { name: 'Sat', bpm: 141 },
  { name: 'Sun', bpm: 142 },
];

export default function DashboardPage() {
  const { user, isProfileComplete, appointments, addAppointment, isLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextAppointment = appointments[0];

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Complete Profile banner */}
      {!isProfileComplete && (
        <div className={styles.banner}>
          <span>💡 Complete your profile to get personalized health insights.</span>
          <span className={styles.bannerLink} onClick={() => window.location.href = '/profile'}>
            Go to Profile
          </span>
        </div>
      )}

      <div className={styles.greetingSection}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>
          Good morning, {user?.name || 'Lovely Mother'}
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', marginTop: '0.15rem' }}>We hope you are resting well today.</p>
      </div>

      {/* Pregnancy Progress banner */}
      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <h3>Week 24</h3>
          <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>Your baby is the size of a Cantaloupe 🍈</p>
        </div>
        <div className={styles.progressCircle}>
          60%
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Appointments Card */}
        <div className={styles.card}>
          <div className={styles.appointmentCardHeader}>
            <span className={styles.cardTitle}>Next Visit</span>
            <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>+ Add</button>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            {nextAppointment ? (
              <>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>
                  {new Date(nextAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.15rem' }}>
                  {new Date(nextAppointment.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {nextAppointment.note}
                </div>
              </>
            ) : (
              <div style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>No upcoming visits scheduled.</div>
            )}
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className={styles.card}>
          <span className={styles.cardTitle}>Baby Heart Rate</span>
          <div className={styles.heartRateValue}>
            142 <span className={styles.unit}>bpm</span>
          </div>
          <div className={styles.statusIndicator}>
            <span>●</span> Normal and steady
          </div>
        </div>

        {/* Heart Rate Chart */}
        <div className={styles.card} style={{ gridColumn: 'span 2' }}>
          <span className={styles.cardTitle}>Heart Rate History (Last 7 Days)</span>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} 
                  labelStyle={{ color: '#6B7280', fontSize: 12 }}
                />
                <Line type="monotone" dataKey="bpm" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#FFFFFF', stroke: '#7C3AED', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
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

      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addAppointment}
      />
    </div>
  );
}
