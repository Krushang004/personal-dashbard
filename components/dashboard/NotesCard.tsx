'use client';

import { FileText, Save } from 'lucide-react';
import { DayData } from '@/utils/types';
import { useState, useEffect } from 'react';

interface Props {
    today: DayData;
    onUpdate: (partial: Partial<DayData>) => void;
}

export default function NotesCard({ today, onUpdate }: Props) {
    const [text, setText] = useState(today.notes || '');
    const [saved, setSaved] = useState(true);

    useEffect(() => {
        setText(today.notes || '');
    }, [today.notes]);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value);
        setSaved(false);
    }

    function handleSave() {
        onUpdate({ notes: text });
        setSaved(true);
    }

    // Auto-save after 1.5s of inactivity
    useEffect(() => {
        if (saved) return;
        const t = setTimeout(() => {
            onUpdate({ notes: text });
            setSaved(true);
        }, 1500);
        return () => clearTimeout(t);
    }, [text, saved]);

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div style={{ background: '#88888820', borderRadius: 8, padding: '6px' }}>
                        <FileText size={15} style={{ color: '#aaaaaa' }} />
                    </div>
                    <span className="section-title">Daily Notes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#555555' }}>{wordCount} words</span>
                    <button onClick={handleSave}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 7, cursor: 'pointer', fontSize: 11,
                            background: saved ? 'rgba(30,30,30,0.8)' : '#88888818', border: `1px solid ${saved ? 'rgba(255,255,255,0.08)' : '#88888835'}`,
                            color: saved ? '#555555' : '#aaaaaa', transition: 'all 0.2s'
                        }}>
                        <Save size={10} />
                        {saved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>

            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Quick thoughts, reflections, ideas for today...

Use this as your daily brain dump. What did you learn? What will you do tomorrow? What are you grateful for?"
                style={{
                    width: '100%', resize: 'none', minHeight: 180,
                    background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '12px', color: '#f0f0f0', fontSize: 13, lineHeight: 1.7,
                    fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#888888'; e.target.style.background = '#88888810'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(30,30,30,0.8)'; }}
            />

            <div style={{ fontSize: 11, color: '#555555' }}>
                💡 Tip: Auto-saves after 1.5s of inactivity
            </div>
        </div>
    );
}
