const gameGrid = document.querySelector('.game-grid');
const currentCans = document.getElementById('current-cans');
const timer = document.getElementById('timer');
const startBtn = document.getElementById('start-game');
const resetBtn = document.getElementById('reset-game');
const achievement = document.getElementById('achievements');
const container = document.querySelector('.container');

// Difficulty selector
const difficultySelect = document.createElement('select');
difficultySelect.innerHTML = `
  <option value="easy">Easy</option>
  <option value="normal" selected>Normal</option>
  <option value="hard">Hard</option>
`;
container.insertBefore(difficultySelect, container.querySelector('.stats'));

// Sound effects
const soundGood = new Audio('./waterdrop.mp3');
const soundBad = new Audio('./explosion.wav');
soundGood.volume = 0.8;
soundBad.volume = 0.6;

let timeLeft = 30;
let score = 0;
let gameInterval;
let spawnInterval;
let targetScore = 20;
let running = false;

const MODES = {
  easy: { time: 45, target: 20, spawnRate: 1200, decoys: 0 },
  normal: { time: 35, target: 30, spawnRate: 850, decoys: 0.1 },
  hard: { time: 25, target: 40, spawnRate: 600, decoys: 0.2 }
};

const MESSAGES = [
  { score: 10, msg: "Halfway there! 💪" },
  { score: 20, msg: "Great job — keep going!" },
  { score: 30, msg: "You’re spreading clean water! 🌊" },
  { score: 40, msg: "Amazing! Clean water for all! 💧" }
];

function startGame() {
  if (running) return;
  running = true;

  const mode = difficultySelect.value;
  const cfg = MODES[mode];

  timeLeft = cfg.time;
  targetScore = cfg.target;
  score = 0;
  currentCans.textContent = score;
  timer.textContent = timeLeft;
  achievement.textContent = "";
  gameGrid.innerHTML = "";

  startBtn.classList.add('hidden');
  resetBtn.classList.remove('hidden');
  difficultySelect.disabled = true;

  gameInterval = setInterval(updateTimer, 1000);
  spawnInterval = setInterval(() => spawnDrop(cfg), cfg.spawnRate);
}

function updateTimer() {
  timeLeft--;
  timer.textContent = timeLeft;
  if (timeLeft <= 0) endGame(false);
}

function spawnDrop(cfg) {
  const drop = document.createElement('div');
  const isDecoy = Math.random() < cfg.decoys;
  drop.classList.add('drop');
  if (isDecoy) {
    drop.classList.add('decoy');
    drop.textContent = "🛢️";
  } else {
    drop.textContent = "💧";
  }

  const maxX = gameGrid.clientWidth - 60;
  const maxY = gameGrid.clientHeight - 60;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;

  drop.addEventListener('click', () => {
    if (isDecoy) {
      score = Math.max(0, score - 1);
      achievement.textContent = "Oops — that’s dirty water! (-1)";
      createSplash('bad', x + 30, y + 30);
      soundBad.currentTime = 0;
      soundBad.play();
    } else {
      score++;
      currentCans.textContent = score;
      checkMilestones(score);
      createSplash('good', x + 30, y + 30);
      soundGood.currentTime = 0;
      soundGood.play();
      if (score >= targetScore) endGame(true);
    }
    drop.style.opacity = 0;
    setTimeout(() => drop.remove(), 150);
  });

  gameGrid.appendChild(drop);
  setTimeout(() => drop.remove(), 2000);
}

function createSplash(variant, x, y) {
  const splash = document.createElement('div');
  splash.classList.add('splash', variant === 'bad' ? 'splash--bad' : 'splash--good');
  splash.style.left = `${x}px`;
  splash.style.top = `${y}px`;
  gameGrid.appendChild(splash);
  setTimeout(() => splash.remove(), 650);
}

function checkMilestones(score) {
  const milestone = MESSAGES.find(m => m.score === score);
  if (milestone) achievement.textContent = milestone.msg;
}

function endGame(win) {
  running = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  achievement.textContent = win
    ? "You did it! 🎉 Clean water for everyone!"
    : "Time’s up — try again!";
  startBtn.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  difficultySelect.disabled = false;
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  running = false;
  score = 0;
  currentCans.textContent = 0;
  timer.textContent = MODES[difficultySelect.value].time;
  achievement.textContent = "";
  gameGrid.innerHTML = "";
  startBtn.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  difficultySelect.disabled = false;
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
