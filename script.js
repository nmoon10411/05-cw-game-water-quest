const gameGrid = document.querySelector('.game-grid');
const currentCans = document.getElementById('current-cans');
const timer = document.getElementById('timer');
const startBtn = document.getElementById('start-game');
const resetBtn = document.getElementById('reset-game');
const achievement = document.getElementById('achievements');
const container = document.querySelector('.container');

// Add difficulty selector
const difficultySelect = document.createElement('select');
difficultySelect.innerHTML = `
  <option value="easy">Easy</option>
  <option value="normal" selected>Normal</option>
  <option value="hard">Hard</option>
`;
container.insertBefore(difficultySelect, container.querySelector('.stats'));

let timeLeft = 30;
let score = 0;
let gameInterval;
let spawnInterval;
let targetScore = 20;
let running = false;

// Configuration for difficulty levels
const MODES = {
  easy: { time: 45, target: 20, spawnRate: 1200, decoys: 0 },
  normal: { time: 35, target: 30, spawnRate: 850, decoys: 0.1 },
  hard: { time: 25, target: 40, spawnRate: 600, decoys: 0.2 }
};

// Milestone messages
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

  if (timeLeft <= 0) {
    endGame(false);
  }
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

  drop.addEventListener('click', () => {
    if (isDecoy) {
      score = Math.max(0, score - 1);
      achievement.textContent = "Oops — that’s dirty water! (-1)";
    } else {
      score++;
      currentCans.textContent = score;
      checkMilestones(score);
      if (score >= targetScore) endGame(true);
    }
    drop.remove();
  });

  gameGrid.appendChild(drop);
  setTimeout(() => drop.remove(), 2000);
}

function checkMilestones(score) {
  const milestone = MESSAGES.find(m => m.score === score);
  if (milestone) {
    achievement.textContent = milestone.msg;
  }
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
