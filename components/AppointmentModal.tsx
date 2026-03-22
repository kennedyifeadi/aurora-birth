'use client';

import { useState } from 'react';
import styles from './AppointmentModal.module.css';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, note: string) => Promise<boolean>;
}

export default function AppointmentModal({ isOpen, onClose, onSave }: AppointmentModalProps) {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !note) return;

    setIsSubmitting(true);
    const success = await onSave(date, note);
    setIsSubmitting(false);

    if (success) {
      onClose();
      setDate('');
      setNote('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Add Appointment</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Date & Time</label>
            <input 
              type="datetime-local" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Note / Description</label>
            <input 
              type="text" 
              placeholder="e.g., Blood test, OB/GYN visit"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
