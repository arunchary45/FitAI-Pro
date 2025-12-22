import React from 'react';
import { LayoutDashboard, MessageSquare, Dumbbell, Activity, Settings, LogOut, Zap } from 'lucide-react';
import styles from './Sidebar.module.css';

export function Sidebar({ activeTab, onTabChange, user, onLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'chat', label: 'AI Trainer', icon: MessageSquare },
        { id: 'planner', label: 'Workout Planner', icon: Dumbbell },
        { id: 'tools', label: 'Tools & BMI', icon: Activity },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Zap className={styles.logoIcon} />
                <span className={styles.logoText}>FitAI Pro</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                            onClick={() => onTabChange(item.id)}
                        >
                            <Icon className={styles.icon} />
                            <span>{item.label}</span>
                        </div>
                    );
                })}
            </nav>

            <div className={styles.userProfile}>
                <div className={styles.userAvatar}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={styles.userInfo}>
                    <h4>{user?.name || 'User'}</h4>
                    <p>Pro Member</p>
                </div>
                <LogOut
                    size={18}
                    style={{ marginLeft: 'auto', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={onLogout}
                    title="Logout"
                />
            </div>
        </aside>
    );
}
