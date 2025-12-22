import React, { useState } from 'react';
import { Activity, Flame, Trophy, Timer, ArrowRight, Plus } from 'lucide-react';
import styles from './DashboardHome.module.css';

export function DashboardHome({ onChangeTab, user, stats, updateStats }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeStat, setActiveStat] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const safeStats = stats || {
        weeklyActivityHours: 5.2,
        caloriesBurned: 2450,
        workoutsCompleted: 12,
        activeStreak: 5
    };

    const statCards = [
        { id: 1, type: 'workout', label: 'Weekly Activity', value: `${safeStats.weeklyActivityHours} hrs`, icon: Activity, color: 'iconPurple', unit: 'minutes' },
        { id: 2, type: 'calories', label: 'Calories Burned', value: safeStats.caloriesBurned.toLocaleString(), icon: Flame, color: 'iconPink', unit: 'kcal' },
        { id: 3, type: 'workout', label: 'Workouts Completed', value: safeStats.workoutsCompleted, icon: Trophy, color: 'iconBlue', unit: 'minutes' },
        { id: 4, type: 'streak', label: 'Active Streak', value: `${safeStats.activeStreak} Days`, icon: Timer, color: 'iconGreen', unit: 'days' },
    ];

    const handleStatClick = (stat) => {
        if (stat.type === 'streak') return; // Streak usually auto-calculates, skipping manual edit for now
        setActiveStat(stat);
        setInputValue('');
        setModalOpen(true);
    };

    const handleConfirm = () => {
        if (!inputValue || isNaN(inputValue)) return;

        // Pass the numeric value to the parent updater
        updateStats(activeStat.type, parseFloat(inputValue));
        setModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.greeting}>Welcome back, {user?.name || 'Athlete'}! 👋</h1>
                <p className={styles.subGreeting}>Here's your daily fitness overview. You're crushing it!</p>
            </div>

            <div className={styles.statsGrid}>
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.id}
                            className={styles.statCard}
                            onClick={() => handleStatClick(stat)}
                            title={stat.type !== 'streak' ? "Click to log activity" : ""}
                        >
                            <div className={`${styles.statIconWrapper} ${styles[stat.color]}`}>
                                <Icon size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                            {stat.type !== 'streak' && (
                                <Plus size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.actionGrid}>
                <div className={styles.actionCard} onClick={() => onChangeTab('chat')}>
                    <h3>Ask AI Coach</h3>
                    <p>Get instant advice on nutrition, form, or recovery from your personal AI assistant.</p>
                    <div className={styles.actionBtn}>
                        Start Chatting <ArrowRight size={18} />
                    </div>
                </div>

                <div className={styles.actionCard} onClick={() => onChangeTab('planner')}>
                    <h3>Smart Planner</h3>
                    <p>Generate a personalized workout plan based on your current fitness level and goals.</p>
                    <div className={styles.actionBtn}>
                        Create Plan <ArrowRight size={18} />
                    </div>
                </div>
            </div>

            {/* Manual Entry Modal */}
            {modalOpen && activeStat && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={`${styles.statIconWrapper} ${styles[activeStat.color]}`} style={{ width: 40, height: 40 }}>
                                <activeStat.icon size={20} />
                            </div>
                            <h3 className={styles.modalTitle}>Add {activeStat.label}</h3>
                        </div>

                        <input
                            type="number"
                            className={styles.modalInput}
                            placeholder={`Enter ${activeStat.unit}`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                        />

                        <div className={styles.modalActions}>
                            <button className={`${styles.modalBtn} ${styles.cancelBtn}`} onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                            <button className={`${styles.modalBtn} ${styles.confirmBtn}`} onClick={handleConfirm}>
                                Confirm Log
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
