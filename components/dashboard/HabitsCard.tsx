'use client';

import { useState } from 'react';
import { CheckSquare, Square, Flame } from 'lucide-react';
import { DayData, DEFAULT_HABITS } from '@/utils/types';
import { getWeekKeys } from '@/utils/dateUtils';

interface Props {
    today: DayData;
    weekData: DayData[];
    onUpdate: (partial: Partial<DayData>) => void;
}

export default function HabitsCard({ today, weekData, onUpdate }: Props) {
    const keys = getWeekKeys();

    function toggle(habit: string) {
        const updated = { ...today.habits, [habit]: !today.habits[habit] };
        onUpdate({ habits: updated });
    }

    function getStreak(habit: string): number {
        let streak = 0;
        for (let i = weekData.length - 1; i >= 0; i--) {
            if (weekData[i].habits?.[habit]) streak++;
            else break;
        }
        return streak;
    }

    const done = DEFAULT_HABITS.filter(h => today.habits[h]).length;
    const total = DEFAULT_HABITS.length;

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div style={{ background: 'rgba(74,92,106,0.3)', borderRadius: 8, padding: '6px' }}>
                        <CheckSquare size={15} style={{ color: '#9BA8AB' }} />
                    </div>
                    <span className="section-title">Habits</span>
                </div>
                <span className="badge" style={{ background: 'rgba(74,92,106,0.25)', color: '#CCD0CF' }}>
                    {done}/{total} today
                </span>
            </div>

            {/* Progress */}
            <div className="progress-bar">
                <div className="progress-fill"
                    style={{ width: `${(done / total) * 100}%`, background: 'linear-gradient(90deg, #253745, #4A5C6A, #9BA8AB)' }} />
            </div>

            {/* Habit list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {DEFAULT_HABITS.map(habit => {
                    const checked = !!today.habits[habit];
                    const streak = getStreak(habit);
                    return (
                        <button key={habit} onClick={() => toggle(habit)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 10px', borderRadius: 8, cursor: 'pointer', width: '100%', transition: 'all 0.15s',
                                background: checked ? 'rgba(74,92,106,0.25)' : 'rgba(17,33,45,0.8)',
                                border: `1px solid ${checked ? '#4A5C6A' : 'rgba(74,92,106,0.2)'}`,
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {checked
                                    ? <CheckSquare size={15} style={{ color: '#9BA8AB' }} />
                                    : <Square size={15} style={{ color: '#4A5C6A' }} />}
                                <span style={{ fontSize: 13, color: checked ? '#CCD0CF' : '#9BA8AB', fontWeight: checked ? 500 : 400 }}>
                                    {habit}
                                </span>
                            </div>
                            {streak > 1 && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#9BA8AB' }}>
                                    <Flame size={10} /> {streak}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
