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
                borderBottom: '1px solid #2e2e2e',
                background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)'
            }}>
            {/* Left: Greeting */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.3px' }}>
                        {getGreeting()}, <span style={{ color: 'var(--color-accent, #888888)' }}>{userName}</span> 👋
                    </h1>
                    {moodEntry && (
                        <span title={`Mood: ${moodEntry.label}`} style={{ fontSize: 18, cursor: 'default' }}>{moodEntry.emoji}</span>
                    )}
                </div>
                <div style={{ color: '#999999', fontSize: 13, marginTop: 3, fontWeight: 400 }}>
                    {format(now, 'EEEE, MMMM d, yyyy')} &nbsp;·&nbsp;
                    <span style={{ fontFamily: 'monospace', color: '#f0f0f0', fontWeight: 600 }}>
                        {format(now, 'HH:mm:ss')}
                    </span>
                </div>
            </div>

            {/* Center: quick stats */}
            <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-between sm:justify-start w-full md:w-auto order-3 md:order-2">
                <Stat label="Sleep" val={`${today.sleep}h`} color="#aaaaaa" />
                <Stat label="Study" val={`${today.study}h`} color="#888888" />
                <Stat label="Code" val={`${today.coding.toFixed(1)}h`} color="#f0f0f0" />
                <Stat label="Gym" val={today.workout ? '✅' : '—'} color="#cccccc" />
            </div>

            {/* Right: Score ring */}
            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto order-2 md:order-3 justify-between md:justify-end">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                        <defs>
                            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#333333" />
                                <stop offset="50%" stopColor="#888888" />
                                <stop offset="100%" stopColor="#f0f0f0" />
                            </linearGradient>
                        </defs>
                        <circle cx={30} cy={30} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
                        <circle cx={30} cy={30} r={radius} fill="none" stroke="url(#heroGradient)" strokeWidth={4}
                            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
                    </svg>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f0', lineHeight: 1, letterSpacing: '-0.5px' }}>{score}</div>
                        <div style={{ fontSize: 10, color: '#555555', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{scoreLabel}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(136,136,136,0.1)', border: '1px solid rgba(136,136,136,0.2)', borderRadius: 8 }}>
                    <Zap size={12} style={{ color: '#aaaaaa' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#aaaaaa' }}>Productivity Score</span>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, val, color }: { label: string; val: string; color: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 10, color: '#555555', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        </div>
    );
}
