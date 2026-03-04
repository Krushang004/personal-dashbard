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
            <div style={{ background: '#0d1e30', border: '1px solid #22d3ee20', borderRadius: 8, padding: '6px 10px' }}>
                <p style={{ color: '#e2f4ff', fontSize: 12, fontWeight: 600 }}>{payload[0].value}h</p>
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
                    <div style={{ background: '#06b6d420', borderRadius: 8, padding: '6px' }}>
                        <Code2 size={15} style={{ color: '#06b6d4' }} />
                    </div>
                    <span className="section-title">Coding / Work</span>
                </div>
                <span className="badge" style={{ background: '#06b6d420', color: '#06b6d4' }}>
                    {pct.toFixed(0)}% goal
                </span>
            </div>

            <div className="flex items-end gap-2">
                <span className="value-lg" style={{ color: today.coding >= target ? '#34d399' : '#06b6d4' }}>
                    {today.coding.toFixed(1)}
                </span>
                <span style={{ color: '#7a9ab5', marginBottom: 4 }}>/ {target}h goal</span>
            </div>

            {/* Timer */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: running ? '#22d3ee' : '#e2f4ff', letterSpacing: 1 }}
                        className={running ? 'timer-active' : ''}>
                        {formatTime(elapsed)}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button
                            onClick={() => setRunning(!running)}
                            style={{ background: running ? '#06b6d420' : '#06b6d4', borderRadius: 7, padding: '5px 10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: running ? '#22d3ee' : 'white', fontSize: 12 }}>
                            {running ? <Pause size={12} /> : <Play size={12} />}
                            {running ? 'Pause' : 'Start'}
                        </button>
                        {(running || elapsed > 0) && (
                            <button onClick={handleStop}
                                style={{ background: '#f8717115', borderRadius: 7, padding: '5px 10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#f87171', fontSize: 12 }}>
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
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#3d5a70' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={index === 6 ? '#06b6d4' : '#06b6d430'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
