'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getWeekLabels, formatCurrency } from '@/utils/dateUtils';
import { DayData } from '@/utils/types';

interface Props {
    today: DayData;
    weekData: DayData[];
    onUpdate: (partial: Partial<DayData>) => void;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#11212D', border: '1px solid #4A5C6A40', borderRadius: 8, padding: '6px 10px' }}>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.name === 'earned' ? '#CCD0CF' : '#9BA8AB', fontSize: 11, fontWeight: 600 }}>
                        {p.name}: ₹{p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function MoneyCard({ today, weekData, onUpdate }: Props) {
    const [earned, setEarned] = useState('');
    const [spent, setSpent] = useState('');
    const labels = getWeekLabels();

    const balance = today.moneyEarned - today.moneySpent;
    const positive = balance >= 0;

    const chartData = weekData.map((d, i) => ({
        day: labels[i],
        earned: d.moneyEarned,
        spent: d.moneySpent,
    }));

    function saveEarned() {
        const v = parseFloat(earned);
        if (!isNaN(v) && v >= 0) { onUpdate({ moneyEarned: v }); setEarned(''); }
    }
    function saveSpent() {
        const v = parseFloat(spent);
        if (!isNaN(v) && v >= 0) { onUpdate({ moneySpent: v }); setSpent(''); }
    }

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div style={{ background: 'rgba(74,92,106,0.3)', borderRadius: 8, padding: '6px' }}>
                    <DollarSign size={15} style={{ color: '#9BA8AB' }} />
                </div>
                <span className="section-title">Money</span>
                <span className="badge ml-auto" style={{ background: positive ? 'rgba(155,168,171,0.15)' : 'rgba(74,92,106,0.25)', color: positive ? '#CCD0CF' : '#9BA8AB' }}>
                    {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {formatCurrency(Math.abs(balance))}
                </span>
            </div>

            {/* Summary row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(155,168,171,0.08)', border: '1px solid #4A5C6A', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ color: '#4A5C6A', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Earned</div>
                    <div style={{ color: '#CCD0CF', fontSize: 18, fontWeight: 700, marginTop: 2 }}>{formatCurrency(today.moneyEarned)}</div>
                </div>
                <div style={{ background: 'rgba(74,92,106,0.15)', border: '1px solid #4A5C6A50', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ color: '#4A5C6A', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Spent</div>
                    <div style={{ color: '#9BA8AB', fontSize: 18, fontWeight: 700, marginTop: 2 }}>{formatCurrency(today.moneySpent)}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <input className="input-field" type="number" placeholder="Earned (₹)" value={earned}
                        onChange={e => setEarned(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEarned()} min={0} />
                    <button className="btn-primary" onClick={saveEarned}>Set earned</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <input className="input-field" type="number" placeholder="Spent (₹)" value={spent}
                        onChange={e => setSpent(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveSpent()} min={0} />
                    <button className="btn-secondary" onClick={saveSpent}>Set spent</button>
                </div>
            </div>

            <div style={{ height: 65 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#CCD0CF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#CCD0CF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4A5C6A" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#4A5C6A" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4A5C6A' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Area type="monotone" dataKey="earned" stroke="#9BA8AB" strokeWidth={1.5} fill="url(#colorEarned)" name="earned" />
                        <Area type="monotone" dataKey="spent" stroke="#4A5C6A" strokeWidth={1.5} fill="url(#colorSpent)" name="spent" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
