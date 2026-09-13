/* =========================================================
   TYPE//TUTOR — vanilla JS typing tutor
   Made by Hasan Abdullah
   ========================================================= */

/* ---------------- DATA: word & sentence banks ---------------- */

const WORD_BANK = [
  "a","as","ask","at","add","and","are","art","all","also","act","ago","air","age",
  "the","this","that","they","them","then","there","these","those","think","thing",
  "he","she","we","you","who","how","was","water","play","stay","tray","gray","spray",
  "is","it","in","on","of","or","if","up","us","go","do","so","no","my","by",
  "have","has","had","help","home","hope","half","hall","tall","fall","salad","flask",
  "letter","little","settle","puddle","riddle","kettle","turtle","hustle","gentle",
  "story","study","sturdy","steady","spider","garden","forest","potato","purple",
  "guitar","eagle","shape","grape","great","yellow","light","right","might","tight",
  "quiet","quirky","outlast","radio","idea","paper","tiger","order","other",
  "your","year","dear","fear","near","hear","clear","learn","earth","heart","start",
  "world","word","work","worth","worry","first","test","type","types","tests","key",
  "keys","finger","hands","speed","skill","level","lesson","master","typist","teacher",
  "school","office","market","travel","planet","system","record",
  "friend","family","future","moment","reason","result","effort","energy","freedom",
  "simple","single","double","triple","choice","change","chance","charge","church",
  "person","people","public","nation","nature","normal","number","object","obtain",
  "orange","output","parent","pencil","period","permit","player","policy","poetry",
  "flag","glad","jag","lag","sad","gala","gash","half","hash","lads","fads","gaff",
  "quick","brown","jumps","over","lazy","dogs","fox","five","dozen","pack","box",
  "hobby","mountain","sunrise","practice","habits","daily","lasting","confidence",
  "progress","remarkable","zebra","zone","maze","size","prize","move","music","mind"
];

const HOME_PHRASE_LINES = [
  "a lad a sad dad", "a flask of salad", "a gala hall", "half a flag",
  "a glass gash", "a jag or lag", "all fall a hall", "ask a lad",
  "a salad flask", "gash a flag"
];

const SENT_TOPHOME = [
  "the little spider dyed a purple grape",
  "eagles like a quiet forest at play",
  "a story tells you it is a riddle",
  "the guitar player is quite happy",
  "she left the salad or the toast",
  "a happy poet drew a great kite",
  "please stay quiet at that early hour",
  "we saw a great deal of yellow light"
];

const SENT_FULL = [
  "the quick brown fox jumps over the lazy dog.",
  "pack my box with five dozen liquor jugs.",
  "she sells seashells by the seashore, quickly and quietly.",
  "jazz musicians often improvise complex, vibrant melodies.",
  "my favorite hobby is baking fresh bread every weekend.",
  "the mountain view was breathtaking, especially at sunrise.",
  "we practice typing every day to build muscle memory.",
  "good habits, practiced daily, lead to lasting mastery."
];

const SENT_CAPS = [
  "Typing every day builds real skill and confidence.",
  "Practice makes progress, not perfection, and that is fine.",
  "The Quick Brown Fox Jumps Over The Lazy Dog.",
  "Rome was not built in a day, but it was built well.",
  "Small steps, taken daily, create remarkable results.",
  "Focus on accuracy first, and speed will follow naturally.",
  "Hasan started this course to master every single key.",
  "Every Monday is a fresh chance to improve your speed."
];

const SENT_NUMBERS = [
  "I have 3 cats, 12 dogs, and 7 fish at home.",
  "The store opens at 9 and closes at 8 daily.",
  "She scored 95 out of 100 on her typing test.",
  "There are 24 hours in a day and 7 days in a week.",
  "He bought 2 apples, 4 oranges, and 6 bananas today.",
  "Room 204 is on the 2nd floor, next to room 206.",
  "We saved 15 dollars out of a 60 dollar budget.",
  "The bus leaves at 7:45 and arrives by 8:30."
];

const SENT_SYMBOLS = [
  "Don't stop; keep going, even when it's hard!",
  "The total cost was $45.99 (including tax & tip).",
  "Use #hashtags & @mentions to boost your post's reach.",
  "She asked, \"Are you ready?\" and I said, \"Yes!\"",
  "50% off sale ends at 9pm - don't miss it!",
  "Email: hasan@example.com | Phone: 555-0192",
  "The formula is: (a + b) * c / d = result.",
  "Wow!! That's amazing... I can't believe it!"
];

const CERT_PARAGRAPH =
  "Congratulations! You have reached the final challenge. Type this paragraph as fast and accurately as you can: mix letters, numbers (like 42 or 2026), symbols (@, #, $, %), and punctuation - commas, periods, and even an exclamation mark! Take a breath, relax your fingers, and begin whenever you are ready.";

/* ---------------- DATA: keyboard / fingers ---------------- */

const FINGER_COLORS = {
  LP: "#E4572E", LR: "#F2A541", LM: "#4C956C", LI: "#2E86AB",
  RI: "#7B5EA7", RM: "#C2569B", RR: "#2F9C95", RP: "#8C6E4E", TH: "#9C9284"
};
const FINGER_NAMES = {
  LP: "Left Pinky", LR: "Left Ring", LM: "Left Middle", LI: "Left Index",
  RI: "Right Index", RM: "Right Middle", RR: "Right Ring", RP: "Right Pinky", TH: "Thumb"
};

const KEY_FINGER = {
  "`":"LP","1":"LP","2":"LR","3":"LM","4":"LI","5":"LI","6":"RI","7":"RI","8":"RM","9":"RR","0":"RP","-":"RP","=":"RP",
  "q":"LP","w":"LR","e":"LM","r":"LI","t":"LI","y":"RI","u":"RI","i":"RM","o":"RR","p":"RP","[":"RP","]":"RP","\\":"RP",
  "a":"LP","s":"LR","d":"LM","f":"LI","g":"LI","h":"RI","j":"RI","k":"RM","l":"RR",";":"RP","'":"RP",
  "z":"LP","x":"LR","c":"LM","v":"LI","b":"LI","n":"RI","m":"RI",",":"RM",".":"RR","/":"RP",
  " ":"TH"
};

const KEYBOARD_ROWS = [
  ["`","1","2","3","4","5","6","7","8","9","0","-","="],
  ["q","w","e","r","t","y","u","i","o","p","[","]"],
  ["a","s","d","f","g","h","j","k","l",";","'"],
  ["z","x","c","v","b","n","m",",",".","/"]
];

const SHIFT_SYMBOL_MAP = {
  "!":"1","@":"2","#":"3","$":"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",
  "_":"-","+":"=","{":"[","}":"]","|":"\\",":":";",'"':"'","<":",","-":"-",">":".","?":"/","~":"`"
};

function resolveKeyInfo(ch) {
  if (ch === " ") return { key: " ", shift: false };
  if (/[a-z]/.test(ch)) return { key: ch, shift: false };
  if (/[A-Z]/.test(ch)) return { key: ch.toLowerCase(), shift: true };
  if (/[0-9]/.test(ch)) return { key: ch, shift: false };
  if (SHIFT_SYMBOL_MAP[ch]) return { key: SHIFT_SYMBOL_MAP[ch], shift: true };
  if (KEY_FINGER[ch] !== undefined) return { key: ch, shift: false };
  return null;
}

/* ---------------- helpers ---------------- */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function wordsFrom(letters, count, maxLen) {
  maxLen = maxLen || 8;
  const set = new Set(letters);
  const pool = WORD_BANK.filter(w => w.length <= maxLen && w.split("").every(c => set.has(c)));
  const picked = shuffle(pool).slice(0, count);
  return picked.length ? picked.join(" ") : letters.join(" ");
}

// weighted drill: new keys appear more often than old keys, always mixed with spaces
function weightedDrill(newKeys, oldKeys, groups) {
  groups = groups || 10;
  const pool = [];
  newKeys.forEach(k => { pool.push(k, k, k); });
  oldKeys.forEach(k => { pool.push(k); });
  if (pool.length === 0) pool.push(...newKeys);
  const out = [];
  for (let i = 0; i < groups; i++) {
    const len = 2 + Math.floor(Math.random() * 3);
    let s = "";
    for (let j = 0; j < len; j++) s += pool[Math.floor(Math.random() * pool.length)];
    out.push(s);
  }
  return out.join(" ");
}

function computeStars(accuracy, wpm) {
  if (accuracy >= 96 && wpm >= 30) return 3;
  if (accuracy >= 88 && wpm >= 15) return 2;
  return 1;
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

/* ---------------- pacing (rounds per lesson type) ---------------- */

const PACE_PRESETS = {
  slow:     { solo: 15, combo: 15, review: 10, words: 8, group: 15, groupCombo: 15 },
  standard: { solo: 8,  combo: 8,  review: 6,  words: 6, group: 8,  groupCombo: 8  },
  fast:     { solo: 4,  combo: 4,  review: 4,  words: 4, group: 4,  groupCombo: 4  }
};
let PACE = PACE_PRESETS.slow;

/* ---------------- curriculum builder ---------------- */

function buildCurriculum() {
  const stages = [];
  let cumulative = [];
  const addKeys = (...ks) => { cumulative = cumulative.concat(ks.filter(k => !cumulative.includes(k))); };

  // ---- Stage 1: Home Row ----
  const home = [];
  const homePairs = [["f","j"],["d","k"],["s","l"],["a",";"],["g","h"]];
  homePairs.forEach(([k1, k2], idx) => {
    home.push({ id:`h${idx+1}a`, title:`Letter "${k1}"`, type:"drill", rounds:()=>PACE.solo, gen: () => weightedDrill([k1], []) });
    home.push({ id:`h${idx+1}b`, title:`Letter "${k2}"`, type:"drill", rounds:()=>PACE.solo, gen: () => weightedDrill([k2], []) });
    const oldBefore = cumulative.slice();
    addKeys(k1, k2);
    home.push({ id:`h${idx+1}c`, title:`"${k1}" + "${k2}" Together`, type:"drill", rounds:()=>PACE.combo, gen: () => weightedDrill([k1,k2], oldBefore) });
  });
  const homeSnap = cumulative.slice();
  home.push({ id:"hreview", title:"Home Row Review", type:"drill", rounds:()=>PACE.review, gen: () => weightedDrill([], homeSnap) });
  home.push({ id:"hphrase", title:"Home Row Phrases", type:"sentences", bank: HOME_PHRASE_LINES });
  stages.push({ name:"Home Row", lessons: home });

  // ---- Stage 2: Top Row ----
  const top = [];
  const topPairs = [["q","p"],["w","o"],["e","i"],["r","u"],["t","y"]];
  topPairs.forEach(([k1, k2], idx) => {
    top.push({ id:`t${idx+1}a`, title:`Letter "${k1}"`, type:"drill", rounds:()=>PACE.solo, gen: () => weightedDrill([k1], []) });
    top.push({ id:`t${idx+1}b`, title:`Letter "${k2}"`, type:"drill", rounds:()=>PACE.solo, gen: () => weightedDrill([k2], []) });
    const oldBefore = cumulative.slice();
    addKeys(k1, k2);
    top.push({ id:`t${idx+1}c`, title:`"${k1}" + "${k2}" Together`, type:"drill", rounds:()=>PACE.combo, gen: () => weightedDrill([k1,k2], oldBefore) });
  });
  const topSnap = cumulative.slice();
  top.push({ id:"treview", title:"Home + Top Row Review", type:"drill", rounds:()=>PACE.review, gen: () => weightedDrill([], topSnap) });
  top.push({ id:"twords", title:"Words: Home + Top Row", type:"words", rounds:()=>PACE.words, gen: () => wordsFrom(topSnap, 14) });
  top.push({ id:"tsent", title:"Sentences: Home + Top Row", type:"sentences", bank: SENT_TOPHOME });
  stages.push({ name:"Top Row", lessons: top });

  // ---- Stage 3: Bottom Row ----
  const bottom = [];
  const bottomPairs = [["z","x"],["c","v"],["b","n"]];
  bottomPairs.forEach(([k1, k2], idx) => {
    bottom.push({ id:`b${idx+1}a`, title:`Letter "${k1}"`, type:"drill", rounds:()=>PACE.solo, gen: () => weightedDrill([k1], []) });
    bottom.push({ id:`b${idx+1}b`, title:`Letter "${k2}"`, type:"drill", rounds:()=>PACE.solo, gen: () => weightedDrill([k2], []) });
    const oldBefore = cumulative.slice();
    addKeys(k1, k2);
    bottom.push({ id:`b${idx+1}c`, title:`"${k1}" + "${k2}" Together`, type:"drill", rounds:()=>PACE.combo, gen: () => weightedDrill([k1,k2], oldBefore) });
  });
  {
    bottom.push({ id:"bma", title:'Letter "m"', type:"drill", rounds:()=>PACE.solo, gen: () => weightedDrill(["m"], []) });
    const oldBefore = cumulative.slice();
    addKeys("m");
    bottom.push({ id:"bmc", title:'"m" + All Letters Review', type:"drill", rounds:()=>PACE.combo, gen: () => weightedDrill(["m"], oldBefore) });
  }
  const fullAlpha = cumulative.slice();
  bottom.push({ id:"breview", title:"Full Alphabet Review", type:"drill", rounds:()=>PACE.review, gen: () => weightedDrill([], fullAlpha) });
  bottom.push({ id:"bwords", title:"Full Alphabet Words", type:"words", rounds:()=>PACE.words, gen: () => wordsFrom(fullAlpha.concat([" "]), 16) });
  bottom.push({ id:"bsent", title:"Full Alphabet Sentences", type:"sentences", bank: SENT_FULL });
  stages.push({ name:"Bottom Row", lessons: bottom });

  // ---- Stage 4: Capitalization ----
  stages.push({ name:"Capitalization", lessons: [
    { id:"cap1", title:"Shift + Capitals Drill", type:"drill", rounds:()=>PACE.group, gen: () => {
        const letters = "abcdefghijklmnopqrstuvwxyz".split("");
        const out = [];
        for (let i=0;i<10;i++){ const c = letters[Math.floor(Math.random()*letters.length)]; out.push(c.toUpperCase()+c+c.toUpperCase()); }
        return out.join(" ");
      }},
    { id:"cap2", title:"Capitalized Sentences", type:"sentences", bank: SENT_CAPS }
  ]});

  // ---- Stage 5: Numbers ----
  stages.push({ name:"Numbers", lessons: [
    { id:"num1", title:"Numbers 1-5", type:"drill", rounds:()=>PACE.group, gen: () => weightedDrill(["1","2","3","4","5"], []) },
    { id:"num2", title:"Numbers 6-0", type:"drill", rounds:()=>PACE.group, gen: () => weightedDrill(["6","7","8","9","0"], []) },
    { id:"num3", title:"All Numbers Combined", type:"drill", rounds:()=>PACE.groupCombo, gen: () => weightedDrill("1234567890".split(""), []) },
    { id:"num4", title:"Numbers in Context", type:"sentences", bank: SENT_NUMBERS }
  ]});

  // ---- Stage 6: Symbols ----
  stages.push({ name:"Symbols & Punctuation", lessons: [
    { id:"sym1", title:"Symbols !@#$%", type:"drill", rounds:()=>PACE.group, gen: () => weightedDrill("!@#$%".split(""), []) },
    { id:"sym2", title:"Symbols ^&*()", type:"drill", rounds:()=>PACE.group, gen: () => weightedDrill("^&*()".split(""), []) },
    { id:"sym3", title:"All Symbols Combined", type:"drill", rounds:()=>PACE.groupCombo, gen: () => weightedDrill("!@#$%^&*()-_=+".split(""), []) },
    { id:"sym4", title:"Punctuation Practice", type:"sentences", bank: SENT_SYMBOLS }
  ]});

  // ---- Stage 7: Mastery ----
  stages.push({ name:"Mastery", lessons: [
    { id:"test1", title:"1-Minute Speed Test", type:"test", timeLimit:60, rounds:()=>1, gen: () => shuffle(SENT_FULL).slice(0,6).join("  ") },
    { id:"test2", title:"3-Minute Endurance Test", type:"test", timeLimit:180, rounds:()=>1, gen: () => shuffle(SENT_FULL.concat(SENT_CAPS,SENT_NUMBERS)).slice(0,10).join("  ") },
    { id:"cert", title:"Final Certificate Test", type:"certificate", rounds:()=>1, gen: () => CERT_PARAGRAPH }
  ]});

  return stages;
}

let CURRICULUM = buildCurriculum();
let ALL_LESSONS = CURRICULUM.flatMap(s => s.lessons);

const BADGES = [
  { id:"first", label:"First Steps", desc:"Complete your first lesson", check:(p)=>Object.keys(p.completed).length>=1 },
  { id:"homehero", label:"Home Row Hero", desc:"Finish the whole Home Row stage", check:(p)=>p.completed["hphrase"] },
  { id:"alphabet", label:"Alphabet Master", desc:"Type every letter with confidence", check:(p)=>p.completed["bsent"] },
  { id:"speed", label:"Speed Demon", desc:"Hit 40+ WPM in a lesson", check:(p)=>p.bestWpm>=40 },
  { id:"sharp", label:"Sharpshooter", desc:"Score 100% accuracy once", check:(p)=>p.bestAccuracy>=100 },
  { id:"numbers", label:"Number Cruncher", desc:"Finish the Numbers stage", check:(p)=>p.completed["num4"] },
  { id:"symbols", label:"Symbol Sensei", desc:"Finish the Symbols stage", check:(p)=>p.completed["sym4"] },
  { id:"streak3", label:"3-Day Streak", desc:"Practice 3 days in a row", check:(p)=>p.streak>=3 },
  { id:"streak7", label:"7-Day Streak", desc:"Practice 7 days in a row", check:(p)=>p.streak>=7 },
  { id:"certified", label:"Certified Typist", desc:"Pass the final certificate test", check:(p)=>p.completed["cert"] }
];

function isLessonUnlocked(lessonId, progress) {
  const idx = ALL_LESSONS.findIndex(l => l.id === lessonId);
  if (idx <= 0) return true;
  return !!progress.completed[ALL_LESSONS[idx-1].id];
}

/* ---------------- state ---------------- */

const DEFAULT_PROGRESS = { completed:{}, stars:{}, history:[], streak:0, lastDate:null, bestWpm:0, bestAccuracy:0, certName:"", errorCounts:{} };
let progress = loadProgress();
let settings = loadSettings();
let theme = localStorage.getItem("tt_theme") || "light";
let currentLessonId = null;
let audioCtx = null;

function loadProgress() {
  try { return Object.assign({}, DEFAULT_PROGRESS, JSON.parse(localStorage.getItem("tt_progress"))); }
  catch (e) { return Object.assign({}, DEFAULT_PROGRESS); }
}
function saveProgress() { localStorage.setItem("tt_progress", JSON.stringify(progress)); }
function loadSettings() {
  try { return Object.assign({ sound:true, fontSize:22, pace:"slow" }, JSON.parse(localStorage.getItem("tt_settings"))); }
  catch (e) { return { sound:true, fontSize:22, pace:"slow" }; }
}
function saveSettings() { localStorage.setItem("tt_settings", JSON.stringify(settings)); }

PACE = PACE_PRESETS[settings.pace] || PACE_PRESETS.slow;
CURRICULUM = buildCurriculum();
ALL_LESSONS = CURRICULUM.flatMap(s => s.lessons);

/* ---------------- sound ---------------- */

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
  { name:"index",  x:38,  y:42, w:20, h:72, rx:10, rot:-6,  cx:48,  cy:114 },
  { name:"middle", x:63,  y:28, w:20, h:88, rx:10, rot:0,   cx:73,  cy:116 },
  { name:"ring",   x:88,  y:40, w:20, h:76, rx:10, rot:7,   cx:98,  cy:116 },
  { name:"pinky",  x:111, y:58, w:17, h:60, rx:8.5,rot:14,  cx:119, cy:118 },
  { name:"thumb",  x:0,   y:98, w:34, h:50, rx:17, rot:38,  cx:17,  cy:123 }
];

function buildHandSVG(side) {
  const parts = [];
  parts.push(`<svg class="hand-svg" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">`);
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

function renderHands() {
  document.getElementById("handsContainer").innerHTML = buildHandSVG("L") + buildHandSVG("R");
}

function resetHandHighlight() {
  document.querySelectorAll(".finger").forEach(el => {
    el.classList.remove("finger-active");
    el.style.fill = "";
  });
}

function highlightFinger(fingerCode) {
  resetHandHighlight();
  if (!fingerCode) return;
  const color = FINGER_COLORS[fingerCode];
  if (fingerCode === "TH") {
    ["finger-L-thumb","finger-R-thumb"].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.add("finger-active"); el.style.fill = color; }
    });
    return;
  }
  const side = fingerCode.startsWith("L") ? "L" : "R";
  const nameMap = { LP:"pinky", LR:"ring", LM:"middle", LI:"index", RI:"index", RM:"middle", RR:"ring", RP:"pinky" };
  const el = document.getElementById(`finger-${side}-${nameMap[fingerCode]}`);
  if (el) { el.classList.add("finger-active"); el.style.fill = color; }
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
      keyDiv.className = "key";
      keyDiv.id = "kb-" + (k === " " ? "space" : k.replace(/[^a-z0-9]/gi, (c)=>"c"+c.charCodeAt(0)));
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

function updateKeyboardHighlight(nextChar) {
  document.querySelectorAll(".key").forEach(k => { k.classList.remove("key-active"); k.style.borderColor = ""; k.style.boxShadow = ""; });
  document.getElementById("kb-shift-left").classList.remove("key-active");
  document.getElementById("kb-shift-right").classList.remove("key-active");
  if (!nextChar) { highlightFinger(null); return; }
  const info = resolveKeyInfo(nextChar);
  if (!info) { highlightFinger(null); return; }
  const finger = KEY_FINGER[info.key];
  const color = FINGER_COLORS[finger];
  const target = info.key === " " ? document.getElementById("kb-space") :
    Array.from(document.querySelectorAll(".key")).find(el => el.dataset.key === info.key);
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

function renderLegend() {
  const el = document.getElementById("legendContainer");
  el.innerHTML = Object.keys(FINGER_NAMES).map(f =>
    `<div class="legend-item"><span class="legend-dot" style="background:${FINGER_COLORS[f]}"></span>${FINGER_NAMES[f]}</div>`
  ).join("");
}

/* ---------------- sidebar / dashboard ---------------- */

function renderSidebar() {
  const el = document.getElementById("sidebarList");
  el.innerHTML = "";
  CURRICULUM.forEach(stage => {
    const block = document.createElement("div");
    block.className = "stage-block";
    const title = document.createElement("div");
    title.className = "stage-title";
    title.textContent = stage.name;
    block.appendChild(title);
    stage.lessons.forEach(lesson => {
      const done = progress.completed[lesson.id];
      const unlocked = isLessonUnlocked(lesson.id, progress);
      const btn = document.createElement("button");
      btn.className = "lesson-btn" + (lesson.id === currentLessonId ? " lesson-active" : "") + (!unlocked ? " lesson-locked" : "");
      btn.disabled = !unlocked;
      const stars = progress.stars[lesson.id] || 0;
      btn.innerHTML = `<span class="lesson-icon">${!unlocked ? "&#128274;" : done ? "&#10003;" : "&#9679;"}</span>
        <span class="lesson-name">${lesson.title}</span>
        ${done ? `<span class="mini-stars">${"&#9733;".repeat(stars)}</span>` : ""}`;
      btn.addEventListener("click", () => startLesson(lesson.id));
      block.appendChild(btn);
    });
    el.appendChild(block);
  });
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
  const stepX = (w - pad*2) / (data.length - 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.wpm / max) * (h - pad*2);
    return `${x},${y}`;
  }).join(" ");
  svg.innerHTML = `
    <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="2.5"></polyline>
    ${data.map((d,i)=>{ const x=pad+i*stepX; const y=h-pad-(d.wpm/max)*(h-pad*2); return `<circle cx="${x}" cy="${y}" r="3" fill="var(--accent)"></circle>`; }).join("")}
  `;
}

function renderDashboard() {
  const total = ALL_LESSONS.length;
  const done = Object.keys(progress.completed).length;
  const pct = Math.round((done/total)*100);
  document.getElementById("progressPct").textContent = pct + "%";
  document.getElementById("progressText").textContent = `${done} of ${total} lessons complete`;
  document.getElementById("streakVal").textContent = progress.streak;
  renderBadges();
  renderSparkline();
}

/* ---------------- lesson session ---------------- */

let session = null; // { lesson, roundsTotal, currentRound, order, roundStats, target, typed, startTime, errorMap, timerId, finished }

function startLesson(id) {
  const lesson = ALL_LESSONS.find(l => l.id === id) || (id === "weak" ? window.__weakLesson : null);
  if (!lesson) return;
  if (!isLessonUnlocked(id, progress) && id !== "weak") return;
  currentLessonId = id;
  const roundsTotal = lesson.bank ? lesson.bank.length : lesson.rounds();
  session = {
    lesson, roundsTotal, currentRound: 0,
    order: lesson.bank ? shuffle(lesson.bank) : null,
    roundStats: [], target: "", typed: "", startTime: null, errorMap: {}, timerId: null, finished: false
  };
  document.getElementById("dashboardView").classList.add("hidden");
  document.getElementById("certView").classList.add("hidden");
  document.getElementById("lessonView").classList.remove("hidden");
  document.getElementById("lessonTitle").textContent = lesson.title;
  renderSidebar();
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
  document.getElementById("roundText").textContent = `Round ${session.currentRound+1} / ${session.roundsTotal}`;
  document.getElementById("roundFill").style.width = Math.round((session.currentRound/session.roundsTotal)*100) + "%";
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

function escapeHtml(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function updateStatsDisplay() {
  const { target, typed, startTime } = session;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
  const accuracy = typed.length ? Math.max(0, Math.round((correct/typed.length)*100)) : 100;
  const minutes = startTime ? Math.max((Date.now()-startTime)/60000, 1/60) : 1/60;
  const wpm = typed.length ? Math.round((correct/5)/minutes) : 0;
  document.getElementById("statWpm").innerHTML = `${wpm} <b>WPM</b>`;
  document.getElementById("statAcc").innerHTML = `${accuracy}% <b>ACC</b>`;
  const secs = startTime ? Math.floor((Date.now()-startTime)/1000) : 0;
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

function finishLesson() {
  session.finished = true;
  playSound("complete");
  const avgAcc = Math.round(session.roundStats.reduce((s,r)=>s+r.accuracy,0) / session.roundStats.length);
  const avgWpm = Math.round(session.roundStats.reduce((s,r)=>s+r.wpm,0) / session.roundStats.length);
  const stars = computeStars(avgAcc, avgWpm);
  document.getElementById("roundFill").style.width = "100%";

  const today = todayISO();
  if (progress.lastDate !== today) {
    const diff = progress.lastDate ? daysBetween(progress.lastDate, today) : 1;
    progress.streak = diff === 1 ? progress.streak + 1 : (diff === 0 ? progress.streak : 1);
  }
  progress.lastDate = today;
  progress.completed[session.lesson.id] = true;
  progress.stars[session.lesson.id] = Math.max(progress.stars[session.lesson.id] || 0, stars);
  progress.history.push({ date: today, wpm: avgWpm, accuracy: avgAcc });
  progress.bestWpm = Math.max(progress.bestWpm, avgWpm);
  progress.bestAccuracy = Math.max(progress.bestAccuracy, avgAcc);
  saveProgress();

  document.getElementById("resWpm").textContent = avgWpm;
  document.getElementById("resAcc").textContent = avgAcc + "%";
  document.getElementById("starsEl").innerHTML = [1,2,3].map(i => `<span class="${i<=stars?"star-on":""}">&#9733;</span>`).join("");
  document.getElementById("lessonCompleteModal").classList.remove("hidden");

  if (session.lesson.id === "cert") {
    setTimeout(() => { document.getElementById("lessonCompleteModal").classList.add("hidden"); showCertificate(); }, 400);
  }
}

function exitLesson() {
  clearInterval(session && session.timerId);
  document.getElementById("lessonCompleteModal").classList.add("hidden");
  document.getElementById("lessonView").classList.add("hidden");
  document.getElementById("certView").classList.add("hidden");
  document.getElementById("dashboardView").classList.remove("hidden");
  renderSidebar();
  renderDashboard();
}

function retryLesson() {
  document.getElementById("lessonCompleteModal").classList.add("hidden");
  startLesson(session.lesson.id);
}

function continueFromModal() {
  document.getElementById("lessonCompleteModal").classList.add("hidden");
  const idx = ALL_LESSONS.findIndex(l => l.id === (session && session.lesson.id));
  const next = idx >= 0 ? ALL_LESSONS[idx+1] : null;
  if (next && session.lesson.id !== "cert") startLesson(next.id);
  else exitLesson();
}

/* ---------------- weak key drill ---------------- */

function startWeakDrill() {
  const entries = Object.entries(progress.errorCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]);
  const keys = entries.length ? entries : "etaoinshrdlu".split("").slice(0,8);
  window.__weakLesson = { id:"weak", title:"Weak Key Drill", type:"drill", bank:null, rounds: () => 12, gen: () => weightedDrill(keys, []) };
  startLesson("weak");
}

/* ---------------- certificate ---------------- */

function showCertificate() {
  document.getElementById("lessonView").classList.add("hidden");
  document.getElementById("dashboardView").classList.add("hidden");
  document.getElementById("certView").classList.remove("hidden");
  document.getElementById("certNameInput").value = progress.certName || "";
  document.getElementById("certWpm").textContent = progress.bestWpm;
  document.getElementById("certAcc").textContent = progress.bestAccuracy + "%";
  document.getElementById("certDate").textContent = new Date().toLocaleDateString();
}

/* ---------------- theme / settings ---------------- */

function applyTheme() {
  const app = document.getElementById("app");
  app.classList.remove("theme-light","theme-dark");
  app.classList.add("theme-" + theme);
  document.getElementById("themeToggle").textContent = theme === "dark" ? "☀" : "🌙";
}

function openSettings() {
  document.getElementById("soundToggle").textContent = settings.sound ? "🔊" : "🔈";
  document.getElementById("fontSizeRange").value = settings.fontSize;
  document.getElementById("paceSelect").value = settings.pace;
  document.getElementById("settingsModal").classList.remove("hidden");
}

/* ---------------- init & events ---------------- */

function init() {
  applyTheme();
  renderHands();
  renderKeyboard();
  renderLegend();
  renderSidebar();
  renderDashboard();
  document.querySelector(".passage").style && null;
  document.documentElement.style.setProperty("--passage-size", settings.fontSize + "px");
  document.getElementById("passageWrap") && (document.querySelector(".passage") ? null : null);

  document.getElementById("themeToggle").addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("tt_theme", theme);
    applyTheme();
  });
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
  document.getElementById("paceSelect").addEventListener("change", (e) => {
    settings.pace = e.target.value; saveSettings();
    PACE = PACE_PRESETS[settings.pace];
    CURRICULUM = buildCurriculum();
    ALL_LESSONS = CURRICULUM.flatMap(s => s.lessons);
    renderSidebar();
  });
  document.getElementById("resetProgressBtn").addEventListener("click", () => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      progress = Object.assign({}, DEFAULT_PROGRESS, { completed:{}, stars:{}, history:[], errorCounts:{} });
      saveProgress();
      document.getElementById("settingsModal").classList.add("hidden");
      exitLesson();
    }
  });

  document.getElementById("exitLessonBtn").addEventListener("click", exitLesson);
  document.getElementById("hiddenInput").addEventListener("input", onHiddenInputChange);
  document.getElementById("retryBtn").addEventListener("click", retryLesson);
  document.getElementById("continueBtnModal").addEventListener("click", continueFromModal);
  document.getElementById("continueBtn2").addEventListener("click", () => {
    const next = ALL_LESSONS.find(l => !progress.completed[l.id]) || ALL_LESSONS[ALL_LESSONS.length-1];
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

document.addEventListener("DOMContentLoaded", init);
