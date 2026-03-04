'use client';

import { useState } from 'react';
import { BarChart2, Youtube, Instagram, Users, TrendingUp } from 'lucide-react';
import { DayData } from '@/utils/types';

interface Props {
    today: DayData;
    onUpdate: (partial: Partial<DayData>) => void;
}

interface StatField {
    key: keyof DayData;
    label: string;
    icon: React.ReactNode;
    color: string;
    placeholder: string;
    suffix?: string;
}

const FIELDS: StatField[] = [
    { key: 'ytViews', label: 'YT Views', icon: <Youtube size={13} />, color: '#f87171', placeholder: '0', suffix: 'views' },
    { key: 'ytSubscribers', label: 'YT Subs', icon: <Users size={13} />, color: '#fb923c', placeholder: '0', suffix: 'subs' },
    { key: 'igViews', label: 'IG Views', icon: <Instagram size={13} />, color: '#f472b6', placeholder: '0', suffix: 'views' },
    { key: 'followers', label: 'IG Followers', icon: <TrendingUp size={13} />, color: '#3BA4F7', placeholder: '0', suffix: 'followers' },
];

export default function SocialCard({ today, onUpdate }: Props) {
    const [vals, setVals] = useState<Record<string, string>>({});

    function handleSave(field: StatField) {
        const raw = vals[field.key] ?? '';
        const v = parseInt(raw.replace(/,/g, ''));
        if (!isNaN(v) && v >= 0) {
            onUpdate({ [field.key]: v } as Partial<DayData>);
            setVals(prev => ({ ...prev, [field.key]: '' }));
        }
    }

    function formatNum(n: number): string {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return n.toString();
    }

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div style={{ background: '#f472b620', borderRadius: 8, padding: '6px' }}>
                    <BarChart2 size={15} style={{ color: '#f472b6' }} />
                </div>
                <span className="section-title">Social Metrics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FIELDS.map(field => {
                    const current = today[field.key] as number || 0;
                    return (
                        <div key={field.key}
                            style={{ background: field.color + '08', border: `1px solid ${field.color}20`, borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                                <span style={{ color: field.color }}>{field.icon}</span>
                                <span style={{ color: '#8b8a96', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {field.label}
                                </span>
                            </div>
                            <div style={{ color: field.color, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                                {formatNum(current)}
                            </div>
                            <div style={{ display: 'flex', gap: 5 }}>
                                <input
                                    className="input-field"
                                    type="number" min={0}
                                    placeholder={field.placeholder}
                                    value={vals[field.key] ?? ''}
                                    onChange={e => setVals(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && handleSave(field)}
                                    style={{ fontSize: 12, padding: '5px 8px' }}
                                />
                                <button onClick={() => handleSave(field)}
                                    style={{ background: field.color + '20', border: `1px solid ${field.color}30`, color: field.color, borderRadius: 7, padding: '5px 8px', cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}>
                                    Set
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
