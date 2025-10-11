// ------- config & state -------
const GOAL_DROPS = 20;
const ROUND_SECONDS = 30;

let currentDrops = 0;
let timeLeft = ROUND_SECONDS;
let gameActive = false;
let spawnInterval = null;
let timerInterval = null;

// ------- dom refs -------
const gridEl = document.querySelector('.game-grid');
const scoreEl = document.getElementById('current-cans');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-game');
const resetBtn = document.getElementById('reset-game');
const msgEl = document.getElementById('achievements');

// ------- messages -------
const WIN = [
  "Amazing! You brought clean water to a community!",
  "You did it! Every drop counts!",
  "Great job! Together, we can make a difference!"
];
const LOSE = [
  "So close! Try again to collect more clean water.",
  "Every drop matters—give it another shot!",
  "Keep going! Clean water is worth the effort!"
];

// ------- build grid -------
function createGrid() {
  gridEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    gridEl.appendChild(cell);
  }
}
createGrid();

// ------- spawn logic -------
function spawnDrop() {
  if (!gameActive) return;

  const cells = [...document.querySelectorAll('.grid-cell')];
  cells.forEach((c) => (c.innerHTML = ''));

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // 25% chance for polluted drop
  const isPolluted = Math.random() < 0.25;
  const img = document.createElement('img');
  img.className = 'water-can';
  img.src = isPolluted ? './img/water-can-transparent.png' : './img/water-can.png';
  img.alt = isPolluted ? 'polluted water drop' : 'clean water drop';
  img.style.filter = isPolluted ? 'grayscale(100%) brightness(0.4)' : 'none';
  randomCell.appendChild(img);

  img.addEventListener('click', () => {
    if (!gameActive) return;
    if (isPolluted) {
      currentDrops = Math.max(0, currentDrops - 2);
      flashEffect(randomCell, 'red');
    } else {
      currentDrops++;
      flashEffect(randomCell, 'aqua');
    }
    scoreEl.textContent = currentDrops;
    img.style.transform = 'scale(.88)';
    setTimeout(() => (img.style.transform = 'scale(1)'), 120);
  });

  // auto-despawn after 900ms
  setTimeout(() => {
    if (randomCell.contains(img)) randomCell.innerHTML = '';
  }, 900);
}

// ------- visual feedback -------
function flashEffect(cell, color) {
  cell.style.boxShadow = `0 0 10px 4px ${color}`;
  setTimeout(() => (cell.style.boxShadow = 'none'), 250);
}

// ------- game flow -------
function startGame() {
  if (gameActive) return;
  gameActive = true;

  currentDrops = 0;
  timeLeft = ROUND_SECONDS;
  scoreEl.textContent = currentDrops;
  timerEl.textContent = timeLeft;
  msgEl.textContent = '';
  msgEl.classList.remove('win-pulse');

  startBtn.disabled = true;
  resetBtn.classList.remove('hidden');

  spawnInterval = setInterval(spawnDrop, 800);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  startBtn.disabled = false;

  if (currentDrops >= GOAL_DROPS) {
    msgEl.textContent = WIN[Math.floor(Math.random() * WIN.length)];
    msgEl.style.color = '#4FCB53';
    msgEl.classList.add('win-pulse');
    confettiEffect();
  } else {
    msgEl.textContent = LOSE[Math.floor(Math.random() * LOSE.length)];
    msgEl.style.color = '#F5402C';
  }
}

function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentDrops = 0;
  timeLeft = ROUND_SECONDS;
  scoreEl.textContent = 0;
  timerEl.textContent = ROUND_SECONDS;
  msgEl.textContent = '';
  msgEl.classList.remove('win-pulse');
  createGrid();
  startBtn.disabled = false;
  resetBtn.classList.add('hidden');
}

// ------- confetti animation -------
function confettiEffect() {
  for (let i = 0; i < 100; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = `${Math.random() * 100}%`;
    conf.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
    conf.style.animationDelay = `${Math.random() * 2}s`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 3000);
  }
}

// ------- events -------
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
