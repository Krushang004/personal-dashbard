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
        <div className="fixed inset-0 z-[100] overflow-y-auto px-4 py-8 sm:px-8 sm:py-10"
            style={{
                background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)',
            }}>
            <div className="max-w-[1000px] mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
                            📊 Analytics
                        </h2>
                        <p style={{ color: '#888888', fontSize: 14, marginTop: 4 }}>Last 14 days overview</p>
                    </div>
                    <button onClick={onClose}
                        style={{ background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: '#f0f0f0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <X size={14} /> Close
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Productivity Score */}
                    <div className="card p-4 sm:p-5 lg:col-span-2">
                        <div className="section-title" style={{ marginBottom: 16 }}>Productivity Score — 14 Days</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={last14}>
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#888888" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#888888" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12, color: '#f0f0f0' }} />
                                <Area type="monotone" dataKey="score" stroke="#888888" strokeWidth={2} fill="url(#scoreGrad)" name="Score" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sleep & Study */}
                    <div className="card p-5">
                        <div className="section-title" style={{ marginBottom: 16 }}>Sleep vs Study Hours</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={last14} barSize={8} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#181818', border: '1px solid #33333350', borderRadius: 8, fontSize: 12 }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#888888' }} />
                                <Bar dataKey="sleep" fill="#666666" radius={[3, 3, 0, 0]} name="Sleep" />
                                <Bar dataKey="study" fill="#aaaaaa" radius={[3, 3, 0, 0]} name="Study" />
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
                                        <stop offset="5%" stopColor="#888888" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#888888" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12, color: '#f0f0f0' }} />
                                <Area type="monotone" dataKey="coding" stroke="#888888" strokeWidth={2} fill="url(#codeGrad)" name="Coding (h)" />
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
                                        <stop offset="5%" stopColor="#f0f0f0" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#f0f0f0" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#888888" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#888888" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#555555' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12, color: '#f0f0f0' }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#888888' }} />
                                <Area type="monotone" dataKey="moneyEarned" stroke="#f0f0f0" strokeWidth={2} fill="url(#earnGrad)" name="Earned" />
                                <Area type="monotone" dataKey="moneySpent" stroke="#888888" strokeWidth={2} fill="url(#spendGrad)" name="Spent" />
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
                                    <div style={{ fontSize: 9, color: '#555555', marginTop: 2 }}>{d.day.split(' ')[1]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
