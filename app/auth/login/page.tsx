'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login Submitting', { email, password });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Aurora Birth</h1>
          <p className={styles.subtitle}>Welcome back, lovely mother.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              className={styles.input}
              type="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              className={styles.input}
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Link href="/auth/forgot-password" className={styles.forgotPassword}>
            Forgot Password?
          </Link>

          <button className={styles.button} type="submit">
            Login
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?
          <Link href="/auth/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
