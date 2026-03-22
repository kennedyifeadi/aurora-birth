'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend } from 'react-icons/fi';
import styles from './aurora.module.css';

interface Message {
  id: string;
  sender: 'aurora' | 'user';
  text: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Why hasn’t my baby kicked today?",
  "Is it normal to feel tired?",
  "What should I expect this month?",
];

const mockResponses: { [key: string]: string } = {
  "Why hasn’t my baby kicked today?": "It can be normal for movement to vary, especially if you are active or the baby is sleeping. Try drinking cold water or lying on your left side for an hour. If you don't feel 10 kicks in 2 hours, please contact your doctor.",
  "Is it normal to feel tired?": "Yes, fatigue is very common, especially in the first and third trimesks as your body works on building support systems. Make sure to rest when you can and stay hydrated.",
  "What should I expect this month?": "This month usually brings structural diagnostics checks. Your baby is developing lungs fully, and you might notice more rhythmic kicks!",
};

export default function AuroraAssistant() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'initial',
      sender: 'aurora',
      text: 'Hello! I am Aurora, your pregnancy assistant. How can I guide you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const reply = mockResponses[text] || "I am processing that question dynamically. Please consult your physician for specific medical scenarios, but generally maintaining steady hydration helps.";
      const auroraMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'aurora',
        text: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, auroraMsg]);
    }, 800);
  }, []);

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
          </div>
        ))}
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
