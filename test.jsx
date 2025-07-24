import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Code, Zap, RefreshCw, CheckCircle, Play, RotateCcw, Lightbulb, MessageCircle, Sparkles, Eye } from 'lucide-react';

const CodeQuestGame = () => {
        const [currentScene, setCurrentScene] = useState(0);
        const [playerStats, setPlayerStats] = useState({
            variables: 0,
            conditionals: 0,
            loops: 0,
            functions: 0
        });
        const [inventory, setInventory] = useState([]);
        const [currentCode, setCurrentCode] = useState('');
        const [codeOutput, setCodeOutput] = useState('');
        const [visualOutput, setVisualOutput] = useState('');
        const [showHint, setShowHint] = useState(false);
        const [challengeCompleted, setChallengeCompleted] = useState(false);
        const [botMessages, setBotMessages] = useState([]);
        const [showBot, setShowBot] = useState(true);
        const [isTypingCode, setIsTypingCode] = useState(false);
        const [lastCodeAnalysis, setLastCodeAnalysis] = useState('');
        const canvasRef = useRef(null);
        const [codeErrors, setCodeErrors] = useState([]);

        // Bot personality and responses
        const botPersonality = {
            name: "Codex",
            greeting: "🧙‍♂️ Greetings! I'm Codex, your AI coding mentor. I'll help guide you through your programming journey!",
            encouragement: ["Great work!", "You're getting there!", "Nice thinking!", "Keep it up!", "Excellent progress!"],
            errorHelp: {
                syntax: "Looks like there's a syntax error. Check your brackets, quotes, and semicolons!",
                logic: "The logic seems off. Think about what you want the code to do step by step.",
                variable: "Variable trouble? Remember to declare with 'let' and use the exact same name.",
                function: "Function issues? Check the syntax: function name(parameters) { ... }"
            }
        };

        const addBotMessage = (message, type = 'info') => {
            const newMessage = {
                id: Date.now(),
                text: message,
                type,
                timestamp: new Date().toLocaleTimeString()
            };
            setBotMessages(prev => [...prev.slice(-4), newMessage]); // Keep last 5 messages
        };

        const analyzeCode = (code) => {
            if (!code.trim()) return;

            const issues = [];
            const suggestions = [];

            // Basic syntax checks
            const openBraces = (code.match(/\{/g) || []).length;
            const closeBraces = (code.match(/\}/g) || []).length;
            const openParens = (code.match(/\(/g) || []).length;
            const closeParens = (code.match(/\)/g) || []).length;

            if (openBraces !== closeBraces) {
                issues.push("Mismatched curly braces {}");
            }
            if (openParens !== closeParens) {
                issues.push("Mismatched parentheses ()");
            }

            // Look for common patterns
            if (code.includes('for') && !code.includes('++')) {
                suggestions.push("Don't forget to increment your loop variable with i++");
            }
            if (code.includes('console.log') && code.includes('undefined')) {
                suggestions.push("Check if your variables are properly defined before using them");
            }

            return { issues, suggestions };
        };

        const scenes = [{
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
                    description: "Create variables for 3 villagers and display them in a colorful list!",
                    startingCode: "// Create variables for villager names\nlet villager1 = 'Aria';\nlet villager2 = 'Finn';\nlet villager3 = 'Luna';\n\n// Display them in the village registry\nconsole.log('🏘️ Village Registry:');\nconsole.log('👤 ' + villager1);\nconsole.log('👤 ' + villager2);\nconsole.log('👤 ' + villager3);\n\n// BONUS: Create a visual display\ndrawVillagers([villager1, villager2, villager3]);",
                    solution: "let villager1 = 'Aria';\nlet villager2 = 'Finn';\nlet villager3 = 'Luna';\n\nconsole.log('🏘️ Village Registry:');\nconsole.log('👤 ' + villager1);\nconsole.log('👤 ' + villager2);\nconsole.log('👤 ' + villager3);\n\ndrawVillagers([villager1, villager2, villager3]);",
                    hint: "Create three variables with different names, then use console.log to display them with emojis!",
                    visual: true,
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
            },
            {
                id: 2,
                title: "The Conditional Crossroads",
                story: "You reach mystical crossroads where a wise owl guards two paths. The owl hoots: 'Your path depends on your magical power! Let me show you how different powers lead to different destinies. Watch as the paths light up based on your choices!'",
                concept: "Conditionals (If/Else)",
                explanation: "Conditionals let programs make decisions based on conditions!",
                challenge: {
                    description: "Create an interactive path selector that shows different outcomes!",
                    startingCode: "// Try different magic levels and see the paths change!\nlet magicLevel = 7; // Try changing this number!\nlet heroName = 'CodeWizard';\n\nconsole.log('🦉 Owl: \"Welcome, ' + heroName + '!\"');\nconsole.log('🔮 Your magic level: ' + magicLevel);\n\nif (magicLevel > 10) {\n  console.log('✨ Taking the LEGENDARY Path!');\n  drawPath('legendary');\n} else if (magicLevel > 5) {\n  console.log('🌟 Taking the Enchanted Path!');\n  drawPath('enchanted');\n} else {\n  console.log('🏔️ Taking the Rocky Road!');\n  drawPath('rocky');\n}\n\n// Show magical energy\ndrawMagicMeter(magicLevel);",
                    solution: "let magicLevel = 7;\nlet heroName = 'CodeWizard';\n\nconsole.log('🦉 Owl: \"Welcome, ' + heroName + '!\"');\nconsole.log('🔮 Your magic level: ' + magicLevel);\n\nif (magicLevel > 10) {\n  console.log('✨ Taking the LEGENDARY Path!');\n  drawPath('legendary');\n} else if (magicLevel > 5) {\n  console.log('🌟 Taking the Enchanted Path!');\n  drawPath('enchanted');\n} else {\n  console.log('🏔️ Taking the Rocky Road!');\n  drawPath('rocky');\n}\n\ndrawMagicMeter(magicLevel);",
                    hint: "Use if/else if/else to create multiple path options. Try changing the magicLevel to see different paths!",
                    visual: true,
                    validation: (code, output) => {
                        return code.includes('if') &&
                            code.includes('magicLevel') &&
                            (output.includes('Enchanted') || output.includes('Rocky') || output.includes('LEGENDARY'));
                    }
                },
                choices: [
                    { text: "Continue your journey", next: 3, requirement: 'challenge_completed' }
                ]
            },
            {
                id: 3,
                title: "The Enchanted Garden",
                story: "You enter a beautiful garden where a sprite tends to magical flowers. 'Oh wonderful! A code wizard! I need to water my flowers, but doing it one by one takes forever. Can you create a loop spell that waters them all while showing beautiful animations?'",
                concept: "Loops",
                explanation: "Loops let you repeat actions efficiently and create amazing visual patterns!",
                challenge: {
                    description: "Create an animated flower-watering loop with visual effects!",
                    startingCode: "// Water flowers with a beautiful animation!\nconsole.log('🧚‍♀️ Sprite: \"Let\\'s water the magical garden!\"');\n\nfor (let flowerNum = 1; flowerNum <= 8; flowerNum++) {\n  console.log('💧 Watering flower ' + flowerNum + '... 🌸');\n  \n  // Create a delay effect (simulate watering time)\n  if (flowerNum % 2 === 0) {\n    console.log('   ✨ Flower ' + flowerNum + ' sparkles with magic!');\n  }\n}\n\nconsole.log('🌺 All flowers are now blooming beautifully!');\n\n// Draw the garden\ndrawGarden(8);",
                    solution: "console.log('🧚‍♀️ Sprite: \"Let\\'s water the magical garden!\"');\n\nfor (let flowerNum = 1; flowerNum <= 8; flowerNum++) {\n  console.log('💧 Watering flower ' + flowerNum + '... 🌸');\n  \n  if (flowerNum % 2 === 0) {\n    console.log('   ✨ Flower ' + flowerNum + ' sparkles with magic!');\n  }\n}\n\nconsole.log('🌺 All flowers are now blooming beautifully!');\ndrawGarden(8);",
                    hint: "Use a for loop with flowerNum from 1 to 8. Add special effects for even-numbered flowers!",
                    visual: true,
                    validation: (code, output) => {
                        return code.includes('for') &&
                            code.includes('flowerNum') &&
                            output.includes('Watering flower') &&
                            output.includes('blooming');
                    }
                },
                choices: [
                    { text: "Visit the Function Forge", next: 4, requirement: 'challenge_completed' }
                ]
            },
            {
                id: 4,
                title: "The Function Forge",
                story: "At the Function Forge, a master blacksmith creates reusable magical tools. 'Welcome! Functions are the most powerful spells - they let you create tools once and use them everywhere! Let me show you how to forge magical abilities that can be used again and again!'",
                concept: "Functions",
                explanation: "Functions are reusable blocks of code that make programming efficient and organized!",
                challenge: {
                    description: "Create magical functions that can enhance any character with visual effects!",
                    startingCode: "// Create reusable magical functions!\n\nfunction castHealingSpell(characterName, healAmount) {\n  console.log('✨🔮 Casting healing spell on ' + characterName);\n  console.log('💚 ' + characterName + ' healed for ' + healAmount + ' HP!');\n  return healAmount;\n}\n\nfunction castFireSpell(target, damage) {\n  console.log('🔥⚡ Unleashing fire magic!');\n  console.log('💥 ' + target + ' takes ' + damage + ' fire damage!');\n  return damage;\n}\n\n// Test your spells!\nconsole.log('🏰 Welcome to the Function Forge!');\n\nlet totalHealing = 0;\ntotalHealing += castHealingSpell('Hero', 50);\ntotalHealing += castHealingSpell('Wizard', 30);\ntotalHealing += castHealingSpell('Archer', 40);\n\nconsole.log('💖 Total healing done: ' + totalHealing + ' HP');\n\ncastFireSpell('Dark Goblin', 75);\ncastFireSpell('Shadow Beast', 60);\n\n// Visual spell effects\ndrawSpellEffects(['healing', 'fire']);",
                    solution: "function castHealingSpell(characterName, healAmount) {\n  console.log('✨🔮 Casting healing spell on ' + characterName);\n  console.log('💚 ' + characterName + ' healed for ' + healAmount + ' HP!');\n  return healAmount;\n}\n\nfunction castFireSpell(target, damage) {\n  console.log('🔥⚡ Unleashing fire magic!');\n  console.log('💥 ' + target + ' takes ' + damage + ' fire damage!');\n  return damage;\n}\n\nconsole.log('🏰 Welcome to the Function Forge!');\n\nlet totalHealing = 0;\ntotalHealing += castHealingSpell('Hero', 50);\ntotalHealing += castHealingSpell('Wizard', 30);\ntotalHealing += castHealingSpell('Archer', 40);\n\nconsole.log('💖 Total healing done: ' + totalHealing + ' HP');\n\ncastFireSpell('Dark Goblin', 75);\ncastFireSpell('Shadow Beast', 60);\n\ndrawSpellEffects(['healing', 'fire']);",
                    hint: "Functions should take parameters and return values. Use them multiple times to show their power!",
                    visual: true,
                    validation: (code, output) => {
                        return code.includes('function') &&
                            code.includes('castHealingSpell') &&
                            code.includes('castFireSpell') &&
                            output.includes('Total healing');
                    }
                },
                choices: [
                    { text: "Face the Final Challenge", next: 5, requirement: 'challenge_completed' }
                ]
            },
            {
                id: 5,
                title: "The Broken Algorithm - Final Boss Battle!",
                story: "You stand before the chaotic Broken Algorithm! It writhes with corrupted code, creating visual chaos. To restore it, you must combine ALL your programming knowledge in an epic final challenge. The Algorithm bellows: 'Show me your mastery, young wizard!'",
                concept: "Integration Challenge",
                explanation: "Real programming combines all concepts! Create a complete battle system!",
                challenge: {
                    description: "Create an epic hero battle system with all programming concepts and amazing visuals!",
                    startingCode: "// THE FINAL CHALLENGE: Hero Battle System!\nconsole.log('⚔️ FINAL BOSS BATTLE: Restore the Great Algorithm! ⚔️');\nconsole.log('═══════════════════════════════════════════════');\n\n// 1. Create hero data (Variables)\nlet heroes = [\n  { name: 'Aria the Swift', level: 12, health: 100, magic: 80 },\n  { name: 'Zael the Brave', level: 10, health: 120, magic: 60 },\n  { name: 'Luna the Wise', level: 15, health: 90, magic: 100 }\n];\n\n// 2. Battle functions (Functions)\nfunction attackBoss(hero, damage) {\n  console.log('⚡ ' + hero.name + ' attacks for ' + damage + ' damage!');\n  return damage;\n}\n\nfunction healHero(hero, amount) {\n  hero.health += amount;\n  console.log('💚 ' + hero.name + ' healed! Health: ' + hero.health);\n}\n\n// 3. Battle logic with conditions and loops\nlet bossHealth = 300;\nconsole.log('👹 Boss Health: ' + bossHealth);\nconsole.log('');\n\nfor (let round = 1; round <= 3 && bossHealth > 0; round++) {\n  console.log('🗡️ ROUND ' + round + ':');\n  \n  for (let i = 0; i < heroes.length; i++) {\n    let hero = heroes[i];\n    \n    // Conditional: Strong heroes deal more damage\n    if (hero.level > 12) {\n      let damage = attackBoss(hero, 60);\n      bossHealth -= damage;\n      console.log('   💥 Critical hit! Boss health: ' + bossHealth);\n    } else {\n      let damage = attackBoss(hero, 40);\n      bossHealth -= damage;\n      console.log('   💢 Hit! Boss health: ' + bossHealth);\n    }\n    \n    // Heal if health is low\n    if (hero.health < 100) {\n      healHero(hero, 20);\n    }\n    \n    if (bossHealth <= 0) break;\n  }\n  \n  console.log(''); // Empty line between rounds\n}\n\n// Victory check\nif (bossHealth <= 0) {\n  console.log('🎉 VICTORY! The Great Algorithm is restored!');\n  console.log('✨ Code Kingdom is saved!');\n  drawVictory();\n} else {\n  console.log('💀 The battle continues...');\n}\n\n// Show final stats\nconsole.log('');\nconsole.log('🏆 FINAL HERO STATS:');\nfor (let i = 0; i < heroes.length; i++) {\n  console.log('   ' + heroes[i].name + ' - Health: ' + heroes[i].health);\n}\n\ndrawBattleField(heroes, bossHealth);",
                    solution: "console.log('⚔️ FINAL BOSS BATTLE: Restore the Great Algorithm! ⚔️');\nconsole.log('═══════════════════════════════════════════════');\n\nlet heroes = [\n  { name: 'Aria the Swift', level: 12, health: 100, magic: 80 },\n  { name: 'Zael the Brave', level: 10, health: 120, magic: 60 },\n  { name: 'Luna the Wise', level: 15, health: 90, magic: 100 }\n];\n\nfunction attackBoss(hero, damage) {\n  console.log('⚡ ' + hero.name + ' attacks for ' + damage + ' damage!');\n  return damage;\n}\n\nfunction healHero(hero, amount) {\n  hero.health += amount;\n  console.log('💚 ' + hero.name + ' healed! Health: ' + hero.health);\n}\n\nlet bossHealth = 300;\nconsole.log('👹 Boss Health: ' + bossHealth);\nconsole.log('');\n\nfor (let round = 1; round <= 3 && bossHealth > 0; round++) {\n  console.log('🗡️ ROUND ' + round + ':');\n  \n  for (let i = 0; i < heroes.length; i++) {\n    let hero = heroes[i];\n    \n    if (hero.level > 12) {\n      let damage = attackBoss(hero, 60);\n      bossHealth -= damage;\n      console.log('   💥 Critical hit! Boss health: ' + bossHealth);\n    } else {\n      let damage = attackBoss(hero, 40);\n      bossHealth -= damage;\n      console.log('   💢 Hit! Boss health: ' + bossHealth);\n    }\n    \n    if (hero.health < 100) {\n      healHero(hero, 20);\n    }\n    \n    if (bossHealth <= 0) break;\n  }\n  \n  console.log('');\n}\n\nif (bossHealth <= 0) {\n  console.log('🎉 VICTORY! The Great Algorithm is restored!');\n  console.log('✨ Code Kingdom is saved!');\n  drawVictory();\n} else {\n  console.log('💀 The battle continues...');\n}\n\nconsole.log('');\nconsole.log('🏆 FINAL HERO STATS:');\nfor (let i = 0; i < heroes.length; i++) {\n  console.log('   ' + heroes[i].name + ' - Health: ' + heroes[i].health);\n}\n\ndrawBattleField(heroes, bossHealth);",
                    hint: "This combines everything: arrays (variables), functions, loops, and conditionals. Run it to see the epic battle!",
                    visual: true,
                    validation: (code, output) => {
                        return code.includes('function') &&
                            code.includes('for') &&
                            code.includes('heroes') &&
                            code.includes('if') &&
                            output.includes('ROUND');
                    }
                },
                choices: [
                    { text: "Celebrate Victory!", next: 6, requirement: 'challenge_completed' }
                ]
            },
            {
                id: 6,
                title: "🎉 LEGENDARY CODE WIZARD! 🎉",
                story: "The Great Algorithm blazes back to life with spectacular visual effects! You've mastered all the fundamental concepts of programming through hands-on practice. The Code Kingdom celebrates your victory with fireworks of pure code! You are now ready for real-world programming adventures!",
                concept: "Mastery Achieved",
                explanation: "You've learned by doing - the best way to master programming! You can now build amazing applications, games, and websites. The coding world awaits your creativity!",
                challenge: null,
                choices: [
                    { text: "🌟 Start an even greater adventure!", next: 0, requirement: null }
                ]
            }
        ];

        // Visual drawing functions
        const drawVillagers = (names) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = '#4a5568';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Title
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏘️ Village Registry', canvas.width / 2, 30);

            // Draw villagers
            names.forEach((name, index) => {
                const y = 70 + index * 50;
                const x = canvas.width / 2;

                // Villager background
                ctx.fillStyle = '#68d391';
                ctx.fillRect(x - 100, y - 15, 200, 30);

                // Villager text
                ctx.fillStyle = '#000';
                ctx.font = '16px Arial';
                ctx.fillText(`👤 ${name}`, x, y + 5);
            });
        };

        const drawPath = (pathType) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const colors = {
                legendary: ['#ffd700', '#ff6b6b'],
                enchanted: ['#9f7aea', '#4fd1c7'],
                rocky: ['#8b8680', '#4a5568']
            };

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, colors[pathType][0]);
            gradient.addColorStop(1, colors[pathType][1]);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            const pathNames = {
                legendary: '✨ LEGENDARY PATH ✨',
                enchanted: '🌟 Enchanted Path 🌟',
                rocky: '🏔️ Rocky Road 🏔️'
            };
            ctx.fillText(pathNames[pathType], canvas.width / 2, canvas.height / 2);
        };

        const drawMagicMeter = (level) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const meterY = canvas.height - 60;

            // Meter background
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(20, meterY, canvas.width - 40, 30);

            // Meter fill
            const fillWidth = ((canvas.width - 40) * level) / 15;
            const gradient = ctx.createLinearGradient(20, meterY, 20 + fillWidth, meterY + 30);
            gradient.addColorStop(0, '#48bb78');
            gradient.addColorStop(1, '#38a169');

            ctx.fillStyle = gradient;
            ctx.fillRect(20, meterY, fillWidth, 30);

            // Meter text
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Magic Level: ${level}`, canvas.width / 2, meterY + 20);
        };

        const drawGarden = (flowerCount) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Garden background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#90cdf4');
            gradient.addColorStop(1, '#68d391');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw flowers
            const flowersPerRow = 4;
            const flowerSize = 30;
            const spacing = 80;

            for (let i = 0; i < flowerCount; i++) {
                const row = Math.floor(i / flowersPerRow);
                const col = i % flowersPerRow;
                const x = 60 + col * spacing;
                const y = 60 + row * spacing;

                // Flower
                ctx.fillStyle = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#4299e1', '#9f7aea'][i % 6];
                ctx.beginPath();
                ctx.arc(x, y, flowerSize / 2, 0, 2 * Math.PI);
                ctx.fill();

                // Stem
                ctx.fillStyle = '#38a169';
                ctx.fillRect(x - 2, y + flowerSize / 2, 4, 20);

                // Water droplet
                ctx.fillStyle = '#4299e1';
                ctx.beginPath();
                ctx.arc(x + 15, y - 15, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        };

        const drawSpellEffects = (spells) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dark background
            ctx.fillStyle = '#1a202c';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            spells.forEach((spell, index) => {
                const centerX = (canvas.width / spells.length) * (index + 0.5);
                const centerY = canvas.height / 2;

                if (spell === 'healing') {
                    // Healing spell - green circles
                    for (let i = 0; i < 5; i++) {
                        ctx.fillStyle = `rgba(72, 187, 120, ${0.8 - i * 0.15})`;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, 20 + i * 10, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                    ctx.fillStyle = '#fff';
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('💚 HEAL', centerX, centerY + 5);
                } else if (spell === 'fire') {
                    // Fire spell - red/orange circles
                    for (let i = 0; i < 5; i++) {
                        ctx.fillStyle = `rgba(245, 101, 101, ${0.8 - i * 0.15})`;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, 20 + i * 10, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                    ctx.fillStyle = '#fff';
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('🔥 FIRE', centerX, centerY + 5);
                }
            });
        };

        const drawBattleField = (heroes, bossHealth) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Epic battle background
            const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 200);
            gradient.addColorStop(0, '#742a2a');
            gradient.addColorStop(1, '#1a202c');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Boss
            if (bossHealth > 0) {
                ctx.fillStyle = '#e53e3e';
                ctx.fillRect(canvas.width / 2 - 50, 30, 100, 60);
                ctx.fillStyle = '#fff';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('👹 BOSS', canvas.width / 2, 50);
                ctx.fillText(`HP: ${bossHealth}`, canvas.width / 2, 70);
            } else {
                ctx.fillStyle = '#38a169';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🎉 VICTORY! 🎉', canvas.width / 2, 60);
            }

            // Heroes
            heroes.forEach((hero, index) => {
                const x = 50 + index * 120;
                const y = canvas.height - 80;

                ctx.fillStyle = hero.health > 50 ? '#38a169' : '#e53e3e';
                ctx.fillRect(x - 30, y, 60, 40);

                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⚔️', x, y + 15);
                ctx.fillText(`${hero.health}HP`, x, y + 30);
            });
        };

        const drawVictory = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Victory background with sparkles
            const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 200);
            gradient.addColorStop(0, '#ffd700');
            gradient.addColorStop(1, '#9f7aea');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Victory text
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎉 VICTORY! 🎉', canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '16px Arial';
            ctx.fillText('Code Kingdom Saved!', canvas.width / 2, canvas.height / 2 + 10);

            // Sparkles
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.fillStyle = '#fff';
                ctx.fillRect(x, y, 2, 2);
            }
        };

        // Real-time code analysis
        useEffect(() => {
            if (!currentCode.trim()) return;

            const timeoutId = setTimeout(() => {
                const analysis = analyzeCode(currentCode);

                if (analysis.issues.length > 0) {
                    addBotMessage(`🔍 I noticed: ${analysis.issues[0]}`, 'warning');
                } else if (analysis.suggestions.length > 0) {
                    addBotMessage(`💡 Tip: ${analysis.suggestions[0]}`, 'suggestion');
                } else if (currentCode.length > lastCodeAnalysis.length + 50) {
                    const encouragements = botPersonality.encouragement;
                    const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
                    addBotMessage(`${randomMsg} Your code is looking good!`, 'encouragement');
                }

                setLastCodeAnalysis(currentCode);
            }, 2000);

            return () => clearTimeout(timeoutId);
        }, [currentCode]);

        // Initialize bot
        useEffect(() => {
            if (currentScene === 0) {
                addBotMessage(botPersonality.greeting, 'greeting');
            }
        }, []);

        const runCode = () => {
            let output = '';
            const originalLog = console.log;

            // Visual helper functions
            const visualFunctions = {
                drawVillagers,
                drawPath,
                drawMagicMeter,
                drawGarden,
                drawSpellEffects,
                drawBattleField,
                drawVictory
            };

            console.log = (...args) => {
                output += args.join(' ') + '\n';
            };

            try {
                const func = new Function(...Object.keys(visualFunctions), currentCode);
                func(...Object.values(visualFunctions));
                setCodeOutput(output.trim());
                setCodeErrors([]);

                const currentChallenge = scenes[currentScene].challenge;
                if (currentChallenge && currentChallenge.validation(currentCode, output)) {
                    setChallengeCompleted(true);
                    setPlayerStats(prev => {
                        const concept = scenes[currentScene].concept.toLowerCase();
                        if (concept.includes('variable')) return {...prev, variables: prev.variables + 1 };
                        if (concept.includes('conditional')) return {...prev, conditionals: prev.conditionals + 1 };
                        if (concept.includes('loop')) return {...prev, loops: prev.loops + 1 };
                        if (concept.includes('function') || concept.includes('integration')) return {...prev, functions: prev.functions + 1 };
                        return prev;
                    });

                    const conceptName = scenes[currentScene].concept;
                    setInventory(prev => [...prev, `${conceptName} Mastery`]);
                    addBotMessage(`🎉 Excellent work! You've mastered ${conceptName}! The visual effects look amazing!`, 'success');
                } else if (currentChallenge) {
                    addBotMessage("Almost there! Check the requirements and try again. You've got this! 💪", 'hint');
                }
            } catch (error) {
                const errorMsg = `Error: ${error.message}`;
                setCodeOutput(errorMsg);
                setCodeErrors([error.message]);

                if (error.message.includes('Unexpected token')) {
                    addBotMessage("Syntax error detected! Check your brackets, quotes, and semicolons. 🔍", 'error');
                } else if (error.message.includes('is not defined')) {
                    addBotMessage("Variable not defined! Make sure you've declared all variables with 'let'. 📝", 'error');
                } else {
                    addBotMessage(`I see an error: ${error.message}. Let me help you fix it! 🛠️`, 'error');
                }
            }

            console.log = originalLog;
        };

        const resetCode = () => {
            const currentChallenge = scenes[currentScene].challenge;
            if (currentChallenge) {
                setCurrentCode(currentChallenge.startingCode);
                setCodeOutput('');
                setChallengeCompleted(false);
                setCodeErrors([]);
                addBotMessage("Code reset! Fresh start - you've got this! 🚀", 'info');
            }
        };

        const handleChoice = (choice) => {
            if (choice.requirement === 'challenge_completed' && !challengeCompleted) {
                addBotMessage("Complete the coding challenge first! I believe in you! 💪", 'reminder');
                return;
            }

            setCurrentScene(choice.next);
            setChallengeCompleted(false);
            setShowHint(false);
            setCodeErrors([]);

            const nextScene = scenes[choice.next];
            if (nextScene.challenge) {
                setCurrentCode(nextScene.challenge.startingCode);
                setCodeOutput('');
                addBotMessage(`Welcome to ${nextScene.title}! Let's tackle this challenge together! 🎯`, 'scene_change');
            } else {
                setCurrentCode('');
                setCodeOutput('');
            }
        };

        useEffect(() => {
            const scene = scenes[currentScene];
            if (scene.challenge) {
                setCurrentCode(scene.challenge.startingCode);
            }
        }, []);

        const currentSceneData = scenes[currentScene];
        const totalStats = Object.values(playerStats).reduce((sum, val) => sum + val, 0);

        return ( <
                div className = "max-w-7xl mx-auto p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white" >
                <
                div className = "bg-black bg-opacity-30 rounded-lg p-6 backdrop-blur-sm" > { /* Header */ } <
                div className = "text-center mb-6" >
                <
                h1 className = "text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent" > ⚡Code Quest: Visual Adventure⚡ <
                /h1> <
                p className = "text-blue-200" > Learn Programming with Real Code, Visuals & AI Guidance! < /p> <
                /div>

                { /* Stats and Inventory */ } <
                div className = "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4" >
                <
                div className = "bg-green-600 bg-opacity-50 p-3 rounded text-center" >
                <
                Code className = "mx-auto mb-1"
                size = { 20 }
                /> <
                div className = "text-sm" > Variables < /div> <
                div className = "font-bold" > { playerStats.variables } < /div> <
                /div> <
                div className = "bg-blue-600 bg-opacity-50 p-3 rounded text-center" >
                <
                Zap className = "mx-auto mb-1"
                size = { 20 }
                /> <
                div className = "text-sm" > Conditionals < /div> <
                div className = "font-bold" > { playerStats.conditionals } < /div> <
                /div> <
                div className = "bg-purple-600 bg-opacity-50 p-3 rounded text-center" >
                <
                RefreshCw className = "mx-auto mb-1"
                size = { 20 }
                /> <
                div className = "text-sm" > Loops < /div> <
                div className = "font-bold" > { playerStats.loops } < /div> <
                /div> <
                div className = "bg-orange-600 bg-opacity-50 p-3 rounded text-center" >
                <
                CheckCircle className = "mx-auto mb-1"
                size = { 20 }
                /> <
                div className = "text-sm" > Functions < /div> <
                div className = "font-bold" > { playerStats.functions } < /div> <
                /div> <
                /div>

                {
                    inventory.length > 0 && ( <
                        div className = "mb-6 p-4 bg-yellow-600 bg-opacity-20 rounded" >
                        <
                        h3 className = "font-semibold mb-2" > 🏆Mastered Skills: < /h3> <
                        div className = "flex flex-wrap gap-2" > {
                            inventory.map((item, index) => ( <
                                span key = { index }
                                className = "bg-yellow-500 text-black px-2 py-1 rounded text-sm" > { item } <
                                /span>
                            ))
                        } <
                        /div> <
                        /div>
                    )
                }

                <
                div className = "grid lg:grid-cols-3 gap-6" > { /* Story Section */ } <
                div className = "lg:col-span-1 bg-white bg-opacity-10 rounded-lg p-6" >
                <
                h2 className = "text-2xl font-bold mb-4 text-yellow-300" > { currentSceneData.title } <
                /h2>

                <
                div className = "mb-4 text-lg leading-relaxed" > { currentSceneData.story } <
                /div>

                <
                div className = "bg-blue-600 bg-opacity-30 p-4 rounded mb-4" >
                <
                h3 className = "font-semibold text-blue-200 mb-2" > 💡Programming Concept: { currentSceneData.concept } <
                /h3> <
                p className = "text-blue-100 text-sm" > { currentSceneData.explanation } <
                /p> <
                /div>

                { /* AI Bot Section */ } {
                    showBot && ( <
                        div className = "bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4" >
                        <
                        div className = "flex items-center justify-between mb-3" >
                        <
                        h3 className = "text-lg font-semibold text-cyan-300 flex items-center gap-2" >
                        <
                        MessageCircle size = { 20 }
                        />
                        Codex AI Mentor <
                        /h3> <
                        button onClick = {
                            () => setShowBot(!showBot) }
                        className = "text-gray-400 hover:text-white" >
                        ×
                        <
                        /button> <
                        /div>

                        <
                        div className = "space-y-2 max-h-32 overflow-y-auto" > {
                            botMessages.slice(-3).map((message) => ( <
                                div key = { message.id }
                                className = { `text-sm p-2 rounded ${
                        message.type === 'error' ? 'bg-red-600 bg-opacity-20 text-red-200' :
                        message.type === 'success' ? 'bg-green-600 bg-opacity-20 text-green-200' :
                        message.type === 'warning' ? 'bg-yellow-600 bg-opacity-20 text-yellow-200' :
                        'bg-blue-600 bg-opacity-20 text-blue-200'
                      }` } >
                                { message.text } <
                                /div>
                            ))
                        } <
                        /div> <
                        /div>
                    )
                }

                { /* Choices */ } <
                div className = "space-y-3" > {
                    currentSceneData.choices.map((choice, index) => ( <
                        button key = { index }
                        onClick = {
                            () => handleChoice(choice) }
                        className = { `w-full p-4 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    choice.requirement === 'challenge_completed' && !challengeCompleted
                      ? 'bg-gray-600 bg-opacity-50 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transform hover:scale-105'
                  }` }
                        disabled = { choice.requirement === 'challenge_completed' && !challengeCompleted } >
                        <
                        span > { choice.text } < /span> {
                            choice.requirement === 'challenge_completed' && !challengeCompleted && ( <
                                span className = "text-xs" > Complete challenge first! < /span>
                            )
                        } <
                        ChevronRight className = "group-hover:translate-x-1 transition-transform"
                        size = { 20 }
                        /> <
                        /button>
                    ))
                } <
                /div> <
                /div>

                { /* Coding Challenge Section */ } {
                    currentSceneData.challenge && ( <
                        div className = "lg:col-span-1 bg-white bg-opacity-10 rounded-lg p-6" >
                        <
                        div className = "flex items-center justify-between mb-4" >
                        <
                        h3 className = "text-xl font-bold text-green-300 flex items-center gap-2" >
                        <
                        Code size = { 20 }
                        />
                        Coding Challenge <
                        /h3> {
                            challengeCompleted && ( <
                                span className = "bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1" >
                                <
                                CheckCircle size = { 16 }
                                />
                                Completed!
                                <
                                /span>
                            )
                        } <
                        /div>

                        <
                        p className = "mb-4 text-sm text-gray-200" > { currentSceneData.challenge.description } <
                        /p>

                        <
                        div className = "mb-4" >
                        <
                        textarea value = { currentCode }
                        onChange = {
                            (e) => {
                                setCurrentCode(e.target.value);
                                setIsTypingCode(true);
                                setTimeout(() => setIsTypingCode(false), 1000);
                            }
                        }
                        className = "w-full h-64 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm border border-gray-600 focus:border-blue-400 outline-none resize-none"
                        placeholder = "Write your magical code here..."
                        spellCheck = "false" /
                        >
                        <
                        /div>

                        <
                        div className = "flex flex-wrap gap-2 mb-4" >
                        <
                        button onClick = { runCode }
                        className = "bg-green-600 hover:bg-green-500 px-4 py-2 rounded flex items-center gap-2 transition-colors" >
                        <
                        Play size = { 16 }
                        />
                        Run Code <
                        /button> <
                        button onClick = { resetCode }
                        className = "bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded flex items-center gap-2 transition-colors" >
                        <
                        RotateCcw size = { 16 }
                        />
                        Reset <
                        /button> <
                        button onClick = {
                            () => setShowHint(!showHint) }
                        className = "bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded flex items-center gap-2 transition-colors" >
                        <
                        Lightbulb size = { 16 }
                        />
                        Hint <
                        /button> <
                        /div>

                        {
                            showHint && ( <
                                div className = "mb-4 p-3 bg-yellow-600 bg-opacity-20 rounded border-l-4 border-yellow-500" >
                                <
                                p className = "text-yellow-200 text-sm" > 💡 < strong > Hint: < /strong> {currentSceneData.challenge.hint} <
                                /p> <
                                /div>
                            )
                        }

                        <
                        div className = "bg-gray-900 p-4 rounded max-h-48 overflow-y-auto" >
                        <
                        h4 className = "text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2" >
                        Output: {
                            isTypingCode && < span className = "text-blue-400 animate-pulse" > ⌨️ < /span>} <
                            /h4> <
                            pre className = "text-green-400 text-sm whitespace-pre-wrap" > { codeOutput || 'Click "Run Code" to see output...' } <
                            /pre> <
                            /div> <
                            /div>
                        )
                    }

                    { /* Visual Output Section */ } {
                        currentSceneData.challenge && currentSceneData.challenge.visual && ( <
                            div className = "lg:col-span-1 bg-white bg-opacity-10 rounded-lg p-6" >
                            <
                            h3 className = "text-xl font-bold text-purple-300 mb-4 flex items-center gap-2" >
                            <
                            Eye size = { 20 }
                            />
                            Visual Magic <
                            /h3> <
                            div className = "bg-gray-900 rounded-lg p-4" >
                            <
                            canvas ref = { canvasRef }
                            width = { 300 }
                            height = { 400 }
                            className = "w-full border border-gray-600 rounded"
                            style = {
                                { maxWidth: '100%', height: 'auto' } }
                            /> <
                            /div> <
                            p className = "text-sm text-gray-300 mt-2 text-center" > ✨Your code creates visual magic!✨
                            <
                            /p> <
                            /div>
                        )
                    } <
                    /div>

                    <
                    div className = "text-center text-sm text-gray-300 mt-6" >
                        Scene { currentScene + 1 }
                    of { scenes.length } | Programming Power: { totalStats } {
                        isTypingCode && < span className = "ml-2 text-blue-400" > ⌨️Coding... < /span>} <
                            /div> <
                            /div> <
                            /div>
                    );
                };

                export default CodeQuestGame;