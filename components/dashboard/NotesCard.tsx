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
                    <div style={{ background: 'rgba(74,92,106,0.3)', borderRadius: 8, padding: '6px' }}>
                        <FileText size={15} style={{ color: '#9BA8AB' }} />
                    </div>
                    <span className="section-title">Daily Notes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#4A5C6A' }}>{wordCount} words</span>
                    <button onClick={handleSave}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 7, cursor: 'pointer', fontSize: 11,
                            background: saved ? 'rgba(17,33,45,0.9)' : 'rgba(74,92,106,0.2)', border: `1px solid ${saved ? '#4A5C6A40' : '#4A5C6A'}`,
                            color: saved ? '#4A5C6A' : '#9BA8AB', transition: 'all 0.2s'
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
                    background: 'rgba(17,33,45,0.9)', border: '1px solid #4A5C6A40',
                    borderRadius: 10, padding: '12px', color: '#CCD0CF', fontSize: 13, lineHeight: 1.7,
                    fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', transition: 'border-color 0.2s, background 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#9BA8AB'; e.target.style.background = '#11212D'; }}
                onBlur={e => { e.target.style.borderColor = '#4A5C6A40'; e.target.style.background = 'rgba(17,33,45,0.9)'; }}
            />

            <div style={{ fontSize: 11, color: '#4A5C6A' }}>
                💡 Tip: Auto-saves after 1.5s of inactivity
            </div>
        </div>
    );
}
