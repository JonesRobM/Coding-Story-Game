import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Code, Zap, RefreshCw, CheckCircle, Play, RotateCcw, Lightbulb, MessageCircle, Sparkles, Eye, Award, TrendingUp, Clock, Star, Github, Flame, Target, Trophy, BarChart3, Settings } from 'lucide-react';

const CodeQuestGame = () => {
  // Core game state
  const [currentScene, setCurrentScene] = useState(0);
  const [playerStats, setPlayerStats] = useState({
    variables: 0,
    conditionals: 0,
    loops: 0,
    functions: 0
  });
  
  // Advanced player progression
  const [playerProgress, setPlayerProgress] = useState({
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalLinesWritten: 0,
    challengesCompleted: 0,
    streak: 0,
    lastPlayDate: null,
    achievements: [],
    skillLevel: 'beginner' // beginner, intermediate, advanced
  });

  // Performance analytics
  const [performanceData, setPerformanceData] = useState({
    codeExecutions: 0,
    averageRuntime: 0,
    errorCount: 0,
    bestPracticesScore: 100,
    codeEfficiencyRating: 'A',
    sessions: []
  });

  // Achievement system
  const achievements = {
    'first_steps': { name: 'First Steps', icon: '👶', description: 'Complete your first challenge', unlocked: false },
    'variable_master': { name: 'Variable Master', icon: '📦', description: 'Use 50+ variables', unlocked: false },
    'loop_master': { name: 'Loop Master', icon: '🔄', description: 'Create 20+ loops', unlocked: false },
    'function_wizard': { name: 'Function Wizard', icon: '🪄', description: 'Write 15+ functions', unlocked: false },
    'bug_squasher': { name: 'Bug Squasher', icon: '🐛', description: 'Fix 25+ syntax errors', unlocked: false },
    'efficiency_expert': { name: 'Efficiency Expert', icon: '⚡', description: 'Maintain 90%+ code efficiency', unlocked: false },
    'streak_warrior': { name: 'Streak Warrior', icon: '🔥', description: 'Code for 7 days straight', unlocked: false },
    'github_publisher': { name: 'GitHub Publisher', icon: '📚', description: 'Save first project to GitHub', unlocked: false }
  };

  // UI and interaction state
  const [inventory, setInventory] = useState([]);
  const [currentCode, setCurrentCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [visualOutput, setVisualOutput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [botMessages, setBotMessages] = useState([]);
  const [showBot, setShowBot] = useState(true);
  const [isTypingCode, setIsTypingCode] = useState(false);
  const [codeErrors, setCodeErrors] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const canvasRef = useRef(null);
  const codeInputRef = useRef(null);

  // Sarcastic teacher bot personality
  const botPersonality = {
    name: "Professor Codex",
    title: "Your Brutally Honest Coding Mentor",
    
    greetings: [
      "🎓 Oh great, another 'future programmer'. Let's see if you can prove me wrong...",
      "📚 Welcome to my classroom. I hope you're better at coding than you are at following instructions.",
      "🧑‍🏫 Ready to learn? Good, because I'm definitely ready to judge your code mercilessly."
    ],
    
    encouragement: [
      "Well, would you look at that - you didn't break everything this time! 🎉",
      "Not terrible! You're only making the mistakes I expected you to make.",
      "I'm almost impressed. Don't let it go to your head.",
      "That actually works... I'm questioning my own teaching methods now.",
      "Fine, that's... adequate. Moving on before you get cocky."
    ],
    
    errorResponses: {
      syntax: [
        "🙄 Missing a semicolon? How original. Even my grandmother remembers her semicolons.",
        "Bracket mismatch? What is this, amateur hour? Count to two - it's not that hard.",
        "Oh look, another syntax error. Did you type this with your eyes closed?"
      ],
      logic: [
        "Your logic is more twisted than my morning coffee routine. Let's untangle this mess.",
        "🤔 That logic is... creative. Wrong, but creative. Points for imagination, minus points for everything else.",
        "I've seen spaghetti code, but yours is more like... abstract art code."
      ],
      variable: [
        "Undefined variable? Let me guess - you forgot the 'let' again, didn't you?",
        "🤦‍♂️ Variables need to be declared before you use them. This isn't magic, it's programming.",
        "That variable is more missing than my patience right now."
      ]
    },
    
    success: [
      "🎊 Congratulations! You've achieved basic competency. The bar was low, but you cleared it.",
      "Well, well, well... look who figured it out. Only took you... *checks watch*... way too long.",
      "🏆 Success! I'm marking this date on my calendar - it might be historic.",
      "That worked! I'm as shocked as you are, trust me."
    ],
    
    achievements: [
      "🏅 Achievement unlocked! I suppose you deserve a participation trophy.",
      "Look at you, collecting badges like a scout. At least someone's keeping track of your progress.",
      "Another achievement? At this rate, you might actually become competent someday."
    ]
  };

  // Code autocomplete suggestions
  const getAutocompleteOptions = (currentCode, cursorPosition) => {
    const beforeCursor = currentCode.substring(0, cursorPosition);
    const lastWord = beforeCursor.split(/\s/).pop();
    
    const suggestions = [
      // JavaScript keywords
      { text: 'let', type: 'keyword', description: 'Declare a variable' },
      { text: 'const', type: 'keyword', description: 'Declare a constant' },
      { text: 'function', type: 'keyword', description: 'Create a function' },
      { text: 'if', type: 'keyword', description: 'Conditional statement' },
      { text: 'else', type: 'keyword', description: 'Alternative condition' },
      { text: 'for', type: 'keyword', description: 'Loop statement' },
      { text: 'while', type: 'keyword', description: 'While loop' },
      { text: 'return', type: 'keyword', description: 'Return a value' },
      
      // Common methods
      { text: 'console.log()', type: 'method', description: 'Print to console' },
      { text: 'Math.random()', type: 'method', description: 'Generate random number' },
      { text: 'Math.floor()', type: 'method', description: 'Round down number' },
      { text: 'Math.ceil()', type: 'method', description: 'Round up number' },
      
      // Custom game functions
      { text: 'drawVillagers()', type: 'function', description: 'Draw villager registry' },
      { text: 'drawPath()', type: 'function', description: 'Draw magical path' },
      { text: 'drawGarden()', type: 'function', description: 'Draw flower garden' },
      { text: 'drawSpellEffects()', type: 'function', description: 'Draw spell animations' }
    ];

    if (lastWord.length < 2) return [];
    
    return suggestions
      .filter(option => option.text.toLowerCase().startsWith(lastWord.toLowerCase()))
      .slice(0, 8);
  };

  // Performance analytics functions
  const analyzeCodePerformance = (code, executionTime) => {
    let score = 100;
    let issues = [];

    // Check for efficiency issues
    if (code.includes('for') && code.includes('for')) {
      score -= 10;
      issues.push('Nested loops detected - consider optimization');
    }

    // Check for best practices
    if (!code.includes('let') && !code.includes('const')) {
      score -= 15;
      issues.push('Use proper variable declarations');
    }

    if (code.split('\n').length > 50) {
      score -= 5;
      issues.push('Consider breaking large functions into smaller ones');
    }

    // Check for unused variables
    const variables = code.match(/let\s+(\w+)/g) || [];
    variables.forEach(varDecl => {
      const varName = varDecl.split(' ')[1];
      const usage = (code.match(new RegExp(varName, 'g')) || []).length;
      if (usage <= 1) {
        score -= 5;
        issues.push(`Unused variable: ${varName}`);
      }
    });

    const rating = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

    setPerformanceData(prev => ({
      ...prev,
      codeExecutions: prev.codeExecutions + 1,
      averageRuntime: (prev.averageRuntime + executionTime) / 2,
      bestPracticesScore: Math.max(0, score),
      codeEfficiencyRating: rating,
      sessions: [...prev.sessions.slice(-19), {
        timestamp: Date.now(),
        score,
        runtime: executionTime,
        issues
      }]
    }));

    return { score, rating, issues };
  };

  // XP and leveling system
  const gainExperience = (baseXP, multiplier = 1) => {
    const xpGained = Math.floor(baseXP * multiplier);
    
    setPlayerProgress(prev => {
      const newXP = prev.xp + xpGained;
      let newLevel = prev.level;
      let newXPToNext = prev.xpToNext;

      // Check for level up
      if (newXP >= prev.xpToNext) {
        newLevel = prev.level + 1;
        newXPToNext = newLevel * 150; // Increasing XP requirements
        addBotMessage(`🎉 Level Up! You're now level ${newLevel}. I'm... mildly surprised.`, 'level_up');
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: newXPToNext
      };
    });

    return xpGained;
  };

  // Achievement system
  const checkAchievements = () => {
    const unlockedAchievements = [];

    // Check various achievement conditions
    if (playerProgress.challengesCompleted >= 1 && !achievements.first_steps.unlocked) {
      achievements.first_steps.unlocked = true;
      unlockedAchievements.push('first_steps');
    }

    if (playerProgress.totalLinesWritten >= 100 && !achievements.variable_master.unlocked) {
      achievements.variable_master.unlocked = true;
      unlockedAchievements.push('variable_master');
    }

    if (playerStats.loops >= 20 && !achievements.loop_master.unlocked) {
      achievements.loop_master.unlocked = true;
      unlockedAchievements.push('loop_master');
    }

    if (playerStats.functions >= 15 && !achievements.function_wizard.unlocked) {
      achievements.function_wizard.unlocked = true;
      unlockedAchievements.push('function_wizard');
    }

    if (performanceData.errorCount >= 25 && !achievements.bug_squasher.unlocked) {
      achievements.bug_squasher.unlocked = true;
      unlockedAchievements.push('bug_squasher');
    }

    if (performanceData.bestPracticesScore >= 90 && !achievements.efficiency_expert.unlocked) {
      achievements.efficiency_expert.unlocked = true;
      unlockedAchievements.push('efficiency_expert');
    }

    if (playerProgress.streak >= 7 && !achievements.streak_warrior.unlocked) {
      achievements.streak_warrior.unlocked = true;
      unlockedAchievements.push('streak_warrior');
    }

    // Update player achievements
    if (unlockedAchievements.length > 0) {
      setPlayerProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...unlockedAchievements]
      }));

      unlockedAchievements.forEach(achievementId => {
        const achievement = achievements[achievementId];
        addBotMessage(`${achievement.icon} Achievement Unlocked: ${achievement.name}! ${botPersonality.achievements[Math.floor(Math.random() * botPersonality.achievements.length)]}`, 'achievement');
        gainExperience(50, 1.5); // Bonus XP for achievements
      });
    }
  };

  // Dynamic difficulty adjustment
  const adjustDifficulty = () => {
    const successRate = playerProgress.challengesCompleted > 0 ? 
      (playerProgress.challengesCompleted / (playerProgress.challengesCompleted + performanceData.errorCount)) : 0.5;
    
    let newSkillLevel = playerProgress.skillLevel;
    let newDifficulty = difficultyLevel;

    if (successRate > 0.8 && playerProgress.level > 3) {
      newSkillLevel = 'intermediate';
      newDifficulty = Math.min(3, difficultyLevel + 1);
    } else if (successRate > 0.9 && playerProgress.level > 6) {
      newSkillLevel = 'advanced';
      newDifficulty = Math.min(5, difficultyLevel + 1);
    } else if (successRate < 0.3) {
      newDifficulty = Math.max(1, difficultyLevel - 1);
      addBotMessage("🎯 I'm making this easier for you. Don't get used to it.", 'difficulty_adjust');
    }

    if (newDifficulty !== difficultyLevel) {
      setDifficultyLevel(newDifficulty);
      if (newDifficulty > difficultyLevel) {
        addBotMessage("🚀 Time to step up your game! I'm increasing the difficulty because you're... not completely hopeless.", 'difficulty_adjust');
      }
    }

    setPlayerProgress(prev => ({
      ...prev,
      skillLevel: newSkillLevel
    }));
  };

  // Streak tracking
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastPlay = playerProgress.lastPlayDate;
    
    if (lastPlay !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastPlay === yesterday.toDateString()) {
        // Continued streak
        setPlayerProgress(prev => ({
          ...prev,
          streak: prev.streak + 1,
          lastPlayDate: today
        }));
      } else if (lastPlay === null || lastPlay !== today) {
        // New streak or broken streak
        setPlayerProgress(prev => ({
          ...prev,
          streak: 1,
          lastPlayDate: today
        }));
      }
    }
  };

  // GitHub integration
  const saveToGitHub = async () => {
    if (!githubToken) {
      addBotMessage("🔐 You need a GitHub token to save projects. Set it in settings first, genius.", 'error');
      return;
    }

    try {
      const projectData = {
        scenes: scenes.map(scene => ({
          title: scene.title,
          code: currentCode,
          completed: scene.id <= currentScene
        })),
        playerProgress,
        achievements: Object.keys(achievements).filter(key => achievements[key].unlocked)
      };

      const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/code-quest-saves/contents/save.json', {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Code Quest Progress - Level ${playerProgress.level}`,
          content: btoa(JSON.stringify(projectData, null, 2))
        })
      });

      if (response.ok) {
        addBotMessage("📚 Project saved to GitHub! Look at you, using version control like a real developer.", 'success');
        if (!achievements.github_publisher.unlocked) {
          achievements.github_publisher.unlocked = true;
          setPlayerProgress(prev => ({
            ...prev,
            achievements: [...prev.achievements, 'github_publisher']
          }));
          gainExperience(100);
        }
      }
    } catch (error) {
      addBotMessage("💥 GitHub save failed. Even I can't fix your configuration problems.", 'error');
    }
  };

  const addBotMessage = (message, type = 'info') => {
    const newMessage = {
      id: Date.now(),
      text: message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setBotMessages(prev => [...prev.slice(-4), newMessage]);
  };

  // Enhanced scenes with dynamic difficulty
  const scenes = [
    {
      id: 0,
      title: "Welcome to Code Kingdom",
      story: "You are a young apprentice programmer who has just arrived at the mystical Code Kingdom. The land is in chaos because the Great Algorithm has been broken into pieces! As the chosen Code Wizard, you must learn programming spells to restore order.",
      concept: "Introduction",
      explanation: "Programming is like magic - you give the computer precise instructions (spells) to make things happen!",
      challenge: null,
      choices: [
        { text: "Begin your quest", next: 1, requirement: null }
      ]
    },
    {
      id: 1,
      title: "The Variable Village",
      story: "You arrive at Variable Village, where the townspeople have forgotten their names! The Village Elder approaches: 'Young wizard, we need your help! Create magical containers to store our villagers' names and watch as they appear in our village registry!'",
      concept: "Variables",
      explanation: "Variables are like labeled boxes that store information. Use 'let' to create a variable!",
      challenge: {
        description: `Create variables for ${difficultyLevel >= 2 ? '5' : '3'} villagers and display them in a colorful list!`,
        startingCode: difficultyLevel >= 2 ? 
          "// INTERMEDIATE: Create 5 villagers with different data types\nlet villager1 = 'Aria';\nlet villager2 = 'Finn';\nlet villager3 = 'Luna';\nlet villager4 = 42; // Age\nlet villager5 = true; // Is magical\n\n// Display them creatively\nconsole.log('🏘️ Village Registry:');\n// Your code here..." :
          "// Create variables for villager names\nlet villager1 = 'Aria';\nlet villager2 = 'Finn';\nlet villager3 = 'Luna';\n\n// Display them in the village registry\nconsole.log('🏘️ Village Registry:');\nconsole.log('👤 ' + villager1);\nconsole.log('👤 ' + villager2);\nconsole.log('👤 ' + villager3);\n\n// BONUS: Create a visual display\ndrawVillagers([villager1, villager2, villager3]);",
        solution: "let villager1 = 'Aria';\nlet villager2 = 'Finn';\nlet villager3 = 'Luna';\n\nconsole.log('🏘️ Village Registry:');\nconsole.log('👤 ' + villager1);\nconsole.log('👤 ' + villager2);\nconsole.log('👤 ' + villager3);\n\ndrawVillagers([villager1, villager2, villager3]);",
        hint: "Create three variables with different names, then use console.log to display them with emojis!",
        visual: true,
        baseXP: 25,
        validation: (code, output) => {
          return code.includes('villager1') && 
                 code.includes('villager2') && 
                 code.includes('villager3') &&
                 output.includes('Village Registry');
        }
      },
      choices: [
        { text: "Continue to the crossroads", next: 2, requirement: 'challenge_completed' }
      ]
    }
    // ... (other scenes would be here with similar dynamic difficulty adjustments)
  ];

  // Enhanced code execution with performance tracking
  const runCode = () => {
    const startTime = performance.now();
    let output = '';
    const originalLog = console.log;
    
    const visualFunctions = {
      drawVillagers: (names) => drawVillagers(names),
      drawPath: (type) => drawPath(type),
      drawMagicMeter: (level) => drawMagicMeter(level),
      drawGarden: (count) => drawGarden(count),
      drawSpellEffects: (spells) => drawSpellEffects(spells),
      drawBattleField: (heroes, health) => drawBattleField(heroes, health),
      drawVictory: () => drawVictory()
    };
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
    };

    try {
      const func = new Function(...Object.keys(visualFunctions), currentCode);
      func(...Object.values(visualFunctions));
      
      const executionTime = performance.now() - startTime;
      const performanceAnalysis = analyzeCodePerformance(currentCode, executionTime);
      
      setCodeOutput(output.trim());
      setCodeErrors([]);
      
      // Update player statistics
      setPlayerProgress(prev => ({
        ...prev,
        totalLinesWritten: prev.totalLinesWritten + currentCode.split('\n').length
      }));

      const currentChallenge = scenes[currentScene].challenge;
      if (currentChallenge && currentChallenge.validation(currentCode, output)) {
        setChallengeCompleted(true);
        
        // Update stats and XP
        const concept = scenes[currentScene].concept.toLowerCase();
        setPlayerStats(prev => {
          if (concept.includes('variable')) return { ...prev, variables: prev.variables + 1 };
          if (concept.includes('conditional')) return { ...prev, conditionals: prev.conditionals + 1 };
          if (concept.includes('loop')) return { ...prev, loops: prev.loops + 1 };
          if (concept.includes('function') || concept.includes('integration')) return { ...prev, functions: prev.functions + 1 };
          return prev;
        });
        
        // Calculate XP with performance bonus
        const baseXP = currentChallenge.baseXP || 50;
        const performanceMultiplier = performanceAnalysis.score >= 90 ? 1.5 : performanceAnalysis.score >= 70 ? 1.2 : 1.0;
        const xpGained = gainExperience(baseXP, performanceMultiplier);
        
        setPlayerProgress(prev => ({
          ...prev,
          challengesCompleted: prev.challengesCompleted + 1
        }));
        
        const conceptName = scenes[currentScene].concept;
        setInventory(prev => [...prev, `${conceptName} Mastery`]);
        
        const successMessages = botPersonality.success;
        addBotMessage(`${successMessages[Math.floor(Math.random() * successMessages.length)]} (+${xpGained} XP)`, 'success');
        
        // Check achievements and adjust difficulty
        checkAchievements();
        adjustDifficulty();
        updateStreak();
        
      } else if (currentChallenge) {
        addBotMessage("🤔 Almost there! Your code runs, but it's not quite meeting the requirements. Try again, champ.", 'hint');
      }
    } catch (error) {
      const executionTime = performance.now() - startTime;
      const errorMsg = `Error: ${error.message}`;
      setCodeOutput(errorMsg);
      setCodeErrors([error.message]);
      
      // Track errors for performance analytics
      setPerformanceData(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1
      }));
      
      // Sarcastic error responses
      if (error.message.includes('Unexpected token')) {
        const syntaxErrors = botPersonality.errorResponses.syntax;
        addBotMessage(syntaxErrors[Math.floor(Math.random() * syntaxErrors.length)], 'error');
      } else if (error.message.includes('is not defined')) {
        const variableErrors = botPersonality.errorResponses.variable;
        addBotMessage(variableErrors[Math.floor(Math.random() * variableErrors.length)], 'error');
      } else {
        const logicErrors = botPersonality.errorResponses.logic;
        addBotMessage(logicErrors[Math.floor(Math.random() * logicErrors.length)], 'error');
      }
    }

    console.log = originalLog;
  };

  // Autocomplete handling
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setCurrentCode(newCode);
    setIsTypingCode(true);
    setTimeout(() => setIsTypingCode(false), 1000);
    
    // Show autocomplete if typing
    const options = getAutocompleteOptions(newCode, cursorPosition);
    if (options.length > 0 && newCode.length > 0) {
      setAutocompleteOptions(options);
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  };

  const insertAutocomplete = (option) => {
    const textarea = codeInputRef.current;
    const cursorPosition = textarea.selectionStart;
    const beforeCursor = currentCode.substring(0, cursorPosition);
    const afterCursor = currentCode.substring(cursorPosition);
    const lastWord = beforeCursor.split(/\s/).pop();
    
    const newCode = beforeCursor.substring(0, beforeCursor.length - lastWord.length) + option.text + afterCursor;
    setCurrentCode(newCode);
    setShowAutocomplete(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition + option.text.length - lastWord.length, cursorPosition + option.text.length - lastWord.length);
    }, 0);
  };

  // Visual drawing functions (simplified for space)
  const drawVillagers = (names) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏘️ Village Registry', canvas.width / 2, 30);
    
    names.forEach((name, index) => {
      const y = 70 + index * 50;
      const x = canvas.width / 2;
      
      ctx.fillStyle = '#68d391';
      ctx.fillRect(x - 100, y - 15, 200, 30);
      
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(`👤 ${name}`, x, y + 5);
    });
  };

  // Initialize game
  useEffect(() => {
    const greetings = botPersonality.greetings;
    addBotMessage(greetings[Math.floor(Math.random() * greetings.length)], 'greeting');
    updateStreak();
  }, []);

  // Initialize first challenge
  useEffect(() => {
    const scene = scenes[currentScene];
    if (scene.challenge) {
      setCurrentCode(scene.challenge.startingCode);
    }
  }, [currentScene, difficultyLevel]);

  const currentSceneData = scenes[currentScene];
  const totalStats = Object.values(playerStats).reduce((sum, val) => sum + val, 0);
  const xpPercentage = (playerProgress.xp / playerProgress.xpToNext) * 100;

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white">
      <div className="bg-black bg-opacity-30 rounded-lg p-6 backdrop-blur-sm">
        {/* Enhanced Header with Player Progress */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ⚡ Code Quest: Advanced Edition ⚡
          </h1>
          <p className="text-blue-200">Level {playerProgress.level} • {playerProgress.xp}/{playerProgress.xpToNext} XP</p>
          
          {/* XP Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Player Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <div className="bg-green-600 bg-opacity-50 p-3 rounded text-center">
            <Code className="mx-auto mb-1" size={20} />
            <div className="text-sm">Variables</div>
            <div className="font-bold">{playerStats.variables}</div>
          </div>
          
          <div className="bg-blue-600 bg-opacity-50 p-3 rounded text-center">
            <Zap className="mx-auto mb-1" size={20} />
            <div className="text-sm">Conditionals</div>
            <div className="font-bold">{playerStats.conditionals}</div>
          </div>
          
          <div className="bg-purple-600 bg-opacity-50 p-3 rounded text-center">
            <RefreshCw className="mx-auto mb-1" size={20} />
            <div className="text-sm">Loops</div>
            <div className="font-bold">{playerStats.loops}</div>
          </div>
          
          <div className="bg-orange-600 bg-opacity-50 p-3 rounded text-center">
            <CheckCircle className="mx-auto mb-1" size={20} />
            <div className="text-sm">Functions</div>
            <div className="font-bold">{playerStats.functions}</div>
          </div>
          
          <div className="bg-red-600 bg-opacity-50 p-3 rounded text-center">
            <Flame className="mx-auto mb-1" size={20} />
            <div className="text-sm">Streak</div>
            <div className="font-bold">{playerProgress.streak}</div>
          </div>
          
          <div className="bg-yellow-600 bg-opacity-50 p-3 rounded text-center">
            <BarChart3 className="mx-auto mb-1" size={20} />
            <div className="text-sm">Efficiency</div>
            <div className="font-bold">{performanceData.codeEfficiencyRating}</div>
          </div>
        </div>

        {/* Achievements Bar */}
        {playerProgress.achievements.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-600 bg-opacity-20 rounded">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Trophy size={20} />
              Achievements Unlocked:
            </h3>
            <div className="flex flex-wrap gap-2">
              {playerProgress.achievements.map((achievementId, index) => {
                const achievement = achievements[achievementId];
                return (
                  <span key={index} className="bg-yellow-500 text-black px-3 py-1 rounded text-sm flex items-center gap-1">
                    {achievement.icon} {achievement.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={16} />
            Analytics
          </button>
          
          <button
            onClick={saveToGitHub}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
          >
            <Github size={16} />
            Save to GitHub
          </button>
          
          <input
            type="text"
            placeholder="GitHub Token"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-600 focus:border-blue-400 outline-none"
          />
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Performance Analytics
            </h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-600 bg-opacity-30 p-3 rounded text-center">
                <div className="text-sm text-gray-300">Code Executions</div>
                <div className="text-2xl font-bold">{performanceData.codeExecutions}</div>
              </div>
              
              <div className="bg-green-600 bg-opacity-30 p-3 rounded text-center">
                <div className="text-sm text-gray-300">Avg Runtime</div>
                <div className="text-2xl font-bold">{performanceData.averageRuntime.toFixed(1)}ms</div>
              </div>
              
              <div className="bg-red-600 bg-opacity-30 p-3 rounded text-center">
                <div className="text-sm text-gray-300">Errors Fixed</div>
                <div className="text-2xl font-bold">{performanceData.errorCount}</div>
              </div>
              
              <div className="bg-purple-600 bg-opacity-30 p-3 rounded text-center">
                <div className="text-sm text-gray-300">Best Practices</div>
                <div className="text-2xl font-bold">{performanceData.bestPracticesScore}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Game Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Story Section */}
          <div className="lg:col-span-1 bg-white bg-opacity-10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">
              {currentSceneData.title}
            </h2>
            
            <div className="mb-4 text-lg leading-relaxed">
              {currentSceneData.story}
            </div>

            <div className="bg-blue-600 bg-opacity-30 p-4 rounded mb-4">
              <h3 className="font-semibold text-blue-200 mb-2">
                💡 Programming Concept: {currentSceneData.concept}
              </h3>
              <p className="text-blue-100 text-sm">
                {currentSceneData.explanation}
              </p>
              <div className="text-xs text-blue-300 mt-2">
                Difficulty Level: {difficultyLevel}/5 | Skill: {playerProgress.skillLevel}
              </div>
            </div>

            {/* Sarcastic AI Bot Section */}
            {showBot && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                    <MessageCircle size={20} />
                    {botPersonality.name}
                  </h3>
                  <button
                    onClick={() => setShowBot(!showBot)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {botMessages.slice(-3).map((message) => (
                    <div
                      key={message.id}
                      className={`text-sm p-2 rounded ${
                        message.type === 'error' ? 'bg-red-600 bg-opacity-20 text-red-200' :
                        message.type === 'success' ? 'bg-green-600 bg-opacity-20 text-green-200' :
                        message.type === 'achievement' ? 'bg-yellow-600 bg-opacity-20 text-yellow-200' :
                        message.type === 'level_up' ? 'bg-purple-600 bg-opacity-20 text-purple-200' :
                        'bg-blue-600 bg-opacity-20 text-blue-200'
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Story Choices */}
            <div className="space-y-3">
              {currentSceneData.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (choice.requirement === 'challenge_completed' && !challengeCompleted) {
                      addBotMessage("Complete the coding challenge first! What part of 'challenge required' don't you understand? 🙄", 'reminder');
                      return;
                    }
                    setCurrentScene(choice.next);
                    setChallengeCompleted(false);
                    setShowHint(false);
                  }}
                  className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    choice.requirement === 'challenge_completed' && !challengeCompleted
                      ? 'bg-gray-600 bg-opacity-50 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transform hover:scale-105'
                  }`}
                  disabled={choice.requirement === 'challenge_completed' && !challengeCompleted}
                >
                  <span>{choice.text}</span>
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Coding Challenge Section */}
          {currentSceneData.challenge && (
            <div className="lg:col-span-1 bg-white bg-opacity-10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-300 flex items-center gap-2">
                  <Code size={20} />
                  Coding Challenge
                </h3>
                {challengeCompleted && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                    <CheckCircle size={16} />
                    Completed!
                  </span>
                )}
              </div>

              <p className="mb-4 text-sm text-gray-200">
                {currentSceneData.challenge.description}
              </p>

              {/* Enhanced Code Editor with Autocomplete */}
              <div className="mb-4 relative">
                <textarea
                  ref={codeInputRef}
                  value={currentCode}
                  onChange={handleCodeChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;
                      const newCode = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
                      setCurrentCode(newCode);
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 2;
                      }, 0);
                    }
                    if (e.key === 'Escape') {
                      setShowAutocomplete(false);
                    }
                  }}
                  className="w-full h-64 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm border border-gray-600 focus:border-blue-400 outline-none resize-none"
                  placeholder="Write your magical code here..."
                  spellCheck="false"
                />
                
                {/* Autocomplete Dropdown */}
                {showAutocomplete && (
                  <div className="absolute top-full left-4 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                    {autocompleteOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => insertAutocomplete(option)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm flex items-center justify-between"
                      >
                        <span className="text-blue-300">{option.text}</span>
                        <span className="text-gray-400 text-xs">{option.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Controls */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={runCode}
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <Play size={16} />
                  Run Code
                </button>
                
                <button
                  onClick={() => {
                    const scene = scenes[currentScene];
                    if (scene.challenge) {
                      setCurrentCode(scene.challenge.startingCode);
                      setCodeOutput('');
                      setChallengeCompleted(false);
                      addBotMessage("Code reset! Try not to mess it up this time. 🔄", 'info');
                    }
                  }}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <Lightbulb size={16} />
                  Hint
                </button>
              </div>

              {/* Hint Section */}
              {showHint && currentSceneData.challenge && (
                <div className="mb-4 p-3 bg-yellow-600 bg-opacity-20 rounded border-l-4 border-yellow-500">
                  <p className="text-yellow-200 text-sm">
                    💡 <strong>Professor's Reluctant Hint:</strong> {currentSceneData.challenge.hint}
                  </p>
                </div>
              )}

              {/* Output Console */}
              <div className="bg-gray-900 p-4 rounded max-h-48 overflow-y-auto">
                <h4 className="text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                  Console Output:
                  {isTypingCode && <span className="text-blue-400 animate-pulse">⌨️</span>}
                </h4>
                <pre className="text-green-400 text-sm whitespace-pre-wrap">
                  {codeOutput || 'Click "Run Code" to see the magic happen...'}
                </pre>
              </div>
            </div>
          )}

          {/* Visual Output Section */}
          {currentSceneData.challenge && currentSceneData.challenge.visual && (
            <div className="lg:col-span-1 bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <Eye size={20} />
                Visual Magic
              </h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={400}
                  className="w-full border border-gray-600 rounded"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
              <p className="text-sm text-gray-300 mt-2 text-center">
                ✨ Your code creates visual magic! ✨
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="text-center text-sm text-gray-300 mt-6">
          Scene {currentScene + 1} of {scenes.length} | 
          Level {playerProgress.level} | 
          Programming Power: {totalStats} | 
          Lines Written: {playerProgress.totalLinesWritten}
          {isTypingCode && <span className="ml-2 text-blue-400">⌨️ Coding...</span>}
        </div>
      </div>
    </div>
  );
};

export default CodeQuestGame;