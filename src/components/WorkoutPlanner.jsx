import { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { Dumbbell, Download, Zap } from 'lucide-react';
import styles from './WorkoutPlanner.module.css';

export function WorkoutPlanner() {
    const [formData, setFormData] = useState({
        fitnessLevel: 'intermediate',
        workoutType: 'weight_loss',
        duration: 45
    });
    const [plan, setPlan] = useState(null);
    const { generateResponse, loading, error } = useGemini();

    const handleGenerate = async () => {
        setPlan(null);
        const prompt = `Create a ${formData.duration}-minute ${formData.workoutType} workout plan for a ${formData.fitnessLevel} fitness level. 
    Include specific exercises, sets, reps, and rest periods. Format it in a clear, easy-to-follow structure with proper spacing and line breaks.`;

        const response = await generateResponse(prompt);
        if (response) setPlan(response);
    };

    const handleDownload = () => {
        if (!plan) return;
        const blob = new Blob([plan], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workout-plan.txt';
        a.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Dumbbell className={styles.icon} />
                <h2>Smart Planner</h2>
            </div>

            <div className={styles.form}>
                <div className={styles.group}>
                    <label>Fitness Level</label>
                    <select
                        value={formData.fitnessLevel}
                        onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })}
                        className={styles.select}
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="athlete">Elite Athlete</option>
                    </select>
                </div>

                <div className={styles.group}>
                    <label>Goal / Type</label>
                    <select
                        value={formData.workoutType}
                        onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
                        className={styles.select}
                    >
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                        <option value="flexibility">Yoga & Flexibility</option>
                        <option value="hiit">HIIT</option>
                    </select>
                </div>

                <div className={styles.group}>
                    <label>Duration (Minutes)</label>
                    <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className={styles.input}
                        min="15" max="180"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={styles.generateBtn}
                >
                    {loading ? 'Generating...' : <><Zap size={18} /> Generate AI Plan</>}
                </button>

                {error && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
            </div>

            {plan && (
                <div className={styles.result}>
                    <h3>Your Plan</h3>
                    <div className={styles.planContent}>
                        {plan.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                    <button onClick={handleDownload} className={styles.downloadBtn}>
                        <Download size={18} /> Download Plan
                    </button>
                </div>
            )}
        </div>
    );
}
