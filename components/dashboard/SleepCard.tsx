'use client';

import { useState } from 'react';
import { Moon, TrendingUp } from 'lucide-react';
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

export default function SleepCard({ today, weekData, onUpdate }: Props) {
    const [inputVal, setInputVal] = useState('');
    const labels = getWeekLabels();
    const chartData = weekData.map((d, i) => ({ day: labels[i], hours: d.sleep }));
    const avgSleep = weekData.reduce((s, d) => s + d.sleep, 0) / 7;
    const target = 8;
    const pct = Math.min(100, (today.sleep / target) * 100);

    function handleSave() {
        const v = parseFloat(inputVal);
        if (!isNaN(v) && v >= 0 && v <= 24) {
            onUpdate({ sleep: v });
            setInputVal('');
        }
    }

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div style={{ background: 'rgba(74,92,106,0.3)', borderRadius: 8, padding: '6px' }}>
                        <Moon size={15} style={{ color: '#9BA8AB' }} />
                    </div>
                    <span className="section-title">Sleep</span>
                </div>
                <span className="badge" style={{ background: 'rgba(74,92,106,0.25)', color: '#CCD0CF' }}>
                    {avgSleep.toFixed(1)}h avg
                </span>
            </div>

            <div className="flex items-end gap-2">
                <span className="value-lg" style={{ color: today.sleep >= 7 ? '#CCD0CF' : today.sleep >= 6 ? '#9BA8AB' : '#4A5C6A' }}>
                    {today.sleep}
                </span>
                <span style={{ color: '#4A5C6A', marginBottom: 4 }}>/ {target}h</span>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: today.sleep >= 7 ? '#9BA8AB' : today.sleep >= 6 ? '#4A5C6A' : '#2E4252' }} />
            </div>

            <div className="flex gap-2">
                <input
                    type="number"
                    className="input-field"
                    placeholder="Hours slept..."
                    value={inputVal}
                    min={0} max={24} step={0.5}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
                <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>

            <div style={{ height: 70 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={10}>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4A5C6A' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={index === 6 ? '#9BA8AB' : '#4A5C6A30'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-1" style={{ color: '#4A5C6A', fontSize: 11 }}>
                <TrendingUp size={11} />
                <span>Target: 7–9 hours per night</span>
            </div>
        </div>
    );
}
