import { useState } from 'react';
import { Zap, ArrowRight, User, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './Login.module.css';

export function Login({ onLogin }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Success

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !password.trim()) return;

        setLoading(true);

        // Simulating a professional authentication sequence
        await new Promise(resolve => setTimeout(resolve, 800));
        setStep(2);

        await new Promise(resolve => setTimeout(resolve, 1000));
        onLogin({ name: name.trim() });
    };

    return (
        <div className={styles.loginPage}>
            {/* Left: Visual Brand Section */}
            <div className={styles.visualSection}>
                <div className={styles.visualOverlay} />
                <div className={styles.brandContent}>
                    <Zap size={64} className={styles.brandLogo} />
                    <h1 className={styles.heroTitle}>
                        Redefine Your <br />
                        Fitness Journey.
                    </h1>
                    <p className={styles.heroText}>
                        Advanced AI coaching, personalized nutrition plans, and intelligent analytics.
                        Join the future of personal training today.
                    </p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.welcomeHeader}>
                        <h2 className={styles.welcomeTitle}>
                            {step === 1 ? 'Get Started' : 'Welcome Abroad'}
                        </h2>
                        <p className={styles.welcomeSubtitle}>
                            {step === 1
                                ? 'Securely access your personal workspace.'
                                : 'Setting up your dashboard...'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {step === 1 && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Username</label>
                                    <div className={styles.inputWrapper}>
                                        <User size={20} className={styles.inputIcon} />
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={styles.input}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Password</label>
                                    <div className={styles.inputWrapper}>
                                        <Lock size={20} className={styles.inputIcon} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={styles.input}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={styles.togglePassword}
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#4ade80', fontSize: '1.1rem', background: 'rgba(74, 222, 128, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                                <CheckCircle2 size={24} />
                                <span>Authentication Successful</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.loginBtn}
                            disabled={loading || !name.trim() || !password.trim()}
                        >
                            {loading ? (
                                step === 2 ? 'Redirecting...' : 'Verifying Credentials...'
                            ) : (
                                <>Sign In to Dashboard <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
