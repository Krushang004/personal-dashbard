'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Zap, RefreshCw } from 'lucide-react';
import { DayData, calcProductivityScore, getScoreColor, getScoreLabel, MOODS } from '@/utils/types';
import { getGreeting } from '@/utils/dateUtils';

interface Props {
    today: DayData;
    onRefresh?: () => void;
}

export default function Header({ today, onRefresh }: Props) {
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
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)',
            position: 'sticky', top: 0, zIndex: 10
        }}>
            {/* Left: Greeting */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f0f7', letterSpacing: '-0.3px' }}>
                        {getGreeting()}, <span style={{ color: '#7c6af7' }}>Krushang</span> 👋
                    </h1>
                    {moodEntry && (
                        <span title={`Mood: ${moodEntry.label}`} style={{ fontSize: 18, cursor: 'default' }}>{moodEntry.emoji}</span>
                    )}
                </div>
                <div style={{ color: '#8b8a96', fontSize: 13, marginTop: 3, fontWeight: 400 }}>
                    {format(now, 'EEEE, MMMM d, yyyy')} &nbsp;·&nbsp;
                    <span style={{ fontFamily: 'monospace', color: '#7c6af7', fontWeight: 600 }}>
                        {format(now, 'HH:mm:ss')}
                    </span>
                </div>
            </div>

            {/* Center: quick stats */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <Stat label="Sleep" val={`${today.sleep}h`} color="#60a5fa" />
                <Stat label="Study" val={`${today.study}h`} color="#4ade80" />
                <Stat label="Code" val={`${today.coding.toFixed(1)}h`} color="#a78bfa" />
                <Stat label="Gym" val={today.workout ? '✅' : '—'} color="#fb923c" />
            </div>

            {/* Right: Score ring */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx={30} cy={30} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
                        <circle cx={30} cy={30} r={radius} fill="none" stroke={scoreColor} strokeWidth={4}
                            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
                    </svg>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor, lineHeight: 1, letterSpacing: '-0.5px' }}>{score}</div>
                        <div style={{ fontSize: 10, color: '#8b8a96', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{scoreLabel}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#7c6af720', border: '1px solid #7c6af730', borderRadius: 8 }}>
                    <Zap size={12} style={{ color: '#7c6af7' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#7c6af7' }}>Productivity Score</span>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, val, color }: { label: string; val: string; color: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 10, color: '#4b4a56', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        </div>
    );
}
