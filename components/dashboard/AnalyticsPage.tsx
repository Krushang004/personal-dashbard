'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { X, TrendingUp, Calendar } from 'lucide-react';
import { DayData, calcProductivityScore, MOODS } from '@/utils/types';

interface Props {
    allData: Record<string, DayData>;
    onClose: () => void;
}

export default function AnalyticsPage({ allData, onClose }: Props) {
    const last14 = Array.from({ length: 14 }, (_, i) => {
        const d = subDays(new Date(), 13 - i);
        const key = format(d, 'yyyy-MM-dd');
        const dayData = allData[key] || { sleep: 0, study: 0, coding: 0, workout: false, habits: {}, mood: '', moneyEarned: 0, moneySpent: 0 };
        const score = calcProductivityScore(dayData as DayData);
        const mood = MOODS.find(m => m.key === (dayData as DayData).mood);
        return {
            day: format(d, 'MMM d'),
            sleep: dayData.sleep || 0,
            study: dayData.study || 0,
            coding: parseFloat(((dayData.coding as number) || 0).toFixed(1)),
            workout: (dayData as DayData).workout ? 1 : 0,
            score,
            moneyEarned: (dayData as DayData).moneyEarned || 0,
            moneySpent: (dayData as DayData).moneySpent || 0,
            moodEmoji: mood?.emoji || '',
        };
    });

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)',
            overflowY: 'auto', padding: '40px 32px'
        }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f1f0f7', letterSpacing: '-0.5px' }}>
                            📊 Analytics
                        </h2>
                        <p style={{ color: '#8b8a96', fontSize: 14, marginTop: 4 }}>Last 14 days overview</p>
                    </div>
                    <button onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: '#f1f0f7', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <X size={14} /> Close
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Productivity Score */}
                    <div className="card p-5" style={{ gridColumn: '1 / -1' }}>
                        <div className="section-title" style={{ marginBottom: 16 }}>Productivity Score — 14 Days</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={last14}>
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff1a', borderRadius: 8, fontSize: 12 }} />
                                <Area type="monotone" dataKey="score" stroke="#7c6af7" strokeWidth={2} fill="url(#scoreGrad)" name="Score" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sleep & Study */}
                    <div className="card p-5">
                        <div className="section-title" style={{ marginBottom: 16 }}>Sleep vs Study Hours</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={last14} barSize={8} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff1a', borderRadius: 8, fontSize: 12 }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8b8a96' }} />
                                <Bar dataKey="sleep" fill="#60a5fa" radius={[3, 3, 0, 0]} name="Sleep" />
                                <Bar dataKey="study" fill="#4ade80" radius={[3, 3, 0, 0]} name="Study" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Coding */}
                    <div className="card p-5">
                        <div className="section-title" style={{ marginBottom: 16 }}>Coding Hours</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={last14}>
                                <defs>
                                    <linearGradient id="codeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff1a', borderRadius: 8, fontSize: 12 }} />
                                <Area type="monotone" dataKey="coding" stroke="#a78bfa" strokeWidth={2} fill="url(#codeGrad)" name="Coding (h)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Money */}
                    <div className="card p-5">
                        <div className="section-title" style={{ marginBottom: 16 }}>Money — Earned vs Spent</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={last14}>
                                <defs>
                                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#4b4a56' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff1a', borderRadius: 8, fontSize: 12 }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8b8a96' }} />
                                <Area type="monotone" dataKey="moneyEarned" stroke="#4ade80" strokeWidth={2} fill="url(#earnGrad)" name="Earned" />
                                <Area type="monotone" dataKey="moneySpent" stroke="#f87171" strokeWidth={2} fill="url(#spendGrad)" name="Spent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Mood row */}
                    <div className="card p-5">
                        <div className="section-title" style={{ marginBottom: 16 }}>Mood History</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {last14.map((d, i) => (
                                <div key={i} style={{ textAlign: 'center', minWidth: 40 }}>
                                    <div style={{ fontSize: 22, lineHeight: 1.4 }}>{d.moodEmoji || '·'}</div>
                                    <div style={{ fontSize: 9, color: '#4b4a56', marginTop: 2 }}>{d.day.split(' ')[1]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
