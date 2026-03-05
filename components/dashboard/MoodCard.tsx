'use client';

import { Heart } from 'lucide-react';
import { DayData, MOODS } from '@/utils/types';

interface Props {
    today: DayData;
    weekData: DayData[];
    onUpdate: (partial: Partial<DayData>) => void;
}

export default function MoodCard({ today, weekData, onUpdate }: Props) {
    const selectedMood = MOODS.find(m => m.key === today.mood);

    function select(key: string) {
        onUpdate({ mood: key });
    }

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div style={{ background: '#88888820', borderRadius: 8, padding: '6px' }}>
                    <Heart size={15} style={{ color: '#aaaaaa' }} />
                </div>
                <span className="section-title">Mood</span>
                {selectedMood && (
                    <span className="badge ml-auto" style={{ background: selectedMood.color + '20', color: selectedMood.color }}>
                        {selectedMood.label}
                    </span>
                )}
            </div>

            {/* Emoji picker */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {MOODS.map(m => (
                    <button key={m.key} onClick={() => select(m.key)}
                        style={{
                            padding: '10px 8px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                            background: today.mood === m.key ? m.color + '20' : 'rgba(30,30,30,0.8)',
                            border: `1.5px solid ${today.mood === m.key ? m.color + '60' : 'rgba(255,255,255,0.06)'}`,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            transform: today.mood === m.key ? 'scale(1.02)' : 'scale(1)',
                        }}>
                        <span style={{ fontSize: 22 }}>{m.emoji}</span>
                        <span style={{ fontSize: 10, color: today.mood === m.key ? m.color : '#555555', fontWeight: 500 }}>{m.label}</span>
                    </button>
                ))}
            </div>

            {/* Weekly mood history row */}
            <div>
                <div className="label" style={{ marginBottom: 8 }}>This week</div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {weekData.map((d, i) => {
                        const mood = MOODS.find(m => m.key === d.mood);
                        return (
                            <div key={i} title={mood?.label || 'No entry'}
                                style={{ flex: 1, textAlign: 'center', fontSize: 16, padding: '4px 0' }}>
                                {mood ? mood.emoji : <span style={{ color: '#333333', fontSize: 10 }}>•</span>}
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                        <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#555555' }}>{d}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
