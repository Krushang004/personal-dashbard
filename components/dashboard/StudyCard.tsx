'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { getWeekLabels } from '@/utils/dateUtils';
import { DayData } from '@/utils/types';

interface Props {
    today: DayData;
    weekData: DayData[];
    onUpdate: (partial: Partial<DayData>) => void;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#11212D', border: '1px solid #4A5C6A40', borderRadius: 8, padding: '6px 10px' }}>
                <p style={{ color: '#CCD0CF', fontSize: 12, fontWeight: 600 }}>{payload[0].value}h</p>
            </div>
        );
    }
    return null;
};

export default function StudyCard({ today, weekData, onUpdate }: Props) {
    const [inputVal, setInputVal] = useState('');
    const labels = getWeekLabels();
    const chartData = weekData.map((d, i) => ({ day: labels[i], hours: d.study }));
    const target = 4;
    const pct = Math.min(100, (today.study / target) * 100);
    const weekTotal = weekData.reduce((s, d) => s + d.study, 0);

    function handleSave() {
        const v = parseFloat(inputVal);
        if (!isNaN(v) && v >= 0) {
            onUpdate({ study: v });
            setInputVal('');
        }
    }

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div style={{ background: 'rgba(74,92,106,0.3)', borderRadius: 8, padding: '6px' }}>
                        <BookOpen size={15} style={{ color: '#9BA8AB' }} />
                    </div>
                    <span className="section-title">Study</span>
                </div>
                <span className="badge" style={{ background: 'rgba(74,92,106,0.25)', color: '#CCD0CF' }}>
                    {weekTotal.toFixed(1)}h week
                </span>
            </div>

            <div className="flex items-end gap-2">
                <span className="value-lg" style={{ color: today.study >= target ? '#CCD0CF' : today.study >= 2 ? '#9BA8AB' : '#CCD0CF' }}>
                    {today.study}
                </span>
                <span style={{ color: '#4A5C6A', marginBottom: 4 }}>/ {target}h goal</span>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #253745, #4A5C6A, #9BA8AB)' }} />
            </div>

            <div style={{ fontSize: 11, color: '#4A5C6A' }}>
                {pct >= 100 ? '✅ Goal reached!' : `${(target - today.study).toFixed(1)}h remaining`}
            </div>

            <div className="flex gap-2">
                <input
                    type="number"
                    className="input-field"
                    placeholder="Hours studied today..."
                    value={inputVal}
                    min={0} max={24} step={0.5}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
                <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>

            <div style={{ height: 65 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={10}>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4A5C6A' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={index === 6 ? '#9BA8AB' : '#4A5C6A25'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
