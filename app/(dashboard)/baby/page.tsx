'use client';

import { useState } from 'react';
import { FiHeart, FiVolume2 } from 'react-icons/fi';
import styles from './baby.module.css';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, BarChart, Bar } from 'recharts';

const heartRateHistory = [
  { time: '10:00', bpm: 142 },
  { time: '11:00', bpm: 145 },
  { time: '12:00', bpm: 140 },
  { time: '13:00', bpm: 144 },
  { time: '14:00', bpm: 142 },
];

const movementTrend = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 18 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 20 },
  { day: 'Sat', count: 25 },
  { day: 'Sun', count: 19 },
];

export default function BabySection() {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const babyName = "Little Peanut";
  const weeks = 24;
  const gender = "Surprise 💖💙";

  const handlePlayHeartbeat = () => {
    if (isPlayingSound) return;
    setIsPlayingSound(true);
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60, audioCtx.currentTime); // Low frequency for heartbeat thump
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

      const now = audioCtx.currentTime;
      const duration = 4; // seconds
      const beatInterval = 0.8; // ~75 bpm

      for (let i = 0; i < duration / beatInterval; i++) {
        const t = now + i * beatInterval;
        // First beat (lub)
        gainNode.gain.linearRampToValueAtTime(0.6, t + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, t + 0.15);
        
        // Second beat (dub)
        gainNode.gain.linearRampToValueAtTime(0.4, t + 0.25);
        gainNode.gain.linearRampToValueAtTime(0, t + 0.35);
      }

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);

      setTimeout(() => {
        setIsPlayingSound(false);
        audioCtx.close();
      }, duration * 1000);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlayingSound(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Upper Information */}
      <div className={styles.headerCard}>
        <div className={styles.titleGroup}>
          <h1>{babyName}</h1>
          <p className={styles.subTitle}>{gender} • Estimated {weeks} weeks</p>
        </div>
        <span className={styles.infoBadge}>Week {weeks}</span>
      </div>

      {/* Central Heart Visual */}
      <div className={styles.heartVisualCard}>
        <div className={styles.heartWrapper}>
          <div className={styles.pulseRing}></div>
          <FiHeart className={styles.heart} />
        </div>
        
        <div className={styles.bpmValue}>
          142 <span>BPM</span>
        </div>

        <button className={styles.audioButton} onClick={handlePlayHeartbeat}>
          <FiVolume2 /> {isPlayingSound ? 'Playing...' : 'Play Heartbeat Sound'}
        </button>
      </div>

      <div className={styles.gridRow}>
        {/* Movement Card */}
        <div className={styles.gridCard}>
          <span className={styles.cardTitle}>Real-time Movement</span>
          <div className={styles.motionGrid}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Baby is Active</div>
              <p style={{ fontSize: '0.825rem', color: '#6B7280', marginTop: '0.25rem' }}>Continuous gentle layout felt</p>
            </div>
            <div className={styles.trackerAnimation}>
              <div className={styles.dot}></div>
            </div>
          </div>
        </div>

        {/* Status indicator Card */}
        <div className={styles.gridCard}>
          <span className={styles.cardTitle}>Daily Status</span>
          <div style={{ marginTop: 'auto', marginBottom: 'auto', textAlign: 'center' }}>
            <span className={styles.badge} style={{ fontSize: '1rem', padding: '0.6rem 1rem' }}>Resting Peacefully</span>
          </div>
        </div>
      </div>

      <div className={styles.gridRow} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(45%, 1fr))' }}>
        {/* Heart Rate Chart */}
        <div className={styles.gridCard}>
          <span className={styles.cardTitle}>Heart Rate History</span>
          <div style={{ height: '220px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateHistory} margin={{ top: 10, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} 
                />
                <Area type="monotone" dataKey="bpm" stroke="#EF4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movement Trend Chart */}
        <div className={styles.gridCard}>
          <span className={styles.cardTitle}>Movement Updates (Kick Count)</span>
          <div style={{ height: '220px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movementTrend} margin={{ top: 10, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} 
                />
                <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
