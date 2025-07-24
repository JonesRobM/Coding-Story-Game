# 🚀 Code Quest Advanced - Complete Setup Guide

This guide will walk you through setting up the complete Code Quest Advanced project with all its modular components, advanced features, and integrations.

## 📁 Project Structure Overview

```
code-quest-advanced/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Game/
│   │   │   ├── CodeQuestGame.jsx          # Main game orchestrator
│   │   │   ├── CodeEditor.jsx             # Advanced code editor with autocomplete
│   │   │   ├── GameCanvas.jsx             # Interactive visual graphics
│   │   │   └── PerformanceAnalytics.jsx   # Analytics dashboard
│   │   ├── UI/
│   │   │   ├── PlayerStats.jsx            # Statistics dashboard
│   │   │   ├── BotChat.jsx               # Sarcastic AI mentor interface
│   │   │   ├── AchievementBadges.jsx      # Achievement system display
│   │   │   └── AutocompleteDropdown.jsx   # Code suggestion interface
│   │   └── GitHub/
│   │       └── GitHubIntegration.jsx      # Repository integration
│   ├── hooks/
│   │   ├── usePlayerProgress.js           # XP, leveling, and progression
│   │   ├── usePerformanceTracking.js      # Code analytics and metrics
│   │   ├── useAchievements.js            # Achievement system logic
│   │   └── useStreakTracking.js          # Daily habit tracking
│   ├── utils/
│   │   ├── botPersonality.js             # AI mentor personality system
│   │   └── codeAnalysis.js               # Performance analysis algorithms
│   ├── data/
│   │   └── gameScenes.js                 # Story content and challenges
│   ├── styles/
│   │   └── index.css                     # Global styles and animations
│   ├── App.jsx                           # Main app component
│   └── index.js                          # React entry point
├── package.json                          # Dependencies and scripts
├── tailwind.config.js                    # Tailwind configuration
├── README.md                             # Project documentation
└── SETUP.md                             # This setup guide
```

## 🛠️ Prerequisites

Before starting, ensure you have:

- **Node.js 16+** and **npm 8+** installed
- **Git** for version control
- **VS Code** (recommended) with these extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Auto Rename Tag
  - Bracket Pair Colorizer
  - GitLens
  - Prettier - Code formatter

## 📦 Step-by-Step Installation

### 1. Create Project Directory

```bash
mkdir code-quest-advanced
cd code-quest-advanced
```

### 2. Initialize React Project

```bash
npx create-react-app . --template typescript
# Or for JavaScript version:
npx create-react-app .
```

### 3. Install Dependencies

```bash
# Main dependencies
npm install lucide-react

# Development dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Set Up Project Structure

Create the directory structure as shown above:

```bash
# Create directories
mkdir -p src/components/Game
mkdir -p src/components/UI  
mkdir -p src/components/GitHub
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/data
mkdir -p src/styles

# You can now copy each component file from the artifacts above
# into their respective directories
```

### 5. Configure Tailwind CSS

Update `tailwind.config.js` with the configuration provided in the artifacts above.

### 6. Set Up Styles

Replace `src/index.css` with the comprehensive styles from the artifacts above.

### 7. Create Component Files

Copy each component from the artifacts above into their respective files:

- `src/components/Game/CodeQuestGame.jsx`
- `src/components/Game/CodeEditor.jsx`
- `src/components/Game/GameCanvas.jsx`
- `src/components/Game/PerformanceAnalytics.jsx`
- `src/components/UI/PlayerStats.jsx`
- `src/components/UI/BotChat.jsx`
- `src/components/UI/AchievementBadges.jsx`
- `src/components/UI/AutocompleteDropdown.jsx`
- `src/components/GitHub/GitHubIntegration.jsx`

### 8. Create Hook Files

- `src/hooks/usePlayerProgress.js`
- `src/hooks/usePerformanceTracking.js`
- `src/hooks/useAchievements.js`
- `src/hooks/useStreakTracking.js`

### 9. Create Utility Files

- `src/utils/botPersonality.js`
- `src/utils/codeAnalysis.js`

### 10. Create Data Files

- `src/data/gameScenes.js`

### 11. Update Main Files

- Replace `src/App.jsx` with the version from artifacts
- Replace `src/index.js` with the version from artifacts
- Update `package.json` with the complete version from artifacts

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

The application will open at `http://localhost:3000` with hot reloading enabled.

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

### Testing

```bash
npm test
```

Runs the test suite in interactive watch mode.

## 🔧 Configuration Options

### Environment Variables

Create a `.env` file in the root directory for optional configurations:

```bash
# GitHub Integration (optional)
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
REACT_APP_GITHUB_REDIRECT_URI=http://localhost:3000

# Analytics (optional)
REACT_APP_ANALYTICS_ID=your_analytics_id

# API endpoints (if needed)
REACT_APP_API_BASE_URL=https://api.yourserver.com
```

### Customizing the AI Bot

Edit `src/utils/botPersonality.js` to customize Professor Codex's responses:

```javascript
// Add new response categories
responses: {
  yourCategory: [
    "Custom response 1",
    "Custom response 2"
  ]
}
```

### Adding New Challenges

Edit `src/data/gameScenes.js` to add new programming challenges:

```javascript
{
  id: newId,
  title: "Your Challenge Title",
  story: "Engaging narrative...",
  concept: "Programming Concept",
  challenge: {
    description: "What students need to do",
    startingCode: "// Template code",
    validation: (code, output) => { /* validation logic */ }
  }
}
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile devices (iOS Safari, Chrome Mobile)

## 🧪 Testing Strategy

### Unit Tests

```bash
# Run specific test suites
npm test -- --testPathPattern=hooks
npm test -- --testPathPattern=components
npm test -- --testPathPattern=utils
```

### Manual Testing Checklist

- [ ] All scenes load and transition correctly
- [ ] Code execution works in each challenge
- [ ] Visual outputs render properly
- [ ] Bot provides contextual feedback
- [ ] Achievement system unlocks correctly
- [ ] GitHub integration saves projects
- [ ] Performance analytics track accurately
- [ ] Streak tracking maintains consistency
- [ ] Mobile responsiveness works across devices

## 🚀 Deployment Options

### Static Hosting (Netlify/Vercel)

```bash
npm run build
# Deploy the build/ folder to your preferred hosting service
```

### GitHub Pages

```bash
npm install -g gh-pages
npm run build
npx gh-pages -d build
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Debugging Tips

### Common Issues and Solutions

1. **Tailwind styles not loading**
   - Ensure `tailwind.config.js` content paths are correct
   - Check that CSS imports are in the right order

2. **Components not rendering**
   - Verify all imports use correct file paths
   - Check for missing dependencies in package.json

3. **GitHub integration not working**
   - Ensure personal access token has correct permissions
   - Check CORS settings if using custom API endpoints

4. **Performance issues**
   - Use React DevTools Profiler to identify bottlenecks
   - Check for unnecessary re-renders in useEffect dependencies

### Development Tools

- **React Developer Tools**: Browser extension for debugging React components
- **Tailwind CSS DevTools**: Browser extension for Tailwind class inspection
- **Redux DevTools**: If you add Redux for state management

## 📈 Performance Optimization

### Code Splitting

Implement lazy loading for better performance:

```javascript
import { lazy, Suspense } from 'react';

const PerformanceAnalytics = lazy(() => import('./PerformanceAnalytics'));

// Usage
<Suspense fallback={<div>Loading...</div>}>
  <PerformanceAnalytics />
</Suspense>
```

### Bundle Analysis

```bash
npm run analyze
```

This will help identify large dependencies and optimization opportunities.

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Create a Pull Request

### Code Style Guidelines

- Use ES6+ features and modern JavaScript
- Follow React best practices and hooks patterns
- Maintain consistent naming conventions
- Add comments for complex logic
- Test across multiple browsers
- Ensure mobile responsiveness

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors, try:

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React Scripts cache
npm start -- --reset-cache
```

### Performance Issues

Monitor performance with:

```bash
# Bundle size analysis
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [GitHub API Documentation](https://docs.github.com/en/rest)

## 🎯 What's Next?

After setup, you can:

1. **Customize the experience** by modifying game scenes and bot personality
2. **Add new features** like multiplayer modes or additional programming languages
3. **Extend analytics** with advanced performance tracking
4. **Integrate with learning platforms** like classroom management systems
5. **Add social features** like leaderboards and code sharing

---

**Ready to code? Let the adventure begin! 🧙‍♂️✨**

For additional help, check the main README.md or open an issue on GitHub.