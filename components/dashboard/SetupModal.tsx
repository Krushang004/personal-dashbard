'use client';

import { useState } from 'react';
import { User, Sparkles } from 'lucide-react';

interface Props {
    onComplete: (name: string) => void;
}

export default function SetupModal({ onComplete }: Props) {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed) onComplete(trimmed);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
            style={{
                background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(24px)'
            }}>
            <div className="card p-8 sm:p-10 w-full max-w-md animate-fade-in glow-accent text-center"
                style={{ border: '1px solid rgba(136,136,136,0.3)' }}>

                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-6"
                    style={{ background: 'linear-gradient(135deg, #333333, #666666, #aaaaaa)', color: '#f0f0f0' }}>
                    <Sparkles size={32} />
                </div>

                <h2 className="text-3xl font-bold mb-3" style={{ color: '#f0f0f0', letterSpacing: '-0.5px' }}>
                    Welcome Aboard
                </h2>
                <p className="mb-8 font-medium" style={{ color: '#888888', fontSize: 15 }}>
                    Let's set up your new Deep Space dashboard. What should I call you?
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} style={{ color: '#888888' }} />
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="input-field text-lg w-full"
                            style={{
                                padding: '14px 16px 14px 44px',
                                fontSize: 16,
                                borderColor: 'rgba(136,136,136,0.4)',
                                background: 'rgba(10,10,10,0.6)'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest disabled:opacity-50"
                        style={{ marginTop: 8 }}
                    >
                        Launch Dashboard 🚀
                    </button>
                </form>

            </div>
        </div>
    );
}
