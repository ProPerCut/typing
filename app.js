/* =========================================================
   TYPE//TUTOR — app logic
   Made by Hasan Abdullah
   ========================================================= */

/* ---------------- curriculum (built once, same for everyone) ---------------- */

const CURRICULUM = buildCurriculum();               // array of day objects
const ALL_LESSONS = CURRICULUM.flatMap(d => d.lessons);
const LESSON_BY_ID = {};
ALL_LESSONS.forEach(l => { LESSON_BY_ID[l.id] = l; });
const DAY_BY_NUM = {};
CURRICULUM.forEach(d => { DAY_BY_NUM[d.dayNum] = d; });

const DEFAULT_PROGRESS = {
  completed: {}, stars: {}, history: [], streak: 0, lastDate: null,
  bestWpm: 0, bestAccuracy: 0, certName: "", errorCounts: {}, gamesPlayed: 0
};
const DEFAULT_SETTINGS = { sound: true, fontSize: 22 };

/* ---------------- user / storage ---------------- */

let currentUserId = null;
let progress = null;
let settings = null;

function generateGuestId() {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TT-${seg()}-${seg()}`;
}
function progressKey(id) { return `tt_progress_${id}`; }
function settingsKey(id) { return `tt_settings_${id}`; }

function loadProgressFor(id) {
  try { return Object.assign({}, DEFAULT_PROGRESS, JSON.parse(localStorage.getItem(progressKey(id)))); }
  catch (e) { return Object.assign({}, DEFAULT_PROGRESS); }
}
function loadSettingsFor(id) {
  try { return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(settingsKey(id)))); }
  catch (e) { return Object.assign({}, DEFAULT_SETTINGS); }
}
function saveProgress() { if (currentUserId) localStorage.setItem(progressKey(currentUserId), JSON.stringify(progress)); }
function saveSettings() { if (currentUserId) localStorage.setItem(settingsKey(currentUserId), JSON.stringify(settings)); }

function loginAs(id) {
  currentUserId = id.trim();
  localStorage.setItem("tt_last_user", currentUserId);
  progress = loadProgressFor(currentUserId);
  settings = loadSettingsFor(currentUserId);
  document.getElementById("gateView").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  initApp();
}

function logout() {
  currentUserId = null;
  document.getElementById("app").classList.add("hidden");
  document.getElementById("gateNewIdBlock").classList.add("hidden");
  document.getElementById("gateLoginBlock").classList.remove("hidden");
  document.getElementById("gateView").classList.remove("hidden");
}

/* ---------------- sound ---------------- */

let audioCtx = null;
function playSound(type) {
  if (!settings.sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.value = type === "error" ? 160 : type === "complete" ? 660 : 440;
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) { /* ignore */ }
}

/* ---------------- hand SVGs ---------------- */

const FINGER_DEFS = [
  { name: "index", x: 38, y: 42, w: 20, h: 72, rx: 10, rot: -6, cx: 48, cy: 114 },
  { name: "middle", x: 63, y: 28, w: 20, h: 88, rx: 10, rot: 0, cx: 73, cy: 116 },
  { name: "ring", x: 88, y: 40, w: 20, h: 76, rx: 10, rot: 7, cx: 98, cy: 116 },
  { name: "pinky", x: 111, y: 58, w: 17, h: 60, rx: 8.5, rot: 14, cx: 119, cy: 118 },
  { name: "thumb", x: 0, y: 98, w: 34, h: 50, rx: 17, rot: 38, cx: 17, cy: 123 }
];
const FINGER_NAME_MAP = { LP: "pinky", LR: "ring", LM: "middle", LI: "index", RI: "index", RM: "middle", RR: "ring", RP: "pinky" };

function buildHandSVG(side) {
  const parts = [`<svg class="hand-svg" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">`];
  parts.push(`<rect class="palm" x="25" y="105" width="110" height="85" rx="34"></rect>`);
  FINGER_DEFS.forEach(f => {
    let x = f.x, rot = f.rot, cx = f.cx;
    if (side === "L") { x = 160 - f.x - f.w; rot = -f.rot; cx = 160 - f.cx; }
    const id = `finger-${side}-${f.name}`;
    parts.push(`<rect class="finger" id="${id}" x="${x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="${f.rx}" transform="rotate(${rot} ${cx} ${f.cy})"></rect>`);
  });
  parts.push(`</svg>`);
  return parts.join("");
}
function renderHands() { document.getElementById("handsContainer").innerHTML = buildHandSVG("L") + buildHandSVG("R"); }

function fingerElId(code) {
  if (code === "TH") return null; // handled separately (two elements)
  const side = code.startsWith("L") ? "L" : "R";
  return `finger-${side}-${FINGER_NAME_MAP[code]}`;
}
function resetHandHighlight() {
  document.querySelectorAll(".finger").forEach(el => {
    el.classList.remove("finger-active", "finger-rest");
    el.style.fill = "";
  });
}
function highlightFinger(fingerCode) {
  resetHandHighlight();
  if (!fingerCode) return;
  const color = FINGER_COLORS[fingerCode];
  if (fingerCode === "TH") {
    ["finger-L-thumb", "finger-R-thumb"].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.add("finger-active"); el.style.fill = color; }
    });
    return;
  }
  const el = document.getElementById(fingerElId(fingerCode));
  if (el) { el.classList.add("finger-active"); el.style.fill = color; }
}

// steady "resting" glow on all home-row fingers, plus a strong pulse on target key(s)
function showIntroHighlight(keys) {
  resetHandHighlight();
  HOME_ROW_FINGERS.forEach(f => {
    const el = document.getElementById(fingerElId(f));
    if (el) { el.classList.add("finger-rest"); el.style.fill = FINGER_COLORS[f] + "66"; }
  });
  ["finger-L-thumb", "finger-R-thumb"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add("finger-rest"); el.style.fill = FINGER_COLORS.TH + "66"; }
  });
  (keys || []).forEach(k => {
    const info = resolveKeyInfo(k);
    if (!info) return;
    const f = KEY_FINGER[info.key];
    const el = document.getElementById(fingerElId(f));
    if (el) { el.classList.add("finger-active"); el.style.fill = FINGER_COLORS[f]; }
  });
  updateKeyboardIntroMarks(keys || []);
}

/* ---------------- keyboard render ---------------- */

function renderKeyboard() {
  const el = document.getElementById("keyboardContainer");
  el.innerHTML = "";
  KEYBOARD_ROWS.forEach((row, ri) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "kb-row";
    if (ri === 0) {
      const ghost = document.createElement("div");
      ghost.className = "key key-wide key-ghost";
      ghost.textContent = "tab";
      rowDiv.appendChild(ghost);
    }
    row.forEach(k => {
      const keyDiv = document.createElement("div");
      keyDiv.className = "key" + (HOME_ROW_KEYS.includes(k) ? " key-home" : "");
      keyDiv.id = "kb-" + (k === " " ? "space" : k.replace(/[^a-z0-9]/gi, (c) => "c" + c.charCodeAt(0)));
      keyDiv.dataset.key = k;
      keyDiv.textContent = k;
      rowDiv.appendChild(keyDiv);
    });
    el.appendChild(rowDiv);
  });
  const shiftRow = document.createElement("div");
  shiftRow.className = "kb-row";
  shiftRow.innerHTML = `
    <div class="key key-wide" id="kb-shift-left">shift</div>
    <div class="key key-space" id="kb-space" data-key=" "></div>
    <div class="key key-wide" id="kb-shift-right">shift</div>
  `;
  el.appendChild(shiftRow);
}

function keyElFor(key) {
  return key === " " ? document.getElementById("kb-space")
    : Array.from(document.querySelectorAll(".key")).find(el => el.dataset.key === key);
}

function updateKeyboardHighlight(nextChar) {
  document.querySelectorAll(".key").forEach(k => { k.classList.remove("key-active"); k.style.borderColor = ""; k.style.boxShadow = ""; });
  document.getElementById("kb-shift-left").classList.remove("key-active");
  document.getElementById("kb-shift-right").classList.remove("key-active");
  if (!nextChar) { highlightFinger(null); return; }
  const info = resolveKeyInfo(nextChar);
  if (!info) { highlightFinger(null); return; }
  const finger = KEY_FINGER[info.key];
  const color = FINGER_COLORS[finger];
  const target = keyElFor(info.key);
  if (target) {
    target.classList.add("key-active");
    target.style.borderColor = color;
    target.style.boxShadow = `0 0 0 2px ${color}55`;
  }
  if (info.shift) {
    const side = finger.startsWith("L") ? "kb-shift-right" : "kb-shift-left";
    document.getElementById(side).classList.add("key-active");
  }
  highlightFinger(finger);
}

function updateKeyboardIntroMarks(keys) {
  document.querySelectorAll(".key").forEach(k => { k.classList.remove("key-active"); k.style.borderColor = ""; k.style.boxShadow = ""; });
  keys.forEach(k => {
    const info = resolveKeyInfo(k);
    if (!info) return;
    const color = FINGER_COLORS[KEY_FINGER[info.key]];
    const target = keyElFor(info.key);
    if (target) { target.classList.add("key-active"); target.style.borderColor = color; target.style.boxShadow = `0 0 0 3px ${color}66`; }
  });
}

function renderLegend() {
  const el = document.getElementById("legendContainer");
  el.innerHTML = Object.keys(FINGER_NAMES).map(f =>
    `<div class="legend-item"><span class="legend-dot" style="background:${FINGER_COLORS[f]}"></span>${FINGER_NAMES[f]}</div>`
  ).join("");
}

/* ---------------- sidebar (weeks/days) ---------------- */

function renderSidebar() {
  const el = document.getElementById("sidebarList");
  el.innerHTML = "";
  for (let w = 1; w <= 8; w++) {
    const weekDays = CURRICULUM.filter(d => d.weekNum === w);
    if (!weekDays.length) continue;
    const block = document.createElement("div");
    block.className = "sb-week";
    const title = document.createElement("div");
    title.className = "sb-week-title";
    title.textContent = `Week ${w}`;
    block.appendChild(title);
    weekDays.forEach(day => {
      const done = day.lessons.length && day.lessons.every(l => progress.completed[l.id]);
      const partial = !done && day.lessons.some(l => progress.completed[l.id]);
      const btn = document.createElement("button");
      btn.className = "sb-day-btn" + (day.dayNum === currentDayNum ? " sb-day-active" : "");
      btn.innerHTML = `<span class="sb-day-dot ${done ? "done" : partial ? "partial" : ""}"></span><span>Day ${day.dayNum} · ${day.label}</span>`;
      btn.addEventListener("click", () => openDayView(day.dayNum));
      block.appendChild(btn);
    });
    el.appendChild(block);
  }
}

/* ---------------- dashboard ---------------- */

function renderCalendar() {
  const el = document.getElementById("calendarGrid");
  el.innerHTML = "";
  for (let w = 1; w <= 8; w++) {
    const weekDays = CURRICULUM.filter(d => d.weekNum === w);
    if (!weekDays.length) continue;
    const row = document.createElement("div");
    row.className = "calendar-week";
    const label = document.createElement("div");
    label.className = "calendar-week-label";
    label.textContent = `Week ${w}`;
    row.appendChild(label);
    const days = document.createElement("div");
    days.className = "calendar-days";
    weekDays.forEach(day => {
      const doneCount = day.lessons.filter(l => progress.completed[l.id]).length;
      const pct = day.lessons.length ? Math.round((doneCount / day.lessons.length) * 100) : 0;
      const card = document.createElement("div");
      card.className = "day-card" + (day.kind === "review" ? " is-review" : "") + (day.kind === "final" ? " is-final" : "");
      card.innerHTML = `
        <div class="day-card-num">Day ${day.dayNum}</div>
        <div class="day-card-label">${day.label}</div>
        <div class="day-card-bar"><div class="day-card-bar-fill" style="width:${pct}%"></div></div>
      `;
      card.addEventListener("click", () => openDayView(day.dayNum));
      days.appendChild(card);
    });
    row.appendChild(days);
    el.appendChild(row);
  }
}

function renderBadges() {
  const el = document.getElementById("badgeGrid");
  const earned = BADGES.filter(b => b.check(progress));
  el.innerHTML = BADGES.map(b =>
    `<div class="badge-chip${earned.includes(b) ? " badge-on" : ""}" title="${b.desc}">&#127942; ${b.label}</div>`
  ).join("");
  document.getElementById("badgeVal").textContent = earned.length;
}

function renderSparkline() {
  const svg = document.getElementById("sparkline");
  const emptyMsg = document.getElementById("sparklineEmpty");
  const data = progress.history.slice(-20);
  if (data.length < 2) { svg.innerHTML = ""; emptyMsg.classList.remove("hidden"); return; }
  emptyMsg.classList.add("hidden");
  const w = 400, h = 140, pad = 10;
  const max = Math.max(...data.map(d => d.wpm), 10);
  const stepX = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.wpm / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  svg.innerHTML = `
    <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="2.5"></polyline>
    ${data.map((d, i) => { const x = pad + i * stepX; const y = h - pad - (d.wpm / max) * (h - pad * 2); return `<circle cx="${x}" cy="${y}" r="3" fill="var(--accent)"></circle>`; }).join("")}
  `;
}

function renderDashboard() {
  const total = ALL_LESSONS.length;
  const done = Object.keys(progress.completed).length;
  const pct = Math.round((done / total) * 100);
  document.getElementById("progressPct").textContent = pct + "%";
  document.getElementById("progressText").textContent = `${done} of ${total} lessons complete`;
  document.getElementById("streakVal").textContent = progress.streak;
  renderCalendar();
  renderBadges();
  renderSparkline();
}

function showView(name) {
  ["dashboardView", "dayView", "lessonView", "certView"].forEach(id => {
    document.getElementById(id).classList.toggle("hidden", id !== name);
  });
}

/* ---------------- day view ---------------- */

let currentDayNum = null;

const LESSON_TYPE_ICON = { intro: "🖐️", drill: "⌨️", words: "🔤", sentences: "📝", game: "🎮", test: "⏱️", certificate: "🏆" };

function openDayView(dayNum) {
  currentDayNum = dayNum;
  const day = DAY_BY_NUM[dayNum];
  showView("dayView");
  document.getElementById("dayViewTitle").textContent = `Day ${dayNum} — ${day.label}`;
  const list = document.getElementById("dayLessonList");
  list.innerHTML = "";
  day.lessons.forEach(lesson => {
    const done = progress.completed[lesson.id];
    const stars = progress.stars[lesson.id] || 0;
    const card = document.createElement("div");
    card.className = "lesson-card";
    card.innerHTML = `
      <div class="lesson-card-icon">${LESSON_TYPE_ICON[lesson.type] || "•"}</div>
      <div class="lesson-card-body">
        <div class="lesson-card-title">${lesson.title}</div>
        <div class="lesson-card-sub">${lesson.type === "game" ? "Mini-game" : lesson.type}${done ? " · done" : ""}</div>
      </div>
      ${done ? `<div class="lesson-card-stars">${"&#9733;".repeat(stars)}</div>` : ""}
    `;
    card.addEventListener("click", () => startLesson(lesson.id));
    list.appendChild(card);
  });
  renderSidebar();
}

/* ---------------- lesson session (drill / words / sentences / test / certificate) ---------------- */

let session = null;
let currentGame = null;

function goToNextLesson(fromId) {
  const idx = ALL_LESSONS.findIndex(l => l.id === fromId);
  const next = idx >= 0 ? ALL_LESSONS[idx + 1] : null;
  if (next) startLesson(next.id);
  else if (currentDayNum) openDayView(currentDayNum);
  else exitLesson();
}

function startLesson(id) {
  const lesson = LESSON_BY_ID[id] || (id === "weak" ? window.__weakLesson : null);
  if (!lesson) return;
  if (lesson.day) currentDayNum = lesson.day;
  showView("lessonView");
  document.getElementById("lessonTitle").textContent = lesson.title;
  document.getElementById("lessonStatsBar").classList.remove("hidden");
  document.getElementById("roundBar").classList.remove("hidden");
  document.getElementById("introStage").classList.add("hidden");
  document.getElementById("passageWrap").classList.add("hidden");
  document.getElementById("gameStageWrap").classList.add("hidden");

  if (lesson.type === "intro") { startIntroLesson(lesson); return; }
  if (lesson.type === "game") { startGameLesson(lesson); return; }

  document.getElementById("passageWrap").classList.remove("hidden");
  const roundsTotal = lesson.bank ? lesson.bank.length : lesson.rounds();
  session = {
    lesson, roundsTotal, currentRound: 0,
    order: lesson.bank ? shuffle(lesson.bank) : null,
    roundStats: [], target: "", typed: "", startTime: null, errorMap: {}, timerId: null, finished: false
  };
  loadRound();
}

function currentRoundText() {
  const { lesson, order, currentRound } = session;
  if (order) return order[currentRound % order.length];
  return lesson.gen();
}

function loadRound() {
  session.target = currentRoundText();
  session.typed = "";
  session.startTime = null;
  session.errorMap = {};
  clearInterval(session.timerId);
  document.getElementById("roundText").textContent = `Round ${session.currentRound + 1} / ${session.roundsTotal}`;
  document.getElementById("roundFill").style.width = Math.round((session.currentRound / session.roundsTotal) * 100) + "%";
  renderPassage();
  updateStatsDisplay();
  const input = document.getElementById("hiddenInput");
  input.value = "";
  input.focus();
  updateKeyboardHighlight(session.target[0]);
}

function renderPassage() {
  const { target, typed } = session;
  const el = document.getElementById("passageEl");
  let html = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i] === " " ? "&nbsp;" : escapeHtml(target[i]);
    let cls = "ch-pending";
    if (i < typed.length) cls = typed[i] === target[i] ? "ch-correct" : "ch-wrong";
    else if (i === typed.length) cls = "ch-current";
    html += `<span class="${cls}">${ch}</span>`;
  }
  el.innerHTML = html;
}
function escapeHtml(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function updateStatsDisplay() {
  const { target, typed, startTime } = session;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
  const accuracy = typed.length ? Math.max(0, Math.round((correct / typed.length) * 100)) : 100;
  const minutes = startTime ? Math.max((Date.now() - startTime) / 60000, 1 / 60) : 1 / 60;
  const wpm = typed.length ? Math.round((correct / 5) / minutes) : 0;
  document.getElementById("statWpm").innerHTML = `${wpm} <b>WPM</b>`;
  document.getElementById("statAcc").innerHTML = `${accuracy}% <b>ACC</b>`;
  const secs = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  document.getElementById("statTime").textContent = secs + "s";
  return { accuracy, wpm };
}

function onHiddenInputChange(e) {
  if (!session || session.finished) return;
  let val = e.target.value;
  if (val.length > session.target.length) val = val.slice(0, session.target.length);
  if (!session.startTime && val.length > 0) {
    session.startTime = Date.now();
    session.timerId = setInterval(() => { updateStatsDisplay(); checkTestTimeLimit(); }, 250);
  }
  if (val.length > session.typed.length) {
    const i = val.length - 1;
    if (val[i] !== session.target[i]) {
      playSound("error");
      session.errorMap[session.target[i]] = (session.errorMap[session.target[i]] || 0) + 1;
      progress.errorCounts[session.target[i]] = (progress.errorCounts[session.target[i]] || 0) + 1;
    } else {
      playSound("key");
    }
  }
  session.typed = val;
  renderPassage();
  const { accuracy, wpm } = updateStatsDisplay();
  updateKeyboardHighlight(session.target[session.typed.length]);
  if (val.length === session.target.length) {
    setTimeout(() => finishRound(accuracy, wpm), 150);
  }
}

function checkTestTimeLimit() {
  const lesson = session.lesson;
  if (lesson.type === "test" && lesson.timeLimit && session.startTime) {
    const elapsed = (Date.now() - session.startTime) / 1000;
    if (elapsed >= lesson.timeLimit) {
      const stats = updateStatsDisplay();
      finishRound(stats.accuracy, stats.wpm);
    }
  }
}

function finishRound(accuracy, wpm) {
  if (session.finished) return;
  clearInterval(session.timerId);
  session.roundStats.push({ accuracy, wpm });
  session.currentRound++;
  if (session.currentRound < session.roundsTotal) {
    showRoundToast(`Round ${session.currentRound} of ${session.roundsTotal} done`);
    setTimeout(() => loadRound(), 500);
  } else {
    finishLesson();
  }
}

function showRoundToast(text) {
  const toast = document.getElementById("roundToast");
  toast.textContent = text;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 900);
}

function recordCompletion(lessonId, accuracy, wpm, stars) {
  const today = todayISO();
  if (progress.lastDate !== today) {
    const diff = progress.lastDate ? daysBetween(progress.lastDate, today) : 1;
    progress.streak = diff === 1 ? progress.streak + 1 : (diff === 0 ? progress.streak : 1);
  }
  progress.lastDate = today;
  progress.completed[lessonId] = true;
  progress.stars[lessonId] = Math.max(progress.stars[lessonId] || 0, stars);
  progress.history.push({ date: today, wpm, accuracy });
  progress.bestWpm = Math.max(progress.bestWpm, wpm);
  progress.bestAccuracy = Math.max(progress.bestAccuracy, accuracy);
  saveProgress();
}

function finishLesson() {
  session.finished = true;
  playSound("complete");
  const avgAcc = Math.round(session.roundStats.reduce((s, r) => s + r.accuracy, 0) / session.roundStats.length);
  const avgWpm = Math.round(session.roundStats.reduce((s, r) => s + r.wpm, 0) / session.roundStats.length);
  const stars = computeStars(avgAcc, avgWpm);
  document.getElementById("roundFill").style.width = "100%";
  recordCompletion(session.lesson.id, avgAcc, avgWpm, stars);
  showCompleteModal(avgWpm, avgAcc, stars, session.lesson.id === "cert");
}

function showCompleteModal(wpm, acc, stars, isCert) {
  document.getElementById("resWpm").textContent = wpm;
  document.getElementById("resAcc").textContent = acc + "%";
  document.getElementById("starsEl").innerHTML = [1, 2, 3].map(i => `<span class="${i <= stars ? "star-on" : ""}">&#9733;</span>`).join("");
  document.getElementById("lessonCompleteModal").classList.remove("hidden");
  if (isCert) {
    setTimeout(() => { document.getElementById("lessonCompleteModal").classList.add("hidden"); showCertificate(); }, 400);
  }
}

function exitLesson() {
  clearInterval(session && session.timerId);
  if (currentGame) { currentGame.stop(); currentGame = null; }
  document.getElementById("lessonCompleteModal").classList.add("hidden");
  if (currentDayNum) openDayView(currentDayNum);
  else { showView("dashboardView"); renderSidebar(); renderDashboard(); }
}

function retryLesson() {
  document.getElementById("lessonCompleteModal").classList.add("hidden");
  startLesson(session ? session.lesson.id : (currentGame && currentGame._lessonId));
}

function continueFromModal() {
  document.getElementById("lessonCompleteModal").classList.add("hidden");
  const lastId = session ? session.lesson.id : window.__lastGameLessonId;
  if (lastId === "cert") { exitLesson(); return; }
  goToNextLesson(lastId);
}

/* ---------------- intro (finger placement) lessons ---------------- */

function startIntroLesson(lesson) {
  session = null;
  document.getElementById("roundBar").classList.add("hidden");
  document.getElementById("lessonStatsBar").classList.add("hidden");
  document.getElementById("introStage").classList.remove("hidden");

  const heading = document.getElementById("introHeading");
  const text = document.getElementById("introText");
  const keysEl = document.getElementById("introKeys");

  if (lesson.introKind === "shift") {
    heading.textContent = "Shift & Capitals";
    text.textContent = "To type a capital letter, hold Shift with the pinky on the opposite hand while the other hand presses the letter — left pinky for right-side letters, right pinky for left-side ones.";
    keysEl.innerHTML = `<div class="intro-key-chip">⇧ Shift</div>`;
    resetHandHighlight();
    document.getElementById("kb-shift-left").classList.add("key-active");
    document.getElementById("kb-shift-right").classList.add("key-active");
    highlightFinger("LP");
  } else {
    const keys = lesson.introKeys || [];
    heading.textContent = lesson.title;
    if (lesson.day === 1) {
      text.textContent = `Before you start, rest all ten fingers on the home row: left hand on A S D F, right hand on J K L ; — thumbs resting on the space bar. Today's first two keys, "${keys[0]}" and "${keys[1]}", are pressed by your index fingers without moving the rest of your hand.`;
    } else {
      text.textContent = `Keep your fingers resting on the home row. Reach out only with the highlighted finger(s) to press "${keys.join('" and "')}".`;
    }
    keysEl.innerHTML = keys.map(k => `<div class="intro-key-chip">${k === " " ? "space" : k}</div>`).join("");
    showIntroHighlight(keys);
  }

  document.getElementById("introContinueBtn").onclick = () => {
    progress.completed[lesson.id] = true;
    progress.stars[lesson.id] = Math.max(progress.stars[lesson.id] || 0, 3);
    saveProgress();
    goToNextLesson(lesson.id);
  };
}

/* ---------------- game lessons ---------------- */

function startGameLesson(lesson) {
  session = null;
  document.getElementById("roundBar").classList.add("hidden");
  document.getElementById("lessonStatsBar").classList.add("hidden");
  document.getElementById("gameStageWrap").classList.remove("hidden");
  window.__lastGameLessonId = lesson.id;

  const content = lesson.gen();
  updateKeyboardHighlight(null);
  currentGame = createSkyFallGame({
    container: document.getElementById("gameContainer"),
    pool: content.pool,
    fallDuration: content.fallDuration,
    spawnInterval: content.spawnInterval,
    lives: content.lives,
    onFront: (tile) => updateKeyboardHighlight(tile ? tile.text[tile.typed.length] : null),
    onKey: (correct) => playSound(correct ? "key" : "error"),
    onEnd: (stats) => finishGameLesson(lesson, stats)
  });
  currentGame._lessonId = lesson.id;

  const input = document.getElementById("gameHiddenInput");
  input.value = "";
  input.focus();
  input.oninput = (e) => {
    const chars = e.target.value.split("");
    chars.forEach(ch => currentGame && currentGame.handleChar(ch));
    e.target.value = "";
  };
}

function finishGameLesson(lesson, stats) {
  playSound("complete");
  const stars = computeStars(stats.accuracy, stats.wpm);
  progress.gamesPlayed = (progress.gamesPlayed || 0) + 1;
  recordCompletion(lesson.id, stats.accuracy, stats.wpm, stars);
  showCompleteModal(stats.wpm, stats.accuracy, stars, false);
}

/* ---------------- weak key drill ---------------- */

function startWeakDrill() {
  const entries = Object.entries(progress.errorCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]);
  const keys = entries.length ? entries : "etaoinshrdlu".split("").slice(0, 8);
  currentDayNum = null;
  window.__weakLesson = { id: "weak", title: "Weak Key Drill", type: "drill", bank: null, rounds: () => 12, gen: () => weightedDrill(keys, []) };
  startLesson("weak");
}

/* ---------------- certificate ---------------- */

function showCertificate() {
  showView("certView");
  document.getElementById("certNameInput").value = progress.certName || "";
  document.getElementById("certWpm").textContent = progress.bestWpm;
  document.getElementById("certAcc").textContent = progress.bestAccuracy + "%";
  document.getElementById("certDate").textContent = new Date().toLocaleDateString();
}

/* ---------------- settings ---------------- */

function openSettings() {
  document.getElementById("soundToggle").textContent = settings.sound ? "🔊" : "🔈";
  document.getElementById("fontSizeRange").value = settings.fontSize;
  document.getElementById("settingsIdValue").textContent = currentUserId;
  document.getElementById("settingsModal").classList.remove("hidden");
}

/* ---------------- gate (login) wiring ---------------- */

function initGate() {
  document.getElementById("gateInstituteName").textContent = INSTITUTE_NAME;
  const lastUser = localStorage.getItem("tt_last_user");
  if (lastUser) document.getElementById("gateIdInput").value = lastUser;

  document.getElementById("gateContinueBtn").addEventListener("click", () => {
    const id = document.getElementById("gateIdInput").value.trim();
    if (!id) { document.getElementById("gateIdInput").focus(); return; }
    loginAs(id);
  });
  let pendingNewId = null;
  document.getElementById("gateNewIdBtn").addEventListener("click", () => {
    pendingNewId = generateGuestId();
    document.getElementById("gateNewIdValue").textContent = pendingNewId;
    document.getElementById("gateLoginBlock").classList.add("hidden");
    document.getElementById("gateNewIdBlock").classList.remove("hidden");
  });
  document.getElementById("gateStartBtn").addEventListener("click", () => {
    if (pendingNewId) loginAs(pendingNewId);
  });
  document.getElementById("gateIdInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("gateContinueBtn").click();
  });
}

/* ---------------- init & events ---------------- */

function initApp() {
  renderHands();
  renderKeyboard();
  renderLegend();
  document.documentElement.style.setProperty("--passage-size", settings.fontSize + "px");
  renderSidebar();
  showView("dashboardView");
  renderDashboard();

  document.getElementById("settingsBtn").addEventListener("click", openSettings);
  document.getElementById("closeSettingsBtn").addEventListener("click", () => document.getElementById("settingsModal").classList.add("hidden"));
  document.getElementById("soundToggle").addEventListener("click", () => {
    settings.sound = !settings.sound; saveSettings();
    document.getElementById("soundToggle").textContent = settings.sound ? "🔊" : "🔈";
  });
  document.getElementById("fontSizeRange").addEventListener("input", (e) => {
    settings.fontSize = Number(e.target.value); saveSettings();
    document.querySelectorAll(".passage").forEach(p => p.style.fontSize = settings.fontSize + "px");
  });
  document.getElementById("switchUserBtn").addEventListener("click", () => {
    document.getElementById("settingsModal").classList.add("hidden");
    logout();
  });
  document.getElementById("resetProgressBtn").addEventListener("click", () => {
    if (confirm("Reset all progress for this ID? This cannot be undone.")) {
      progress = Object.assign({}, DEFAULT_PROGRESS, { completed: {}, stars: {}, history: [], errorCounts: {} });
      saveProgress();
      document.getElementById("settingsModal").classList.add("hidden");
      currentDayNum = null;
      showView("dashboardView");
      renderSidebar();
      renderDashboard();
    }
  });

  document.getElementById("dayBackBtn").addEventListener("click", () => {
    currentDayNum = null;
    showView("dashboardView");
    renderSidebar();
    renderDashboard();
  });
  document.getElementById("exitLessonBtn").addEventListener("click", exitLesson);
  document.getElementById("hiddenInput").addEventListener("input", onHiddenInputChange);
  document.getElementById("retryBtn").addEventListener("click", retryLesson);
  document.getElementById("continueBtnModal").addEventListener("click", continueFromModal);
  document.getElementById("continueBtn2").addEventListener("click", () => {
    const next = ALL_LESSONS.find(l => !progress.completed[l.id]) || ALL_LESSONS[ALL_LESSONS.length - 1];
    startLesson(next.id);
  });
  document.getElementById("weakDrillBtn").addEventListener("click", startWeakDrill);
  document.getElementById("certBackBtn").addEventListener("click", exitLesson);
  document.getElementById("certNameInput").addEventListener("input", (e) => {
    progress.certName = e.target.value; saveProgress();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const modal = document.getElementById("lessonCompleteModal");
      if (!modal.classList.contains("hidden")) {
        e.preventDefault();
        document.getElementById("continueBtnModal").click();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initGate);
