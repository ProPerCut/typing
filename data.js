/* =========================================================
   TYPE//TUTOR — data & curriculum
   Made by Hasan Abdullah
   ========================================================= */

const INSTITUTE_NAME = "Aksharo Touch-Type Institute";

/* ---------------- word & sentence banks ---------------- */

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
  "progress","remarkable","zebra","zone","maze","size","prize","move","music","mind",
  "desk","lamp","door","wall","roof","rain","wind","snow","leaf","tree","root",
  "gold","cold","bold","fold","hold","sold","told","mild","wild","kind","find"
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

/* ---------------- keyboard / fingers ---------------- */

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

const HOME_ROW_KEYS = ["a","s","d","f","j","k","l",";"];
const HOME_ROW_FINGERS = ["LP","LR","LM","LI","RI","RM","RR","RP"];

const KEYBOARD_ROWS = [
  ["`","1","2","3","4","5","6","7","8","9","0","-","="],
  ["q","w","e","r","t","y","u","i","o","p","[","]"],
  ["a","s","d","f","g","h","j","k","l",";","'"],
  ["z","x","c","v","b","n","m",",",".","/"]
];

const SHIFT_SYMBOL_MAP = {
  "!":"1","@":"2","#":"3","$":"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",
  "_":"-","+":"=","{":"[","}":"]","|":"\\",":":";",'"':"'","<":",",">":".","?":"/","~":"`"
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

// weighted drill: new keys appear more often than old keys, mixed with spaces
function weightedDrill(newKeys, oldKeys, groups) {
  groups = groups || 10;
  const pool = [];
  newKeys.forEach(k => { pool.push(k, k, k); });
  oldKeys.forEach(k => { pool.push(k); });
  if (pool.length === 0) pool.push(...(newKeys.length ? newKeys : ["a"]));
  const out = [];
  for (let i = 0; i < groups; i++) {
    const len = 2 + Math.floor(Math.random() * 3);
    let s = "";
    for (let j = 0; j < len; j++) s += pool[Math.floor(Math.random() * pool.length)];
    out.push(s);
  }
  return out.join(" ");
}

// short alternating combo patterns, e.g. jf fj jjf fjj, optionally weaving in a review key
function comboPatternDrill(keys, priorWeekKeys) {
  const [a, b] = keys;
  const patterns = [a + b, b + a, a + a + b, a + b + b, b + a + a, a + b + a];
  if (priorWeekKeys && priorWeekKeys.length) {
    const p = priorWeekKeys[Math.floor(Math.random() * priorWeekKeys.length)];
    patterns.push(a + p, p + b, b + p + a, p + a + b);
  }
  const groups = 9;
  const out = [];
  for (let i = 0; i < groups; i++) out.push(patterns[Math.floor(Math.random() * patterns.length)]);
  return out.join(" ");
}

function capsDrill(knownLetters) {
  const letters = knownLetters.length ? knownLetters : "asdfjkl".split("");
  const out = [];
  for (let i = 0; i < 10; i++) {
    const c = letters[Math.floor(Math.random() * letters.length)];
    out.push(c.toUpperCase() + c + c.toUpperCase());
  }
  return out.join(" ");
}

function capsWordsDrill(knownLetters) {
  const set = new Set(knownLetters);
  const pool = WORD_BANK.filter(w => w.length <= 7 && w.split("").every(c => set.has(c)));
  const picked = shuffle(pool).slice(0, 8).map(w => w[0].toUpperCase() + w.slice(1));
  return picked.length ? picked.join(" ") : knownLetters.join(" ").toUpperCase();
}

function computeStars(accuracy, wpm) {
  if (accuracy >= 96 && wpm >= 30) return 3;
  if (accuracy >= 88 && wpm >= 15) return 2;
  return 1;
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

/* ---------------- game content & difficulty ---------------- */

function gameContentFor(knownChars, dayNum, opts) {
  opts = opts || {};
  const chars = knownChars.filter(c => c !== " ");
  let pool = [];
  if (chars.length <= 4) {
    pool = shuffle(chars.concat(chars, chars));
  } else if (chars.length <= 10) {
    for (let i = 0; i < 22; i++) {
      const len = 1 + Math.floor(Math.random() * 2);
      let s = "";
      for (let j = 0; j < len; j++) s += chars[Math.floor(Math.random() * chars.length)];
      pool.push(s);
    }
  } else {
    const set = new Set(chars);
    const words = WORD_BANK.filter(w => w.length <= 6 && w.split("").every(c => set.has(c)));
    pool = words.length >= 10 ? shuffle(words).slice(0, 22) : chars;
  }
  if (opts.caps) pool = pool.map(w => (Math.random() < 0.5 ? w[0].toUpperCase() + w.slice(1) : w));
  const tier = Math.min(7, Math.ceil(dayNum / 6));
  const fallDuration = Math.max(3200, 8200 - tier * 750);
  const spawnInterval = Math.max(850, 2300 - tier * 190);
  return { pool: pool.length ? pool : ["a"], fallDuration, spawnInterval, lives: 5 };
}

/* ---------------- badges ---------------- */

const BADGES = [
  { id: "first", label: "First Steps", desc: "Complete your first lesson", check: (p) => Object.keys(p.completed).length >= 1 },
  { id: "week1", label: "Week One Done", desc: "Finish Week 1's review day", check: (p) => p.completed["d5_wreview"] },
  { id: "homerow", label: "Home Row Hero", desc: "Learn all Home Row keys", check: (p) => p.completed["d4_review"] },
  { id: "alphabet", label: "Alphabet Master", desc: "Learn every letter", check: (p) => p.completed["d18_review"] },
  { id: "speed", label: "Speed Demon", desc: "Hit 40+ WPM in a lesson", check: (p) => p.bestWpm >= 40 },
  { id: "sharp", label: "Sharpshooter", desc: "Score 100% accuracy once", check: (p) => p.bestAccuracy >= 100 },
  { id: "gamer", label: "Sky Fall Ace", desc: "Finish 5 games", check: (p) => (p.gamesPlayed || 0) >= 5 },
  { id: "numbers", label: "Number Cruncher", desc: "Finish the Numbers days", check: (p) => p.completed["d22_review"] },
  { id: "symbols", label: "Symbol Sensei", desc: "Finish the Symbols days", check: (p) => p.completed["d24_review"] },
  { id: "streak3", label: "3-Day Streak", desc: "Practice 3 days in a row", check: (p) => p.streak >= 3 },
  { id: "streak7", label: "7-Day Streak", desc: "Practice 7 days in a row", check: (p) => p.streak >= 7 },
  { id: "certified", label: "Certified Typist", desc: "Pass the final certificate test", check: (p) => p.completed["cert"] }
];

/* ---------------- day schedule ---------------- */

const LETTER_PAIRS = [
  ["f", "j"], ["d", "k"], ["s", "l"], ["a", ";"],
  ["g", "h"], ["r", "u"], ["t", "y"], ["e", "i"],
  ["w", "o"], ["q", "p"], ["c", ","], ["v", "m"],
  ["x", "."], ["z", "/"], ["b", "n"]
];

function buildDaySchedule() {
  const sched = [];
  let li = 0;
  for (let w = 0; w < 3; w++) {
    for (let i = 0; i < 4; i++) sched.push({ kind: "letters", pair: LETTER_PAIRS[li++] });
    sched.push({ kind: "review" });
  }
  for (let i = 0; i < 3; i++) sched.push({ kind: "letters", pair: LETTER_PAIRS[li++] });
  sched.push({ kind: "caps" });
  sched.push({ kind: "review" });
  sched.push({ kind: "num1" });
  sched.push({ kind: "num2" });
  sched.push({ kind: "sym1" });
  sched.push({ kind: "sym2" });
  sched.push({ kind: "review" });
  sched.push({ kind: "punct" });
  sched.push({ kind: "speedwords" });
  sched.push({ kind: "sentences" });
  sched.push({ kind: "mixed" });
  sched.push({ kind: "review" });
  for (let i = 1; i <= 4; i++) sched.push({ kind: "speed", tier: i });
  sched.push({ kind: "review" });
  for (let i = 1; i <= 4; i++) sched.push({ kind: "endurance", tier: i });
  sched.push({ kind: "final" });
  return sched;
}

const DAY_KIND_LABEL = {
  letters: "New Keys", review: "Week Review", caps: "Capitals", num1: "Numbers", num2: "Numbers",
  sym1: "Symbols", sym2: "Symbols", punct: "Punctuation", speedwords: "Word Speed",
  sentences: "Sentences", mixed: "Mixed Practice", speed: "Speed Building",
  endurance: "Endurance", final: "Final Exam"
};

function buildLetterDay(dayNum, keys, priorAll, priorThisWeek) {
  const d = `d${dayNum}`;
  const lessons = [];
  lessons.push({ id: `${d}_intro`, day: dayNum, title: `New Keys: "${keys[0]}" & "${keys[1]}"`, type: "intro", introKind: "newkey", introKeys: keys });
  keys.forEach((k, i) => {
    lessons.push({ id: `${d}_solo${i}`, day: dayNum, title: `Warm-up: "${k}"`, type: "drill", rounds: () => 6, gen: () => weightedDrill([k], []) });
  });
  lessons.push({ id: `${d}_combo1`, day: dayNum, title: `Combo: "${keys[0]}" + "${keys[1]}"`, type: "drill", rounds: () => 6, gen: () => weightedDrill(keys, []) });
  lessons.push({ id: `${d}_combo2`, day: dayNum, title: "Combo Patterns", type: "drill", rounds: () => 7, gen: () => comboPatternDrill(keys, priorThisWeek) });
  if (priorThisWeek.length) {
    lessons.push({ id: `${d}_mix`, day: dayNum, title: "Mix with This Week", type: "drill", rounds: () => 8, gen: () => weightedDrill(keys, priorThisWeek) });
  }
  const allKnown = priorAll.concat(keys);
  if (allKnown.filter(c => /[a-z]/.test(c)).length >= 6) {
    lessons.push({ id: `${d}_words`, day: dayNum, title: "Word Practice", type: "words", rounds: () => 6, gen: () => wordsFrom(allKnown, 10) });
  } else {
    lessons.push({ id: `${d}_seq`, day: dayNum, title: "Letter Sequences", type: "drill", rounds: () => 6, gen: () => weightedDrill(allKnown, []) });
  }
  lessons.push({ id: `${d}_review`, day: dayNum, title: "Quick Review", type: "drill", rounds: () => 6, gen: () => weightedDrill(keys, priorAll) });
  lessons.push({ id: `${d}_game`, day: dayNum, title: "Game: Sky Fall", type: "game", gen: () => gameContentFor(allKnown, dayNum) });
  return lessons;
}

function buildCapsDay(dayNum, allKnown) {
  const d = `d${dayNum}`;
  return [
    { id: `${d}_intro`, day: dayNum, title: "Shift & Capitals", type: "intro", introKind: "shift" },
    { id: `${d}_drill1`, day: dayNum, title: "Capital Letters Drill", type: "drill", rounds: () => 8, gen: () => capsDrill(allKnown) },
    { id: `${d}_drill2`, day: dayNum, title: "Capitalized Words", type: "drill", rounds: () => 6, gen: () => capsWordsDrill(allKnown) },
    { id: `${d}_sent`, day: dayNum, title: "Capitalized Sentences", type: "sentences", bank: SENT_CAPS },
    { id: `${d}_game`, day: dayNum, title: "Game: Sky Fall (Capitals)", type: "game", gen: () => gameContentFor(allKnown, dayNum, { caps: true }) }
  ];
}

function buildNumSymDay(dayNum, title, chars, allKnown) {
  const d = `d${dayNum}`;
  return [
    { id: `${d}_intro`, day: dayNum, title, type: "intro", introKind: "newkey", introKeys: chars },
    { id: `${d}_drill1`, day: dayNum, title: `${title} Solo`, type: "drill", rounds: () => 8, gen: () => weightedDrill(chars, []) },
    { id: `${d}_drill2`, day: dayNum, title: `${title} Combined`, type: "drill", rounds: () => 8, gen: () => weightedDrill(chars, allKnown.slice(-4)) },
    { id: `${d}_game`, day: dayNum, title: "Game: Sky Fall", type: "game", gen: () => gameContentFor(chars, dayNum) }
  ];
}

function buildReviewDay(dayNum, weekNum, thisWeekKeys, allKnown) {
  const d = `d${dayNum}`;
  const lessons = [];
  lessons.push({ id: `${d}_wreview`, day: dayNum, title: `Week ${weekNum} Recap`, type: "drill", rounds: () => 10, gen: () => weightedDrill(thisWeekKeys.length ? thisWeekKeys : allKnown, allKnown.filter(k => !thisWeekKeys.includes(k))) });
  if (allKnown.filter(c => /[a-z]/.test(c)).length >= 6) {
    lessons.push({ id: `${d}_words`, day: dayNum, title: "Word Roundup", type: "words", rounds: () => 8, gen: () => wordsFrom(allKnown, 12) });
  }
  lessons.push({ id: `${d}_game1`, day: dayNum, title: "Game: This Week", type: "game", gen: () => gameContentFor(thisWeekKeys.length ? thisWeekKeys : allKnown, dayNum) });
  lessons.push({ id: `${d}_game2`, day: dayNum, title: "Game: Full Mix", type: "game", gen: () => gameContentFor(allKnown, dayNum) });
  lessons.push({ id: `${d}_test`, day: dayNum, title: "Timed Check-in", type: "test", timeLimit: 45, rounds: () => 1, gen: () => weightedDrill(allKnown, [], 16) });
  lessons.push({ id: `${d}_review`, day: dayNum, title: "Week Complete", type: "drill", rounds: () => 6, gen: () => weightedDrill(thisWeekKeys.length ? thisWeekKeys : allKnown, allKnown) });
  return lessons;
}

function buildSentenceStyleDay(dayNum, title, bank, allKnown) {
  const d = `d${dayNum}`;
  return [
    { id: `${d}_sent`, day: dayNum, title, type: "sentences", bank },
    { id: `${d}_drill`, day: dayNum, title: "Speed Drill", type: "words", rounds: () => 8, gen: () => wordsFrom(allKnown, 14) },
    { id: `${d}_game`, day: dayNum, title: "Game: Sky Fall", type: "game", gen: () => gameContentFor(allKnown, dayNum) }
  ];
}

function buildSpeedDay(dayNum, tier, allKnown, allSymbols) {
  const d = `d${dayNum}`;
  const timeLimit = 30 + tier * 15;
  const banks = [SENT_FULL, SENT_CAPS, SENT_NUMBERS, SENT_SYMBOLS];
  const bank = banks[Math.min(tier - 1, banks.length - 1)];
  return [
    { id: `${d}_test`, day: dayNum, title: `Speed Test (${timeLimit}s)`, type: "test", timeLimit, rounds: () => 1, gen: () => shuffle(bank.concat(SENT_FULL)).slice(0, 8).join("  ") },
    { id: `${d}_words`, day: dayNum, title: "Accuracy Words", type: "words", rounds: () => 8, gen: () => wordsFrom(allKnown, 14) },
    { id: `${d}_game`, day: dayNum, title: "Game: Sky Fall Rush", type: "game", gen: () => gameContentFor(allKnown, dayNum) }
  ];
}

function buildEnduranceDay(dayNum, tier, allKnown) {
  const d = `d${dayNum}`;
  const timeLimit = 60 + tier * 30;
  const combined = shuffle(SENT_FULL.concat(SENT_CAPS, SENT_NUMBERS, SENT_SYMBOLS));
  return [
    { id: `${d}_test`, day: dayNum, title: `Endurance Test (${timeLimit}s)`, type: "test", timeLimit, rounds: () => 1, gen: () => combined.slice(0, 10).join("  ") },
    { id: `${d}_game`, day: dayNum, title: "Game: Sky Fall Gauntlet", type: "game", gen: () => gameContentFor(allKnown, dayNum) }
  ];
}

function buildFinalDay(dayNum) {
  const d = `d${dayNum}`;
  return [
    { id: "test1", day: dayNum, title: "1-Minute Speed Test", type: "test", timeLimit: 60, rounds: () => 1, gen: () => shuffle(SENT_FULL).slice(0, 6).join("  ") },
    { id: "test2", day: dayNum, title: "3-Minute Endurance Test", type: "test", timeLimit: 180, rounds: () => 1, gen: () => shuffle(SENT_FULL.concat(SENT_CAPS, SENT_NUMBERS)).slice(0, 10).join("  ") },
    { id: "cert", day: dayNum, title: "Final Certificate Test", type: "certificate", rounds: () => 1, gen: () => CERT_PARAGRAPH }
  ];
}

function buildCurriculum() {
  const schedule = buildDaySchedule();
  let cumulative = [];      // all letters/punct learned so far
  let allSymbolsSeen = [];  // numbers + symbols learned so far
  let thisWeekKeys = [];
  const days = [];

  schedule.forEach((entry, idx) => {
    const dayNum = idx + 1;
    const weekNum = Math.ceil(dayNum / 5);
    let lessons = [];
    let newKeysToday = [];

    if (entry.kind === "letters") {
      const [k1, k2] = entry.pair;
      lessons = buildLetterDay(dayNum, entry.pair, cumulative.slice(), thisWeekKeys.slice());
      newKeysToday = [k1, k2];
      cumulative = cumulative.concat(newKeysToday);
      thisWeekKeys = thisWeekKeys.concat(newKeysToday);
    } else if (entry.kind === "caps") {
      lessons = buildCapsDay(dayNum, cumulative.slice());
    } else if (entry.kind === "num1") {
      newKeysToday = ["1", "2", "3", "4", "5"];
      lessons = buildNumSymDay(dayNum, "Numbers 1-5", newKeysToday, allSymbolsSeen.slice());
      allSymbolsSeen = allSymbolsSeen.concat(newKeysToday);
    } else if (entry.kind === "num2") {
      newKeysToday = ["6", "7", "8", "9", "0"];
      lessons = buildNumSymDay(dayNum, "Numbers 6-0", newKeysToday, allSymbolsSeen.slice());
      allSymbolsSeen = allSymbolsSeen.concat(newKeysToday);
    } else if (entry.kind === "sym1") {
      newKeysToday = ["!", "@", "#", "$", "%"];
      lessons = buildNumSymDay(dayNum, "Symbols !@#$%", newKeysToday, allSymbolsSeen.slice());
      allSymbolsSeen = allSymbolsSeen.concat(newKeysToday);
    } else if (entry.kind === "sym2") {
      newKeysToday = ["^", "&", "*", "(", ")"];
      lessons = buildNumSymDay(dayNum, "Symbols ^&*()", newKeysToday, allSymbolsSeen.slice());
      allSymbolsSeen = allSymbolsSeen.concat(newKeysToday);
    } else if (entry.kind === "punct") {
      lessons = buildSentenceStyleDay(dayNum, "Punctuation Practice", SENT_SYMBOLS, cumulative.slice());
    } else if (entry.kind === "speedwords") {
      lessons = buildSentenceStyleDay(dayNum, "Home + Top Row Sentences", SENT_TOPHOME, cumulative.slice());
    } else if (entry.kind === "sentences") {
      lessons = buildSentenceStyleDay(dayNum, "Full Sentences", SENT_FULL, cumulative.slice());
    } else if (entry.kind === "mixed") {
      lessons = buildSentenceStyleDay(dayNum, "Numbers in Context", SENT_NUMBERS, cumulative.slice());
    } else if (entry.kind === "speed") {
      lessons = buildSpeedDay(dayNum, entry.tier, cumulative.slice(), allSymbolsSeen.slice());
    } else if (entry.kind === "endurance") {
      lessons = buildEnduranceDay(dayNum, entry.tier, cumulative.slice());
    } else if (entry.kind === "final") {
      lessons = buildFinalDay(dayNum);
    } else if (entry.kind === "review") {
      lessons = buildReviewDay(dayNum, weekNum, thisWeekKeys.slice(), cumulative.slice());
      thisWeekKeys = [];
    }

    days.push({
      dayNum, weekNum, kind: entry.kind, label: DAY_KIND_LABEL[entry.kind] || entry.kind,
      newKeys: newKeysToday, lessons,
      knownLettersAfter: cumulative.slice(), knownSymbolsAfter: allSymbolsSeen.slice()
    });
  });

  return days;
}
