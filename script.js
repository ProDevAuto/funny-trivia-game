let questions = [];
// Questions are now loaded from external files: questions-easy.js, questions-medium.js, questions-hard.js

// Game settings
let gameSettings = {
    players: 1,
    difficulty: 'easy',
    questionCount: 10
};

let current = 0;
let scores = [];
let currentPlayer = 0;
let timer;
let timeLeft = 15;
const correctSound = new Audio("assets/correct.mp3");
const wrongSound = new Audio("assets/wrong.mp3");

// Setup screen functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    initializeSetupScreen();
    displayLeaderboard();
});

function initializeSetupScreen() {
    // Setup button listeners
    const setupButtons = document.querySelectorAll('.setup-btn');
    setupButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.setup-section');
            section.querySelectorAll('.setup-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update game settings
            if (this.dataset.players) {
                gameSettings.players = parseInt(this.dataset.players);
            }
            if (this.dataset.difficulty) {
                gameSettings.difficulty = this.dataset.difficulty;
            }
            if (this.dataset.questions) {
                gameSettings.questionCount = parseInt(this.dataset.questions);
            }
        });
    });
    
    // Start game button
    document.getElementById('start-game').addEventListener('click', startGame);
}

function startGame() {
    // Initialize scores array based on number of players
    scores = new Array(gameSettings.players).fill(0);
    current = 0;
    currentPlayer = 0;
    
    // Hide setup screen and show game screen
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Load questions based on difficulty
    selectDifficulty(gameSettings.difficulty);
    
    // Update score display for multiple players
    updateScoreDisplay();
}

// Randomly select questions from the chosen difficulty
function selectDifficulty(level) {
  let sourceQuestions = [];
  if (level === "easy") sourceQuestions = [...easyQuestions];
  if (level === "medium") sourceQuestions = [...mediumQuestions];
  if (level === "hard") sourceQuestions = [...hardQuestions];

  // Randomly select questions from the available pool
  questions = getRandomQuestions(sourceQuestions, gameSettings.questionCount);
  shuffleQuestions();
  loadQuestion();
}

// Get random questions from the pool
function getRandomQuestions(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    const scoreText = scores.map((score, index) => `Player ${index + 1}: ${score}`).join(' | ');
    scoreElement.textContent = scoreText;
}
function shuffleQuestions() {
  questions.sort(() => Math.random() - 0.5);
}
function loadQuestion() {
  if (current >= questions.length) {
    endGame();
    return;
  }
  const q = questions[current];
  document.getElementById("question").textContent = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
  document.getElementById("player-turn").textContent = `Player ${
    currentPlayer + 1
  }'s Turn`;
  startTimer();
}
function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("timer").textContent = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      const q = questions[current];
      showNotification(false, "Time's Up! ⏰", `The correct answer was: ${q.answers[q.correct]}`);
      setTimeout(() => {
        nextQuestion();
      }, 2500);
    }
  }, 1000);
}
function checkAnswer(i) {
  clearInterval(timer);
  const q = questions[current];
  if (i === q.correct) {
    correctSound.play();
    showNotification(true, "Correct!", q.funny);
    scores[currentPlayer]++;
  } else {
    wrongSound.play();
    showNotification(false, "Oops!", `The correct answer was: ${q.answers[q.correct]}`);
  }
  
  // Wait for notification to show before continuing
  setTimeout(() => {
    nextQuestion();
  }, 2500);
}
function showGif(type) {
  const gifContainer = document.getElementById("gif-container");
  gifContainer.innerHTML = `<img src="assets/gifs/${type}.gif" alt="${type}" />`;
  setTimeout(() => (gifContainer.innerHTML = ""), 2000);
}

function showNotification(isCorrect, title, message) {
  const card = document.getElementById("notification-card");
  const titleEl = card.querySelector(".notification-title");
  const messageEl = card.querySelector(".notification-message");
  const iconEl = card.querySelector(".notification-icon");
  const closeBtn = card.querySelector(".notification-close");
  
  // Set content
  titleEl.textContent = title;
  messageEl.textContent = message;
  iconEl.textContent = isCorrect ? '✅' : '❌';
  
  // Set style based on correct/wrong and show
  card.className = `notification-card ${isCorrect ? 'correct' : 'wrong'} show`;
  
  // Auto-hide after 2 seconds
  const autoHide = setTimeout(() => {
    hideNotification();
  }, 2000);
  
  // Close button functionality
  closeBtn.onclick = () => {
    clearTimeout(autoHide);
    hideNotification();
  };
  
  // Close on backdrop click
  card.onclick = (e) => {
    if (e.target === card) {
      clearTimeout(autoHide);
      hideNotification();
    }
  };
}

function hideNotification() {
  const card = document.getElementById("notification-card");
  card.classList.remove('show');
  setTimeout(() => {
    card.className = 'notification-card hidden';
  }, 300);
}

function nextQuestion() {
  current++;
  currentPlayer = (currentPlayer + 1) % gameSettings.players;
  updateScoreDisplay();
  loadQuestion();
}
function endGame() {
  // Find the winner(s) for multiple players
  const maxScore = Math.max(...scores);
  const winners = scores.map((score, index) => score === maxScore ? index + 1 : null).filter(player => player !== null);
  
  let winnerText;
  if (winners.length === 1) {
    winnerText = `Player ${winners[0]} wins! 🏆`;
  } else if (winners.length === scores.length) {
    winnerText = "Everyone tied! 🤝";
  } else {
    winnerText = `Players ${winners.join(', ')} tied! 🤝`;
  }
  
  const finalScoreText = scores.map((score, index) => `Player ${index + 1}: ${score}`).join(' | ');
  
  document.getElementById("question").textContent = `Game Over! ${winnerText} Final Score: ${finalScoreText}`;
  document.getElementById("answers").innerHTML = "";
  document.getElementById("timer").textContent = "";
  document.getElementById("player-turn").textContent = "";
  document.getElementById("restart").style.display = "block";
  updateLeaderboard();
}
document.getElementById("restart").onclick = () => {
  // Return to setup screen
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("setup-screen").classList.remove("hidden");
  document.getElementById("restart").style.display = "none";
  
  // Reset game state
  current = 0;
  scores = [];
  currentPlayer = 0;
};
function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  
  const entry = {
    players: gameSettings.players,
    scores: [...scores],
    total: totalScore,
    difficulty: gameSettings.difficulty,
    questions: gameSettings.questionCount,
    date: new Date().toLocaleString(),
  };
  
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.total - a.total);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 10)));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  
  leaderboard.forEach((entry, index) => {
    const li = document.createElement("li");
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
    
    // Handle both old and new leaderboard formats
    let scoresText;
    if (entry.scores) {
      scoresText = entry.scores.map((score, idx) => `P${idx + 1}: ${score}`).join(', ');
    } else {
      scoresText = `P1: ${entry.p1}, P2: ${entry.p2}`;
    }
    
    const difficultyText = entry.difficulty ? ` [${entry.difficulty.toUpperCase()}]` : '';
    li.textContent = `${medal} ${scoresText} (Total: ${entry.total})${difficultyText} - ${entry.date}`;
    list.appendChild(li);
  });
}
