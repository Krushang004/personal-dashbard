'use client';

import { useState, useEffect, useRef } from 'react';
import { Code2, Play, Pause, Square } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { getWeekLabels, formatTime } from '@/utils/dateUtils';
import { DayData } from '@/utils/types';

interface Props {
    today: DayData;
    weekData: DayData[];
    onUpdate: (partial: Partial<DayData>) => void;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 10px' }}>
                <p style={{ color: '#CCD0CF', fontSize: 12, fontWeight: 600 }}>{payload[0].value}h</p>
            </div>
        );
    }
    return null;
};

export default function CodingCard({ today, weekData, onUpdate }: Props) {
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(today.codingSeconds || 0);
    const [manualInput, setManualInput] = useState('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const labels = getWeekLabels();
    const chartData = weekData.map((d, i) => ({ day: labels[i], hours: parseFloat(d.coding.toFixed(1)) }));
    const target = 3;
    const pct = Math.min(100, (today.coding / target) * 100);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setElapsed(e => e + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running]);

    function handleStop() {
        setRunning(false);
        const totalHours = elapsed / 3600;
        const newCoding = parseFloat((today.coding + totalHours).toFixed(2));
        onUpdate({ coding: newCoding, codingSeconds: elapsed });
        setElapsed(0);
    }

    function handleManualSave() {
        const v = parseFloat(manualInput);
        if (!isNaN(v) && v >= 0) {
            onUpdate({ coding: v, codingSeconds: Math.round(v * 3600) });
            setManualInput('');
        }
    }

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div style={{ background: 'rgba(74,92,106,0.3)', borderRadius: 8, padding: '6px' }}>
                        <Code2 size={15} style={{ color: '#9BA8AB' }} />
                    </div>
                    <span className="section-title">Coding / Work</span>
                </div>
                <span className="badge" style={{ background: 'rgba(74,92,106,0.25)', color: '#CCD0CF' }}>
                    {pct.toFixed(0)}% goal
                </span>
            </div>

            <div className="flex items-end gap-2">
                <span className="value-lg" style={{ color: today.coding >= target ? '#CCD0CF' : '#9BA8AB' }}>
                    {today.coding.toFixed(1)}
                </span>
                <span style={{ color: '#4A5C6A', marginBottom: 4 }}>/ {target}h goal</span>
            </div>

            {/* Timer */}
            <div style={{ background: '#11212D', borderRadius: 10, padding: '10px 12px', border: '1px solid #4A5C6A30' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: running ? '#CCD0CF' : '#4A5C6A', letterSpacing: 1 }}
                        className={running ? 'timer-active' : ''}>
                        {formatTime(elapsed)}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button
                            onClick={() => setRunning(!running)}
                            style={{ background: running ? 'rgba(74,92,106,0.3)' : '#4A5C6A', borderRadius: 7, padding: '5px 10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: running ? '#9BA8AB' : '#CCD0CF', fontSize: 12 }}>
                            {running ? <Pause size={12} /> : <Play size={12} />}
                            {running ? 'Pause' : 'Start'}
                        </button>
                        {(running || elapsed > 0) && (
                            <button onClick={handleStop}
                                style={{ background: 'rgba(74,92,106,0.2)', borderRadius: 7, padding: '5px 10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#9BA8AB', fontSize: 12 }}>
                                <Square size={12} /> Stop
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <input
                    type="number"
                    className="input-field"
                    placeholder="Or enter hours manually..."
                    value={manualInput}
                    min={0} step={0.5}
                    onChange={e => setManualInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleManualSave()}
                />
                <button className="btn-secondary" onClick={handleManualSave}>Set</button>
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
