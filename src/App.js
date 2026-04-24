import React, { useState, useEffect, useRef, useCallback } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const THEME_KEY = "spesometro_theme";
function getInitialTheme() {
  try {
    const s = localStorage.getItem(THEME_KEY); if (s) return s;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {} return "light";
}
const THEMES = {
  light: {
    bgPage:"#F7F6F2",bgCard:"#ffffff",bgInput:"#fafafa",bgHover:"#fafaf8",bgBar:"#f0ede8",bgCatCard:"#fafaf8",
    sidebar:"#1a1a18",sidebarActive:"#2e2e2b",sidebarText:"#888",sidebarActiveText:"#fff",sidebarSub:"#555",sidebarDivider:"#2a2a27",sidebarBadgeBg:"#2e2e2b",sidebarBadgeColor:"#888",
    textPrimary:"#1a1a18",textSecondary:"#888",textMuted:"#aaa",textFaint:"#bbb",
    border:"#ebebeb",borderInput:"#e0e0e0",
    accentBlue:"#185FA5",accentBlueBg:"#E6F1FB",accentBlueBorder:"#B5D4F4",accentBlueDark:"#0C447C",accentBlueDarkBg:"#F0F6FE",
    accentGreen:"#0F6E56",accentGreenBg:"#EAF3DE",accentGreenText:"#3B6D11",
    accentRed:"#A32D2D",accentRedBg:"#FCEBEB",
    accentOrange:"#854F0B",accentOrangeBg:"#FAEEDA",accentOrangeBorder:"#FAC775",
    accentGray:"#5F5E5A",accentGrayBg:"#F1EFE8",
    accentPurple:"#6B46C1",accentPurpleBg:"#EDE9F8",accentPurpleBorder:"#C4B5FD",
    accentGold:"#B45309",accentGoldBg:"#FEF3C7",accentGoldBorder:"#FCD34D",
    btnPrimaryBg:"#1a1a18",btnPrimaryText:"#fff",btnGhostText:"#555",btnGhostBorder:"#e0e0e0",btnIconText:"#aaa",btnIconBorder:"#ebebeb",btnDefaultBg:"#F0EEE8",btnDefaultText:"#1a1a18",
    modalBg:"#fff",overlayBg:"rgba(0,0,0,0.32)",
    radioBorderActive:"#1a1a18",radioBgActive:"#f5f4f0",radioBorderInactive:"#e0e0e0",radioBgInactive:"#fafafa",
    scrollThumb:"#ddd",toggleTrackOff:"#c8c4bb",toggleKnob:"#fff",
  },
  dark: {
    bgPage:"#111110",bgCard:"#1c1c1a",bgInput:"#252522",bgHover:"#222220",bgBar:"#2a2a27",bgCatCard:"#252522",
    sidebar:"#0d0d0c",sidebarActive:"#1e1e1b",sidebarText:"#555",sidebarActiveText:"#e8e6df",sidebarSub:"#444",sidebarDivider:"#1e1e1b",sidebarBadgeBg:"#1e1e1b",sidebarBadgeColor:"#555",
    textPrimary:"#e8e6df",textSecondary:"#777",textMuted:"#555",textFaint:"#444",
    border:"#2a2a27",borderInput:"#333330",
    accentBlue:"#5B9BD5",accentBlueBg:"#1a2a3a",accentBlueBorder:"#2a4060",accentBlueDark:"#7ab3e8",accentBlueDarkBg:"#151f2a",
    accentGreen:"#3fba8f",accentGreenBg:"#152518",accentGreenText:"#5ecf9e",
    accentRed:"#d45c5c",accentRedBg:"#2a1515",
    accentOrange:"#c97d2a",accentOrangeBg:"#2a1e0d",accentOrangeBorder:"#7a4a10",
    accentGray:"#777",accentGrayBg:"#252522",
    accentPurple:"#A78BFA",accentPurpleBg:"#2D1F4E",accentPurpleBorder:"#6D4FC2",
    accentGold:"#F59E0B",accentGoldBg:"#2D1F00",accentGoldBorder:"#B45309",
    btnPrimaryBg:"#e8e6df",btnPrimaryText:"#111110",btnGhostText:"#aaa",btnGhostBorder:"#333330",btnIconText:"#555",btnIconBorder:"#2a2a27",btnDefaultBg:"#252522",btnDefaultText:"#e8e6df",
    modalBg:"#1c1c1a",overlayBg:"rgba(0,0,0,0.6)",
    radioBorderActive:"#e8e6df",radioBgActive:"#252522",radioBorderInactive:"#333330",radioBgInactive:"#1a1a18",
    scrollThumb:"#333",toggleTrackOff:"#3a3a37",toggleKnob:"#e8e6df",
  }
};

function ThemeToggle({ theme, onToggle }) {
  const T = THEMES[theme]; const isDark = theme === "dark";
  return (
    <button onClick={onToggle} title={isDark?"Passa a light mode":"Passa a dark mode"}
      style={{display:"flex",alignItems:"center",gap:7,background:"transparent",border:"none",borderRadius:20,padding:"6px 4px",cursor:"pointer",fontSize:13,color:T.sidebarText,fontFamily:"inherit",transition:"all .2s"}}>
      <span style={{width:32,height:18,borderRadius:99,background:isDark?"#5B9BD5":T.toggleTrackOff,position:"relative",transition:"background .25s",flexShrink:0,display:"inline-block"}}>
        <span style={{position:"absolute",top:3,left:isDark?15:3,width:12,height:12,borderRadius:"50%",background:T.toggleKnob,transition:"left .22s cubic-bezier(.4,0,.2,1)",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}} />
      </span>
      <span>{isDark?"🌙":"☀️"}</span>
    </button>
  );
}

// ── ACHIEVEMENT ENGINE ────────────────────────────────────────────────────────
const ACH_KEY = uid => `spesometro_ach_${uid}`;

const RARITY = {
  common:    { label:"Comune",      color:"#5F5E5A", bg:"#F1EFE8", border:"#D8D5CC" },
  rare:      { label:"Raro",        color:"#185FA5", bg:"#E6F1FB", border:"#B5D4F4" },
  epic:      { label:"Epico",       color:"#6B46C1", bg:"#EDE9F8", border:"#C4B5FD" },
  legendary: { label:"Leggendario", color:"#B45309", bg:"#FEF3C7", border:"#FCD34D" },
};

function _parseMonthKey(k) { const [y,m]=k.split("-"); return { year:parseInt(y), month:parseInt(m)-1 }; }
function _getRecForMonth(recurring, monthKey) { return (recurring||[]).filter(r=>{ if(r.startMonth>monthKey)return false; if(r.endMonth&&r.endMonth<monthKey)return false; return true; }); }

// Mesi che hanno entrate E almeno una spesa (manuale o ricorrente) — usato per i check
function _getAllMonthKeys(data) { return Object.keys(data.income||{}).filter(k=>k!=='_default'&&(data.income[k]||0)>0).sort(); }
function _getMonthsWithExpenses(data) {
  // Mesi che hanno entrate impostate E almeno una spesa registrata (variabile o fissa)
  return _getAllMonthKeys(data).filter(mk => {
    const {year,month} = _parseMonthKey(mk);
    const hasManual = (data.expenses||[]).some(e=>{ const d=new Date(e.date); return d.getMonth()===month&&d.getFullYear()===year; });
    const hasRec = _getRecForMonth(data.recurring||[], mk).length > 0;
    return hasManual || hasRec;
  });
}

function _getSpent(data, mk) {
  const {year,month} = _parseMonthKey(mk);
  const manual = (data.expenses||[]).filter(e=>{ const d=new Date(e.date); return d.getMonth()===month&&d.getFullYear()===year; }).reduce((s,e)=>s+e.amount,0);
  const rec = _getRecForMonth(data.recurring||[], mk).reduce((s,r)=>s+r.amount,0);
  return manual + rec;
}
function _getIncome(data, mk) { return data.income[mk] ?? data.income._default ?? 0; }
function _getSaving(data, mk) { const inc=_getIncome(data,mk); return inc>0?inc-_getSpent(data,mk):0; }
function _getSavingPct(data, mk) { const inc=_getIncome(data,mk); if(!inc)return 0; return (_getSaving(data,mk)/inc)*100; }
function _getManualCount(data, mk) { const {year,month}=_parseMonthKey(mk); return (data.expenses||[]).filter(e=>{ const d=new Date(e.date); return d.getMonth()===month&&d.getFullYear()===year; }).length; }

// Streak mesi CONSECUTIVI in positivo (solo mesi con dati reali)
function _positiveStreak(data) {
  const months=_getMonthsWithExpenses(data); if(!months.length) return 0;
  let s=0; for(let i=months.length-1;i>=0;i--) { if(_getSaving(data,months[i])>0) s++; else break; } return s;
}
// Streak mesi consecutivi con risparmio CRESCENTE
function _improvementStreak(data, mk) {
  const months=_getMonthsWithExpenses(data); const idx=months.indexOf(mk); if(idx<1) return 0;
  let s=0; for(let i=idx;i>=1;i--) { if(_getSaving(data,months[i])>_getSaving(data,months[i-1])) s++; else break; } return s;
}
// Mesi TOTALI in positivo (non consecutivi)
function _totalPositiveMonths(data) {
  return _getMonthsWithExpenses(data).filter(mk=>_getSaving(data,mk)>0).length;
}
// Risparmio totale cumulato su tutti i mesi
function _totalSaved(data) {
  return _getMonthsWithExpenses(data).reduce((s,mk)=>{ const sv=_getSaving(data,mk); return s+(sv>0?sv:0); },0);
}
// Spesa massima in un singolo giorno
function _maxDailySpend(data) {
  const dm={}; (data.expenses||[]).forEach(e=>{ dm[e.date]=(dm[e.date]||0)+e.amount; });
  return Math.max(0,...Object.values(dm));
}
// Numero di categorie diverse usate in un mese
function _categoriesUsedInMonth(data, mk) {
  const {year,month}=_parseMonthKey(mk);
  const cats=new Set((data.expenses||[]).filter(e=>{ const d=new Date(e.date); return d.getMonth()===month&&d.getFullYear()===year; }).map(e=>e.category));
  return cats.size;
}
// Mesi con spese tracciate ogni settimana (proxy: >=4 giorni distinti)
function _monthWithWeeklyTracking(data, mk) {
  const {year,month}=_parseMonthKey(mk);
  const days=new Set((data.expenses||[]).filter(e=>{ const d=new Date(e.date); return d.getMonth()===month&&d.getFullYear()===year; }).map(e=>e.date));
  return days.size>=4;
}

// GUARD: la maggior parte degli achievement mensili richiede che il mese
// abbia sia entrate che almeno una spesa registrata, E non sia il mese corrente
// (così non scattano appena si imposta lo stipendio).
function _monthReady(data, mk) {
  const now = new Date();
  const currentMk = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  if (mk >= currentMk) return false; // il mese corrente non è "chiuso"
  const inc = _getIncome(data, mk);
  if (!inc) return false;
  const {year,month} = _parseMonthKey(mk);
  const hasExp = (data.expenses||[]).some(e=>{ const d=new Date(e.date); return d.getMonth()===month&&d.getFullYear()===year; });
  const hasRec = _getRecForMonth(data.recurring||[], mk).length>0;
  return hasExp || hasRec;
}

const ACHIEVEMENTS = [
  // ── ONBOARDING ──────────────────────────────────────────────────────────────
  { id:"first_expense",     icon:"📝", rarity:"common",    title:"Prima spesa",          desc:"Hai tracciato la tua prima spesa. Il viaggio comincia!",
    check:(d)=>(d.expenses||[]).length>=1 },
  { id:"first_recurring",   icon:"⟳",  rarity:"common",    title:"Pianificatore",        desc:"Hai aggiunto la tua prima spesa fissa.",
    check:(d)=>(d.recurring||[]).length>=1 },
  { id:"income_set",        icon:"💵", rarity:"common",    title:"Stipendio inserito",   desc:"Hai impostato le entrate per almeno un mese.",
    check:(d)=>Object.values(d.income||{}).some(v=>v>0) },
  { id:"three_recurring",   icon:"📌", rarity:"rare",      title:"Ben organizzato",      desc:"Hai configurato almeno 3 spese fisse.",
    check:(d)=>(d.recurring||[]).length>=3 },
  { id:"five_recurring",    icon:"🗂️", rarity:"epic",      title:"Archivista",           desc:"5 spese fisse configurate. Tutto sotto controllo.",
    check:(d)=>(d.recurring||[]).length>=5 },

  // ── VOLUME SPESE ────────────────────────────────────────────────────────────
  { id:"expense_5",         icon:"✏️", rarity:"common",    title:"Cinque spese",         desc:"Hai tracciato 5 spese.",
    check:(d)=>(d.expenses||[]).length>=5 },
  { id:"expense_10",        icon:"📋", rarity:"common",    title:"Dieci spese",          desc:"Hai tracciato 10 spese. Buona abitudine!",
    check:(d)=>(d.expenses||[]).length>=10 },
  { id:"expense_25",        icon:"📂", rarity:"common",    title:"Venticinque spese",    desc:"25 spese tracciate. Stai prendendo il ritmo.",
    check:(d)=>(d.expenses||[]).length>=25 },
  { id:"expense_50",        icon:"📚", rarity:"rare",      title:"Mezzo centinaio",      desc:"50 spese tracciate. Sei disciplinato.",
    check:(d)=>(d.expenses||[]).length>=50 },
  { id:"expense_100",       icon:"🗃️", rarity:"epic",      title:"Centonaio",            desc:"100 spese tracciate. Sei un contabile nato.",
    check:(d)=>(d.expenses||[]).length>=100 },
  { id:"expense_200",       icon:"🏦", rarity:"legendary", title:"Il grande archivio",   desc:"200 spese. Non ti sfugge niente.",
    check:(d)=>(d.expenses||[]).length>=200 },

  // ── RISPARMIO MENSILE (richiedono mese chiuso con spese) ───────────────────
  { id:"first_saving",      icon:"🌱", rarity:"common",    title:"Primo risparmio",      desc:"Hai chiuso un mese in positivo per la prima volta.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSaving(d,mk)>0 },
  { id:"saving_10pct",      icon:"💰", rarity:"common",    title:"Risparmiatore",        desc:"Hai risparmiato almeno il 10% delle entrate in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSavingPct(d,mk)>=10 },
  { id:"saving_20pct",      icon:"🐜", rarity:"rare",      title:"Formichina",           desc:"Hai risparmiato almeno il 20% delle entrate.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSavingPct(d,mk)>=20 },
  { id:"saving_30pct",      icon:"🦫", rarity:"rare",      title:"Castoro",              desc:"30% delle entrate risparmiato. Impressionante.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSavingPct(d,mk)>=30 },
  { id:"saving_50pct",      icon:"🏆", rarity:"legendary", title:"Mezzo stipendio",      desc:"Hai risparmiato il 50% o più in un mese. Leggendario.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSavingPct(d,mk)>=50 },
  { id:"big_saver_200",     icon:"💶", rarity:"common",    title:"Piccolo tesoretto",    desc:"Hai risparmiato più di 200€ in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSaving(d,mk)>=200 },
  { id:"big_saver_500",     icon:"💎", rarity:"epic",      title:"Grande risparmio",     desc:"Hai risparmiato più di 500€ in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSaving(d,mk)>=500 },
  { id:"big_saver_1000",    icon:"💠", rarity:"legendary", title:"Mille euro in tasca",  desc:"Hai risparmiato più di 1000€ in un mese. Straordinario.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSaving(d,mk)>=1000 },
  { id:"under_50pct",       icon:"🧘", rarity:"rare",      title:"Minimalista",          desc:"Hai speso meno della metà delle entrate in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSpent(d,mk)<_getIncome(d,mk)*0.5 },
  { id:"under_30pct",       icon:"🏕️", rarity:"epic",      title:"Sopravvissuto",        desc:"Hai speso meno del 30% delle entrate in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSpent(d,mk)<_getIncome(d,mk)*0.3 },

  // ── RISPARMIO CUMULATO (globale, non mensile) ────────────────────────────
  { id:"total_saved_1000",  icon:"🪙", rarity:"rare",      title:"Mille in banca",       desc:"Hai risparmiato 1000€ in totale su tutti i mesi.",
    check:(d)=>_totalSaved(d)>=1000 },
  { id:"total_saved_5000",  icon:"🏅", rarity:"epic",      title:"Cinquemila!",          desc:"5000€ risparmiati in totale. Stai costruendo qualcosa.",
    check:(d)=>_totalSaved(d)>=5000 },
  { id:"total_saved_10000", icon:"🥇", rarity:"legendary", title:"Diecimila",            desc:"10.000€ risparmiati in totale. Chapeau.",
    check:(d)=>_totalSaved(d)>=10000 },
  { id:"positive_3months",  icon:"☀️", rarity:"rare",      title:"Tre mesi positivi",    desc:"3 mesi in positivo in totale (anche non consecutivi).",
    check:(d)=>_totalPositiveMonths(d)>=3 },
  { id:"positive_6months",  icon:"🌤️", rarity:"epic",      title:"Sei mesi positivi",    desc:"6 mesi in positivo in totale.",
    check:(d)=>_totalPositiveMonths(d)>=6 },
  { id:"positive_12months", icon:"🌞", rarity:"legendary", title:"Un anno di positivo",  desc:"12 mesi in positivo in totale. Eccezionale.",
    check:(d)=>_totalPositiveMonths(d)>=12 },

  // ── STREAK CONSECUTIVI ──────────────────────────────────────────────────────
  { id:"streak_2",          icon:"🔥", rarity:"common",    title:"Due di fila",          desc:"2 mesi consecutivi chiusi in positivo.",
    check:(d)=>_positiveStreak(d)>=2 },
  { id:"streak_3",          icon:"🔥🔥",rarity:"rare",     title:"Tre di fila",          desc:"3 mesi consecutivi in positivo.",
    check:(d)=>_positiveStreak(d)>=3 },
  { id:"streak_6",          icon:"⚡", rarity:"epic",      title:"Semestre perfetto",    desc:"6 mesi consecutivi in positivo.",
    check:(d)=>_positiveStreak(d)>=6 },
  { id:"streak_12",         icon:"👑", rarity:"legendary", title:"Anno perfetto",        desc:"12 mesi consecutivi. Sei una macchina.",
    check:(d)=>_positiveStreak(d)>=12 },

  // ── MIGLIORAMENTO ────────────────────────────────────────────────────────────
  { id:"improvement",       icon:"📈", rarity:"common",    title:"Sempre meglio",        desc:"Hai risparmiato più del mese precedente.",
    check:(d,mk)=>{ if(!_monthReady(d,mk)) return false; const ms=_getMonthsWithExpenses(d); const idx=ms.indexOf(mk); return idx>=1&&_getSaving(d,mk)>_getSaving(d,ms[idx-1]); } },
  { id:"improvement_3",     icon:"🚀", rarity:"rare",      title:"Trend positivo",       desc:"Hai migliorato il risparmio per 3 mesi di fila.",
    check:(d,mk)=>_monthReady(d,mk)&&_improvementStreak(d,mk)>=3 },
  { id:"improvement_6",     icon:"🛸", rarity:"epic",      title:"Iperspazio",           desc:"6 mesi consecutivi con risparmio crescente.",
    check:(d,mk)=>_monthReady(d,mk)&&_improvementStreak(d,mk)>=6 },
  { id:"double_saving",     icon:"✌️", rarity:"epic",      title:"Raddoppio!",           desc:"Hai risparmiato il doppio rispetto al mese precedente.",
    check:(d,mk)=>{ if(!_monthReady(d,mk)) return false; const ms=_getMonthsWithExpenses(d); const idx=ms.indexOf(mk); if(idx<1) return false; const prev=_getSaving(d,ms[idx-1]); return prev>0&&_getSaving(d,mk)>=prev*2; } },

  // ── ABITUDINI DI TRACCIAMENTO ───────────────────────────────────────────────
  { id:"weekly_tracker",    icon:"📅", rarity:"rare",      title:"Tracker settimanale",  desc:"Hai tracciato spese in almeno 4 giorni diversi in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_monthWithWeeklyTracking(d,mk) },
  { id:"all_categories",    icon:"🌈", rarity:"epic",      title:"Tutto tracciato",      desc:"Hai usato tutte e 8 le categorie in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_categoriesUsedInMonth(d,mk)>=8 },
  { id:"five_categories",   icon:"🎨", rarity:"rare",      title:"Diversificato",        desc:"Hai usato almeno 5 categorie in un mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_categoriesUsedInMonth(d,mk)>=5 },
  { id:"10_in_month",       icon:"✅", rarity:"common",    title:"Diligente",            desc:"Hai tracciato almeno 10 spese in un singolo mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_getManualCount(d,mk)>=10 },
  { id:"20_in_month",       icon:"🏋️", rarity:"rare",      title:"Instancabile",         desc:"20 spese tracciate in un singolo mese.",
    check:(d,mk)=>_monthReady(d,mk)&&_getManualCount(d,mk)>=20 },

  // ── SEGRETI / FUN ────────────────────────────────────────────────────────────
  { id:"zero_var_exp",      icon:"🧙", rarity:"epic",      title:"Monaco zen",           desc:"Nessuna spesa variabile in un mese con entrate. Sei un asceta.",
    check:(d,mk)=>_monthReady(d,mk)&&_getManualCount(d,mk)===0&&_getRecForMonth(d.recurring||[],mk).length>0 },
  { id:"big_spender_day",   icon:"🛍️", rarity:"rare",      title:"Giornata di spese",    desc:"Hai speso più di 200€ in un singolo giorno.",
    check:(d)=>_maxDailySpend(d)>=200 },
  { id:"big_spender_day2",  icon:"💸", rarity:"epic",      title:"Saldo il conto",       desc:"Hai speso più di 500€ in un singolo giorno.",
    check:(d)=>_maxDailySpend(d)>=500 },
  { id:"frugal_month",      icon:"🥗", rarity:"rare",      title:"Mese frugale",         desc:"Hai speso meno di 300€ in totale in un mese con entrate.",
    check:(d,mk)=>_monthReady(d,mk)&&_getSpent(d,mk)>0&&_getSpent(d,mk)<300 },
  { id:"no_svago",          icon:"🎯", rarity:"rare",      title:"Niente divertimento",  desc:"Un mese intero senza spese in 'Svago'.",
    check:(d,mk)=>{ if(!_monthReady(d,mk)) return false; const {year,month}=_parseMonthKey(mk); const svago=(d.expenses||[]).filter(e=>{ const dt=new Date(e.date); return dt.getMonth()===month&&dt.getFullYear()===year&&e.category==="svago"; }); return svago.length===0&&_getManualCount(d,mk)>0; } },
  { id:"early_adopter",     icon:"🌅", rarity:"legendary", title:"Early adopter",        desc:"Stai usando Spesometro da più di 3 mesi.",
    check:(d)=>{ const months=_getAllMonthKeys(d); return months.length>=3; } },
  { id:"veteran",           icon:"🎖️", rarity:"legendary", title:"Veterano",             desc:"Stai usando Spesometro da più di 6 mesi.",
    check:(d)=>{ const months=_getAllMonthKeys(d); return months.length>=6; } },
];

function loadAchievements(uid) { try { const r=localStorage.getItem(ACH_KEY(uid)); return r?JSON.parse(r):[]; } catch { return []; } }
function saveAchievements(uid, list) { try { localStorage.setItem(ACH_KEY(uid), JSON.stringify(list)); } catch {} }

// checkAchievements viene chiamato passando il mese visualizzato — i check mensili
// usano _monthReady() internamente, quelli globali ignorano mk.
function checkAchievements(data, monthKey, already) {
  const ids = new Set(already.map(a=>a.id));
  return ACHIEVEMENTS
    .filter(a=>!ids.has(a.id))
    .filter(a=>{ try{ return a.check(data,monthKey); }catch{ return false; } })
    .map(a=>({ id:a.id, unlockedAt:new Date().toISOString(), monthKey }));
}

// ── ACHIEVEMENT POPUP ─────────────────────────────────────────────────────────
function AchievementPopup({ queue, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (queue.length > 0 && !current) {
      const ach = ACHIEVEMENTS.find(a => a.id === queue[0].id);
      setCurrent(ach);
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => dismiss(), 4000);
    }
  }, [queue, current]);

  function dismiss() {
    setVisible(false);
    setTimeout(() => { setCurrent(null); onDismiss(); }, 350);
  }

  if (!current) return null;
  const r = RARITY[current.rarity];

  return (
    <div style={{
      position:"fixed", top:24, right:24, zIndex:9999, maxWidth:360, width:"calc(100% - 48px)",
      transition:"all .35s cubic-bezier(.4,0,.2,1)",
      opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(-20px)",
    }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:14, border:`2px solid ${r.border}`, boxShadow:"0 12px 40px rgba(0,0,0,0.15)", cursor:"pointer" }}
        onClick={dismiss}>
        {/* Icon */}
        <div style={{ width:52,height:52,borderRadius:"50%",background:r.bg,border:`2px solid ${r.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>
          {current.icon}
        </div>
        {/* Text */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:10,fontWeight:700,color:r.color,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3 }}>🏆 Achievement sbloccato · {r.label}</div>
          <div style={{ fontSize:15,fontWeight:700,color:"#1a1a18",marginBottom:2 }}>{current.title}</div>
          <div style={{ fontSize:12,color:"#888",lineHeight:1.4 }}>{current.desc}</div>
        </div>
        {/* Close */}
        <button onClick={e=>{ e.stopPropagation(); dismiss(); }} style={{ background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:18,padding:4,flexShrink:0 }}>✕</button>
      </div>
      {queue.length > 1 && (
        <div style={{ textAlign:"center",marginTop:6 }}>
          <span style={{ background:"#1a1a18",color:"#fff",borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:600 }}>+{queue.length-1} altri sbloccati!</span>
        </div>
      )}
    </div>
  );
}

// ── ACHIEVEMENTS VIEW ─────────────────────────────────────────────────────────
function AchievementsView({ T, unlockedMap, unlockedList }) {
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const rarityOrder = ["legendary","epic","rare","common"];
  const total = ACHIEVEMENTS.length;
  const count = unlockedList.length;
  const pct   = Math.round(count/total*100);

  const filtered = ACHIEVEMENTS.filter(a => {
    if (filter==="unlocked") return !!unlockedMap[a.id];
    if (filter==="locked")   return !unlockedMap[a.id];
    if (rarityOrder.includes(filter)) return a.rarity===filter;
    return true;
  });
  const groups = rarityOrder.map(r=>({ rarity:r, items:filtered.filter(a=>a.rarity===r) })).filter(g=>g.items.length>0);

  return (
    <div>
      {/* Header */}
      <div style={{ background:T.bgCard, borderRadius:16, padding:"1.5rem", border:`1px solid ${T.border}`, marginBottom:"1.25rem", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🏆</div>
        <div style={{ fontSize:22,fontWeight:700,color:T.textPrimary }}>{count} / {total}</div>
        <div style={{ fontSize:13,color:T.textSecondary,marginBottom:14 }}>achievement sbloccati</div>
        <div style={{ height:10,background:T.bgBar,borderRadius:99,overflow:"hidden",marginBottom:6 }}>
          <div style={{ height:"100%",width:`${pct}%`,background:"#B45309",borderRadius:99,transition:"width .4s ease" }} />
        </div>
        <div style={{ fontSize:12,color:T.textMuted }}>{pct}% completato</div>
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:"1.25rem" }}>
        {[
          { id:"all",     label:"Tutti" },
          { id:"unlocked",label:"✓ Sbloccati" },
          { id:"locked",  label:"🔒 Bloccati" },
          ...rarityOrder.map(r=>({ id:r, label:RARITY[r].label }))
        ].map(f => {
          const active = filter===f.id;
          const rc = RARITY[f.id];
          return (
            <button key={f.id} onClick={()=>setFilter(f.id)}
              style={{ padding:"5px 14px",borderRadius:99,border:`1.5px solid ${active?(rc?.border||T.btnPrimaryBg):T.borderInput}`,background:active?(rc?.bg||T.btnPrimaryBg):"transparent",color:active?(rc?.color||T.btnPrimaryText):T.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s" }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {groups.length===0
        ? <div style={{ textAlign:"center",padding:"3rem",color:T.textMuted }}>Nessun achievement trovato</div>
        : groups.map(group => {
          const r = RARITY[group.rarity];
          return (
            <div key={group.rarity} style={{ marginBottom:"1.5rem" }}>
              {/* Rarity divider */}
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                <div style={{ flex:1,height:1,background:T.border }} />
                <span style={{ background:r.bg,border:`1px solid ${r.border}`,color:r.color,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em" }}>{r.label}</span>
                <div style={{ flex:1,height:1,background:T.border }} />
              </div>
              {/* Cards grid */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:10 }}>
                {group.items.map(ach => {
                  const unlocked = !!unlockedMap[ach.id];
                  return (
                    <div key={ach.id} onClick={()=>setDetail(ach)}
                      style={{ background:unlocked?r.bg:T.bgHover,border:`2px solid ${unlocked?r.border:T.border}`,borderRadius:14,padding:"14px 8px",textAlign:"center",cursor:"pointer",opacity:unlocked?1:0.45,transition:"all .15s",userSelect:"none" }}>
                      <div style={{ fontSize:28,marginBottom:6 }}>{unlocked?ach.icon:"🔒"}</div>
                      <div style={{ fontSize:11,fontWeight:600,color:unlocked?T.textPrimary:T.textMuted,lineHeight:1.3 }}>{ach.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      }

      {/* Detail modal */}
      {detail && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}
          onClick={()=>setDetail(null)}>
          <div style={{ background:T.modalBg,borderRadius:24,padding:"2rem",maxWidth:380,width:"100%",textAlign:"center",border:`2px solid ${RARITY[detail.rarity].border}`,boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:52,marginBottom:12 }}>{unlockedMap[detail.id]?detail.icon:"🔒"}</div>
            <div style={{ background:RARITY[detail.rarity].bg,border:`1px solid ${RARITY[detail.rarity].border}`,borderRadius:99,padding:"3px 14px",display:"inline-block",marginBottom:12 }}>
              <span style={{ fontSize:11,fontWeight:700,color:RARITY[detail.rarity].color,textTransform:"uppercase",letterSpacing:"0.07em" }}>{RARITY[detail.rarity].label}</span>
            </div>
            <div style={{ fontSize:18,fontWeight:700,color:T.textPrimary,marginBottom:8 }}>{detail.title}</div>
            <div style={{ fontSize:14,color:T.textSecondary,lineHeight:1.6,marginBottom:16 }}>{detail.desc}</div>
            {unlockedMap[detail.id]
              ? <div style={{ fontSize:12,color:T.textMuted }}>Sbloccato il {new Date(unlockedMap[detail.id].unlockedAt).toLocaleDateString("it-IT")}</div>
              : <div style={{ fontSize:12,color:T.textMuted,fontStyle:"italic" }}>Non ancora sbloccato</div>
            }
            <button onClick={()=>setDetail(null)} style={{ marginTop:20,background:T.btnPrimaryBg,color:T.btnPrimaryText,border:"none",borderRadius:10,padding:"10px 24px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MOCK AUTH ─────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "user_dani",    email: "dani@spesometro.it",    password: "A7kP2xQ9Lm4Z", name: "Dani" },
  { id: "user_sergiu",  email: "sergiu@spesometro.it",  password: "r3D8vN6bX1Qa", name: "Sergiu" },
  { id: "user_sofia",   email: "sofia@spesometro.it",   password: "T9mL5cW2pH8s", name: "Sophie" },
  { id: "user_andrei",  email: "andrei@spesometro.it",  password: "T9mL5cw3pH8s", name: "Andrei" },
  { id: "user_andreas", email: "andreas@spesometro.it", password: "T9mL6Cw3pH8s", name: "Andreas" },
];
const SESSION_KEY = "spesometro_session";
function getSession() { try { const r=sessionStorage.getItem(SESSION_KEY); if(r)return JSON.parse(r); } catch {} return null; }
function setSession(u) { try { sessionStorage.setItem(SESSION_KEY,JSON.stringify(u)); } catch {} }
function clearSession() { try { sessionStorage.removeItem(SESSION_KEY); } catch {} }

// ── DATA ──────────────────────────────────────────────────────────────────────
function userStorageKey(uid) { return `spesometro_v2_${uid}`; }
function loadData(uid) { try { const r=localStorage.getItem(userStorageKey(uid)); if(r)return JSON.parse(r); } catch {} return { expenses:[],income:{},recurring:[] }; }
function saveData(uid,d) { try { localStorage.setItem(userStorageKey(uid),JSON.stringify(d)); } catch {} }

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, theme, onToggleTheme }) {
  const T = THEMES[theme];
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const [showPw,setShowPw]=useState(false);

  function handleLogin() {
    setError(""); setLoading(true);
    setTimeout(()=>{
      const u=MOCK_USERS.find(x=>x.email.toLowerCase()===email.trim().toLowerCase()&&x.password===password);
      if(u){ const s={id:u.id,name:u.name,email:u.email}; setSession(s); onLogin(s); }
      else setError("Email o password non corretti.");
      setLoading(false);
    },600);
  }
  const inp={ width:"100%",padding:"11px 13px",borderRadius:10,border:`1.5px solid ${T.borderInput}`,fontSize:14,fontFamily:"inherit",background:T.bgInput,color:T.textPrimary,boxSizing:"border-box",marginBottom:"1rem" };
  const lbl={ fontSize:11,fontWeight:600,color:T.textMuted,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:"0.06em" };

  return (
    <div style={{minHeight:"100vh",background:T.bgPage,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',sans-serif",padding:"1rem",position:"relative",transition:"background .2s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box} input:focus{outline:none;border-color:${T.textPrimary}!important}`}</style>
      <div style={{position:"absolute",top:20,right:20}}><ThemeToggle theme={theme} onToggle={onToggleTheme}/></div>
      <div style={{background:T.bgCard,borderRadius:24,padding:"2.5rem 2rem",width:"100%",maxWidth:400,boxShadow:`0 4px 40px rgba(0,0,0,${theme==="dark"?0.4:0.08})`,border:`1px solid ${T.border}`}}>
        <div style={{fontSize:32,marginBottom:8}}>💰</div>
        <div style={{fontSize:22,fontWeight:700,color:T.textPrimary,marginBottom:4}}>Spesometro</div>
        <div style={{fontSize:14,color:T.textSecondary,marginBottom:"2rem"}}>Accedi per gestire le tue finanze</div>
        {error&&<div style={{background:T.accentRedBg,color:T.accentRed,borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:"1rem"}}>⚠ {error}</div>}
        <label style={lbl}>Email</label>
        <input style={inp} type="email" placeholder="marco@spesometro.it" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} autoFocus/>
        <label style={lbl}>Password</label>
        <div style={{position:"relative"}}>
          <input style={{...inp,paddingRight:80}} type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          <button style={{position:"absolute",right:12,top:"34%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:12,fontFamily:"inherit"}} onClick={()=>setShowPw(v=>!v)} tabIndex={-1}>{showPw?"Nascondi":"Mostra"}</button>
        </div>
        <button style={{width:"100%",padding:"12px",borderRadius:10,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,background:T.btnPrimaryBg,color:T.btnPrimaryText,marginTop:8,opacity:loading?0.6:1,fontFamily:"inherit"}} onClick={handleLogin} disabled={loading}>
          {loading?"Accesso in corso…":"Accedi →"}
        </button>
        <div style={{fontSize:12,color:T.textFaint,marginTop:"1.5rem",lineHeight:1.6,textAlign:"center"}}>
          Inserisci le tue credenziali per accedere
        </div>
      </div>
    </div>
  );
}

// ── COSTANTI ──────────────────────────────────────────────────────────────────
const CATEGORIES=[
  {id:"casa",label:"Casa",icon:"🏠",color:"#5DCAA5"},{id:"cibo",label:"Cibo",icon:"🍕",color:"#EF9F27"},
  {id:"trasporti",label:"Trasporti",icon:"🚗",color:"#85B7EB"},{id:"svago",label:"Svago",icon:"🎬",color:"#ED93B1"},
  {id:"salute",label:"Salute",icon:"💊",color:"#5DCAA5"},{id:"abbigliamento",label:"Abbigliamento",icon:"👕",color:"#AFA9EC"},
  {id:"tecnologia",label:"Tecnologia",icon:"💻",color:"#378ADD"},{id:"altro",label:"Altro",icon:"📦",color:"#888780"},
];
const MONTHS=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const catMap=Object.fromEntries(CATEGORIES.map(c=>[c.id,c]));
function formatEur(n){return new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR",minimumFractionDigits:2}).format(n);}
function toMonthKey(y,m){return `${y}-${String(m+1).padStart(2,"0")}`;}
function parseMonthKey(k){const[y,m]=k.split("-");return{year:parseInt(y),month:parseInt(m)-1};}
function addMonths(y,m,n){const d=new Date(y,m+n,1);return{year:d.getFullYear(),month:d.getMonth()};}
function getRecurringForMonth(recurring,monthKey){return recurring.filter(r=>{if(r.startMonth>monthKey)return false;if(r.endMonth&&r.endMonth<monthKey)return false;return true;});}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MainApp({ user, onLogout, theme, onToggleTheme }) {
  const T = THEMES[theme];
  const now = new Date();
  const [data,setData]                   = useState(()=>loadData(user.id));
  const [view,setView]                   = useState("dashboard");
  const [selectedMonth,setSelectedMonth] = useState(now.getMonth());
  const [selectedYear,setSelectedYear]   = useState(now.getFullYear());
  const [showForm,setShowForm]           = useState(false);
  const [showRecurringForm,setShowRecurringForm] = useState(false);
  const [editingExpense,setEditingExpense]   = useState(null);
  const [editingRecurring,setEditingRecurring] = useState(null);
  const [editingIncome,setEditingIncome] = useState(false);
  const [filterCat,setFilterCat]         = useState("all");
  const [filterType,setFilterType]       = useState("all");
  const [form,setForm]                   = useState({description:"",amount:"",category:"cibo",date:new Date().toISOString().split("T")[0],note:""});
  const [rForm,setRForm]                 = useState({description:"",amount:"",category:"casa",startMonth:toMonthKey(now.getFullYear(),now.getMonth()),duration:"ongoing",durationMonths:"12",note:""});
  const [incomeForm,setIncomeForm]       = useState("");
  const [toast,setToast]                 = useState(null);
  const [achPopupQueue,setAchPopupQueue] = useState([]);
  const [unlockedList,setUnlockedList]   = useState(()=>loadAchievements(user.id));
  const [sidebarOpen,setSidebarOpen]         = useState(false);
  const [isMobile,setIsMobile]               = useState(()=>window.innerWidth<768);
  const [selectedCompareMks,setSelectedCompareMks] = useState([]);
  const [showResetModal,setShowResetModal]         = useState(false);
  const toastTimer = useRef(null);

  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",handler);
    return ()=>window.removeEventListener("resize",handler);
  },[]);

  // Salva dati
  useEffect(()=>{ saveData(user.id,data); },[data,user.id]);

  // Check achievement ogni volta che i dati cambiano
  useEffect(()=>{
    const monthKey = toMonthKey(selectedYear,selectedMonth);
    const current  = loadAchievements(user.id);
    const newOnes  = checkAchievements(data, monthKey, current);
    if(newOnes.length>0){
      const updated=[...current,...newOnes];
      saveAchievements(user.id,updated);
      setUnlockedList(updated);
      setAchPopupQueue(q=>[...q,...newOnes]);
    }
  },[data,selectedMonth,selectedYear,user.id]);

  const unlockedMap = Object.fromEntries(unlockedList.map(u=>[u.id,u]));

  const monthKey=toMonthKey(selectedYear,selectedMonth);
  const manualExpenses=data.expenses.filter(e=>{const d=new Date(e.date);return d.getMonth()===selectedMonth&&d.getFullYear()===selectedYear;});
  const activeRecurring=getRecurringForMonth(data.recurring||[],monthKey);
  const allMonthExpenses=[...manualExpenses.map(e=>({...e,isRecurring:false})),...activeRecurring.map(r=>({...r,id:`rec_${r.id}`,date:`${monthKey}-01`,isRecurring:true}))];
  const totalSpent=allMonthExpenses.reduce((s,e)=>s+e.amount,0);
  const totalRecurring=activeRecurring.reduce((s,r)=>s+r.amount,0);
  const income = data.income[monthKey] ?? data.income._default ?? 0;
  const saved=income-totalSpent;
  const filtered=allMonthExpenses.filter(e=>filterCat==="all"||e.category===filterCat).filter(e=>filterType==="all"||(filterType==="manual"?!e.isRecurring:e.isRecurring)).sort((a,b)=>{if(a.isRecurring&&!b.isRecurring)return -1;if(!a.isRecurring&&b.isRecurring)return 1;return new Date(b.date)-new Date(a.date);});
  const byCategory=CATEGORIES.map(c=>({...c,total:allMonthExpenses.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0),count:allMonthExpenses.filter(e=>e.category===c.id).length})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
  const maxCatTotal=byCategory[0]?.total||1;

  function showToast(msg,type="success"){setToast({msg,type});clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(null),2800);}
  function openAdd(){setEditingExpense(null);setForm({description:"",amount:"",category:"cibo",date:new Date().toISOString().split("T")[0],note:""});setShowForm(true);}
  function openEdit(exp){setEditingExpense(exp);setForm({description:exp.description,amount:String(exp.amount),category:exp.category,date:exp.date,note:exp.note||""});setShowForm(true);}
  function submitForm(){
    const amount=parseFloat(form.amount.replace(",","."));
    if(!form.description.trim()||isNaN(amount)||amount<=0){showToast("Compila tutti i campi","error");return;}
    const entry={id:editingExpense?.id||Date.now(),description:form.description.trim(),amount,category:form.category,date:form.date,note:form.note};
    setData(d=>({...d,expenses:editingExpense?d.expenses.map(e=>e.id===editingExpense.id?entry:e):[...d.expenses,entry]}));
    setShowForm(false);showToast(editingExpense?"Spesa aggiornata":"Spesa aggiunta");
  }
  function deleteExpense(id){setData(d=>({...d,expenses:d.expenses.filter(e=>e.id!==id)}));showToast("Spesa eliminata","error");}
  function openAddRecurring(){setEditingRecurring(null);setRForm({description:"",amount:"",category:"casa",startMonth:monthKey,duration:"ongoing",durationMonths:"12",note:""});setShowRecurringForm(true);}
  function openEditRecurring(r){
    if(!r)return;setEditingRecurring(r);
    const hasEnd=!!r.endMonth;let durationMonths="12";
    if(hasEnd){const s=parseMonthKey(r.startMonth),e=parseMonthKey(r.endMonth);durationMonths=String((e.year-s.year)*12+(e.month-s.month)+1);}
    setRForm({description:r.description,amount:String(r.amount),category:r.category,startMonth:r.startMonth,duration:hasEnd?"fixed":"ongoing",durationMonths,note:r.note||""});setShowRecurringForm(true);
  }
  function submitRecurring(){
    const amount=parseFloat(rForm.amount.replace(",","."));
    if(!rForm.description.trim()||isNaN(amount)||amount<=0){showToast("Compila tutti i campi","error");return;}
    let endMonth=null;
    if(rForm.duration==="fixed"){const n=parseInt(rForm.durationMonths);if(isNaN(n)||n<1){showToast("Numero di mesi non valido","error");return;}const s=parseMonthKey(rForm.startMonth),e=addMonths(s.year,s.month,n-1);endMonth=toMonthKey(e.year,e.month);}
    const entry={id:editingRecurring?.id||Date.now(),description:rForm.description.trim(),amount,category:rForm.category,startMonth:rForm.startMonth,endMonth,note:rForm.note};
    setData(d=>({...d,recurring:editingRecurring?(d.recurring||[]).map(r=>r.id===editingRecurring.id?entry:r):[...(d.recurring||[]),entry]}));
    setShowRecurringForm(false);showToast(editingRecurring?"Spesa fissa aggiornata":"Spesa fissa aggiunta");
  }
  function deleteRecurring(id){setData(d=>({...d,recurring:(d.recurring||[]).filter(r=>r.id!==id)}));showToast("Spesa fissa eliminata","error");}
  function stopRecurringNow(r){
    const prev=addMonths(now.getFullYear(),now.getMonth(),-1);const endMonth=toMonthKey(prev.year,prev.month);
    setData(d=>({...d,recurring:(d.recurring||[]).map(x=>x.id===r.id?{...x,endMonth:endMonth<x.startMonth?x.startMonth:endMonth}:x)}));showToast("Spesa fissa terminata");
  }
  function saveIncome(){
    const val=parseFloat(incomeForm.replace(",","."));
    if(isNaN(val)||val<0) return;
    setData(d=>{
      // Salva il valore di default globale
      const newDefault = val;
      // Aggiorna il mese corrente esplicitamente
      const newIncome = { ...d.income, [monthKey]: val, _default: newDefault };
      return { ...d, income: newIncome };
    });
    setEditingIncome(false);
    showToast("Entrate aggiornate");
  }
  function changeMonth(dir){let m=selectedMonth+dir,y=selectedYear;if(m<0){m=11;y--;}if(m>11){m=0;y++;}setSelectedMonth(m);setSelectedYear(y);}
  function recurringLabel(r){if(!r.endMonth)return"Senza scadenza";const s=parseMonthKey(r.startMonth),e=parseMonthKey(r.endMonth);const n=(e.year-s.year)*12+(e.month-s.month)+1;return`${n} ${n===1?"mese":"mesi"} · fino a ${MONTHS[e.month]} ${e.year}`;}
  const endMonthPreview=()=>{if(rForm.duration!=="fixed")return null;const n=parseInt(rForm.durationMonths);if(isNaN(n)||n<1)return null;const s=parseMonthKey(rForm.startMonth),e=addMonths(s.year,s.month,n-1);return`fino a ${MONTHS[e.month]} ${e.year}`;};

  function navigateTo(id){ setView(id); if(isMobile) setSidebarOpen(false); }

  const S={
    root:{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:T.bgPage,color:T.textPrimary,transition:"background .2s,color .2s"},
    sidebar:{width:220,background:T.sidebar,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"1.5rem 1rem",position:"fixed",top:0,left:isMobile?(sidebarOpen?0:-240):0,bottom:0,zIndex:200,transition:"left 0.25s ease, background .2s",boxShadow:isMobile&&sidebarOpen?"4px 0 32px rgba(0,0,0,0.35)":"none"},
    main:{marginLeft:isMobile?0:220,padding:isMobile?"1rem 0.875rem":"2rem",maxWidth:isMobile?"100%":980,paddingBottom:"2rem"},
    nav:(a)=>({display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,cursor:"pointer",marginBottom:4,background:a?T.sidebarActive:"transparent",color:a?T.sidebarActiveText:T.sidebarText,fontSize:14,fontWeight:a?500:400,border:"none",width:"100%",textAlign:"left",transition:"all 0.15s",fontFamily:"inherit",minHeight:44}),
    card:{background:T.bgCard,borderRadius:16,padding:isMobile?"1rem":"1.25rem 1.5rem",border:`1px solid ${T.border}`,marginBottom:"1.25rem"},
    metricCard:(bg)=>({background:bg||T.bgCard,borderRadius:14,padding:"1.25rem",border:`1px solid ${T.border}`,flex:1,minWidth:isMobile?0:160}),
    btn:(v)=>({padding:v==="icon"?"7px 10px":"10px 18px",borderRadius:10,border:"none",cursor:"pointer",fontSize:14,fontWeight:500,transition:"all 0.15s",whiteSpace:"nowrap",fontFamily:"inherit",minHeight:40,
      ...(v==="primary"?{background:T.btnPrimaryBg,color:T.btnPrimaryText}:v==="accent"?{background:T.accentBlueBg,color:T.accentBlue}:v==="ghost"?{background:"transparent",color:T.btnGhostText,border:`1px solid ${T.btnGhostBorder}`}:v==="icon"?{background:"transparent",color:T.btnIconText,border:`1px solid ${T.btnIconBorder}`,minWidth:40}:{background:T.btnDefaultBg,color:T.btnDefaultText})}),
    input:{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.borderInput}`,fontSize:16,fontFamily:"inherit",background:T.bgInput,color:T.textPrimary,boxSizing:"border-box"},
    label:{fontSize:11,fontWeight:600,color:T.textMuted,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:"0.06em"},
    badge:(cat)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:500,background:catMap[cat]?.color+"28",color:catMap[cat]?.color}),
    recBadge:{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,background:T.accentBlueBg,color:T.accentBlue,fontWeight:500},
    overlay:{position:"fixed",inset:0,background:T.overlayBg,zIndex:100,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",padding:isMobile?0:"1rem"},
    modal:{background:T.modalBg,borderRadius:isMobile?"20px 20px 0 0":20,padding:isMobile?"1.5rem 1rem 2rem":"2rem",width:"100%",maxWidth:isMobile?"100%":500,boxShadow:`0 20px 60px rgba(0,0,0,${theme==="dark"?0.5:0.15})`,maxHeight:"92vh",overflowY:"auto",border:`1px solid ${T.border}`},
    toast:(t)=>({position:"fixed",bottom:24,right:isMobile?12:24,left:isMobile?12:"auto",zIndex:300,background:t==="error"?T.accentRed:T.btnPrimaryBg,color:T.btnPrimaryText,padding:"12px 20px",borderRadius:12,fontSize:14,fontWeight:500,boxShadow:"0 8px 24px rgba(0,0,0,0.25)",animation:"fadeIn .25s ease",textAlign:isMobile?"center":"left"}),
  };

  const NAV_ITEMS = [
    {id:"dashboard",icon:"▦",label:"Dashboard"},
    {id:"expenses", icon:"≡",label:"Spese"},
    {id:"recurring",icon:"⟳",label:"Spese fisse",count:(data.recurring||[]).length},
    {id:"stats",    icon:"◉",label:"Statistiche"},
    {id:"analisi",  icon:"📊",label:"Analisi"},
    {id:"trophies", icon:"🏆",label:"Trofei",badge:`${unlockedList.length}/${ACHIEVEMENTS.length}`},
  ];

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box} button:hover{opacity:.85}
        input:focus,select:focus,textarea:focus{border-color:${T.textPrimary}!important;outline:none}
        .row:hover{background:${T.bgHover}!important}
        .nav-btn:hover{background:${T.sidebarActive}!important;color:${T.sidebarActiveText}!important}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px} select{appearance:none}
        input[type="date"]::-webkit-calendar-picker-indicator,input[type="month"]::-webkit-calendar-picker-indicator{filter:${theme==="dark"?"invert(1)":"none"}}
        @media(max-width:767px){
          input,select,textarea{font-size:16px!important;}
          .metric-row{flex-direction:column!important;}
          .modal-grid-2{grid-template-columns:1fr!important;}
          .topbar-month{min-width:120px!important;font-size:16px!important;}
        }
      `}</style>

      {/* Achievement popup */}
      {achPopupQueue.length>0 && (
        <AchievementPopup queue={achPopupQueue} onDismiss={()=>setAchPopupQueue(q=>q.slice(1))} />
      )}

      {/* Mobile sidebar backdrop */}
      {isMobile&&sidebarOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:199}} onClick={()=>setSidebarOpen(false)}/>
      )}

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{marginBottom:"2rem",display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:18,fontWeight:600,color:T.sidebarActiveText,letterSpacing:"-0.02em"}}>💰 Spesometro</div>
            <div style={{fontSize:12,color:T.sidebarSub,marginTop:2}}>Traccia le tue finanze</div>
          </div>
          {isMobile&&(
            <button onClick={()=>setSidebarOpen(false)} style={{background:"none",border:"none",color:"#666",fontSize:20,cursor:"pointer",padding:"2px 4px",lineHeight:1,marginTop:-2}} aria-label="Chiudi menu">✕</button>
          )}
        </div>
        {NAV_ITEMS.map(i=>(
          <button key={i.id} className="nav-btn" onClick={()=>navigateTo(i.id)} style={S.nav(view===i.id)}>
            <span style={{fontSize:15}}>{i.icon}</span>{i.label}
            {i.count>0&&<span style={{marginLeft:"auto",background:T.sidebarBadgeBg,color:T.sidebarBadgeColor,borderRadius:20,fontSize:11,padding:"1px 7px"}}>{i.count}</span>}
            {i.badge&&<span style={{marginLeft:"auto",background:T.sidebarBadgeBg,color:T.sidebarBadgeColor,borderRadius:20,fontSize:11,padding:"1px 7px"}}>{i.badge}</span>}
          </button>
        ))}
        <div style={{flex:1}}/>
        <div style={{marginBottom:8}}><ThemeToggle theme={theme} onToggle={onToggleTheme}/></div>
        <div style={{borderTop:`1px solid ${T.sidebarDivider}`,paddingTop:"1rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:T.sidebarActive,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:T.sidebarActiveText,flexShrink:0}}>{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:T.sidebarActiveText}}>{user.name}</div>
              <div style={{fontSize:11,color:T.sidebarSub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:130}}>{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} className="nav-btn" style={{...S.nav(false),width:"100%",fontSize:13}}><span>↩</span> Esci</button>
          <button onClick={()=>setShowResetModal(true)} className="nav-btn" style={{...S.nav(false),width:"100%",fontSize:13,color:T.accentRed,marginTop:4}}><span>🗑</span> Reset dati</button>
        </div>
        <div style={{fontSize:11,color:T.sidebarText,lineHeight:1.8,marginTop:8}}>{manualExpenses.length} spese manuali<br/>{activeRecurring.length} fisse attive</div>
      </div>

      {/* Main */}
      <div style={S.main}>
        {/* Top bar (non su trofei) */}
        {view!=="trophies"&&view!=="analisi"&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {isMobile&&(
                <button style={{...S.btn("icon"),fontSize:18,padding:"7px 12px"}} onClick={()=>setSidebarOpen(o=>!o)} aria-label="Menu">☰</button>
              )}
              <button style={S.btn("icon")} onClick={()=>changeMonth(-1)}>‹</button>
              <div className="topbar-month" style={{fontSize:20,fontWeight:600,minWidth:190,textAlign:"center"}}>{MONTHS[selectedMonth]} {selectedYear}</div>
              <button style={S.btn("icon")} onClick={()=>changeMonth(1)}>›</button>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={S.btn("accent")} onClick={openAddRecurring}>{isMobile?"⟳":"⟳ Spesa fissa"}</button>
              <button style={S.btn("primary")} onClick={openAdd}>{isMobile?"+":"+ Nuova spesa"}</button>
            </div>
          </div>
        )}

        {/* ══ TROPHIES ══ */}
        {view==="trophies"&&(
          <div>
            <div style={{fontSize:22,fontWeight:700,marginBottom:"1.5rem",color:T.textPrimary}}>🏆 I tuoi trofei</div>
            <AchievementsView T={T} unlockedMap={unlockedMap} unlockedList={unlockedList}/>
          </div>
        )}

        {/* ══ DASHBOARD ══ */}
        {view==="dashboard"&&(<>
          <div className="metric-row" style={{display:"flex",gap:12,marginBottom:"1.25rem",flexWrap:"wrap"}}>
            <div style={S.metricCard()}>
              <div style={S.label}>Entrate</div>
              {editingIncome?(
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input style={{...S.input,width:110}} value={incomeForm} onChange={e=>setIncomeForm(e.target.value)} placeholder="0.00" autoFocus onKeyDown={e=>e.key==="Enter"&&saveIncome()}/>
                  <button style={S.btn("primary")} onClick={saveIncome}>✓</button>
                  <button style={S.btn("ghost")} onClick={()=>setEditingIncome(false)}>✕</button>
                </div>
              ):(
                <div>
                  <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
                    <div style={{fontSize:24,fontWeight:600,color:T.accentGreen}}>{formatEur(income)}</div>
                    <button style={{...S.btn("ghost"),padding:"3px 10px",fontSize:12}} onClick={()=>{setIncomeForm(String(income));setEditingIncome(true);}}>modifica</button>
                  </div>
                  {income>0&&!data.income[monthKey]&&data.income._default&&(
                    <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>↩ valore predefinito</div>
                  )}
                </div>
              )}
            </div>
            <div style={S.metricCard()}>
              <div style={S.label}>Spese totali</div>
              <div style={{fontSize:24,fontWeight:600,color:T.accentRed}}>{formatEur(totalSpent)}</div>
              <div style={{fontSize:12,color:T.textMuted,marginTop:3}}>{formatEur(totalRecurring)} fisse · {formatEur(totalSpent-totalRecurring)} variabili</div>
            </div>
            <div style={S.metricCard(saved>=0?T.accentGreenBg:T.accentRedBg)}>
              <div style={S.label}>Risparmio</div>
              <div style={{fontSize:24,fontWeight:600,color:saved>=0?T.accentGreenText:T.accentRed}}>{saved>=0?"+":""}{formatEur(saved)}</div>
              {income>0&&<div style={{fontSize:12,color:saved>=0?T.accentGreenText:T.accentRed,marginTop:3}}>{saved>=0?"✓":"⚠"} {Math.abs(Math.round(saved/income*100))}% {saved>=0?"risparmiato":"in rosso"}</div>}
            </div>
          </div>
          {activeRecurring.length>0&&(
            <div style={{...S.card,background:T.accentBlueDarkBg,border:`1px solid ${T.accentBlueBorder}`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:14,fontWeight:500,color:T.accentBlueDark}}>⟳ Spese fisse attive — {MONTHS[selectedMonth]}</div>
                <div style={{fontSize:16,fontWeight:600,color:T.accentBlueDark}}>{formatEur(totalRecurring)}</div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {activeRecurring.map(r=>(
                  <div key={r.id} style={{display:"flex",alignItems:"center",gap:6,background:T.bgCard,borderRadius:10,padding:"6px 12px",border:`1px solid ${T.accentBlueBorder}`,fontSize:13}}>
                    <span>{catMap[r.category]?.icon}</span>
                    <span style={{fontWeight:500,color:T.textPrimary}}>{r.description}</span>
                    <span style={{color:T.accentBlue,fontWeight:600}}>{formatEur(r.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {income>0&&(
            <div style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:14,fontWeight:500}}>Utilizzo budget mensile</span>
                <span style={{fontSize:13,color:T.textSecondary}}>{formatEur(totalSpent)} / {formatEur(income)}</span>
              </div>
              <div style={{height:10,background:T.bgBar,borderRadius:99,overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",width:`${Math.min(100,totalSpent/income*100).toFixed(1)}%`,background:totalSpent>income?"#E24B4A":totalSpent/income>0.8?"#EF9F27":"#1D9E75",borderRadius:99,transition:"width .4s ease"}}/>
              </div>
              <div style={{display:"flex",gap:16,fontSize:12,color:T.textSecondary,flexWrap:"wrap"}}>
                <span>🔵 Fisse: {formatEur(totalRecurring)} ({income>0?Math.round(totalRecurring/income*100):0}%)</span>
                <span>🟠 Variabili: {formatEur(totalSpent-totalRecurring)} ({income>0?Math.round((totalSpent-totalRecurring)/income*100):0}%)</span>
              </div>
            </div>
          )}
          {byCategory.length>0&&(
            <div style={S.card}>
              <div style={{fontSize:15,fontWeight:500,marginBottom:"1rem"}}>Spese per categoria</div>
              {byCategory.map(cat=>(
                <div key={cat.id} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:14}}>{cat.icon} {cat.label}</span>
                    <span style={{fontSize:13,fontWeight:500}}>{formatEur(cat.total)} <span style={{color:T.textMuted,fontWeight:400}}>({cat.count})</span></span>
                  </div>
                  <div style={{height:6,background:T.bgBar,borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(cat.total/maxCatTotal*100).toFixed(1)}%`,background:cat.color,borderRadius:99}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
          {allMonthExpenses.length>0?(
            <div style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                <div style={{fontSize:15,fontWeight:500}}>Ultime spese</div>
                <button style={{...S.btn("ghost"),fontSize:13}} onClick={()=>setView("expenses")}>Vedi tutte →</button>
              </div>
              {[...allMonthExpenses].sort((a,b)=>{if(a.isRecurring&&!b.isRecurring)return -1;if(!a.isRecurring&&b.isRecurring)return 1;return new Date(b.date)-new Date(a.date);}).slice(0,6).map(exp=>(
                <div key={exp.id} className="row" style={{display:"flex",alignItems:"center",padding:"10px 6px",borderBottom:`1px solid ${T.border}`,gap:10,borderRadius:8}}>
                  <div style={{fontSize:22}}>{catMap[exp.category]?.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:14,fontWeight:500}}>{exp.description}</span>
                      {exp.isRecurring&&<span style={S.recBadge}>⟳ fissa</span>}
                    </div>
                    <div style={{fontSize:12,color:T.textMuted}}>{exp.isRecurring?"Mensile":new Date(exp.date).toLocaleDateString("it-IT")}</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:600,color:T.accentRed}}>-{formatEur(exp.amount)}</div>
                </div>
              ))}
            </div>
          ):(
            <div style={{...S.card,textAlign:"center",padding:"3rem",color:T.textMuted}}>
              <div style={{fontSize:48,marginBottom:12}}>🧾</div>
              <div style={{fontSize:16,fontWeight:500,marginBottom:6}}>Nessuna spesa questo mese</div>
              <div style={{fontSize:14}}>Aggiungi una spesa con i bottoni in alto</div>
            </div>
          )}
        </>)}

        {/* ══ EXPENSES LIST ══ */}
        {view==="expenses"&&(<>
          <div style={{display:"flex",gap:8,marginBottom:"0.75rem",flexWrap:"wrap"}}>
            {["all","manual","recurring"].map(t=>(
              <button key={t} style={{...S.btn(filterType===t?"primary":"ghost"),fontSize:13}} onClick={()=>setFilterType(t)}>
                {t==="all"?"Tutte":t==="manual"?"Variabili":"⟳ Fisse"}
              </button>
            ))}
            <div style={{width:1,background:T.borderInput,margin:"0 4px"}}/>
            {CATEGORIES.filter(c=>allMonthExpenses.some(e=>e.category===c.id)).map(cat=>(
              <button key={cat.id} style={{...S.btn(filterCat===cat.id?"primary":"ghost"),fontSize:13}} onClick={()=>setFilterCat(filterCat===cat.id?"all":cat.id)}>{cat.icon} {cat.label}</button>
            ))}
          </div>
          <div style={S.card}>
            {filtered.length===0?(<div style={{textAlign:"center",padding:"2rem",color:T.textMuted}}>Nessuna spesa</div>):
            filtered.map(exp=>(
              <div key={exp.id} className="row" style={{display:"flex",alignItems:"center",padding:"12px 6px",borderBottom:`1px solid ${T.border}`,gap:10,borderRadius:8}}>
                <div style={{fontSize:24}}>{catMap[exp.category]?.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:2}}>
                    <span style={{fontSize:14,fontWeight:500}}>{exp.description}</span>
                    <span style={S.badge(exp.category)}>{catMap[exp.category]?.label}</span>
                    {exp.isRecurring&&<span style={S.recBadge}>⟳ fissa</span>}
                  </div>
                  <div style={{fontSize:12,color:T.textMuted}}>{exp.isRecurring?"Mensile ricorrente":new Date(exp.date).toLocaleDateString("it-IT")}{exp.note&&<span style={{marginLeft:8}}>· {exp.note}</span>}</div>
                </div>
                <div style={{fontSize:15,fontWeight:600,color:T.accentRed,marginRight:8}}>-{formatEur(exp.amount)}</div>
                {exp.isRecurring?(
                  <button style={S.btn("icon")} onClick={()=>openEditRecurring((data.recurring||[]).find(r=>r.id===parseInt(exp.id.toString().replace("rec_",""))))} title="Modifica">✎</button>
                ):(<>
                  <button style={S.btn("icon")} onClick={()=>openEdit(exp)} title="Modifica">✎</button>
                  <button style={{...S.btn("icon"),color:T.accentRed}} onClick={()=>deleteExpense(exp.id)} title="Elimina">✕</button>
                </>)}
              </div>
            ))}
          </div>
          {filtered.length>0&&<div style={{display:"flex",justifyContent:"flex-end"}}><div style={{fontSize:14,color:T.textSecondary}}>Totale: <strong style={{color:T.accentRed}}>{formatEur(filtered.reduce((s,e)=>s+e.amount,0))}</strong></div></div>}
        </>)}

        {/* ══ RECURRING ══ */}
        {view==="recurring"&&(<>
          <div className="metric-row" style={{display:"flex",gap:12,marginBottom:"1.25rem",flexWrap:"wrap"}}>
            <div style={S.metricCard()}><div style={S.label}>Totale spese fisse</div><div style={{fontSize:22,fontWeight:600,color:T.accentBlue}}>{formatEur((data.recurring||[]).reduce((s,r)=>s+r.amount,0))}</div><div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{(data.recurring||[]).length} voci configurate</div></div>
            <div style={S.metricCard(T.accentBlueDarkBg)}><div style={S.label}>Attive — {MONTHS[selectedMonth]}</div><div style={{fontSize:22,fontWeight:600,color:T.accentBlue}}>{formatEur(totalRecurring)}</div><div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{activeRecurring.length} attive questo mese</div></div>
          </div>
          {(data.recurring||[]).length===0?(
            <div style={{...S.card,textAlign:"center",padding:"3rem",color:T.textMuted}}>
              <div style={{fontSize:48,marginBottom:12}}>⟳</div>
              <div style={{fontSize:16,fontWeight:500,marginBottom:6}}>Nessuna spesa fissa</div>
              <div style={{fontSize:14,marginBottom:"1.5rem"}}>Affitto, abbonamenti, rate — aggiungi spese che si ripetono ogni mese</div>
              <button style={S.btn("primary")} onClick={openAddRecurring}>+ Aggiungi spesa fissa</button>
            </div>
          ):(
            <div style={S.card}>
              <div style={{fontSize:15,fontWeight:500,marginBottom:"1rem"}}>Tutte le spese fisse</div>
              {[...(data.recurring||[])].sort((a,b)=>b.amount-a.amount).map(r=>{
                const isActive=getRecurringForMonth([r],monthKey).length>0;
                const isPast=r.endMonth&&r.endMonth<monthKey;
                const isFuture=r.startMonth>monthKey;
                return(
                  <div key={r.id} className="row" style={{display:"flex",alignItems:"center",padding:"14px 8px",borderBottom:`1px solid ${T.border}`,gap:12,borderRadius:8,opacity:isPast?0.5:1}}>
                    <div style={{fontSize:26}}>{catMap[r.category]?.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                        <span style={{fontSize:14,fontWeight:500}}>{r.description}</span>
                        <span style={S.badge(r.category)}>{catMap[r.category]?.label}</span>
                        {isActive&&<span style={{...S.recBadge,background:T.accentGreenBg,color:T.accentGreenText}}>● attiva</span>}
                        {isPast&&<span style={{...S.recBadge,background:T.accentGrayBg,color:T.accentGray}}>terminata</span>}
                        {isFuture&&<span style={{...S.recBadge,background:T.accentOrangeBg,color:T.accentOrange}}>futura</span>}
                      </div>
                      <div style={{fontSize:12,color:T.textMuted}}>Da {MONTHS[parseMonthKey(r.startMonth).month]} {parseMonthKey(r.startMonth).year} · {recurringLabel(r)}{r.note&&<span style={{marginLeft:8}}>· {r.note}</span>}</div>
                    </div>
                    <div style={{textAlign:"right",marginRight:8}}>
                      <div style={{fontSize:16,fontWeight:600,color:T.accentBlue}}>{formatEur(r.amount)}</div>
                      <div style={{fontSize:11,color:T.textMuted}}>/mese</div>
                    </div>
                    <button style={S.btn("icon")} onClick={()=>openEditRecurring(r)} title="Modifica">✎</button>
                    {isActive&&!r.endMonth&&<button style={{...S.btn("icon"),fontSize:11,padding:"6px 9px",color:T.accentOrange,border:`1px solid ${T.accentOrangeBorder}`}} onClick={()=>stopRecurringNow(r)} title="Termina ora">⏹</button>}
                    <button style={{...S.btn("icon"),color:T.accentRed}} onClick={()=>deleteRecurring(r.id)} title="Elimina">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </>)}

        {/* ══ STATS ══ */}
        {view==="stats"&&(<>
          <div style={S.card}>
            <div style={{fontSize:15,fontWeight:500,marginBottom:"1rem"}}>Riepilogo {MONTHS[selectedMonth]}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
              {byCategory.map(cat=>(
                <div key={cat.id} style={{display:"flex",alignItems:"center",gap:10,background:T.bgCatCard,padding:"12px 14px",borderRadius:12,border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:28}}>{cat.icon}</div>
                  <div>
                    <div style={{fontSize:13,color:T.textSecondary}}>{cat.label}</div>
                    <div style={{fontSize:16,fontWeight:600}}>{formatEur(cat.total)}</div>
                    <div style={{fontSize:11,color:T.textFaint}}>{cat.count} voci · avg {formatEur(cat.total/cat.count)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {totalSpent>0&&(
            <div style={S.card}>
              <div style={{fontSize:15,fontWeight:500,marginBottom:"1rem"}}>Distribuzione % categoria</div>
              {byCategory.map(cat=>{const pct=cat.total/totalSpent*100;return(
                <div key={cat.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:22,textAlign:"center"}}>{cat.icon}</div>
                  <div style={{flex:1,height:8,background:T.bgBar,borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct.toFixed(1)}%`,background:cat.color,borderRadius:99}}/>
                  </div>
                  <div style={{fontSize:12,width:44,textAlign:"right",color:T.textSecondary}}>{pct.toFixed(0)}%</div>
                </div>
              );})}
            </div>
          )}
          <div style={S.card}>
            <div style={{fontSize:15,fontWeight:500,marginBottom:"1rem"}}>Andamento giornaliero (spese variabili)</div>
            {(()=>{
              const dm={};manualExpenses.forEach(e=>{dm[e.date]=(dm[e.date]||0)+e.amount;});
              const entries=Object.entries(dm).sort(([a],[b])=>a.localeCompare(b));
              const max=Math.max(...entries.map(([,v])=>v),1);
              return entries.length===0?<div style={{color:T.textMuted,textAlign:"center",padding:"1rem"}}>Nessun dato</div>:
                entries.map(([date,total])=>(
                  <div key={date} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <div style={{fontSize:12,color:T.textSecondary,width:62,flexShrink:0}}>{new Date(date).toLocaleDateString("it-IT",{day:"2-digit",month:"short"})}</div>
                    <div style={{flex:1,height:8,background:T.bgBar,borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(total/max*100).toFixed(1)}%`,background:T.btnPrimaryBg,borderRadius:99}}/>
                    </div>
                    <div style={{fontSize:12,fontWeight:500,width:72,textAlign:"right"}}>{formatEur(total)}</div>
                  </div>
                ));
            })()}
          </div>
        </>)}

        {view==="analisi"&&isMobile&&(
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1.5rem"}}>
            <button style={{...S.btn("icon"),fontSize:18,padding:"7px 12px"}} onClick={()=>setSidebarOpen(o=>!o)} aria-label="Menu">☰</button>
          </div>
        )}
        {view==="analisi"&&(()=>{
          // ── dati storici ──────────────────────────────────────────────────
          const now2 = new Date();
          const currentMk = `${now2.getFullYear()}-${String(now2.getMonth()+1).padStart(2,"0")}`;

          // Tutti i mesi con entrate impostate — incluso il mese corrente
          const allMksWithCurrent = Object.keys(data.income||{})
            .filter(k=>k!=="_default"&&k.match(/^\d{4}-\d{2}$/)&&(data.income[k]??data.income._default??0)>0)
            .sort();

          // Se il mese corrente ha un default ma non è nella lista, aggiungilo
          if (!allMksWithCurrent.includes(currentMk) && (data.income._default??0)>0) {
            allMksWithCurrent.push(currentMk);
            allMksWithCurrent.sort();
          }

          // Calcola dati per ogni mese
          function getMkData(mk) {
            const {year,month} = parseMonthKey(mk);
            const inc = data.income[mk]??data.income._default??0;
            const manual = (data.expenses||[]).filter(e=>{ const d=new Date(e.date); return d.getMonth()===month&&d.getFullYear()===year; }).reduce((s,e)=>s+e.amount,0);
            const rec = getRecurringForMonth(data.recurring||[], mk).reduce((s,r)=>s+r.amount,0);
            const spent = manual+rec;
            const saving = inc>0?inc-spent:null;
            const savingPct = inc>0&&saving!==null?(saving/inc)*100:null;
            return { mk, inc, manual, rec, spent, saving, savingPct, isCurrent: mk===currentMk };
          }

          const rows = allMksWithCurrent.map(getMkData);
          // Per il pronostico usa solo i mesi passati (< currentMk) con spese reali
          const historicRows = rows.filter(r=>r.mk<currentMk&&r.inc>0&&(r.manual+r.rec)>0);

          // ── pronostico ────────────────────────────────────────────────────
          // Media ultimi N mesi storici (con spese)
          const FORECAST_WINDOW = 3;
          const lastN = historicRows.slice(-FORECAST_WINDOW);
          const avgIncome  = lastN.length ? lastN.reduce((s,r)=>s+r.inc,0)/lastN.length : 0;
          const avgSpent   = lastN.length ? lastN.reduce((s,r)=>s+r.spent,0)/lastN.length : 0;
          const avgSaving  = avgIncome - avgSpent;
          const avgSavingPct = avgIncome>0?(avgSaving/avgIncome)*100:0;

          // Genera prossimi 6 mesi
          function nextMk(mk, n) {
            const {year,month}=parseMonthKey(mk); const d=new Date(year,month+n,1);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
          }
          const forecastBase = allMksWithCurrent.length>0 ? allMksWithCurrent[allMksWithCurrent.length-1] : currentMk;
          const forecastMks = [1,2,3,4,5,6].map(n=>nextMk(forecastBase,n));

          // ── grafico ───────────────────────────────────────────────────────
          // Mostra ultimi 6 storici + corrente + 4 forecast
          const chartHistoric = allMksWithCurrent.slice(-7);
          const chartForecast = forecastMks.slice(0,4);
          const chartAll = [...chartHistoric, ...chartForecast];

          function getChartVal(mk, field) {
            if (chartForecast.includes(mk)) {
              return field==="inc"?avgIncome:field==="spent"?avgSpent:avgSaving;
            }
            const r=getMkData(mk);
            return field==="inc"?r.inc:field==="spent"?r.spent:(r.saving??0);
          }

          const chartMax = Math.max(...chartAll.flatMap(mk=>[getChartVal(mk,"inc"),getChartVal(mk,"spent"),Math.max(0,getChartVal(mk,"sav"))]),1);
          const BAR_W = 28; const GAP = 10; const CHART_H = 180; const LEFT = 60; const BOTTOM = 36;
          const totalW = LEFT + chartAll.length*(BAR_W*3+GAP*2+8) + 16;

          function barH(val){ return Math.max(2,(val/chartMax)*CHART_H); }
          function shortMk(mk){ const {year,month}=parseMonthKey(mk); return `${MONTHS[month].slice(0,3)} ${String(year).slice(2)}`; }

          // Linee guida Y
          const yLines = [0.25,0.5,0.75,1].map(f=>({ y: CHART_H - f*CHART_H, label: formatEur(f*chartMax).replace(",00","") }));

          const toggleCompareMk = mk => setSelectedCompareMks(prev=>prev.includes(mk)?prev.filter(x=>x!==mk):[...prev,mk].slice(-3));

          const compareRows = selectedCompareMks.length>0
            ? rows.filter(r=>selectedCompareMks.includes(r.mk))
            : historicRows.slice(-3);

          if (rows.length===0) return (
            <div style={{...S.card,textAlign:"center",padding:"3rem",color:T.textMuted}}>
              <div style={{fontSize:48,marginBottom:12}}>📊</div>
              <div style={{fontSize:16,fontWeight:500,marginBottom:6}}>Nessun dato storico</div>
              <div style={{fontSize:14}}>Aggiungi entrate e spese per almeno un mese per vedere l'analisi.</div>
            </div>
          );

          return (
            <div>
              <div style={{fontSize:22,fontWeight:700,marginBottom:"1.5rem",color:T.textPrimary}}>📊 Analisi & Pronostico</div>

              {/* ── GRAFICO ── */}
              <div style={S.card}>
                <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>Entrate · Spese · Risparmio</div>
                <div style={{fontSize:12,color:T.textMuted,marginBottom:16}}>Ultimi mesi + pronostico (media {FORECAST_WINDOW} mesi)</div>

                {/* Legenda */}
                <div style={{display:"flex",gap:16,marginBottom:12,flexWrap:"wrap"}}>
                  {[{col:"#5DCAA5",label:"Entrate"},{col:T.accentRed,label:"Spese"},{col:"#378ADD",label:"Risparmio"}].map(l=>(
                    <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:12,height:12,borderRadius:3,background:l.col}}/>
                      <span style={{fontSize:12,color:T.textSecondary}}>{l.label}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:12,height:12,borderRadius:3,background:T.bgBar,border:`1.5px dashed ${T.textMuted}`}}/>
                    <span style={{fontSize:12,color:T.textSecondary}}>Pronostico</span>
                  </div>
                </div>

                <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                  <svg width={Math.max(totalW,300)} height={CHART_H+BOTTOM+8} style={{display:"block",fontFamily:"inherit"}}>
                    {/* Linee guida */}
                    {yLines.map(({y,label})=>(
                      <g key={y}>
                        <line x1={LEFT} y1={y} x2={totalW} y2={y} stroke={T.border} strokeDasharray="3,3"/>
                        <text x={LEFT-6} y={y+4} textAnchor="end" fontSize={10} fill={T.textMuted}>{label}</text>
                      </g>
                    ))}
                    {/* Linea base */}
                    <line x1={LEFT} y1={CHART_H} x2={totalW} y2={CHART_H} stroke={T.border}/>

                    {chartAll.map((mk,i)=>{
                      const isForecast = chartForecast.includes(mk);
                      const isCurr = mk===currentMk;
                      const x = LEFT + i*(BAR_W*3+GAP*2+8) + 4;
                      const inc   = getChartVal(mk,"inc");
                      const spent = getChartVal(mk,"spent");
                      const sav   = Math.max(0,getChartVal(mk,"sav"));
                      const hInc=barH(inc), hSpent=barH(spent), hSav=barH(sav);
                      return (
                        <g key={mk}>
                          {/* Sfondo forecast */}
                          {isForecast&&<rect x={x-4} y={0} width={BAR_W*3+GAP*2+12} height={CHART_H} fill={T.bgHover} rx={4} opacity={0.5}/>}
                          {/* Barre */}
                          <rect x={x} y={CHART_H-hInc} width={BAR_W} height={hInc} rx={4}
                            fill={isForecast?"none":"#5DCAA5"} stroke={isForecast?"#5DCAA5":"none"} strokeDasharray={isForecast?"4,2":""} strokeWidth={1.5}/>
                          <rect x={x+BAR_W+GAP} y={CHART_H-hSpent} width={BAR_W} height={hSpent} rx={4}
                            fill={isForecast?"none":T.accentRed} stroke={isForecast?T.accentRed:"none"} strokeDasharray={isForecast?"4,2":""} strokeWidth={1.5}/>
                          <rect x={x+BAR_W*2+GAP*2} y={CHART_H-hSav} width={BAR_W} height={hSav} rx={4}
                            fill={isForecast?"none":"#378ADD"} stroke={isForecast?"#378ADD":"none"} strokeDasharray={isForecast?"4,2":""} strokeWidth={1.5}/>
                          {/* Label mese */}
                          <text x={x+BAR_W*1.5+GAP} y={CHART_H+BOTTOM-4} textAnchor="middle" fontSize={10}
                            fill={isForecast?T.textMuted:isCurr?"#378ADD":T.textSecondary}
                            fontWeight={isCurr?600:400}>
                            {shortMk(mk)}{isForecast?"*":""}
                          </text>
                          {/* Badge corrente */}
                          {isCurr&&<text x={x+BAR_W*1.5+GAP} y={CHART_H+BOTTOM-16} textAnchor="middle" fontSize={9} fill="#378ADD">in corso</text>}
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:4}}>* pronostico basato sulla media degli ultimi {FORECAST_WINDOW} mesi</div>
              </div>

              {/* ── PRONOSTICO ── */}
              {lastN.length>0&&(
                <div style={S.card}>
                  <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>Pronostico prossimi 6 mesi</div>
                  <div style={{fontSize:12,color:T.textMuted,marginBottom:16}}>
                    Media su {lastN.length} mesi: entrate {formatEur(avgIncome)} · spese {formatEur(avgSpent)} · risparmio stimato {formatEur(avgSaving)} ({avgSavingPct.toFixed(0)}%)
                  </div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:400}}>
                      <thead>
                        <tr style={{borderBottom:`2px solid ${T.border}`}}>
                          {["Mese","Entrate stimate","Spese stimate","Risparmio stimato","%"].map(h=>(
                            <th key={h} style={{padding:"8px 10px",textAlign:h==="Mese"?"left":"right",color:T.textMuted,fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {forecastMks.map((mk,i)=>{
                          const cumSaving = avgSaving*(i+1);
                          return (
                            <tr key={mk} style={{borderBottom:`1px solid ${T.border}`}}>
                              <td style={{padding:"10px 10px",color:T.textPrimary,fontWeight:500}}>{shortMk(mk)}</td>
                              <td style={{padding:"10px 10px",textAlign:"right",color:T.accentGreen}}>{formatEur(avgIncome)}</td>
                              <td style={{padding:"10px 10px",textAlign:"right",color:T.accentRed}}>{formatEur(avgSpent)}</td>
                              <td style={{padding:"10px 10px",textAlign:"right",fontWeight:600,color:avgSaving>=0?T.accentGreenText:T.accentRed}}>
                                {avgSaving>=0?"+":""}{formatEur(avgSaving)}
                                <div style={{fontSize:10,color:T.textMuted,fontWeight:400}}>cumulato: {formatEur(cumSaving)}</div>
                              </td>
                              <td style={{padding:"10px 10px",textAlign:"right",color:avgSavingPct>=0?T.accentGreenText:T.accentRed,fontWeight:500}}>{avgSavingPct.toFixed(0)}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {avgSaving>0&&(
                    <div style={{marginTop:14,background:T.accentGreenBg,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.accentGreenText}33`}}>
                      <div style={{fontSize:13,fontWeight:600,color:T.accentGreenText}}>
                        📈 Se mantieni questo ritmo, in 6 mesi risparmieresti circa {formatEur(avgSaving*6)}
                      </div>
                      {avgSaving*12>0&&<div style={{fontSize:12,color:T.accentGreenText,marginTop:4,opacity:0.8}}>In un anno: {formatEur(avgSaving*12)}</div>}
                    </div>
                  )}
                  {avgSaving<0&&(
                    <div style={{marginTop:14,background:T.accentRedBg,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.accentRed}33`}}>
                      <div style={{fontSize:13,fontWeight:600,color:T.accentRed}}>
                        ⚠ Con questo andamento stai consumando {formatEur(Math.abs(avgSaving))} al mese. Controlla le spese!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── CONFRONTO MESI ── */}
              <div style={S.card}>
                <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>Confronto mesi</div>
                <div style={{fontSize:12,color:T.textMuted,marginBottom:12}}>
                  Seleziona fino a 3 mesi da confrontare (default: ultimi 3)
                </div>
                {/* Selezione mesi */}
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
                  {allMksWithCurrent.map(mk=>{
                    const sel=selectedCompareMks.includes(mk);
                    const isCurr=mk===currentMk;
                    return (
                      <button key={mk} onClick={()=>toggleCompareMk(mk)}
                        style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${sel?T.accentBlue:T.borderInput}`,background:sel?T.accentBlueBg:"transparent",color:sel?T.accentBlue:T.textSecondary,fontSize:12,fontWeight:sel?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                        {shortMk(mk)}{isCurr?" ●":""}
                      </button>
                    );
                  })}
                  {selectedCompareMks.length>0&&(
                    <button onClick={()=>setSelectedCompareMks([])}
                      style={{padding:"5px 12px",borderRadius:99,border:`1px solid ${T.borderInput}`,background:"transparent",color:T.textMuted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                      Reset
                    </button>
                  )}
                </div>

                {/* Tabella confronto */}
                {compareRows.length>0&&(
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:380}}>
                      <thead>
                        <tr style={{borderBottom:`2px solid ${T.border}`}}>
                          <th style={{padding:"8px 10px",textAlign:"left",color:T.textMuted,fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>Voce</th>
                          {compareRows.map(r=>(
                            <th key={r.mk} style={{padding:"8px 10px",textAlign:"right",color:r.isCurrent?T.accentBlue:T.textMuted,fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
                              {shortMk(r.mk)}{r.isCurrent?" ●":""}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {label:"💵 Entrate",    key:"inc",     fmt:v=>formatEur(v),         color:()=>T.accentGreen},
                          {label:"💸 Spese tot.", key:"spent",   fmt:v=>formatEur(v),         color:()=>T.accentRed},
                          {label:"⟳ Fisse",       key:"rec",     fmt:v=>formatEur(v),         color:()=>T.accentBlue},
                          {label:"✏️ Variabili",  key:"manual",  fmt:v=>formatEur(v),         color:()=>T.textPrimary},
                          {label:"🏦 Risparmio",  key:"saving",  fmt:v=>v===null?"—":(v>=0?"+":"")+formatEur(v), color:v=>v===null?T.textMuted:v>=0?T.accentGreenText:T.accentRed},
                          {label:"📊 % risparmio",key:"savingPct",fmt:v=>v===null?"—":`${v.toFixed(0)}%`, color:v=>v===null?T.textMuted:v>=0?T.accentGreenText:T.accentRed},
                        ].map(row=>{
                          // Trova il miglior valore per evidenziarlo
                          const vals = compareRows.map(r=>r[row.key]);
                          const maxVal = row.key==="spent"?null:Math.max(...vals.filter(v=>v!==null));
                          return (
                            <tr key={row.label} style={{borderBottom:`1px solid ${T.border}`}}>
                              <td style={{padding:"10px 10px",color:T.textSecondary,fontWeight:500,whiteSpace:"nowrap"}}>{row.label}</td>
                              {compareRows.map(r=>{
                                const val=r[row.key];
                                const isBest = maxVal!==null&&val===maxVal&&compareRows.length>1&&val!==null;
                                return (
                                  <td key={r.mk} style={{padding:"10px 10px",textAlign:"right",fontWeight:isBest?700:400,color:row.color(val),background:isBest?T.accentGreenBg:"transparent",borderRadius:isBest?8:0}}>
                                    {row.fmt(val)}
                                    {isBest&&<span style={{fontSize:10,marginLeft:4}}>🥇</span>}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ── STORICO COMPLETO ── */}
              <div style={S.card}>
                <div style={{fontSize:15,fontWeight:600,marginBottom:16}}>Storico completo</div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:500}}>
                    <thead>
                      <tr style={{borderBottom:`2px solid ${T.border}`}}>
                        {["Mese","Entrate","Spese","Fisse","Variabili","Risparmio","%"].map(h=>(
                          <th key={h} style={{padding:"8px 10px",textAlign:h==="Mese"?"left":"right",color:T.textMuted,fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...rows].reverse().map(r=>(
                        <tr key={r.mk} style={{borderBottom:`1px solid ${T.border}`,background:r.isCurrent?T.accentBlueBg:"transparent"}}>
                          <td style={{padding:"10px 10px",fontWeight:r.isCurrent?600:400,color:r.isCurrent?T.accentBlue:T.textPrimary,whiteSpace:"nowrap"}}>
                            {shortMk(r.mk)}{r.isCurrent&&<span style={{fontSize:10,marginLeft:5,color:T.accentBlue}}>in corso</span>}
                          </td>
                          <td style={{padding:"10px 10px",textAlign:"right",color:T.accentGreen}}>{formatEur(r.inc)}</td>
                          <td style={{padding:"10px 10px",textAlign:"right",color:T.accentRed}}>{formatEur(r.spent)}</td>
                          <td style={{padding:"10px 10px",textAlign:"right",color:T.accentBlue}}>{formatEur(r.rec)}</td>
                          <td style={{padding:"10px 10px",textAlign:"right",color:T.textPrimary}}>{formatEur(r.manual)}</td>
                          <td style={{padding:"10px 10px",textAlign:"right",fontWeight:600,color:r.saving===null?T.textMuted:r.saving>=0?T.accentGreenText:T.accentRed}}>
                            {r.saving===null?"—":(r.saving>=0?"+":"")+formatEur(r.saving)}
                          </td>
                          <td style={{padding:"10px 10px",textAlign:"right",color:r.savingPct===null?T.textMuted:r.savingPct>=0?T.accentGreenText:T.accentRed}}>
                            {r.savingPct===null?"—":`${r.savingPct.toFixed(0)}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {showForm&&(
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div style={S.modal}>
            <div style={{fontSize:18,fontWeight:600,marginBottom:"1.5rem"}}>{editingExpense?"Modifica spesa":"Nuova spesa"}</div>
            <div style={{display:"grid",gap:14}}>
              <div><label style={S.label}>Descrizione</label><input style={S.input} placeholder="es. Spesa al supermercato" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} autoFocus/></div>
              <div className="modal-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={S.label}>Importo (€)</label><input style={S.input} placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></div>
                <div><label style={S.label}>Data</label><input type="date" style={S.input} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
              </div>
              <div><label style={S.label}>Categoria</label><select style={S.input} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select></div>
              <div><label style={S.label}>Note (opzionale)</label><input style={S.input} placeholder="Aggiungi una nota..." value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:"1.5rem"}}>
              <button style={{...S.btn("ghost"),flex:1}} onClick={()=>setShowForm(false)}>Annulla</button>
              <button style={{...S.btn("primary"),flex:2}} onClick={submitForm}>{editingExpense?"Salva modifiche":"Aggiungi spesa"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: spesa fissa ── */}
      {showRecurringForm&&(
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setShowRecurringForm(false)}>
          <div style={S.modal}>
            <div style={{fontSize:18,fontWeight:600,marginBottom:4}}>{editingRecurring?"Modifica spesa fissa":"Nuova spesa fissa"}</div>
            <div style={{fontSize:13,color:T.textMuted,marginBottom:"1.5rem"}}>Affitti, abbonamenti, rate — si aggiunge automaticamente ogni mese</div>
            <div style={{display:"grid",gap:14}}>
              <div><label style={S.label}>Descrizione</label><input style={S.input} placeholder="es. Affitto, Netflix, Rata mutuo..." value={rForm.description} onChange={e=>setRForm(f=>({...f,description:e.target.value}))} autoFocus/></div>
              <div className="modal-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={S.label}>Importo mensile (€)</label><input style={S.input} placeholder="0.00" value={rForm.amount} onChange={e=>setRForm(f=>({...f,amount:e.target.value}))}/></div>
                <div><label style={S.label}>Categoria</label><select style={S.input} value={rForm.category} onChange={e=>setRForm(f=>({...f,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select></div>
              </div>
              <div><label style={S.label}>Mese di inizio</label><input type="month" style={S.input} value={rForm.startMonth} onChange={e=>setRForm(f=>({...f,startMonth:e.target.value}))}/></div>
              <div>
                <label style={S.label}>Durata</label>
                <div style={{display:"flex",gap:10}}>
                  {[{v:"ongoing",l:"♾ Senza scadenza"},{v:"fixed",l:"📅 N mesi fissi"}].map(opt=>(
                    <label key={opt.v} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${rForm.duration===opt.v?T.radioBorderActive:T.radioBorderInactive}`,cursor:"pointer",flex:1,fontSize:13,fontWeight:rForm.duration===opt.v?500:400,background:rForm.duration===opt.v?T.radioBgActive:T.radioBgInactive,color:T.textPrimary,transition:"all .15s"}}>
                      <input type="radio" name="dur" value={opt.v} checked={rForm.duration===opt.v} onChange={()=>setRForm(f=>({...f,duration:opt.v}))} style={{accentColor:T.btnPrimaryBg}}/>
                      {opt.l}
                    </label>
                  ))}
                </div>
              </div>
              {rForm.duration==="fixed"&&(
                <div>
                  <label style={S.label}>Numero di mesi</label>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <input style={{...S.input,width:100}} type="number" min="1" max="120" placeholder="12" value={rForm.durationMonths} onChange={e=>setRForm(f=>({...f,durationMonths:e.target.value}))}/>
                    {endMonthPreview()&&<span style={{fontSize:13,color:T.accentBlue,fontWeight:500}}>→ {endMonthPreview()}</span>}
                  </div>
                </div>
              )}
              <div><label style={S.label}>Note (opzionale)</label><input style={S.input} placeholder="es. Contratto n.123..." value={rForm.note} onChange={e=>setRForm(f=>({...f,note:e.target.value}))}/></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:"1.5rem"}}>
              <button style={{...S.btn("ghost"),flex:1}} onClick={()=>setShowRecurringForm(false)}>Annulla</button>
              <button style={{...S.btn("primary"),flex:2}} onClick={submitRecurring}>{editingRecurring?"Salva modifiche":"Aggiungi spesa fissa"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: reset dati ── */}
      {showResetModal&&(
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setShowResetModal(false)}>
          <div style={{...S.modal,maxWidth:440,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:18,fontWeight:700,color:T.accentRed,marginBottom:8}}>Reset completo dei dati</div>
            <div style={{fontSize:14,color:T.textSecondary,lineHeight:1.7,marginBottom:"1.5rem",textAlign:"left"}}>
              Questa azione cancellerà <strong style={{color:T.textPrimary}}>permanentemente e in modo irreversibile</strong> tutti i dati del tuo account:
              <ul style={{margin:"12px 0",paddingLeft:20,display:"flex",flexDirection:"column",gap:6}}>
                <li>Tutte le <strong>spese</strong> inserite</li>
                <li>Tutte le <strong>spese fisse</strong> configurate</li>
                <li>Tutte le <strong>entrate</strong> impostate (incluso il default)</li>
                <li>Tutti gli <strong>achievement</strong> sbloccati</li>
              </ul>
              <div style={{background:T.accentRedBg,borderRadius:10,padding:"10px 14px",fontSize:13,color:T.accentRed,fontWeight:500}}>
                ⚠ Non esiste un backup. Una volta confermato, non si può tornare indietro.
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("ghost"),flex:1}} onClick={()=>setShowResetModal(false)}>Annulla</button>
              <button
                style={{...S.btn("primary"),flex:2,background:T.accentRed,color:"#fff"}}
                onClick={()=>{
                  saveData(user.id,{expenses:[],income:{},recurring:[]});
                  saveAchievements(user.id,[]);
                  setData({expenses:[],income:{},recurring:[]});
                  setUnlockedList([]);
                  setShowResetModal(false);
                  showToast("Dati resettati","error");
                }}
              >
                Sì, cancella tutto
              </button>
            </div>
          </div>
        </div>
      )}

      {toast&&<div style={S.toast(toast.type)}>{toast.msg}</div>}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]   = useState(()=>getSession());
  const [theme,setTheme] = useState(()=>getInitialTheme());
  function toggleTheme() { setTheme(t=>{ const next=t==="light"?"dark":"light"; try{localStorage.setItem(THEME_KEY,next);}catch{} return next; }); }
  if(!user) return <LoginScreen onLogin={setUser} theme={theme} onToggleTheme={toggleTheme}/>;
  return <MainApp key={user.id} user={user} onLogout={()=>{clearSession();setUser(null);}} theme={theme} onToggleTheme={toggleTheme}/>;
}
