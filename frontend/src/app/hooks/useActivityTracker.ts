import { useState, useEffect } from 'react';

interface ActivityLog {
    [date: string]: number; // date in YYYY-MM-DD format, value in seconds
}

export const useActivityTracker = () => {
    const [streak, setStreak] = useState(0);
    const [todayActivity, setTodayActivity] = useState(0);
    const [weeklyLogs, setWeeklyLogs] = useState<{ day: string; minutes: number }[]>([]);
    const [isStudying, setIsStudying] = useState(false);

    useEffect(() => {
        // Initialize from localStorage
        const storedLogs = localStorage.getItem('activity_logs');
        const logs: ActivityLog = storedLogs ? JSON.parse(storedLogs) : {};

        const today = new Date().toISOString().split('T')[0];
        setTodayActivity(logs[today] || 0);

        // Calculate Streak
        let currentStreak = 0;
        let checkDate = new Date();
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (logs[dateStr] && logs[dateStr] > 0) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        setStreak(currentStreak);

        // Calculate Weekly Logs for Graph
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            // Real data only - no random fillers
            const seconds = logs[dStr] || 0;
            last7Days.push({ day: dayName, minutes: Math.round(seconds / 60) });
        }
        setWeeklyLogs(last7Days);

        // Tracker interval
        const interval = setInterval(() => {
            // Track if user is actively on the site OR specifically in a study view
            const isWindowActive = document.visibilityState === 'visible' && document.hasFocus();

            if (isWindowActive || isStudying) {
                setTodayActivity(prev => {
                    const newTotal = prev + 1;
                    const updatedLogs = { ...logs, [today]: newTotal };
                    localStorage.setItem('activity_logs', JSON.stringify(updatedLogs));
                    return newTotal;
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isStudying]);

    return { streak, todayActivity, weeklyLogs, setIsStudying };
};
