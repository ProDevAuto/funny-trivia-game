# 😂 Funny Trivia Game

A modern, interactive Progressive Web App (PWA) trivia game with multiple difficulty levels, player support, and a sleek dark theme design.

## 🎮 Features

- **🎯 Multiple Difficulty Levels**: Easy, Medium, and Hard questions
- **👥 Multi-Player Support**: 1-4 players can play together
- **❓ Customizable Game Length**: Choose from 5, 10, 15, or 20 questions
- **🎨 Modern UI**: Beautiful dark theme with animations and gradients
- **📱 Progressive Web App**: Install and play offline like a native app
- **🔊 Sound Effects**: Audio feedback for correct and wrong answers
- **🎞️ Visual Feedback**: Animated GIFs for correct/wrong answers
- **🏆 Leaderboard**: Track high scores with local storage
- **⏱️ Timer-Based**: 15-second countdown for each question
- **📊 Smart Scoring**: Comprehensive scoring system

## 📋 Question Database

- **Easy**: 35+ fun, basic questions (math, colors, animals, etc.)
- **Medium**: 35+ challenging questions (geography, history, science, etc.)
- **Hard**: 30+ expert-level questions (advanced math, physics, programming, etc.)

Questions are randomly selected from the pool, ensuring unique gameplay experiences.

## 🚀 How to Play

1. **Setup**: Choose number of players (1-4), difficulty level, and question count
2. **Play**: Players take turns answering questions within 15 seconds
3. **Scoring**: Correct answers increase your score
4. **Results**: See the winner and final scores
5. **Leaderboard**: Check your ranking against previous games

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and PWA manifest
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript**: Game logic, local storage, and PWA functionality
- **PWA**: Service worker for offline functionality
- **Local Storage**: Persistent leaderboard data

## 📱 Installation as PWA

### Desktop (Chrome/Edge):
1. Open the game in your browser
2. Look for the install icon in the address bar
3. Click "Install" to add to desktop

### Mobile:
- **Android**: Chrome will show "Add to Home Screen" banner
- **iOS**: Tap Share button → "Add to Home Screen"

## 🎨 Design Features

- **Dark Theme**: Modern dark UI with blue/purple gradients
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Smooth Animations**: Hover effects, transitions, and keyframes
- **Responsive Design**: Works perfectly on all screen sizes
- **Modern Typography**: Clean, readable fonts with proper hierarchy

## 📁 Project Structure

```
funny-trivia-game/
├── index.html              # Main HTML file
├── style.css              # Modern CSS styles
├── script.js              # Game logic and functionality
├── manifest.json          # PWA configuration
├── service-worker.js      # Offline functionality
├── questions-easy.js      # Easy difficulty questions
├── questions-medium.js    # Medium difficulty questions
├── questions-hard.js     # Hard difficulty questions
└── assets/
    ├── icon.png          # App icon
    ├── correct.mp3       # Success sound
    ├── wrong.mp3         # Error sound
    └── gifs/
        ├── correct.gif   # Success animation
        └── wrong.gif     # Error animation
```

## 🌐 Live Demo

You can play the game locally by opening `index.html` in your browser or serve it through a local web server for full PWA functionality:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 🚀 Deployment

This game is ready for deployment to:
- **Azure Static Web Apps** (Recommended)
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**

## 🤝 Contributing

Feel free to contribute by:
- Adding more questions to any difficulty level
- Improving the UI/UX design
- Adding new game modes
- Fixing bugs or improving performance

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

- [ ] Online multiplayer support
- [ ] Custom question categories
- [ ] Difficulty-based scoring multipliers
- [ ] Social media sharing
- [ ] Question submission by users
- [ ] Analytics and statistics
- [ ] Theme customization options

---

Made with ❤️ for trivia lovers everywhere! 🧠✨