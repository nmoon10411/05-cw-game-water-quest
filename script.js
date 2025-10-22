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

  // random position inside play area
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
    } else {
      score++;
      currentCans.textContent = score;
      checkMilestones(score);
      if (score >= targetScore) endGame(true);
    }
    drop.style.opacity = 0; // fade out
    setTimeout(() => drop.remove(), 150);
  });

  gameGrid.appendChild(drop);

  // Remove after a short time to keep it dynamic
  setTimeout(() => drop.remove(), 2000);
}
