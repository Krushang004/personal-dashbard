export interface DayData {
    sleep: number;         // hours
    study: number;         // hours
    coding: number;        // hours (combined timer + manual)
    codingSeconds: number; // raw timer seconds
    workout: boolean;
    workoutNotes: string;
    habits: Record<string, boolean>;
    mood: string;          // emoji key
    moneyEarned: number;
    moneySpent: number;
    igViews: number;
    ytViews: number;
    followers: number;
    ytSubscribers: number;
    notes: string;
}

export const DEFAULT_HABITS = ['Study', 'Workout', 'No Scrolling', 'Coding', 'Read', 'Meditate'];

export const MOODS = [
    { key: 'amazing', emoji: '🤩', label: 'Amazing', color: '#4ade80' },
    { key: 'good', emoji: '😊', label: 'Good', color: '#60a5fa' },
    { key: 'okay', emoji: '😐', label: 'Okay', color: '#facc15' },
    { key: 'meh', emoji: '😕', label: 'Meh', color: '#fb923c' },
    { key: 'bad', emoji: '😞', label: 'Bad', color: '#f87171' },
    { key: 'terrible', emoji: '😭', label: 'Terrible', color: '#a78bfa' },
];

export function emptyDay(): DayData {
    return {
        sleep: 0,
        study: 0,
        coding: 0,
        codingSeconds: 0,
        workout: false,
        workoutNotes: '',
        habits: {},
        mood: '',
        moneyEarned: 0,
        moneySpent: 0,
        igViews: 0,
        ytViews: 0,
        followers: 0,
        ytSubscribers: 0,
        notes: '',
    };
}

export function calcProductivityScore(data: DayData): number {
    let score = 0;
    // Sleep quality (target: 7-9h)
    if (data.sleep >= 7 && data.sleep <= 9) score += 20;
    else if (data.sleep >= 6) score += 10;
    // Study (target: 4h)
    score += Math.min(20, (data.study / 4) * 20);
    // Coding (target: 3h)
    score += Math.min(20, (data.coding / 3) * 20);
    // Workout
    if (data.workout) score += 20;
    // Habits (max 20 points)
    const totalHabits = DEFAULT_HABITS.length;
    const doneHabits = DEFAULT_HABITS.filter(h => data.habits[h]).length;
    score += Math.round((doneHabits / totalHabits) * 20);

    return Math.min(100, Math.round(score));
}

export function getScoreColor(score: number): string {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#7c6af7';
    if (score >= 40) return '#facc15';
    return '#f87171';
}

export function getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Low';
}
