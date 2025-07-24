import { useState, useEffect, useCallback } from 'react';

// Initial streak state
const initialStreakState = {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayDate: null,
    totalDaysPlayed: 0,
    streakHistory: [], // Array of dates when user coded
    weeklyGoal: 7, // Days per week goal
    monthlyStats: {},
    streakMilestones: []
};

export const useStreakTracking = () => {
    // Load streak data from localStorage
    const [streakData, setStreakData] = useState(() => {
        const saved = localStorage.getItem('codequest_streak_data');
        return saved ? JSON.parse(saved) : initialStreakState;
    });

    const [todaysCodingTime, setTodaysCodingTime] = useState(0);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    // Save to localStorage whenever streak data changes
    useEffect(() => {
        localStorage.setItem('codequest_streak_data', JSON.stringify(streakData));
    }, [streakData]);

    // Initialize session tracking
    useEffect(() => {
        setSessionStartTime(Date.now());

        // Update coding time every minute
        const interval = setInterval(() => {
            if (sessionStartTime) {
                const sessionTime = Date.now() - sessionStartTime;
                setTodaysCodingTime(prev => Math.max(prev, sessionTime));
            }
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [sessionStartTime]);

    // Get today's date string for comparison
    const getTodayString = useCallback(() => {
        return new Date().toDateString();
    }, []);

    // Get yesterday's date string
    const getYesterdayString = useCallback(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toDateString();
    }, []);

    // Update streak when user codes
    const updateStreak = useCallback(() => {
        const today = getTodayString();
        const yesterday = getYesterdayString();

        setStreakData(prevData => {
            // If already coded today, don't update streak
            if (prevData.lastPlayDate === today) {
                return prevData;
            }

            let newCurrentStreak = prevData.currentStreak;
            let newStreakHistory = [...prevData.streakHistory];
            let newMilestones = [...prevData.streakMilestones];

            // Add today to history if not already there
            if (!newStreakHistory.includes(today)) {
                newStreakHistory.push(today);
            }

            // Calculate new streak
            if (prevData.lastPlayDate === yesterday) {
                // Continued streak
                newCurrentStreak = prevData.currentStreak + 1;
            } else if (prevData.lastPlayDate !== today) {
                // New streak or broken streak
                newCurrentStreak = 1;
            }

            // Check for new milestones
            const milestoneValues = [3, 7, 14, 30, 50, 100];
            milestoneValues.forEach(milestone => {
                if (newCurrentStreak >= milestone &&
                    !prevData.streakMilestones.some(m => m.days === milestone && m.achieved)) {
                    newMilestones.push({
                        days: milestone,
                        achieved: true,
                        date: today,
                        message: getStreakMilestoneMessage(milestone)
                    });
                }
            });

            // Update monthly stats
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
            const newMonthlyStats = {...prevData.monthlyStats };
            if (!newMonthlyStats[currentMonth]) {
                newMonthlyStats[currentMonth] = { daysActive: 0, challengesCompleted: 0 };
            }
            if (prevData.lastPlayDate !== today) {
                newMonthlyStats[currentMonth].daysActive++;
            }

            return {
                ...prevData,
                currentStreak: newCurrentStreak,
                longestStreak: Math.max(prevData.longestStreak, newCurrentStreak),
                lastPlayDate: today,
                totalDaysPlayed: prevData.lastPlayDate !== today ? prevData.totalDaysPlayed + 1 : prevData.totalDaysPlayed,
                streakHistory: newStreakHistory,
                monthlyStats: newMonthlyStats,
                streakMilestones: newMilestones
            };
        });
    }, [getTodayString, getYesterdayString]);

    // Check if streak is at risk (missed yesterday)
    const isStreakAtRisk = useCallback(() => {
        const today = getTodayString();
        const yesterday = getYesterdayString();

        return streakData.lastPlayDate !== today &&
            streakData.lastPlayDate !== yesterday &&
            streakData.currentStreak > 0;
    }, [streakData.lastPlayDate, streakData.currentStreak, getTodayString, getYesterdayString]);

    // Get streak status for today
    const getTodayStatus = useCallback(() => {
        const today = getTodayString();
        const codedToday = streakData.lastPlayDate === today;

        return {
            codedToday,
            streakSafe: !isStreakAtRisk(),
            currentStreak: streakData.currentStreak,
            daysUntilMilestone: getNextMilestone() - streakData.currentStreak,
            todaysCodingTime: Math.floor(todaysCodingTime / 60000) // Convert to minutes
        };
    }, [streakData, todaysCodingTime, isStreakAtRisk, getTodayString]);

    // Get next streak milestone
    const getNextMilestone = useCallback(() => {
        const milestones = [3, 7, 14, 30, 50, 100, 200, 365];
        return milestones.find(milestone => milestone > streakData.currentStreak) || 999;
    }, [streakData.currentStreak]);

    // Get weekly progress
    const getWeeklyProgress = useCallback(() => {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            weekDays.push({
                date: day.toDateString(),
                coded: streakData.streakHistory.includes(day.toDateString()),
                isToday: day.toDateString() === getTodayString(),
                dayName: day.toLocaleDateString('en-US', { weekday: 'short' })
            });
        }

        const daysCodedThisWeek = weekDays.filter(day => day.coded).length;
        const weeklyGoalProgress = (daysCodedThisWeek / streakData.weeklyGoal) * 100;

        return {
            weekDays,
            daysCodedThisWeek,
            weeklyGoalProgress: Math.round(weeklyGoalProgress),
            weeklyGoalMet: daysCodedThisWeek >= streakData.weeklyGoal
        };
    }, [streakData.streakHistory, streakData.weeklyGoal, getTodayString]);

    // Get monthly statistics
    const getMonthlyStats = useCallback(() => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const currentMonthStats = streakData.monthlyStats[currentMonth] || { daysActive: 0, challengesCompleted: 0 };

        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const monthlyGoal = Math.floor(daysInMonth * 0.8); // Aim for 80% of days in month

        return {
            currentMonth,
            daysActive: currentMonthStats.daysActive,
            monthlyGoal,
            monthlyProgress: (currentMonthStats.daysActive / monthlyGoal) * 100,
            daysRemaining: daysInMonth - new Date().getDate(),
            onTrack: currentMonthStats.daysActive >= (new Date().getDate() * 0.8)
        };
    }, [streakData.monthlyStats]);

    // Get streak analytics
    const getStreakAnalytics = useCallback(() => {
        const totalDays = streakData.totalDaysPlayed;
        const currentStreak = streakData.currentStreak;
        const longestStreak = streakData.longestStreak;

        // Calculate consistency percentage (days played vs days since first play)
        const firstPlayDate = streakData.streakHistory[0];
        const daysSinceStart = firstPlayDate ?
            Math.floor((Date.now() - new Date(firstPlayDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1;
        const consistencyRate = (totalDays / daysSinceStart) * 100;

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentActivity = streakData.streakHistory.filter(date =>
            new Date(date) >= thirtyDaysAgo
        ).length;

        return {
            totalDays,
            currentStreak,
            longestStreak,
            consistencyRate: Math.round(consistencyRate),
            recentActivity,
            averageSessionTime: todaysCodingTime > 0 ? Math.floor(todaysCodingTime / 60000) : 0,
            streakMilestones: streakData.streakMilestones.length,
            nextMilestone: getNextMilestone()
        };
    }, [streakData, todaysCodingTime, getNextMilestone]);

    // Reset streak data (for testing)
    const resetStreakData = useCallback(() => {
        setStreakData(initialStreakState);
        setTodaysCodingTime(0);
        localStorage.removeItem('codequest_streak_data');
    }, []);

    // Update weekly goal
    const updateWeeklyGoal = useCallback((newGoal) => {
        setStreakData(prev => ({
            ...prev,
            weeklyGoal: Math.max(1, Math.min(7, newGoal))
        }));
    }, []);

    // Get motivational message based on streak
    const getMotivationalMessage = useCallback(() => {
        const { currentStreak } = streakData;
        const todayStatus = getTodayStatus();

        if (!todayStatus.codedToday) {
            if (currentStreak === 0) {
                return "🌟 Start your coding journey today! Every expert was once a beginner.";
            } else if (isStreakAtRisk()) {
                return `🔥 Your ${currentStreak}-day streak is at risk! Code today to keep it alive!`;
            } else {
                return "💻 Ready to code today? Your future self will thank you!";
            }
        }

        if (currentStreak < 3) {
            return "🚀 Great start! Keep building that coding habit!";
        } else if (currentStreak < 7) {
            return "⭐ Awesome streak! You're building serious momentum!";
        } else if (currentStreak < 30) {
            return "🔥 On fire! This consistency will pay off big time!";
        } else {
            return "🏆 Legendary dedication! You're a true coding warrior!";
        }
    }, [streakData, getTodayStatus, isStreakAtRisk]);

    // Export streak data for sharing
    const exportStreakData = useCallback(() => {
        const analytics = getStreakAnalytics();
        const weeklyProgress = getWeeklyProgress();
        const monthlyStats = getMonthlyStats();

        return {
            summary: {
                currentStreak: streakData.currentStreak,
                longestStreak: streakData.longestStreak,
                totalDaysPlayed: streakData.totalDaysPlayed,
                consistencyRate: analytics.consistencyRate
            },
            weekly: weeklyProgress,
            monthly: monthlyStats,
            milestones: streakData.streakMilestones,
            exportDate: new Date().toISOString()
        };
    }, [streakData, getStreakAnalytics, getWeeklyProgress, getMonthlyStats]);

    return {
        // State
        streakData,
        todaysCodingTime,

        // Actions
        updateStreak,
        resetStreakData,
        updateWeeklyGoal,

        // Status checks
        isStreakAtRisk,
        getTodayStatus,

        // Analytics
        getWeeklyProgress,
        getMonthlyStats,
        getStreakAnalytics,
        getMotivationalMessage,
        exportStreakData
    };
};

// Helper function for streak milestone messages
const getStreakMilestoneMessage = (days) => {
    const messages = {
        3: "🌟 3-day streak! You're building a habit!",
        7: "🔥 One week strong! Consistency is key!",
        14: "⚡ Two weeks of coding! You're on fire!",
        30: "🏆 One month milestone! Incredible dedication!",
        50: "💎 50 days of coding! You're a true warrior!",
        100: "🎯 100-day streak! Legendary achievement!",
        200: "🚀 200 days! You've transcended mortal limits!",
        365: "👑 One full year! You are the coding champion!"
    };

    return messages[days] || `🎉 ${days}-day streak! Amazing achievement!`;
};