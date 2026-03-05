'use client';

import { useState } from 'react';
import { Dumbbell, Flame, CheckCircle2, Circle } from 'lucide-react';
import { DayData } from '@/utils/types';
import { getWeekKeys } from '@/utils/dateUtils';

interface Props {
    today: DayData;
    weekData: DayData[];
    onUpdate: (partial: Partial<DayData>) => void;
}

const WORKOUT_TYPES = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio', 'Full Body', 'Rest Day'];

export default function GymCard({ today: t, weekData: wd, onUpdate }: Props) {
    const [notes, setNotes] = useState(t.workoutNotes || '');

    // Streak calculation
    const keys = getWeekKeys();
    let streak = 0;
    for (let i = wd.length - 1; i >= 0; i--) {
        if (wd[i].workout) streak++;
        else break;
    }

    const weekWorkouts = wd.filter(d => d.workout).length;

    function toggleWorkout() {
        onUpdate({ workout: !t.workout });
    }

    function saveNotes() {
        onUpdate({ workoutNotes: notes });
    }

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div style={{ background: '#fb923c20', borderRadius: 8, padding: '6px' }}>
                        <Dumbbell size={15} style={{ color: '#fb923c' }} />
                    </div>
                    <span className="section-title">Gym / Health</span>
                </div>
                {streak > 0 && (
                    <span className="badge" style={{ background: '#fb923c20', color: '#fb923c' }}>
                        <Flame size={10} /> {streak} streak
                    </span>
                )}
            </div>

            {/* Today toggle */}
            <button
                onClick={toggleWorkout}
                style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                    background: t.workout ? '#fb923c12' : 'rgba(30,30,30,0.9)',
                    border: `1px solid ${t.workout ? '#fb923c40' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 10, cursor: 'pointer', width: '100%', transition: 'all 0.2s'
                }}>
                {t.workout
                    ? <CheckCircle2 size={18} style={{ color: '#fb923c' }} />
                    : <Circle size={18} style={{ color: '#555555' }} />}
                <div style={{ textAlign: 'left' }}>
                    <div style={{ color: t.workout ? '#fb923c' : '#f0f0f0', fontWeight: 600, fontSize: 13 }}>
                        {t.workout ? 'Workout done! 💪' : 'Mark today\'s workout'}
                    </div>
                    <div style={{ color: '#555555', fontSize: 11 }}>{weekWorkouts}/7 workouts this week</div>
                </div>
            </button>

            {/* Weekly dots */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: '#555555', fontSize: 11, width: 60 }}>This week</span>
                <div style={{ display: 'flex', gap: 4 }}>
                    {wd.map((d, i) => (
                        <div key={i} title={keys[i]} style={{
                            width: 20, height: 20, borderRadius: 5,
                            background: d.workout ? '#f0f0f0' : 'rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
                            color: d.workout ? 'white' : '#555555'
                        }}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </div>
                    ))}
                </div>
            </div>

            {/* Workout type quick tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {WORKOUT_TYPES.map(type => (
                    <button key={type} onClick={() => setNotes(type)}
                        style={{
                            padding: '3px 9px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                            background: notes === type ? '#88888820' : 'rgba(30,30,30,0.8)',
                            border: `1px solid ${notes === type ? '#88888840' : 'rgba(255,255,255,0.06)'}`,
                            color: notes === type ? '#f0f0f0' : '#888888', transition: 'all 0.15s'
                        }}>
                        {type}
                    </button>
                ))}
            </div>

            <input
                className="input-field"
                placeholder="Workout notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                onBlur={saveNotes}
                onKeyDown={e => e.key === 'Enter' && saveNotes()}
            />
        </div>
    );
}
