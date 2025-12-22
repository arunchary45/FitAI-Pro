import { useState } from 'react';
import { Calculator } from 'lucide-react';
import styles from './WorkoutPlanner.module.css'; // Reuse container styles

export function BMICalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState(null);

    const calculateBMI = () => {
        if (weight && height) {
            const hM = height / 100;
            const bmi = (weight / (hM * hM)).toFixed(1);
            let category = '';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';
            setResult({ bmi, category });
        }
    };

    return (
        <div className={styles.container} style={{ marginTop: '2rem' }}>
            <div className={styles.header}>
                <Calculator className={styles.icon} />
                <h2>BMI Calculator</h2>
            </div>
            <div className={styles.form}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Height (cm)"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <button onClick={calculateBMI} className={styles.generateBtn}>
                    Calculate
                </button>
                {result && (
                    <div style={{ textAlign: 'center', marginTop: '1rem', color: '#fff', fontWeight: 'bold' }}>
                        BMI: <span style={{ color: '#06b6d4' }}>{result.bmi}</span> ({result.category})
                    </div>
                )}
            </div>
        </div>
    );
}
