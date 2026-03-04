import { format } from 'date-fns';

export function getTodayKey(): string {
    return format(new Date(), 'yyyy-MM-dd');
}

export function getWeekKeys(): string[] {
    const keys: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        keys.push(format(d, 'yyyy-MM-dd'));
    }
    return keys;
}

export function getWeekLabels(): string[] {
    return getWeekKeys().map(k => format(new Date(k + 'T00:00:00'), 'EEE'));
}

export function getDayLabel(key: string): string {
    return format(new Date(key + 'T00:00:00'), 'EEE');
}

export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
