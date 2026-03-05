'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Zap } from 'lucide-react';
import { DayData, MOODS, calcProductivityScore, getScoreColor, getScoreLabel } from '@/utils/types';

interface Props {
    today: DayData;
    userName: string;
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
}

function Stat({ label, val, color }: { label: string; val: string; color: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 10, color: '#4A5C6A', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        </div>
    );
}

export default function Header({ today, userName }: Props) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const score = calcProductivityScore(today);
    const scoreLabel = getScoreLabel(score);
    const moodEntry = MOODS.find(m => m.key === today.mood);
    const radius = 24;
    const circ = 2 * Math.PI * radius;
    const dash = (score / 100) * circ;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-8 py-5 md:sticky md:top-0 z-20"
            style={{
                borderBottom: '1px solid #253745',
                background: 'rgba(6, 20, 27, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            }}>
            {/* Left: Greeting */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#CCD0CF', letterSpacing: '-0.3px' }}>
                        {getGreeting()}, <span style={{ color: '#9BA8AB' }}>{userName}</span> 👋
                    </h1>
                    {moodEntry && (
                        <span title={`Mood: ${moodEntry.label}`} style={{ fontSize: 18, cursor: 'default' }}>{moodEntry.emoji}</span>
                    )}
                </div>
                <div style={{ color: '#4A5C6A', fontSize: 13, marginTop: 3, fontWeight: 400 }}>
                    {format(now, 'EEEE, MMMM d, yyyy')} &nbsp;·&nbsp;
                    <span style={{ fontFamily: 'monospace', color: '#9BA8AB', fontWeight: 600 }}>
                        {format(now, 'HH:mm:ss')}
                    </span>
                </div>
            </div>

            {/* Center: quick stats */}
            <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-between sm:justify-start w-full md:w-auto order-3 md:order-2">
                <Stat label="Sleep" val={`${today.sleep}h`} color="#9BA8AB" />
                <Stat label="Study" val={`${today.study}h`} color="#CCD0CF" />
                <Stat label="Code" val={`${today.coding.toFixed(1)}h`} color="#9BA8AB" />
                <Stat label="Gym" val={today.workout ? '✅' : '—'} color="#CCD0CF" />
            </div>

            {/* Right: Score ring */}
            <div className="flex items-center gap-4 order-2 md:order-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                        <defs>
                            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#253745" />
                                <stop offset="50%" stopColor="#4A5C6A" />
                                <stop offset="100%" stopColor="#CCD0CF" />
                            </linearGradient>
                        </defs>
                        <circle cx={30} cy={30} r={radius} fill="none" stroke="rgba(74,92,106,0.3)" strokeWidth={4} />
                        <circle cx={30} cy={30} r={radius} fill="none" stroke="url(#heroGradient)" strokeWidth={4}
                            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
                    </svg>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: getScoreColor(score), lineHeight: 1, letterSpacing: '-0.5px' }}>{score}</div>
                        <div style={{ fontSize: 10, color: '#4A5C6A', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{scoreLabel}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(74,92,106,0.2)', border: '1px solid rgba(74,92,106,0.4)', borderRadius: 8 }}>
                    <Zap size={12} style={{ color: '#9BA8AB' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#9BA8AB' }}>Productivity Score</span>
                </div>
            </div>
        </div>
    );
}
