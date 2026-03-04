'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';

import { getTodayKey, getWeekKeys } from '@/utils/dateUtils';
import { useUserData } from '@/hooks/useUserData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DayData, emptyDay } from '@/utils/types';

import Header from '@/components/dashboard/Header';
import SetupModal from '@/components/dashboard/SetupModal';
import SleepCard from '@/components/dashboard/SleepCard';
import StudyCard from '@/components/dashboard/StudyCard';
import CodingCard from '@/components/dashboard/CodingCard';
import GymCard from '@/components/dashboard/GymCard';
import HabitsCard from '@/components/dashboard/HabitsCard';
import MoodCard from '@/components/dashboard/MoodCard';
import MoneyCard from '@/components/dashboard/MoneyCard';
import SocialCard from '@/components/dashboard/SocialCard';
import NotesCard from '@/components/dashboard/NotesCard';
import AnalyticsPage from '@/components/dashboard/AnalyticsPage';

export default function DashboardPage() {
    const { userName, setUserName, isLoaded, isFirstTime } = useUserData();
    const [allData, setAllData] = useLocalStorage<Record<string, DayData>>('life-dashboard-v1', {});
    const [viewingDate, setViewingDate] = useState(getTodayKey());
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const todayKey = getTodayKey();
    const isToday = viewingDate === todayKey;

    const todayData: DayData = allData[viewingDate] || emptyDay();

    // Get last 7 days ending at viewingDate
    const weekData: DayData[] = getWeekKeys().map(key => allData[key] || emptyDay());

    function updateDay(partial: Partial<DayData>) {
        setAllData(prev => ({
            ...prev,
            [viewingDate]: { ...(prev[viewingDate] || emptyDay()), ...partial }
        }));
    }

    function prevDay() {
        const d = new Date(viewingDate + 'T00:00:00');
        d.setDate(d.getDate() - 1);
        setViewingDate(format(d, 'yyyy-MM-dd'));
    }

    function nextDay() {
        const d = new Date(viewingDate + 'T00:00:00');
        d.setDate(d.getDate() + 1);
        setViewingDate(format(d, 'yyyy-MM-dd'));
    }

    // Keyboard shortcuts
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'a' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setShowAnalytics(v => !v); }
            if (e.key === 't' && !e.ctrlKey && !e.metaKey) setViewingDate(getTodayKey());
            if (e.key === 'ArrowLeft') prevDay();
            if (e.key === 'ArrowRight' && !isToday) nextDay();
            if (e.key === 'Escape') setShowAnalytics(false);
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [viewingDate, isToday]);

    if (!mounted || !isLoaded) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #080414)' }}>

            {/* First-time Setup Modal */}
            {isFirstTime && <SetupModal onComplete={setUserName} />}

            <Header today={todayData} userName={userName || 'Guest'} />

            {/* Date navigation bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-8 py-3 relative z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0" style={{ scrollbarWidth: 'none' }}>
                    <button onClick={prevDay}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#8b8a96', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={15} />
                    </button>
                    <div style={{ textAlign: 'center', minWidth: 150 }}>
                        <span style={{ color: '#f1f0f7', fontWeight: 600, fontSize: 14 }}>
                            {isToday ? 'Today · ' : ''}{format(new Date(viewingDate + 'T00:00:00'), 'EEEE, MMM d')}
                        </span>
                    </div>
                    <button onClick={nextDay} disabled={isToday}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 8px', cursor: isToday ? 'not-allowed' : 'pointer', color: isToday ? '#2a2a36' : '#8b8a96', display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={15} />
                    </button>
                    {!isToday && (
                        <button onClick={() => setViewingDate(todayKey)}
                            style={{ background: '#7c6af720', border: '1px solid #7c6af730', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', color: '#7c6af7', fontSize: 12, fontWeight: 600 }}>
                            Jump to Today
                        </button>
                    )}
                </div>

                <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto justify-between sm:justify-end">
                    <span style={{ fontSize: 11, color: '#4b4a56' }}>
                        <kbd style={{ background: '#1c1c26', border: '1px solid #ffffff10', borderRadius: 4, padding: '1px 5px', marginRight: 4 }}>T</kbd>today
                        &nbsp;&nbsp;
                        <kbd style={{ background: '#1c1c26', border: '1px solid #ffffff10', borderRadius: 4, padding: '1px 5px', marginRight: 4 }}>←/→</kbd>nav
                        &nbsp;&nbsp;
                        <kbd style={{ background: '#1c1c26', border: '1px solid #ffffff10', borderRadius: 4, padding: '1px 5px', marginRight: 4 }}>⌘A</kbd>analytics
                    </span>
                    <button onClick={() => setShowAnalytics(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#7c6af7', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white', fontSize: 12, fontWeight: 600 }}>
                        <BarChart2 size={13} /> Analytics
                    </button>
                </div>
            </div>

            {/* Main grid */}
            <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                    {/* Row 1: Sleep, Habits, Coding */}
                    <SleepCard today={todayData} weekData={weekData} onUpdate={updateDay} />
                    <HabitsCard today={todayData} weekData={weekData} onUpdate={updateDay} />
                    <CodingCard today={todayData} weekData={weekData} onUpdate={updateDay} />

                    {/* Row 2: Gym, Study, Mood */}
                    <GymCard today={todayData} weekData={weekData} onUpdate={updateDay} />
                    <StudyCard today={todayData} weekData={weekData} onUpdate={updateDay} />
                    <MoodCard today={todayData} weekData={weekData} onUpdate={updateDay} />

                    {/* Row 3: Money (wide), Social */}
                    <div className="md:col-span-2 xl:col-span-2">
                        <MoneyCard today={todayData} weekData={weekData} onUpdate={updateDay} />
                    </div>
                    <SocialCard today={todayData} onUpdate={updateDay} />

                    {/* Row 4: Notes (full width) */}
                    <div className="col-span-1 md:col-span-2 xl:col-span-3">
                        <NotesCard today={todayData} onUpdate={updateDay} />
                    </div>
                </div>
            </div>

            {/* Analytics overlay */}
            {showAnalytics && (
                <AnalyticsPage allData={allData} onClose={() => setShowAnalytics(false)} />
            )}

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '20px', color: '#2a2a36', fontSize: 11 }}>
                Data stored locally in your browser · Built for Krushang 🚀
            </div>
        </div>
    );
}
