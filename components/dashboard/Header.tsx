'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Zap, RefreshCw } from 'lucide-react';
import { DayData, calcProductivityScore, getScoreColor, getScoreLabel, MOODS } from '@/utils/types';
import { getGreeting } from '@/utils/dateUtils';

interface Props {
    today: DayData;
    userName: string;
    onRefresh?: () => void;
}

export default function Header({ today, userName, onRefresh }: Props) {
    const [now, setNow] = useState(new Date());
    const score = calcProductivityScore(today);
    const scoreColor = getScoreColor(score);
    const scoreLabel = getScoreLabel(score);
    const moodEntry = MOODS.find(m => m.key === today.mood);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Radius for SVG circle
    const radius = 22;
    const circ = 2 * Math.PI * radius;
    const dash = (score / 100) * circ;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-8 py-5 sticky top-0 z-20"
            style={{
                borderBottom: '1px solid rgba(34,211,238,0.08)',
                background: 'rgba(5,13,26,0.85)', backdropFilter: 'blur(20px)'
            }}>
            {/* Left: Greeting */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E6EDF3', letterSpacing: '-0.3px' }}>
                        {getGreeting()}, <span style={{ color: 'var(--color-accent, #3BA4F7)' }}>{userName}</span> 👋
                    </h1>
                    {moodEntry && (
                        <span title={`Mood: ${moodEntry.label}`} style={{ fontSize: 18, cursor: 'default' }}>{moodEntry.emoji}</span>
                    )}
                </div>
                <div style={{ color: '#7a9ab5', fontSize: 13, marginTop: 3, fontWeight: 400 }}>
                    {format(now, 'EEEE, MMMM d, yyyy')} &nbsp;·&nbsp;
                    <span style={{ fontFamily: 'monospace', color: 'var(--color-accent-light, #c084fc)', fontWeight: 600 }}>
                        {format(now, 'HH:mm:ss')}
                    </span>
                </div>
            </div>

            {/* Center: quick stats */}
            <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-between sm:justify-start w-full md:w-auto order-3 md:order-2">
                <Stat label="Sleep" val={`${today.sleep}h`} color="#60a5fa" />
                <Stat label="Study" val={`${today.study}h`} color="#34d399" />
                <Stat label="Code" val={`${today.coding.toFixed(1)}h`} color="#06b6d4" />
                <Stat label="Gym" val={today.workout ? '✅' : '—'} color="#f97316" />
            </div>

            {/* Right: Score ring */}
            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto order-2 md:order-3 justify-between md:justify-end">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                        <defs>
                            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1C3D8C" />
                                <stop offset="50%" stopColor="#0F6CBD" />
                                <stop offset="100%" stopColor="#1F9D8B" />
                            </linearGradient>
                        </defs>
                        <circle cx={30} cy={30} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
                        <circle cx={30} cy={30} r={radius} fill="none" stroke="url(#heroGradient)" strokeWidth={4}
                            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
                    </svg>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#E6EDF3', lineHeight: 1, letterSpacing: '-0.5px' }}>{score}</div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{scoreLabel}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'var(--color-accent-dim)', border: '1px solid rgba(59,164,247,0.3)', borderRadius: 8 }}>
                    <Zap size={12} style={{ color: 'var(--color-accent, #3BA4F7)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-accent, #3BA4F7)' }}>Productivity Score</span>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, val, color }: { label: string; val: string; color: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 10, color: '#3d5a70', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        </div>
    );
}
