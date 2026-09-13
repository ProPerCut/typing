import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sun, Moon, Settings, Flame, Award, Lock, Check, Volume2, VolumeX, X, ChevronRight, Home, RotateCcw, ArrowRight } from "lucide-react";

/* ============================== DATA ============================== */

const WORD_BANK = [
  "a","as","ask","at","add","and","are","art","all","also","act","ago","air","age",
  "the","this","that","they","them","then","there","these","those","think","thing",
  "he","she","we","you","who","how","was","water","play","stay","tray","gray","spray",
  "is","it","in","on","of","or","if","up","us","go","do","so","no","my","by",
  "have","has","had","help","home","hope","half","hall","tall","fall","salad","flask",
  "letter","little","settle","puddle","riddle","kettle","turtle","hustle","gentle",
  "story","study","sturdy","steady","spider","garden","forest","potato","purple",
  "guitar","eagle","shape","grape","great","yellow","light","right","might","tight",
  "quiet","quirky","outlast","radio","idea","water","paper","tiger","order","other",
  "your","year","dear","fear","near","hear","clear","learn","earth","heart","start",
  "world","word","work","worth","worry","first","test","type","types","tests","key",
  "keys","finger","hands","speed","skill","level","lesson","master","typist","teacher",
  "school","office","market","garden","dollar","travel","planet","system","record",
  "friend","family","future","moment","reason","result","effort","energy","freedom",
  "simple","single","double","triple","choice","change","chance","charge","church",
  "person","people","public","nation","nature","normal","number","object","obtain",
  "orange","output","parent","pencil","period","permit","player","policy","poetry",
  "flag","glad","jag","lag","sad","gala","gash","half","hash","lads","fads","gaff",
  "quick","brown","jumps","over","lazy","dogs","fox","five","dozen","pack","box",
  "seashells","seashore","musicians","hobby","mountain","sunrise","practice","habits",
  "daily","lasting","confidence","progress","perfection","results","remarkable"
];

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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function wordsFrom(letters, count = 14, maxLen = 8) {
  const set = new Set(letters);
  const pool = WORD_BANK.filter(w => w.length <= maxLen && [...w].every(c => set.has(c)));
  const picked = shuffle(pool).slice(0, count);
  return picked.length ? picked.join(" ") : letters.join(" ");
}

function drillFrom(keys, groups = 14) {
  const out = [];
  for (let i = 0; i < groups; i++) {
    const len = 2 + Math.floor(Math.random() * 3);
    let s = "";
    for (let j = 0; j < len; j++) s += keys[Math.floor(Math.random() * keys.length)];
    out.push(s);
  }
  return out.join(" ");
}

// Pure repetition of a single brand-new key, so a beginner can drill just
// that one finger movement until it stops needing conscious thought.
function soloDrill(key, groups = 22) {
  const out = [];
  for (let i = 0; i < groups; i++) {
    const len = 2 + Math.floor(Math.random() * 4); // 2-5 reps per group
    out.push(key.repeat(len));
  }
  return out.join(" ");
}

// Mixes the newest key in with everything already learned so far - never
// with anything the learner hasn't been taught yet.
function comboDrill(learnedKeys, focusKey, groups = 18) {
  const out = [];
  for (let i = 0; i < groups; i++) {
    const len = 2 + Math.floor(Math.random() * 3); // 2-4 chars per group
    let s = "";
    for (let j = 0; j < len; j++) {
      // weight toward the new key so it still gets extra reps while it's fresh
      if (Math.random() < 0.45) s += focusKey;
      else s += learnedKeys[Math.floor(Math.random() * learnedKeys.length)];
    }
    out.push(s);
  }
  return out.join(" ");
}

const KEY_LABELS = { ",": "Comma", ".": "Period", "/": "Slash", ";": "Semicolon" };
function labelFor(k) { return KEY_LABELS[k] || k.toUpperCase(); }
function idFor(k) { return (KEY_LABELS[k] ? KEY_LABELS[k].toLowerCase() : k).replace(/[^a-z0-9]/gi, "_"); }

const HOME_PHRASES = "a lad a sad dad a flask of salad a gala hall half a flag a glass gash a jag or lag all fall";
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
  "Focus on accuracy first, and speed will follow naturally."
];
const SENT_NUMBERS = [
  "I have 3 cats, 12 dogs, and 7 fish at home.",
  "The store opens at 9 and closes at 8 daily.",
  "She scored 95 out of 100 on her typing test.",
  "There are 24 hours in a day and 7 days in a week.",
  "He bought 2 apples, 4 oranges, and 6 bananas today."
];
const SENT_SYMBOLS = [
  "Don't stop; keep going, even when it's hard!",
  "The total cost was $45.99 (including tax & tip).",
  "Use #hashtags & @mentions to boost your post's reach.",
  "She asked, \"Are you ready?\" and I said, \"Yes!\"",
  "50% off sale ends at 9pm - don't miss it!"
];
const CERT_PARAGRAPH =
  "Congratulations! You have reached the final challenge. Type this paragraph as fast and accurately as you can: mix letters, numbers (like 42 or 2026), symbols (@, #, $, %), and punctuation - commas, periods, and even an exclamation mark! Take a breath, relax your fingers, and begin whenever you are ready.";

function buildCurriculum() {
  const stages = [];
  let cumulative = [];

  const addKeys = (...ks) => { cumulative = [...new Set([...cumulative, ...ks])]; };

  // Every key below is introduced ALONE first (pure repetition, no other
  // keys mixed in) and only afterwards combined with keys already learned.
  // Word/sentence lessons only ever draw on keys that have been taught by
  // that point, so nothing unfamiliar sneaks into practice text.
  function addKeyLessons(lessonsArr, prefix, k) {
    addKeys(k);
    const learnedSoFar = [...cumulative];
    lessonsArr.push({
      id: `${prefix}_${idFor(k)}_solo`, title: `"${labelFor(k)}" \u2014 learn the key`, type: "drill",
      keys: [k], gen: () => soloDrill(k, 22)
    });
    lessonsArr.push({
      id: `${prefix}_${idFor(k)}_combo`, title: `"${labelFor(k)}" \u2014 mix with what you know`, type: "drill",
      keys: [k], gen: () => comboDrill(learnedSoFar, k, 18)
    });
  }

  // Stage 1: Home Row
  const homeLessons = [];
  const homeKeys = ["f","j","d","k","s","l","a",";","g","h"];
  homeKeys.forEach(k => addKeyLessons(homeLessons, "h", k));
  const homeFinalKeys = [...cumulative];
  homeLessons.push({ id: "h_words", title: "Home Row Words", type: "words", keys: [], gen: () => wordsFrom(homeFinalKeys, 16) });
  stages.push({ name: "Home Row", lessons: homeLessons });

  // Stage 2: Top Row
  const topLessons = [];
  const topKeys = ["q","p","w","o","e","i","r","u","t","y"];
  topKeys.forEach(k => addKeyLessons(topLessons, "t", k));
  const topSnap = [...cumulative];
  topLessons.push({ id: "t_words", title: "Words: Home + Top Row", type: "words", keys: [], gen: () => wordsFrom(topSnap, 16) });
  topLessons.push({ id: "t_sentences", title: "Sentences: Home + Top Row", type: "sentences", keys: [], gen: () => shuffle(SENT_TOPHOME).slice(0,4).join("  ") });
  stages.push({ name: "Top Row", lessons: topLessons });

  // Stage 3: Bottom Row
  const bottomLessons = [];
  const bottomKeys = ["z","x","c","v","b","n","m",",",".","/"];
  bottomKeys.forEach(k => addKeyLessons(bottomLessons, "b", k));
  const fullAlpha = [...cumulative, " "];
  bottomLessons.push({ id: "b_words", title: "Full Alphabet Words", type: "words", keys: [], gen: () => wordsFrom(fullAlpha, 18) });
  bottomLessons.push({ id: "b_sentences", title: "Full Alphabet Sentences", type: "sentences", keys: [], gen: () => shuffle(SENT_FULL).slice(0,3).join("  ") });
  stages.push({ name: "Bottom Row", lessons: bottomLessons });

  // Stage 4: Capitals
  stages.push({ name: "Capitalization", lessons: [
    { id: "cap1", title: "Shift + Capitals Drill", type: "drill", keys: [], gen: () => {
        const letters = "abcdefghijklmnopqrstuvwxyz".split("");
        const out = [];
        for (let i=0;i<14;i++){ const c = letters[Math.floor(Math.random()*letters.length)]; out.push(c.toUpperCase()+c+c.toUpperCase()); }
        return out.join(" ");
      }},
    { id: "cap2", title: "Capitalized Sentences", type: "sentences", keys: [], gen: () => shuffle(SENT_CAPS).slice(0,3).join("  ") }
  ]});

  // Stage 5: Numbers
  stages.push({ name: "Numbers", lessons: [
    { id: "num1", title: "Number Row Drill", type: "drill", keys: [], gen: () => drillFrom("1234567890".split("")) },
    { id: "num2", title: "Numbers in Context", type: "sentences", keys: [], gen: () => shuffle(SENT_NUMBERS).slice(0,3).join("  ") }
  ]});

  // Stage 6: Symbols
  stages.push({ name: "Symbols & Punctuation", lessons: [
    { id: "sym1", title: "Symbol Drill", type: "drill", keys: [], gen: () => drillFrom("!@#$%^&*()-_=+".split("")) },
    { id: "sym2", title: "Punctuation Practice", type: "sentences", keys: [], gen: () => shuffle(SENT_SYMBOLS).slice(0,3).join("  ") }
  ]});

  // Stage 7: Mastery
  stages.push({ name: "Mastery", lessons: [
    { id: "test1", title: "1-Minute Speed Test", type: "test", timeLimit: 60, keys: [], gen: () => shuffle(SENT_FULL).slice(0,6).join("  ") },
    { id: "test2", title: "3-Minute Endurance Test", type: "test", timeLimit: 180, keys: [], gen: () => shuffle([...SENT_FULL, ...SENT_CAPS, ...SENT_NUMBERS]).slice(0,10).join("  ") },
    { id: "cert", title: "Final Certificate Test", type: "certificate", keys: [], gen: () => CERT_PARAGRAPH }
  ]});

  return stages;
}

const CURRICULUM = buildCurriculum();
const ALL_LESSONS = CURRICULUM.flatMap(s => s.lessons);

const BADGES = [
  { id: "first", label: "First Steps", desc: "Complete your first lesson", check: (p) => Object.keys(p.completed).length >= 1 },
  { id: "homehero", label: "Home Row Hero", desc: "Finish the whole Home Row stage", check: (p) => CURRICULUM.find(s => s.name === "Home Row").lessons.every(l => p.completed[l.id]) },
  { id: "alphabet", label: "Alphabet Master", desc: "Type every letter with confidence", check: (p) => p.completed["b_sentences"] },
  { id: "speed", label: "Speed Demon", desc: "Hit 40+ WPM in a lesson", check: (p) => p.bestWpm >= 40 },
  { id: "sharp", label: "Sharpshooter", desc: "Score 100% accuracy once", check: (p) => p.bestAccuracy >= 100 },
  { id: "numbers", label: "Number Cruncher", desc: "Finish the Numbers stage", check: (p) => p.completed["num2"] },
  { id: "symbols", label: "Symbol Sensei", desc: "Finish the Symbols stage", check: (p) => p.completed["sym2"] },
  { id: "streak3", label: "3-Day Streak", desc: "Practice 3 days in a row", check: (p) => p.streak >= 3 },
  { id: "streak7", label: "7-Day Streak", desc: "Practice 7 days in a row", check: (p) => p.streak >= 7 },
  { id: "certified", label: "Certified Typist", desc: "Pass the final certificate test", check: (p) => p.completed["cert"] }
];

/* ============================== HELPERS ============================== */

function todayISO() { return new Date().toISOString().slice(0,10); }
function daysBetween(a,b){ return Math.round((new Date(b) - new Date(a)) / 86400000); }

function computeStars(accuracy, wpm) {
  if (accuracy >= 96 && wpm >= 35) return 3;
  if (accuracy >= 88 && wpm >= 20) return 2;
  return 1;
}

function isLessonUnlocked(lessonId, progress) {
  const idx = ALL_LESSONS.findIndex(l => l.id === lessonId);
  if (idx <= 0) return true;
  const prev = ALL_LESSONS[idx - 1];
  return !!progress.completed[prev.id];
}

/* ============================== SOUND ============================== */

function useSounds(enabled) {
  const ctxRef = useRef(null);
  const play = useCallback((type) => {
    if (!enabled) return;
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = type === "error" ? 160 : type === "complete" ? 660 : 440;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) { /* audio unavailable, ignore */ }
  }, [enabled]);
  return play;
}

/* ============================== UI PIECES ============================== */

function FingerLegend() {
  const items = Object.keys(FINGER_NAMES);
  return (
    <div className="legend">
      {items.map(f => (
        <div className="legend-item" key={f}>
          <span className="legend-dot" style={{ background: FINGER_COLORS[f] }} />
          <span>{FINGER_NAMES[f]}</span>
        </div>
      ))}
    </div>
  );
}

// A stylized top-down pair of hands. One local geometry is defined for the
// left hand; the right hand reuses it via a horizontal mirror, since a right
// hand is just a left hand flipped. This makes it obvious at a glance which
// physical finger should move next, instead of asking a beginner to
// translate a color or a finger name into a body part themselves.
function HandGraphic({ side, activeFinger, needsShift, shiftSide }) {
  const isLeft = side === "L";
  const codes = isLeft ? ["LP","LR","LM","LI"] : ["RP","RR","RM","RI"];
  const positions = [-72, -36, 0, 36]; // outer(pinky) -> inner(index), local x
  const lengths = [58, 78, 88, 72];
  const thumbCode = "TH";
  const shiftActiveHere = needsShift && shiftSide === side;

  return (
    <g transform={isLeft ? "translate(150,172)" : "translate(330,172) scale(-1,1)"}>
      {/* palm */}
      <rect x="-92" y="-72" width="184" height="76" rx="34" className="hand-palm" />
      {/* four fingers */}
      {codes.map((code, i) => {
        const active = code === activeFinger;
        const x = positions[i];
        const len = lengths[i];
        return (
          <rect
            key={code}
            x={x - 15} y={-72 - len} width="30" height={len + 18} rx="15"
            fill={active ? FINGER_COLORS[code] : "var(--key-face)"}
            stroke={active ? FINGER_COLORS[code] : "var(--border)"}
            strokeWidth={active ? 3 : 1.5}
            style={active ? { color: FINGER_COLORS[code] } : undefined}
            className={active ? "finger-active" : ""}
          />
        );
      })}
      {/* thumb, angled toward the space bar */}
      <rect
        x="46" y="-28" width="26" height="70" rx="13"
        transform="rotate(52 59 7)"
        fill={shiftActiveHere || activeFinger === "TH" ? FINGER_COLORS[thumbCode] : "var(--key-face)"}
        stroke={shiftActiveHere || activeFinger === "TH" ? FINGER_COLORS[thumbCode] : "var(--border)"}
        strokeWidth={shiftActiveHere || activeFinger === "TH" ? 3 : 1.5}
        style={(shiftActiveHere || activeFinger === "TH") ? { color: FINGER_COLORS[thumbCode] } : undefined}
        className={(shiftActiveHere || activeFinger === "TH") ? "finger-active" : ""}
      />
    </g>
  );
}

function HandDiagram({ nextChar }) {
  const info = nextChar ? resolveKeyInfo(nextChar) : null;
  const activeKey = info ? info.key : null;
  const activeFinger = activeKey ? KEY_FINGER[activeKey] : null;
  const needsShift = info ? info.shift : false;
  const shiftSide = activeFinger && activeFinger.startsWith("L") ? "R" : "L";

  return (
    <div className="hand-diagram">
      <div className="hand-instruction">
        {activeFinger ? (
          <>Press with your <span style={{ color: FINGER_COLORS[activeFinger], fontWeight: 700 }}>{FINGER_NAMES[activeFinger]}</span>
            {needsShift && <> &nbsp;+ hold <b>Shift</b> with your {shiftSide === "L" ? "left" : "right"} pinky</>}
          </>
        ) : "Get ready\u2026"}
      </div>
      <svg viewBox="0 0 480 210" className="hand-svg">
        <HandGraphic side="L" activeFinger={activeFinger} needsShift={needsShift} shiftSide={shiftSide} />
        <HandGraphic side="R" activeFinger={activeFinger} needsShift={needsShift} shiftSide={shiftSide} />
      </svg>
    </div>
  );
}

function VirtualKeyboard({ nextChar }) {
  const info = nextChar ? resolveKeyInfo(nextChar) : null;
  const activeKey = info ? info.key : null;
  const needsShift = info ? info.shift : false;
  const activeFinger = activeKey ? KEY_FINGER[activeKey] : null;
  const shiftSide = activeFinger && activeFinger.startsWith("L") ? "right" : "left";

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, ri) => (
        <div className="kb-row" key={ri}>
          {ri === 0 && <div className="key key-wide key-ghost">tab</div>}
          {row.map(k => {
            const active = k === activeKey;
            const finger = KEY_FINGER[k];
            return (
              <div
                key={k}
                className={`key${active ? " key-active" : ""}`}
                style={active ? { borderColor: FINGER_COLORS[finger], boxShadow: `0 0 0 2px ${FINGER_COLORS[finger]}55` } : {}}
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
      <div className="kb-row">
        <div className={`key key-wide${needsShift && shiftSide === "left" ? " key-active" : ""}`}
             style={needsShift && shiftSide === "left" ? { borderColor: FINGER_COLORS.LP, boxShadow: `0 0 0 2px ${FINGER_COLORS.LP}55` } : {}}>
          shift
        </div>
        <div className={`key key-space${activeKey === " " ? " key-active" : ""}`}
             style={activeKey === " " ? { borderColor: FINGER_COLORS.TH, boxShadow: `0 0 0 2px ${FINGER_COLORS.TH}55` } : {}} />
        <div className={`key key-wide${needsShift && shiftSide === "right" ? " key-active" : ""}`}
             style={needsShift && shiftSide === "right" ? { borderColor: FINGER_COLORS.RP, boxShadow: `0 0 0 2px ${FINGER_COLORS.RP}55` } : {}}>
          shift
        </div>
      </div>
    </div>
  );
}

function Stars({ count }) {
  return (
    <span className="stars">
      {[1,2,3].map(i => <span key={i} className={i <= count ? "star star-on" : "star"}>&#9733;</span>)}
    </span>
  );
}

function Sidebar({ progress, currentId, onSelect }) {
  return (
    <div className="sidebar">
      <div className="brand">TYPE//TUTOR</div>
      <div className="sidebar-scroll">
        {CURRICULUM.map(stage => (
          <div className="stage-block" key={stage.name}>
            <div className="stage-title">{stage.name}</div>
            {stage.lessons.map(lesson => {
              const done = progress.completed[lesson.id];
              const unlocked = isLessonUnlocked(lesson.id, progress);
              const active = lesson.id === currentId;
              return (
                <button
                  key={lesson.id}
                  className={`lesson-btn${active ? " lesson-active" : ""}${!unlocked ? " lesson-locked" : ""}`}
                  disabled={!unlocked}
                  onClick={() => onSelect(lesson.id)}
                >
                  <span className="lesson-icon">
                    {!unlocked ? <Lock size={13}/> : done ? <Check size={13}/> : <span className="dot"/>}
                  </span>
                  <span className="lesson-name">{lesson.title}</span>
                  {done && <Stars count={progress.stars[lesson.id] || 0} />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBar({ theme, onToggleTheme, onOpenSettings, streak, badgeCount }) {
  return (
    <div className="topbar">
      <div className="topbar-title">Learn to type, one key at a time.</div>
      <div className="topbar-right">
        <div className="chip"><Flame size={14}/> {streak}</div>
        <div className="chip"><Award size={14}/> {badgeCount}</div>
        <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}
        </button>
        <button className="icon-btn" onClick={onOpenSettings} title="Settings">
          <Settings size={17}/>
        </button>
      </div>
    </div>
  );
}

function Dashboard({ progress, onStart, onWeakDrill }) {
  const totalLessons = ALL_LESSONS.length;
  const doneCount = Object.keys(progress.completed).length;
  const pct = Math.round((doneCount / totalLessons) * 100);
  const chartData = progress.history.slice(-20).map((h, i) => ({ n: i+1, wpm: h.wpm }));
  const earnedBadges = BADGES.filter(b => b.check(progress));
  const nextLesson = ALL_LESSONS.find(l => !progress.completed[l.id]) || ALL_LESSONS[ALL_LESSONS.length-1];

  return (
    <div className="dashboard">
      <div className="panel hero-panel">
        <div>
          <div className="hero-eyebrow">Your progress</div>
          <div className="hero-big">{pct}%</div>
          <div className="muted">{doneCount} of {totalLessons} lessons complete</div>
        </div>
        <button className="btn-primary" onClick={() => onStart(nextLesson.id)}>
          Continue &middot; {nextLesson.title} <ArrowRight size={15}/>
        </button>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-title">Speed over time</div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="n" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 12 }} />
                <Line type="monotone" dataKey="wpm" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="muted small">Complete a couple of lessons to see your speed trend here.</div>}
        </div>
        <div className="panel">
          <div className="panel-title">Badges earned ({earnedBadges.length}/{BADGES.length})</div>
          <div className="badge-grid">
            {BADGES.map(b => (
              <div className={`badge-chip${earnedBadges.includes(b) ? " badge-on" : ""}`} key={b.id} title={b.desc}>
                <Award size={14}/> {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Weak-key drill</div>
        <div className="muted small" style={{marginBottom:10}}>Practice built from the keys that trip you up most, based on your mistakes so far.</div>
        <button className="btn-secondary" onClick={onWeakDrill}>Practice my weak keys</button>
      </div>
    </div>
  );
}

function CertificateView({ name, setName, stats, onBack }) {
  return (
    <div className="cert-wrap">
      <div className="certificate">
        <div className="cert-eyebrow">Certificate of Completion</div>
        <div className="cert-title">Touch Typing Mastery</div>
        <div className="cert-line">awarded to</div>
        <input className="cert-name-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Type your name" />
        <div className="cert-line">for completing every lesson with</div>
        <div className="cert-stats">
          <div><span className="cert-num">{stats.wpm}</span><span className="cert-label">WPM</span></div>
          <div><span className="cert-num">{stats.accuracy}%</span><span className="cert-label">Accuracy</span></div>
        </div>
        <div className="cert-date">{new Date().toLocaleDateString()}</div>
      </div>
      <button className="btn-secondary" onClick={onBack} style={{marginTop:20}}>Back to dashboard</button>
    </div>
  );
}

/* ============================== LESSON VIEW ============================== */

function LessonView({ lesson, settings, onComplete, onExit, playSound }) {
  const [target, setTarget] = useState(() => lesson.gen());
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [errorMap, setErrorMap] = useState({});
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, [lesson.id]);

  // Let the learner hit Enter to move on instead of reaching for the mouse.
  useEffect(() => {
    if (!finished) return;
    function onKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        onExit();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finished, onExit]);

  useEffect(() => {
    if (startTime && !finished) {
      timerRef.current = setInterval(() => setElapsed(Date.now() - startTime), 250);
      return () => clearInterval(timerRef.current);
    }
  }, [startTime, finished]);

  useEffect(() => {
    if (lesson.type === "test" && lesson.timeLimit && startTime && !finished) {
      if (elapsed / 1000 >= lesson.timeLimit) finish();
    }
    // eslint-disable-next-line
  }, [elapsed]);

  const correctCount = useMemo(() => {
    let c = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) c++;
    return c;
  }, [typed, target]);

  const accuracy = typed.length ? Math.max(0, Math.round((correctCount / typed.length) * 100)) : 100;
  const minutes = Math.max(elapsed / 60000, 1/60);
  const wpm = typed.length ? Math.round((correctCount / 5) / minutes) : 0;

  function finish() {
    if (finished) return;
    setFinished(true);
    clearInterval(timerRef.current);
    playSound("complete");
    onComplete({ lessonId: lesson.id, accuracy, wpm, errorMap });
  }

  function handleChange(e) {
    if (finished) return;
    let val = e.target.value;
    if (val.length > target.length) val = val.slice(0, target.length);
    if (!startTime && val.length > 0) setStartTime(Date.now());

    if (val.length > typed.length) {
      const i = val.length - 1;
      if (val[i] !== target[i]) {
        playSound("error");
        setErrorMap(m => ({ ...m, [target[i]]: (m[target[i]] || 0) + 1 }));
      } else {
        playSound("key");
      }
    }
    setTyped(val);
    if (val.length === target.length) {
      setTimeout(finish, 150);
    }
  }

  function handleRestart() {
    setTarget(lesson.gen());
    setTyped(""); setStartTime(null); setErrorMap({}); setFinished(false); setElapsed(0);
    inputRef.current && inputRef.current.focus();
  }

  const nextChar = target[typed.length];
  const stars = computeStars(accuracy, wpm);

  return (
    <div className="lesson-view">
      <div className="lesson-header">
        <button className="icon-btn" onClick={onExit}><Home size={16}/></button>
        <div className="lesson-header-title">{lesson.title}</div>
        <div className="lesson-stats">
          <span>{wpm} <b>WPM</b></span>
          <span>{accuracy}% <b>ACC</b></span>
          <span>{Math.floor(elapsed/1000)}s</span>
        </div>
      </div>

      <div className="passage-wrap" onClick={() => inputRef.current && inputRef.current.focus()} style={{ fontSize: settings.fontSize }}>
        <div className="passage">
          {target.split("").map((ch, i) => {
            let cls = "ch-pending";
            if (i < typed.length) cls = typed[i] === ch ? "ch-correct" : "ch-wrong";
            else if (i === typed.length) cls = "ch-current";
            return <span className={cls} key={i}>{ch === " " ? "\u00A0" : ch}</span>;
          })}
        </div>
        <input
          ref={inputRef}
          className="hidden-input"
          value={typed}
          onChange={handleChange}
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      <HandDiagram nextChar={finished ? null : nextChar} />
      <VirtualKeyboard nextChar={finished ? null : nextChar} />
      <FingerLegend />

      {finished && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-title">Lesson complete</div>
            <Stars count={stars} />
            <div className="result-grid">
              <div><div className="result-num">{wpm}</div><div className="muted small">WPM</div></div>
              <div><div className="result-num">{accuracy}%</div><div className="muted small">Accuracy</div></div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleRestart}><RotateCcw size={14}/> Retry</button>
              <button className="btn-primary" onClick={onExit}>Continue <ChevronRight size={14}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== SETTINGS MODAL ============================== */

function SettingsModal({ settings, setSettings, onClose, onReset }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title-row">
          <div className="modal-title">Settings</div>
          <button className="icon-btn" onClick={onClose}><X size={16}/></button>
        </div>
        <div className="settings-row">
          <span>Sound effects</span>
          <button className="icon-btn" onClick={() => setSettings(s => ({...s, sound: !s.sound}))}>
            {settings.sound ? <Volume2 size={16}/> : <VolumeX size={16}/>}
          </button>
        </div>
        <div className="settings-row">
          <span>Text size</span>
          <input type="range" min="16" max="30" value={settings.fontSize} onChange={e => setSettings(s => ({...s, fontSize: Number(e.target.value)}))} />
        </div>
        <div className="settings-row">
          <span>Difficulty</span>
          <select value={settings.difficulty} onChange={e => setSettings(s => ({...s, difficulty: e.target.value}))}>
            <option value="relaxed">Relaxed</option>
            <option value="standard">Standard</option>
            <option value="strict">Strict</option>
          </select>
        </div>
        <button className="btn-secondary" style={{marginTop:14, width:"100%"}} onClick={onReset}>Reset all progress</button>
      </div>
    </div>
  );
}

/* ============================== MAIN APP ============================== */

const DEFAULT_PROGRESS = { completed: {}, stars: {}, history: [], streak: 0, lastDate: null, bestWpm: 0, bestAccuracy: 0, certName: "" };

export default function App() {
  const [theme, setTheme] = useState("light");
  const [screen, setScreen] = useState("dashboard");
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [settings, setSettings] = useState({ sound: true, fontSize: 22, difficulty: "standard" });
  const [showSettings, setShowSettings] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [weakLesson, setWeakLesson] = useState(null);
  const playSound = useSounds(settings.sound);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("typing_tutor_v1");
      if (saved) {
        const data = JSON.parse(saved);
        setProgress(p => ({ ...DEFAULT_PROGRESS, ...(data.progress || {}) }));
        setSettings(s => ({ ...s, ...(data.settings || {}) }));
        setTheme(data.theme || "light");
      }
    } catch (e) {
      /* first run or invalid saved data */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        "typing_tutor_v1",
        JSON.stringify({ progress, settings, theme })
      );
    } catch (e) {
      /* storage unavailable, ignore */
    }
  }, [progress, settings, theme, loaded]);

  function handleCompleteLesson({ lessonId, accuracy, wpm, errorMap }) {
    setProgress(p => {
      const stars = computeStars(accuracy, wpm);
      const today = todayISO();
      let streak = p.streak;
      if (p.lastDate !== today) {
        const diff = p.lastDate ? daysBetween(p.lastDate, today) : 1;
        streak = diff === 1 ? p.streak + 1 : diff === 0 ? p.streak : 1;
      }
      return {
        ...p,
        completed: { ...p.completed, [lessonId]: true },
        stars: { ...p.stars, [lessonId]: Math.max(p.stars[lessonId] || 0, stars) },
        history: [...p.history, { date: today, wpm, accuracy }],
        bestWpm: Math.max(p.bestWpm, wpm),
        bestAccuracy: Math.max(p.bestAccuracy, accuracy),
        streak, lastDate: today
      };
    });
    if (lessonId === "cert") setTimeout(() => setShowCert(true), 400);
  }

  function startLesson(id) {
    setCurrentLessonId(id);
    setScreen("lesson");
  }

  function weakKeyLesson() {
    const errCounts = {};
    progress.history.forEach(() => {}); // history doesn't store per-key; use a synthetic weak set fallback
    const keys = "etaoinshrdlucmfwypvbgkjqxz".split("").slice(0, 10);
    const fake = { id: "weak", title: "Weak Key Drill", type: "drill", gen: () => drillFrom(keys, 16) };
    setCurrentLessonId("weak");
    setScreen("lesson");
    setWeakLesson(fake);
  }

  const currentLesson = currentLessonId === "weak"
    ? weakLesson
    : ALL_LESSONS.find(l => l.id === currentLessonId);

  const earnedBadgeCount = BADGES.filter(b => b.check(progress)).length;

  return (
    <div className={`app-root theme-${theme}`}>
      <style>{CSS}</style>
      {screen === "lesson" && currentLesson ? (
        <div className="lesson-shell">
          <LessonView
            lesson={currentLesson}
            settings={settings}
            playSound={playSound}
            onComplete={handleCompleteLesson}
            onExit={() => setScreen("dashboard")}
          />
        </div>
      ) : showCert ? (
        <div className="main-shell">
          <TopBar theme={theme} onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")} onOpenSettings={() => setShowSettings(true)} streak={progress.streak} badgeCount={earnedBadgeCount} />
          <CertificateView
            name={progress.certName}
            setName={(n) => setProgress(p => ({...p, certName: n}))}
            stats={{ wpm: progress.bestWpm, accuracy: progress.bestAccuracy }}
            onBack={() => { setShowCert(false); setScreen("dashboard"); }}
          />
        </div>
      ) : (
        <div className="main-shell">
          <Sidebar progress={progress} currentId={currentLessonId} onSelect={startLesson} />
          <div className="main-col">
            <TopBar theme={theme} onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")} onOpenSettings={() => setShowSettings(true)} streak={progress.streak} badgeCount={earnedBadgeCount} />
            <Dashboard progress={progress} onStart={startLesson} onWeakDrill={weakKeyLesson} />
          </div>
        </div>
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
          onReset={() => { setProgress(DEFAULT_PROGRESS); setShowSettings(false); }}
        />
      )}
    </div>
  );
}

/* ============================== STYLES ============================== */

const CSS = `
.app-root {
  --font-ui: 'IBM Plex Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', 'JetBrains Mono', monospace;
  min-height: 100vh; font-family: var(--font-ui); color: var(--ink);
}
.theme-light {
  --bg: #EDE8DD; --surface: #FFFFFF; --ink: #262220; --muted: #766F63;
  --accent: #8A6D3B; --correct: #3F7A52; --error: #B23A2E; --border: #DCD5C6; --key-face: #F7F4EC;
}
.theme-dark {
  --bg: #1B1815; --surface: #242019; --ink: #EDE6D9; --muted: #9C9284;
  --accent: #C08A4E; --correct: #6FAE7F; --error: #E06A57; --border: #383228; --key-face: #2E2A22;
}
.app-root { background: var(--bg); }
.main-shell { display: flex; min-height: 100vh; }
.sidebar { width: 230px; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border); display:flex; flex-direction:column; }
.brand { font-family: var(--font-mono); font-weight:700; letter-spacing: 0.02em; padding: 18px 16px; border-bottom: 1px solid var(--border); font-size: 14px; }
.sidebar-scroll { overflow-y:auto; padding: 8px; }
.stage-block { margin-bottom: 10px; }
.stage-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding: 8px 8px 4px; }
.lesson-btn { display:flex; align-items:center; gap:8px; width:100%; text-align:left; background:none; border:none; padding:7px 8px; border-radius:6px; font-size:13px; color: var(--ink); cursor:pointer; }
.lesson-btn:hover:not(:disabled) { background: var(--bg); }
.lesson-active { background: var(--bg); font-weight:600; }
.lesson-locked { color: var(--muted); cursor: not-allowed; }
.lesson-icon { width:16px; display:flex; align-items:center; color: var(--muted); }
.dot { width:6px; height:6px; border-radius:50%; background: var(--muted); display:inline-block; }
.lesson-name { flex:1; }
.main-col { flex:1; display:flex; flex-direction:column; min-width:0; }
.topbar { display:flex; align-items:center; justify-content:space-between; padding: 14px 24px; border-bottom:1px solid var(--border); }
.topbar-title { font-size: 13px; color: var(--muted); }
.topbar-right { display:flex; align-items:center; gap:10px; }
.chip { display:flex; align-items:center; gap:5px; font-size:12px; background: var(--surface); border:1px solid var(--border); padding:4px 9px; border-radius: 20px; }
.icon-btn { background:none; border:1px solid var(--border); border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--ink); }
.icon-btn:hover { border-color: var(--accent); }
.dashboard { padding: 24px; display:flex; flex-direction:column; gap:16px; max-width: 900px; }
.panel { background: var(--surface); border:1px solid var(--border); border-radius:10px; padding:18px 20px; }
.hero-panel { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
.hero-eyebrow { font-size:12px; color: var(--muted); }
.hero-big { font-family: var(--font-mono); font-size: 40px; font-weight:700; line-height:1.1; }
.muted { color: var(--muted); }
.small { font-size: 12.5px; }
.grid2 { display:grid; grid-template-columns: 1.3fr 1fr; gap:16px; }
.panel-title { font-size:13px; font-weight:600; margin-bottom:10px; }
.badge-grid { display:flex; flex-wrap:wrap; gap:7px; }
.badge-chip { font-size:11.5px; display:flex; align-items:center; gap:5px; border:1px solid var(--border); border-radius:20px; padding:4px 10px; color: var(--muted); }
.badge-on { color: var(--accent); border-color: var(--accent); }
.btn-primary { background: var(--accent); color: #fff; border:none; border-radius:8px; padding:10px 16px; font-size:13.5px; font-weight:600; display:flex; align-items:center; gap:6px; cursor:pointer; }
.btn-secondary { background: none; border:1px solid var(--border); color: var(--ink); border-radius:8px; padding:9px 15px; font-size:13.5px; display:flex; align-items:center; gap:6px; cursor:pointer; justify-content:center; }
.lesson-shell { flex:1; }
.lesson-view { padding: 20px 28px; display:flex; flex-direction:column; gap:18px; min-height:100vh; }
.lesson-header { display:flex; align-items:center; gap:14px; }
.lesson-header-title { font-weight:600; font-size:15px; flex:1; }
.lesson-stats { display:flex; gap:14px; font-family: var(--font-mono); font-size:13px; }
.passage-wrap { position:relative; background: var(--surface); border:1px solid var(--border); border-radius:12px; padding: 28px 30px; cursor:text; }
.passage { font-family: var(--font-mono); line-height: 1.9; letter-spacing: 0.5px; max-width: 68ch; }
.ch-pending { color: var(--muted); }
.ch-correct { color: var(--correct); }
.ch-wrong { color: var(--error); background: color-mix(in srgb, var(--error) 15%, transparent); border-radius:2px; }
.ch-current { color: var(--ink); border-bottom: 2px solid var(--accent); }
.hidden-input { position:absolute; inset:0; opacity:0; border:none; cursor:text; }
.hand-diagram { display:flex; flex-direction:column; align-items:center; gap:8px; }
.hand-instruction { font-size: 14px; color: var(--ink); text-align:center; min-height: 20px; }
.hand-svg { width: 100%; max-width: 420px; height: auto; }
.hand-palm { fill: var(--key-face); stroke: var(--border); stroke-width: 1.5; }
.finger-active { filter: drop-shadow(0 0 5px currentColor); }
.keyboard { display:flex; flex-direction:column; gap:6px; align-items:center; }
.kb-row { display:flex; gap:6px; }
.key { width:38px; height:38px; border:1px solid var(--border); border-radius:7px; background: var(--key-face); display:flex; align-items:center; justify-content:center; font-family: var(--font-mono); font-size:13px; text-transform:lowercase; transition: box-shadow .1s, border-color .1s; }
.key-ghost { opacity: 0.35; }
.key-wide { width:64px; font-size:11px; }
.key-space { width: 260px; }
.key-active { font-weight:700; }
.legend { display:flex; flex-wrap:wrap; gap:10px 16px; justify-content:center; font-size:11.5px; color: var(--muted); }
.legend-item { display:flex; align-items:center; gap:5px; }
.legend-dot { width:9px; height:9px; border-radius:50%; display:inline-block; }
.stars { font-size:20px; color: var(--border); }
.star-on { color: #E0A93B; }
.modal-backdrop { position:fixed; inset:0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:50; }
.modal { background: var(--surface); border-radius:12px; padding:24px 26px; width: 320px; border:1px solid var(--border); }
.modal-title { font-weight:700; font-size:16px; margin-bottom:8px; }
.modal-title-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.result-grid { display:flex; gap:26px; margin: 14px 0; }
.result-num { font-family: var(--font-mono); font-size:26px; font-weight:700; }
.modal-actions { display:flex; gap:10px; margin-top: 10px; }
.settings-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom: 1px solid var(--border); font-size:13.5px; }
.cert-wrap { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px; }
.certificate { background: var(--surface); border: 2px solid var(--accent); border-radius: 4px; padding: 46px 60px; text-align:center; max-width: 520px; }
.cert-eyebrow { font-size:11px; letter-spacing:0.1em; color: var(--muted); text-transform:uppercase; }
.cert-title { font-family: var(--font-mono); font-size:26px; font-weight:700; margin: 8px 0 18px; }
.cert-line { color: var(--muted); font-size:13px; margin: 6px 0; }
.cert-name-input { font-family: var(--font-mono); font-size:20px; text-align:center; border:none; border-bottom:1px solid var(--border); background:none; color: var(--ink); padding: 6px; width: 100%; margin: 6px 0 14px; }
.cert-stats { display:flex; justify-content:center; gap: 40px; margin: 14px 0; }
.cert-num { display:block; font-family: var(--font-mono); font-size:28px; font-weight:700; color: var(--accent); }
.cert-label { font-size:11px; color: var(--muted); }
.cert-date { font-size:12px; color: var(--muted); margin-top: 10px; }
@media (max-width: 760px) {
  .sidebar { display:none; }
  .grid2 { grid-template-columns: 1fr; }
  .key-space { width: 160px; }
}
`;
