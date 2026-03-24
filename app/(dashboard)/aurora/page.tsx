'use client';

import { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import styles from './aurora.module.css';
import { useUser } from '../context/UserContext';

interface Message {
  id: string;
  sender: 'aurora' | 'user';
  text: string;
  timestamp: Date;
}

// Suggested questions for initial load
const suggestedQuestions = [
  "Why hasn’t my baby kicked today?",
  "Is it normal to feel tired?",
  "What should I expect this month?",
];

export default function AuroraAssistant() {
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('aurora_chat_history');
    if (saved) {
      // Parse timestamps back to Date objects if needed, or just keep as strings
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          id: 'initial',
          sender: 'aurora',
          text: 'Hello! I am Aurora, your pregnancy assistant. How can I guide you today?',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Save History
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aurora_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const resp = await fetch('/api/aurora/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ text })
      });
      const data = await resp.json();

      const auroraMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'aurora',
        text: data.text || data.error || 'Sorry, I encountered an error answering that.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, auroraMsg]);
    } catch (error) {
      console.error('Aurora Chat Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Suggestions Section: Hide after user starts chatting */}
      {messages.length <= 1 && (
        <div className={styles.suggestionsContainer}>
          <span className={styles.suggestionsTitle}>💡 Suggested Questions</span>
          <div className={styles.suggestionsGrid}>
            {suggestedQuestions.map((q, idx) => (
              <div 
                key={idx} 
                className={styles.suggestionCard} 
                onClick={() => handleSendMessage(q)}
              >
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className={styles.chatHistory}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`${styles.messageBubble} ${msg.sender === 'aurora' ? styles.auroraMessage : styles.userMessage}`}
          >
            {msg.text}

            {/* Contextual Doctor Action Card */}
            {msg.sender === 'aurora' && (msg.text?.includes('doctor') || msg.text?.includes('medical facility')) && profile?.doctor?.name && (
              <div className={styles.doctorActionCard}>
                <div className={styles.doctorInfo}>
                  <span className={styles.doctorLabel}>Your Doctor:</span>
                  <span className={styles.doctorName}>{profile.doctor.name}</span>
                </div>
                {profile.doctor.phone && (
                  <a href={`tel:${profile.doctor.phone}`} className={styles.callDoctorBtn}>
                    Call Now
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.messageBubble} ${styles.auroraMessage} ${styles.typing}`}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Input Area */}
      <form 
        className={styles.inputBar} 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
      >
        <input 
          type="text" 
          placeholder="What would you like to know today?" 
          className={styles.inputField} 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn}>
          <FiSend />
        </button>
      </form>
    </div>
  );
}
