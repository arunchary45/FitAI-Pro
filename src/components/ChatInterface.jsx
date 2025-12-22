import { useState, useRef, useEffect } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { Send, Mic, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ChatInterface.module.css';

export function ChatInterface() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your advanced AI trainer. I can help with workouts, nutrition, and health advice. Try using voice commands!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const { generateResponse, loading, error } = useGemini();
    const { isListening, transcript, startListening, isSupported, setTranscript } = useVoiceInput();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setTranscript('');

        const prompt = `You are an expert fitness trainer and nutritionist created by Arun Chaudhary. 
    Provide detailed, accurate advice. Question: ${input}`;

        const responseText = await generateResponse(prompt);

        if (responseText) {
            const botMessage = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Bot className={styles.botIcon} />
                <h2>AI Fitness Assistant</h2>
            </div>

            <div className={styles.messagesArea}>
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.botWrapper}`}
                        >
                            <div className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className={styles.typingIndicator}>
                            <div className={styles.dot} />
                            <div className={styles.dot} />
                            <div className={styles.dot} />
                        </div>
                    )}
                    {error && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            borderRadius: '12px',
                            margin: '1rem 0',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            ⚠️ <span>{error}</span>
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about workouts..."
                    disabled={loading}
                    className={styles.input}
                />

                {isSupported && (
                    <button
                        onClick={startListening}
                        className={`${styles.iconBtn} ${isListening ? styles.listening : ''}`}
                    >
                        <Mic size={20} />
                    </button>
                )}

                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className={styles.sendBtn}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
