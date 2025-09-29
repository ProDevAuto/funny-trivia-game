let questions = [];
// Questions are now loaded from external files: questions-easy.js, questions-medium.js, questions-hard.js

// Game settings
let gameSettings = {
    players: 1,
    difficulty: 'easy',
  questionCount: 10,
  category: 'any', // 'any' | category id | 'local'
  useAPI: true,    // toggle automatically based on category
  nicknames: []    // player nicknames aligned by index
};

// Allowlist of known category IDs from OpenTDB (defensive validation)
const ALLOWED_CATEGORY_IDS = new Set([9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);

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
  initCornerQR();
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
    ensureNicknamesLength();
    renderNicknameInputs();
            }
            if (this.dataset.difficulty) {
                gameSettings.difficulty = this.dataset.difficulty;
            }
      if (this.dataset.questions) {
                gameSettings.questionCount = parseInt(this.dataset.questions);
            }
      if (this.dataset.category) {
        gameSettings.category = this.dataset.category;
        // If user picks local we disable API usage
        gameSettings.useAPI = this.dataset.category !== 'local';
      }
        });
    });

  // Initial nickname UI
  ensureNicknamesLength();
  renderNicknameInputs();

  // Category dropdown
  const categorySelect = document.getElementById('category-select');
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      const value = categorySelect.value;
      gameSettings.category = value;
      gameSettings.useAPI = value !== 'local';
    });
    // Fetch categories dynamically
    fetchCategories();
  }
    
    // Start game button
    document.getElementById('start-game').addEventListener('click', startGame);

  // Stop game button (added dynamically in game screen)
  const stopBtn = document.getElementById('stop-game');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      stopCurrentGame();
    });
  }
}

/* ===== Corner QR (always visible) ===== */
let cornerQRLastHash = '';
function initCornerQR(){
  renderCornerQR();
  // Hide on small/mobile screens (JS fallback in addition to CSS) or touch-only devices
  if (isLikelyMobile()) {
    const cqr = document.getElementById('corner-qr');
    if (cqr) cqr.style.display = 'none';
  }
  // Re-render QR when settings change via setup buttons or nickname edits
  document.addEventListener('input', e => {
    if(e.target && e.target.id.startsWith('nickname-')) renderCornerQR();
  });
  document.addEventListener('click', e => {
    // Setup buttons change players/diff/questions
    if(e.target.classList && e.target.classList.contains('setup-btn')){
      setTimeout(renderCornerQR, 30);
    }
  });
}
function buildShareUrl(){
  const loc = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set('players', gameSettings.players);
  params.set('difficulty', gameSettings.difficulty);
  params.set('questions', gameSettings.questionCount);
  params.set('category', gameSettings.category);
  if(gameSettings.nicknames && gameSettings.nicknames.length){ params.set('n', gameSettings.nicknames.map(n=> encodeURIComponent(n)).join(',')); }
  return loc + '?' + params.toString();
}
function renderCornerQR(){
  const container = document.querySelector('#corner-qr .corner-qr-inner');
  if(!container) return;
  if (isLikelyMobile()) return; // skip work
  const url = buildShareUrl();
  const hash = url; // simple hash comparison
  if(hash === cornerQRLastHash) return;
  cornerQRLastHash = hash;
  // Replace existing child with <img> pointing to external QR API (real QR code)
  const existing = container.querySelector('img, canvas');
  if(existing) existing.remove();
  const img = document.createElement('img');
  const encoded = encodeURIComponent(url);
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encoded}`;
  img.alt = 'QR code to open this trivia setup on mobile';
  img.width = 120; img.height = 120;
  img.style.width = '120px'; img.style.height = '120px';
  container.appendChild(img);
  container.setAttribute('data-url', url);
}
function isLikelyMobile(){
  return (window.innerWidth <= 820) || ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 1);
}
// Removed local placeholder QR implementation (now using external API image)
// (Removed old modal QR generation function)

// On load, parse URL params to auto-apply settings (deep link)
(function applySettingsFromURL(){
  const sp = new URLSearchParams(window.location.search);
  if(!sp.has('players') && !sp.has('difficulty')) return; // nothing to do
  const players = parseInt(sp.get('players')); if(players>=1 && players<=4){ gameSettings.players = players; }
  const diff = sp.get('difficulty'); if(['easy','medium','hard'].includes(diff)) gameSettings.difficulty = diff;
  const questions = parseInt(sp.get('questions')); if(questions>=1 && questions<=50) gameSettings.questionCount = questions;
  const cat = sp.get('category'); if(cat) { gameSettings.category = cat; gameSettings.useAPI = cat !== 'local'; }
  const n = sp.get('n'); if(n){
    const parts = n.split(',').map(s=> decodeURIComponent(s).slice(0,14));
    gameSettings.nicknames = parts.slice(0,4);
  }
  ensureNicknamesLength();
  // Reflect in UI buttons (idempotent) - direct class toggles
  document.querySelectorAll('[data-players]').forEach(btn=> { btn.classList.toggle('active', parseInt(btn.dataset.players)===gameSettings.players); });
  document.querySelectorAll('[data-difficulty]').forEach(btn=> { btn.classList.toggle('active', btn.dataset.difficulty===gameSettings.difficulty); });
  document.querySelectorAll('[data-questions]').forEach(btn=> { btn.classList.toggle('active', parseInt(btn.dataset.questions)===gameSettings.questionCount); });
  const catSelect = document.getElementById('category-select'); if(catSelect) catSelect.value = gameSettings.category;
  renderNicknameInputs();
})();

async function fetchCategories() {
  const loadingEl = document.getElementById('category-loading');
  try {
    if (loadingEl) loadingEl.textContent = 'Loading categories...';
    const res = await fetch('https://opentdb.com/api_category.php');
    if (!res.ok) throw new Error('Failed to fetch category list');
    const data = await res.json();
    if (!data.trivia_categories) throw new Error('Invalid category payload');
    const select = document.getElementById('category-select');
    if (!select) return;
    // Remove previously injected dynamic options (keep any & local at top)
    // Start adding after first two static options
    data.trivia_categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
    if (loadingEl) loadingEl.textContent = '';
  } catch (e) {
    console.error(e);
    if (loadingEl) loadingEl.textContent = 'Could not load categories (using defaults).';
  }
}

function startGame() {
    // Initialize scores array based on number of players
    scores = new Array(gameSettings.players).fill(0);
    current = 0;
    currentPlayer = 0;
  // Capture latest nickname values before starting
  const nicknameInputs = document.querySelectorAll('.nickname-field input');
  nicknameInputs.forEach((inp, idx) => {
    const val = inp.value.trim();
    if (val) gameSettings.nicknames[idx] = sanitizeNickname(val);
  });
    
    // Hide setup screen and show game screen
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
  // Load questions - API first if enabled
  if (gameSettings.useAPI) {
    fetchAPIQuestions().then(success => {
      if (!success) {
        // Fallback to local
        selectDifficulty(gameSettings.difficulty);
      }
    });
  } else {
    selectDifficulty(gameSettings.difficulty);
  }
    
    // Update score display for multiple players
    updateScoreDisplay();
}

// Gracefully stop an in-progress game and return to setup without saving scores
function stopCurrentGame() {
  clearInterval(timer);
  // Provide brief feedback
  showNotification(false, 'Game Stopped', 'You ended the current session. Returning to setup.');
  setTimeout(() => {
    // Reset basics
    current = 0;
    scores = [];
    currentPlayer = 0;
    questions = [];
    // Hide game, show setup
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    // Clear question/answers UI
    document.getElementById('question').textContent = 'Select settings and start a new game!';
    document.getElementById('answers').innerHTML = '';
    document.getElementById('timer').textContent = '';
    document.getElementById('player-turn').textContent = '';
    document.getElementById('restart').style.display = 'none';
  }, 1200);
}

// Randomly select questions from the chosen difficulty
// ORIGINAL LOCAL QUESTION LOADING (kept for fallback)
function selectDifficulty(level) {
  let sourceQuestions = [];
  if (level === "easy") sourceQuestions = [...easyQuestions];
  if (level === "medium") sourceQuestions = [...mediumQuestions];
  if (level === "hard") sourceQuestions = [...hardQuestions];

  questions = getRandomQuestions(sourceQuestions, gameSettings.questionCount);
  shuffleQuestions();
  loadQuestion();
}

// NEW: Fetch from OpenTDB API
async function fetchAPIQuestions() {
  try {
    const url = buildAPIUrl();
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    if (data.response_code !== 0 || !Array.isArray(data.results) || data.results.length === 0) {
      console.warn('API returned no usable data, falling back');
      return false;
    }
    // Transform API questions to local format
    questions = data.results.map(q => {
      const allAnswers = [...q.incorrect_answers, q.correct_answer];
      // Shuffle answers deterministically per question
      const shuffled = allAnswers
        .map(a => ({ a, sort: Math.random() }))
        .sort((x, y) => x.sort - y.sort)
        .map(o => o.a);
      const correctIndex = shuffled.indexOf(q.correct_answer);
      return {
        question: decodeHTML(q.question),
        answers: shuffled.map(decodeHTML),
        correct: correctIndex,
        funny: generateFunnyLine(q.category)
      };
    });
    shuffleQuestions();
    loadQuestion();
    return true;
  } catch (err) {
    console.error('Failed to fetch API questions', err);
    return false;
  }
}

function decodeHTML(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function buildAPIUrl(){
  const amount = Math.min(Math.max(parseInt(gameSettings.questionCount) || 10, 1), 50); // clamp 1..50
  const base = 'https://opentdb.com/api.php';
  const params = new URLSearchParams();
  params.set('amount', amount.toString());
  if (gameSettings.difficulty && gameSettings.difficulty !== 'any') {
    params.set('difficulty', gameSettings.difficulty);
  }
  if (gameSettings.category && gameSettings.category !== 'any' && gameSettings.category !== 'local') {
    const cid = Number(gameSettings.category);
    if (ALLOWED_CATEGORY_IDS.has(cid)) {
      params.set('category', cid.toString());
    }
  }
  params.set('type', 'multiple');
  return `${base}?${params.toString()}`;
}

function generateFunnyLine(category) {
  const lines = [
    `Category: ${category}. Trivia wizard!`,
    `You conquered ${category}!`,
    `${category} knowledge flex!`,
    `Brains + ${category} = 🔥`,
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

// Get random questions from the pool
function getRandomQuestions(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
  const scoreText = scores.map((score, index) => `${getPlayerLabel(index)}: ${score}`).join(' | ');
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
  // Always use textContent to avoid HTML injection/XSS
  document.getElementById("question").textContent = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans; // ensures plain text
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
  document.getElementById("player-turn").textContent = `Player ${
    getPlayerLabel(currentPlayer)
  }'s Turn`;
  updateProgress();
  hideGif();
  // Smooth scroll to top for the first question (helps after long setup scroll)
  if (current === 0) {
    // Use rAF to ensure DOM has updated before scrolling
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
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
  gifContainer.innerHTML = `<img src="assets/gifs/${type}.gif" alt="${type} feedback" />`;
  gifContainer.classList.add('show');
  setTimeout(() => hideGif(), 2000);
}

function hideGif(){
  const gifContainer = document.getElementById("gif-container");
  gifContainer.classList.remove('show');
  gifContainer.innerHTML = '';
}

function updateProgress(){
  const bar = document.getElementById('progress-bar');
  if(!bar || !questions.length) return;
  const pct = (current / questions.length) * 100;
  bar.style.width = pct + '%';
  const txt = document.getElementById('progress-text');
  if (txt) {
    txt.textContent = `${current} / ${questions.length}`;
  }
  bar.setAttribute('aria-valuenow', Math.round(pct));
  bar.setAttribute('aria-valuetext', `${current} of ${questions.length}`);
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
  
  // Dynamic vertical offset: place below player turn/timer row
  const gameContainer = document.querySelector('.game-container');
  let offset = 0;
  const turnEl = document.getElementById('player-turn');
  if (turnEl) {
    const rect = turnEl.getBoundingClientRect();
    offset = (rect.bottom - (gameContainer?.getBoundingClientRect().top || 0)) + 12; // 12px gap
  } else {
    offset = 16;
  }
  card.style.top = offset + 'px';

  // Set style based on correct/wrong and show (enable pointer events while visible)
  card.className = `notification-card ${isCorrect ? 'correct' : 'wrong'} show`;
  card.style.pointerEvents = 'auto';

  // Optional auto-focus for accessibility
  titleEl.setAttribute('tabindex','-1');
  titleEl.focus({preventScroll:true});

  // Auto-hide after 2.5 seconds
  const autoHide = setTimeout(() => { hideNotification(); }, 2500);
  
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
    card.style.pointerEvents = 'none';
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
  const winners = scores.map((score, index) => score === maxScore ? index : null).filter(player => player !== null);
  
  let winnerText;
  if (winners.length === 1) {
    winnerText = `${getPlayerLabel(winners[0])} wins! 🏆`;
  } else if (winners.length === scores.length) {
    winnerText = "Everyone tied! 🤝";
  } else {
    winnerText = `${winners.map(i=>getPlayerLabel(i)).join(', ')} tied! 🤝`;
  }
  
  const finalScoreText = scores.map((score, index) => `${getPlayerLabel(index)}: ${score}`).join(' | ');
  
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
    nicknames: [...gameSettings.nicknames],
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
      const nicks = entry.nicknames && entry.nicknames.length ? entry.nicknames : [];
      scoresText = entry.scores.map((score, idx) => `${nicks[idx] ? nicks[idx] : 'P'+(idx+1)}: ${score}`).join(', ');
    } else {
      scoresText = `P1: ${entry.p1}, P2: ${entry.p2}`;
    }
    
    const difficultyText = entry.difficulty ? ` [${entry.difficulty.toUpperCase()}]` : '';
    li.textContent = `${medal} ${scoresText} (Total: ${entry.total})${difficultyText} - ${entry.date}`;
    list.appendChild(li);
  });
}

/* ===== Nickname Helpers ===== */
function ensureNicknamesLength(){
  if (!Array.isArray(gameSettings.nicknames)) gameSettings.nicknames = [];
  while (gameSettings.nicknames.length < gameSettings.players) {
    gameSettings.nicknames.push(`Player ${gameSettings.nicknames.length+1}`);
  }
  if (gameSettings.nicknames.length > gameSettings.players) {
    gameSettings.nicknames = gameSettings.nicknames.slice(0, gameSettings.players);
  }
}
function renderNicknameInputs(){
  const wrapper = document.getElementById('nickname-wrapper');
  if(!wrapper) return;
  wrapper.innerHTML = '';
  for(let i=0;i<gameSettings.players;i++){
    const div = document.createElement('div');
    div.className = 'nickname-field';
    const id = `nickname-${i+1}`;
    div.innerHTML = `<label for="${id}">PLAYER ${i+1} NAME</label>`;
    const inp = document.createElement('input');
    inp.id = id;
    inp.maxLength = 14;
    inp.placeholder = `Player ${i+1}`;
    inp.value = gameSettings.nicknames[i] || `Player ${i+1}`;
    inp.addEventListener('input', () => {
      const val = inp.value.trim();
      gameSettings.nicknames[i] = val ? sanitizeNickname(val) : `Player ${i+1}`;
    });
    div.appendChild(inp);
    wrapper.appendChild(div);
  }
  // Add hint
  const hint = document.createElement('div');
  hint.className = 'nickname-hint';
  hint.textContent = 'Customize player nicknames (max 14 chars).';
  wrapper.appendChild(hint);
}
function sanitizeNickname(str){
  // Allow letters, numbers, spaces, limited punctuation
  return str.replace(/[^\w \-!@#$%&*?]/g,'').slice(0,14);
}
function getPlayerLabel(index){
  return gameSettings.nicknames[index] || `Player ${index+1}`;
}
