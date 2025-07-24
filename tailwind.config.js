/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            animation: {
                'fadeIn': 'fadeIn 0.3s ease-out',
                'slideIn': 'slideIn 0.4s ease-out',
                'bounce': 'bounce 1s infinite',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'spin': 'spin 1s linear infinite',
                'gradient-shift': 'gradient-shift 3s ease infinite',
                'progress-glow': 'progress-glow 2s ease-in-out infinite',
                'battle-pulse': 'battle-pulse 3s ease-in-out infinite',
                'victory-gradient': 'victory-gradient 2s ease infinite'
            },
            keyframes: {
                fadeIn: {
                    'from': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    'to': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                slideIn: {
                    'from': {
                        opacity: '0',
                        transform: 'translateX(-20px)'
                    },
                    'to': {
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                },
                bounce: {
                    '0%, 20%, 53%, 80%, 100%': {
                        'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                        transform: 'translate3d(0,0,0)'
                    },
                    '40%, 43%': {
                        'animation-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                        transform: 'translate3d(0, -30px, 0)'
                    },
                    '70%': {
                        'animation-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                        transform: 'translate3d(0, -15px, 0)'
                    },
                    '90%': {
                        transform: 'translate3d(0,-4px,0)'
                    }
                },
                glow: {
                    '0%': {
                        'box-shadow': '0 0 5px rgba(59, 130, 246, 0.5)'
                    },
                    '50%': {
                        'box-shadow': '0 0 20px rgba(59, 130, 246, 0.8)'
                    },
                    '100%': {
                        'box-shadow': '0 0 5px rgba(59, 130, 246, 0.5)'
                    }
                },
                'gradient-shift': {
                    '0%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                    '100%': { 'background-position': '0% 50%' }
                },
                'progress-glow': {
                    '0%': { 'background-position': '200% 0' },
                    '100%': { 'background-position': '-200% 0' }
                },
                'battle-pulse': {
                    '0%, 100%': { 'background-size': '100% 100%' },
                    '50%': { 'background-size': '120% 120%' }
                },
                'victory-gradient': {
                    '0%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                    '100%': { 'background-position': '0% 50%' }
                }
            },
            colors: {
                'code-green': '#4ade80',
                'code-blue': '#3b82f6',
                'code-purple': '#8b5cf6',
                'code-yellow': '#fbbf24',
                'code-red': '#ef4444',
                'achievement-common': '#6b7280',
                'achievement-uncommon': '#10b981',
                'achievement-rare': '#3b82f6',
                'achievement-epic': '#8b5cf6',
                'achievement-legendary': '#f59e0b'
            },
            fontFamily: {
                'code': ['Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
                'game': ['Inter', 'system-ui', 'sans-serif']
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem'
            },
            fontSize: {
                'xxs': '0.625rem'
            },
            backdropBlur: {
                'xs': '2px'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'game-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'code-bg': 'linear-gradient(to right, #0f172a, #1e293b)',
                'victory-bg': 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffd93d)'
            },
            boxShadow: {
                'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
                'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
                'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
                'glow-yellow': '0 0 20px rgba(251, 191, 36, 0.5)',
                'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.2)'
            },
            screens: {
                'xs': '475px'
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100'
            }
        }
    },
    plugins: [
        // Custom plugin for scrollbar utilities
        function({ addUtilities }) {
            const newUtilities = {
                '.scrollbar-thin': {
                    'scrollbar-width': 'thin',
                    'scrollbar-color': '#4b5563 #1f2937'
                },
                '.scrollbar-thin::-webkit-scrollbar': {
                    width: '6px'
                },
                '.scrollbar-thin::-webkit-scrollbar-track': {
                    background: '#1f2937',
                    'border-radius': '3px'
                },
                '.scrollbar-thin::-webkit-scrollbar-thumb': {
                    background: '#4b5563',
                    'border-radius': '3px'
                },
                '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
                    background: '#6b7280'
                },
                '.text-shadow': {
                    'text-shadow': '2px 2px 4px rgba(0,0,0,0.5)'
                },
                '.text-shadow-lg': {
                    'text-shadow': '4px 4px 8px rgba(0,0,0,0.5)'
                },
                '.backdrop-blur-xs': {
                    'backdrop-filter': 'blur(2px)'
                }
            }
            addUtilities(newUtilities)
        }
    ],
    // Dark mode configuration
    darkMode: 'class',
    // Purge unused CSS in production
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: [
            './src/**/*.{js,jsx,ts,tsx}',
            './public/index.html'
        ],
        options: {
            safelist: [
                // Always keep these classes
                'animate-fadeIn',
                'animate-slideIn',
                'animate-bounce',
                'animate-pulse',
                'animate-glow',
                'bg-achievement-common',
                'bg-achievement-uncommon',
                'bg-achievement-rare',
                'bg-achievement-epic',
                'bg-achievement-legendary',
                'text-achievement-common',
                'text-achievement-uncommon',
                'text-achievement-rare',
                'text-achievement-epic',
                'text-achievement-legendary'
            ]
        }
    }
}