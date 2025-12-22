import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { ChatInterface } from './components/ChatInterface';
import { WorkoutPlanner } from './components/WorkoutPlanner';
import { BMICalculator } from './components/BMICalculator';
import { Login } from './components/Login';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Fitness State
  const [stats, setStats] = useState({
    weeklyActivityHours: 5.2,
    caloriesBurned: 2450,
    workoutsCompleted: 12,
    activeStreak: 5,
    recentWorkouts: [
      { day: 'Mon', hours: 1.2 },
      { day: 'Tue', hours: 0.8 },
      { day: 'Wed', hours: 1.5 },
      { day: 'Thu', hours: 0.5 },
      { day: 'Fri', hours: 1.2 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: 0 },
    ]
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('fitai_user');
    const savedStats = localStorage.getItem('fitai_stats');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedStats) setStats(JSON.parse(savedStats));

    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('fitai_stats', JSON.stringify(stats));
  }, [stats]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fitai_user', JSON.stringify(userData));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fitai_user');
    setActiveTab('dashboard');
  };

  const updateStats = (type, value) => {
    setStats(prev => {
      const newStats = { ...prev };
      switch (type) {
        case 'calories':
          newStats.caloriesBurned += value;
          break;
        case 'workout':
          newStats.workoutsCompleted += 1;
          newStats.weeklyActivityHours = +(newStats.weeklyActivityHours + (value / 60)).toFixed(1);
          // Update today's graph bar (simulated for Friday for demo)
          const todayIndex = 4; // Friday
          newStats.recentWorkouts[todayIndex].hours += (value / 60);
          break;
        case 'streak':
          newStats.activeStreak += 1;
          break;
        default:
          break;
      }
      return newStats;
    });
  };

  if (loading) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome
          onChangeTab={setActiveTab}
          user={user}
          stats={stats}
          updateStats={updateStats}
        />;
      case 'chat':
        return (
          <div className="content-container">
            <h2 className="section-title">AI Personal Trainer</h2>
            <ChatInterface />
          </div>
        );
      case 'planner':
        return (
          <div className="content-container">
            <h2 className="section-title">Workout Planner</h2>
            <WorkoutPlanner />
          </div>
        );
      case 'tools':
        return (
          <div className="content-container">
            <h2 className="section-title">Fitness Tools</h2>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <BMICalculator />
            </div>
          </div>
        );
      default:
        return <DashboardHome onChangeTab={setActiveTab} user={user} stats={stats} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
