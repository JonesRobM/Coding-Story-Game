import { useState, useEffect, useCallback } from 'react';

// Achievement definitions with complete metadata
const achievementDefinitions = {
    first_steps: {
        name: 'First Steps',
        icon: '👶',
        description: 'Complete your first coding challenge',
        rarity: 'common',
        xpReward: 25,
        category: 'progression',
        requirements: {
            challengesCompleted: 1
        }
    },
    variable_master: {
        name: 'Variable Master',
        icon: '📦',
        description: 'Successfully use 50+ variables across all challenges',
        rarity: 'uncommon',
        xpReward: 75,
        category: 'skill',
        requirements: {
            totalVariables: 50
        }
    },
    loop_master: {
        name: 'Loop Master',
        icon: '🔄',
        description: 'Create 20+ efficient loop structures',
        rarity: 'uncommon',
        xpReward: 75,
        category: 'skill',
        requirements: {
            totalLoops: 20
        }
    },
    function_wizard: {
        name: 'Function Wizard',
        icon: '🪄',
        description: 'Write 15+ reusable functions with proper parameters',
        rarity: 'rare',
        xpReward: 100,
        category: 'mastery',
        requirements: {
            totalFunctions: 15
        }
    },
    bug_squasher: {
        name: 'Bug Squasher',
        icon: '🐛',
        description: 'Successfully debug and fix 25+ syntax errors',
        rarity: 'uncommon',
        xpReward: 75,
        category: 'resilience',
        requirements: {
            totalErrors: 25
        }
    },
    efficiency_expert: {
        name: 'Efficiency Expert',
        icon: '⚡',
        description: 'Maintain 90%+ code efficiency rating across sessions',
        rarity: 'epic',
        xpReward: 150,
        category: 'excellence',
        requirements: {
            bestPracticesScore: 90
        }
    },
    streak_warrior: {
        name: 'Streak Warrior',
        icon: '🔥',
        description: 'Code consistently for 7 days straight',
        rarity: 'rare',
        xpReward: 100,
        category: 'dedication',
        requirements: {
            streak: 7
        }
    },
    github_publisher: {
        name: 'GitHub Publisher',
        icon: '📚',
        description: 'Save your first project to GitHub repository',
        rarity: 'rare',
        xpReward: 100,
        category: 'professional',
        requirements: {
            githubSaves: 1
        }
    },
    speed_demon: {
        name: 'Speed Demon',
        icon: '💨',
        description: 'Complete 5 challenges in under 30 seconds each',
        rarity: 'rare',
        xpReward: 100,
        category: 'excellence',
        requirements: {
            fastCompletions: 5
        }
    },
    perfectionist: {
        name: 'Perfectionist',
        icon: '💎',
        description: 'Achieve 100% score on 3 consecutive challenges',
        rarity: 'epic',
        xpReward: 200,
        category: 'excellence',
        requirements: {
            perfectStreaks: 3
        }
    }
};

export const useAchievements = () => {
    // Load unlocked achievements from localStorage
    const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
        const saved = localStorage.getItem('codequest_achievements');
        return saved ? JSON.parse(saved) : [];
    });

    const [recentlyUnlocked, setRecentlyUnlocked] = useState([]);
    const [achievementProgress, setAchievementProgress] = useState({});

    // Save achievements to localStorage
    useEffect(() => {
        localStorage.setItem('codequest_achievements', JSON.stringify(unlockedAchievements));
    }, [unlockedAchievements]);

    // Check if player qualifies for achievements
    const checkAchievements = useCallback((playerProgress, playerStats, performanceData) => {
        const newlyUnlocked = [];

        Object.entries(achievementDefinitions).forEach(([achievementId, achievement]) => {
            // Skip if already unlocked
            if (unlockedAchievements.includes(achievementId)) return;

            let qualified = true;
            const requirements = achievement.requirements;

            // Check each requirement
            if (requirements.challengesCompleted && playerProgress.challengesCompleted < requirements.challengesCompleted) {
                qualified = false;
            }
            if (requirements.totalVariables && playerStats.variables < requirements.totalVariables) {
                qualified = false;
            }
            if (requirements.totalLoops && playerStats.loops < requirements.totalLoops) {
                qualified = false;
            }
            if (requirements.totalFunctions && playerStats.functions < requirements.totalFunctions) {
                qualified = false;
            }
            if (requirements.totalErrors && performanceData.errorCount < requirements.totalErrors) {
                qualified = false;
            }
            if (requirements.bestPracticesScore && performanceData.bestPracticesScore < requirements.bestPracticesScore) {
                qualified = false;
            }
            if (requirements.streak && playerProgress.streak < requirements.streak) {
                qualified = false;
            }
            if (requirements.githubSaves && !playerProgress.githubSaveCount) {
                qualified = false;
            }

            // Special achievements with custom logic
            if (achievementId === 'speed_demon') {
                qualified = checkSpeedDemonRequirement(performanceData);
            }
            if (achievementId === 'perfectionist') {
                qualified = checkPerfectionistRequirement(performanceData);
            }

            if (qualified) {
                newlyUnlocked.push(achievementId);
            }
        });

        // Unlock new achievements
        if (newlyUnlocked.length > 0) {
            setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
            setRecentlyUnlocked(newlyUnlocked);

            // Clear recently unlocked after 5 seconds
            setTimeout(() => setRecentlyUnlocked([]), 5000);
        }

        return newlyUnlocked;
    }, [unlockedAchievements]);

    // Manually unlock achievement (for special events)
    const unlockAchievement = useCallback((achievementId) => {
        if (!unlockedAchievements.includes(achievementId) && achievementDefinitions[achievementId]) {
            setUnlockedAchievements(prev => [...prev, achievementId]);
            setRecentlyUnlocked([achievementId]);
            setTimeout(() => setRecentlyUnlocked([]), 5000);
            return true;
        }
        return false;
    }, [unlockedAchievements]);

    // Get achievement progress for UI
    const getAchievementProgress = useCallback((playerProgress, playerStats, performanceData) => {
        const progress = {};

        Object.entries(achievementDefinitions).forEach(([achievementId, achievement]) => {
            if (unlockedAchievements.includes(achievementId)) {
                progress[achievementId] = { completed: true, percentage: 100 };
                return;
            }

            const requirements = achievement.requirements;
            let currentProgress = 0;
            let maxProgress = 1;

            // Calculate progress for each requirement type
            if (requirements.challengesCompleted) {
                currentProgress = playerProgress.challengesCompleted;
                maxProgress = requirements.challengesCompleted;
            } else if (requirements.totalVariables) {
                currentProgress = playerStats.variables;
                maxProgress = requirements.totalVariables;
            } else if (requirements.totalLoops) {
                currentProgress = playerStats.loops;
                maxProgress = requirements.totalLoops;
            } else if (requirements.totalFunctions) {
                currentProgress = playerStats.functions;
                maxProgress = requirements.totalFunctions;
            } else if (requirements.totalErrors) {
                currentProgress = performanceData.errorCount;
                maxProgress = requirements.totalErrors;
            } else if (requirements.bestPracticesScore) {
                currentProgress = performanceData.bestPracticesScore;
                maxProgress = requirements.bestPracticesScore;
            } else if (requirements.streak) {
                currentProgress = playerProgress.streak;
                maxProgress = requirements.streak;
            }

            const percentage = Math.min(100, (currentProgress / maxProgress) * 100);
            progress[achievementId] = {
                completed: false,
                percentage: Math.round(percentage),
                current: currentProgress,
                required: maxProgress
            };
        });

        setAchievementProgress(progress);
        return progress;
    }, [unlockedAchievements]);

    // Get achievements by category
    const getAchievementsByCategory = useCallback(() => {
        const categories = {};

        Object.entries(achievementDefinitions).forEach(([id, achievement]) => {
            const category = achievement.category;
            if (!categories[category]) categories[category] = [];

            categories[category].push({
                id,
                ...achievement,
                unlocked: unlockedAchievements.includes(id),
                progress: achievementProgress[id] || { completed: false, percentage: 0 }
            });
        });

        return categories;
    }, [unlockedAchievements, achievementProgress]);

    // Get completion statistics
    const getCompletionStats = useCallback(() => {
        const totalAchievements = Object.keys(achievementDefinitions).length;
        const unlockedCount = unlockedAchievements.length;
        const completionPercentage = (unlockedCount / totalAchievements) * 100;

        const totalXPEarned = unlockedAchievements.reduce((sum, achievementId) => {
            const achievement = achievementDefinitions[achievementId];
            return sum + (achievement?.xpReward || 0);
        }, 0);

        const categoryStats = {};
        Object.values(achievementDefinitions).forEach(achievement => {
            const cat = achievement.category;
            if (!categoryStats[cat]) {
                categoryStats[cat] = { total: 0, unlocked: 0 };
            }
            categoryStats[cat].total++;
            if (unlockedAchievements.includes(Object.keys(achievementDefinitions).find(key =>
                    achievementDefinitions[key] === achievement))) {
                categoryStats[cat].unlocked++;
            }
        });

        return {
            totalAchievements,
            unlockedCount,
            completionPercentage: Math.round(completionPercentage),
            totalXPEarned,
            categoryStats,
            recentAchievements: unlockedAchievements.slice(-3),
            remainingCount: totalAchievements - unlockedCount
        };
    }, [unlockedAchievements]);

    // Reset achievements (for testing)
    const resetAchievements = useCallback(() => {
        setUnlockedAchievements([]);
        setRecentlyUnlocked([]);
        setAchievementProgress({});
        localStorage.removeItem('codequest_achievements');
    }, []);

    // Get next achievable achievements
    const getNextAchievements = useCallback((playerProgress, playerStats, performanceData) => {
        const nextAchievements = [];

        Object.entries(achievementDefinitions).forEach(([achievementId, achievement]) => {
            if (unlockedAchievements.includes(achievementId)) return;

            const progress = achievementProgress[achievementId];
            if (progress && progress.percentage > 50) {
                nextAchievements.push({
                    id: achievementId,
                    ...achievement,
                    progress
                });
            }
        });

        return nextAchievements.sort((a, b) => b.progress.percentage - a.progress.percentage);
    }, [unlockedAchievements, achievementProgress]);

    return {
        // State
        achievements: achievementDefinitions,
        unlockedAchievements,
        recentlyUnlocked,
        achievementProgress,

        // Actions
        checkAchievements,
        unlockAchievement,
        getAchievementProgress,
        resetAchievements,

        // Utilities
        getAchievementsByCategory,
        getCompletionStats,
        getNextAchievements
    };
};

// Helper functions for special achievement requirements
const checkSpeedDemonRequirement = (performanceData) => {
    const recentSessions = performanceData.sessions?.slice(-10) || [];
    const fastCompletions = recentSessions.filter(session =>
        session.runtime < 30000 && session.score > 80
    );
    return fastCompletions.length >= 5;
};

const checkPerfectionistRequirement = (performanceData) => {
    const recentSessions = performanceData.sessions?.slice(-5) || [];
    if (recentSessions.length < 3) return false;

    let consecutivePerfect = 0;
    let maxConsecutive = 0;

    recentSessions.forEach(session => {
        if (session.score >= 100) {
            consecutivePerfect++;
            maxConsecutive = Math.max(maxConsecutive, consecutivePerfect);
        } else {
            consecutivePerfect = 0;
        }
    });

    return maxConsecutive >= 3;
};