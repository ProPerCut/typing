/* =========================================================
   TYPE//TUTOR — Sky Fall typing game
   Made by Hasan Abdullah
   ========================================================= */

function createSkyFallGame(opts) {
  // opts: { container, pool, fallDuration, spawnInterval, lives, onTick, onKey, onEnd, timeLimitMs }
  const state = {
    tiles: [],          // queue of { id, text, typed, el, startTime }
    lives: opts.lives || 5,
    score: 0,
    combo: 0,
    correctChars: 0,
    wrongChars: 0,
    startedAt: Date.now(),
    spawnTimer: null,
    rafId: null,
    running: true,
    nextId: 1
  };

  const container = opts.container;
  container.innerHTML = "";
  const stage = document.createElement("div");
  stage.className = "game-stage";
  const hud = document.createElement("div");
  hud.className = "game-hud";
  hud.innerHTML = `
    <div class="game-hud-item">⭐ <span class="game-score">0</span></div>
    <div class="game-hud-item game-lives">❤❤❤❤❤</div>
    <div class="game-hud-item">🔥 <span class="game-combo">0</span></div>
  `;
  container.appendChild(hud);
  container.appendChild(stage);

  function renderLives() {
    hud.querySelector(".game-lives").textContent = "❤".repeat(Math.max(0, state.lives)) + "🖤".repeat(Math.max(0, (opts.lives || 5) - state.lives));
  }
  function renderScore() {
    hud.querySelector(".game-score").textContent = state.score;
    hud.querySelector(".game-combo").textContent = state.combo;
  }
  renderLives(); renderScore();

  function spawnTile() {
    if (!state.running) return;
    const text = opts.pool[Math.floor(Math.random() * opts.pool.length)];
    const el = document.createElement("div");
    el.className = "sky-tile";
    el.style.left = (8 + Math.random() * 76) + "%";
    el.style.animationDuration = opts.fallDuration + "ms";
    stage.appendChild(el);
    const tile = { id: state.nextId++, text, typed: "", el, startTime: performance.now() };
    state.tiles.push(tile);
    renderTile(tile);
    if (state.tiles.length === 1 && opts.onFront) opts.onFront(tile);
  }

  function renderTile(tile) {
    const isFront = state.tiles[0] === tile;
    let html = "";
    for (let i = 0; i < tile.text.length; i++) {
      const ch = tile.text[i] === " " ? "&nbsp;" : tile.text[i];
      let cls = "ch-pending";
      if (i < tile.typed.length) cls = "ch-correct";
      else if (i === tile.typed.length && isFront) cls = "ch-current";
      html += `<span class="${cls}">${ch}</span>`;
    }
    tile.el.innerHTML = html;
    tile.el.classList.toggle("sky-tile-active", isFront);
  }

  function frontTile() { return state.tiles[0] || null; }

  function checkFallen() {
    state.tiles.forEach(tile => {
      const rect = tile.el.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      if (rect.top - stageRect.top >= stageRect.height - 6) {
        tile.fell = true;
      }
    });
    const fallen = state.tiles.filter(t => t.fell);
    if (fallen.length) {
      fallen.forEach(t => {
        t.el.remove();
        state.lives -= 1;
        state.combo = 0;
      });
      state.tiles = state.tiles.filter(t => !t.fell);
      renderLives(); renderScore();
      if (state.tiles[0]) renderTile(state.tiles[0]);
      if (state.lives <= 0) return endGame();
    }
    if (state.running) state.rafId = requestAnimationFrame(checkFallen);
  }

  function handleChar(ch) {
    if (!state.running) return;
    const tile = frontTile();
    if (!tile) return;
    const expected = tile.text[tile.typed.length];
    if (ch === expected) {
      tile.typed += ch;
      state.correctChars++;
      if (opts.onKey) opts.onKey(true, tile.text[tile.typed.length]);
      if (tile.typed.length === tile.text.length) {
        state.combo++;
        state.score += 10 * Math.max(1, state.combo);
        tile.el.classList.add("sky-tile-pop");
        setTimeout(() => tile.el.remove(), 220);
        state.tiles.shift();
        if (state.tiles[0]) { renderTile(state.tiles[0]); if (opts.onFront) opts.onFront(state.tiles[0]); }
        else if (opts.onFront) opts.onFront(null);
      } else {
        renderTile(tile);
      }
    } else {
      state.wrongChars++;
      state.combo = 0;
      if (opts.onKey) opts.onKey(false, expected);
      tile.el.classList.add("sky-tile-shake");
      setTimeout(() => tile.el.classList.remove("sky-tile-shake"), 200);
    }
    renderScore();
  }

  function endGame() {
    if (!state.running) return;
    state.running = false;
    clearInterval(state.spawnTimer);
    if (state.rafId) cancelAnimationFrame(state.rafId);
    const elapsedMin = Math.max((Date.now() - state.startedAt) / 60000, 1 / 60);
    const totalTyped = state.correctChars + state.wrongChars;
    const accuracy = totalTyped ? Math.max(0, Math.round((state.correctChars / totalTyped) * 100)) : 100;
    const wpm = Math.round((state.correctChars / 5) / elapsedMin);
    if (opts.onEnd) opts.onEnd({ accuracy, wpm, score: state.score });
  }

  state.spawnTimer = setInterval(spawnTile, opts.spawnInterval);
  spawnTile();
  state.rafId = requestAnimationFrame(checkFallen);

  if (opts.timeLimitMs) {
    setTimeout(() => endGame(), opts.timeLimitMs);
  }

  return {
    handleChar,
    stop: endGame,
    isRunning: () => state.running
  };
}
