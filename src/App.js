import { useState, useEffect, useRef } from "react";

// ── MOCK AUTH ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "user_dani", email: "dani@spesometro.it", password: "A7kP2xQ9Lm4Z", name: "Dani" },
  { id: "user_sergiu", email: "sergiu@spesometro.it", password: "r3D8vN6bX1Qa", name: "Sergiu" },
  { id: "user_sofia", email: "sofia@spesometro.it", password: "T9mL5cW2pH8s", name: "Sophie" },
  { id: "user_andrei", email: "andrei@spesometro.it", password: "T9mL5cw3pH8s", name: "Andrei" },
  { id: "user_andreas", email: "andreas@spesometro.it", password: "T9mL6Cw3pH8s", name: "Andreas" },
];

const SESSION_KEY = "spesometro_session";

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}
function setSession(user) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch {}
}
function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

// ── DATI PER UTENTE ──────────────────────────────────────────────────────────
function userStorageKey(userId) { return `spesometro_v2_${userId}`; }
function loadData(userId) {
  try {
    const raw = localStorage.getItem(userStorageKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { expenses: [], income: {}, recurring: [] };
}
function saveData(userId, d) {
  try { localStorage.setItem(userStorageKey(userId), JSON.stringify(d)); } catch {}
}

// ── SCHERMATA DI LOGIN ───────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  function handleLogin() {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password.trim()
      );
      if (user) {
        const session = { id: user.id, name: user.name, email: user.email };
        setSession(session);
        onLogin(session);
      } else {
        setError("Email o password non corretti.");
      }
      setLoading(false);
    }, 600);
  }

  const S = {
    wrap: {
      minHeight: "100vh",
      background: "#F7F6F2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "1rem",
    },
    card: {
      background: "#fff",
      borderRadius: 24,
      padding: "2.5rem 2rem",
      width: "100%",
      maxWidth: 400,
      boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
      border: "1px solid #ebebeb",
    },
    logo: { fontSize: 32, marginBottom: 8 },
    title: { fontSize: 22, fontWeight: 700, color: "#1a1a18", marginBottom: 4 },
    subtitle: { fontSize: 14, color: "#888", marginBottom: "2rem" },
    label: { fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.06em" },
    input: { width: "100%", padding: "11px 13px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 16, fontFamily: "inherit", background: "#fafafa", color: "#1a1a18", boxSizing: "border-box", marginBottom: "1rem" },
    btn: { width: "100%", padding: "13px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, background: "#1a1a18", color: "#fff", marginTop: 8, transition: "opacity .15s", minHeight: 48 },
    error: { background: "#FCEBEB", color: "#A32D2D", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: "1rem" },
    pwWrap: { position: "relative" },
    pwToggle: { position: "absolute", right: 12, top: "50%", transform: "translateY(-70%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 13, minHeight: 44, minWidth: 44 },
  };

  return (
    <div style={S.wrap}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box} input:focus{border-color:#1a1a18!important;outline:none;box-shadow:0 0 0 3px rgba(26,26,24,.07)}`}</style>
      <div style={S.card}>
        <div style={S.logo}>💰</div>
        <div style={S.title}>Spesometro</div>
        <div style={S.subtitle}>Accedi per gestire le tue finanze</div>

        {error && <div style={S.error}>⚠ {error}</div>}

        <div>
          <label style={S.label}>Email</label>
          <input
            style={S.input}
            type="email"
            placeholder="marco@spesometro.it"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoFocus
          />
        </div>
        <div>
          <label style={S.label}>Password</label>
          <div style={S.pwWrap}>
            <input
              style={{ ...S.input, paddingRight: 44 }}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
            <button style={S.pwToggle} onClick={() => setShowPw(v => !v)} tabIndex={-1}>
              {showPw ? "Nascondi" : "Mostra"}
            </button>
          </div>
        </div>

        <button style={{ ...S.btn, opacity: loading ? 0.6 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Accesso in corso…" : "Accedi →"}
        </button>
      </div>
    </div>
  );
}

// ── APP PRINCIPALE ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "casa", label: "Casa", icon: "🏠", color: "#5DCAA5" },
  { id: "cibo", label: "Cibo", icon: "🍕", color: "#EF9F27" },
  { id: "trasporti", label: "Trasporti", icon: "🚗", color: "#85B7EB" },
  { id: "svago", label: "Svago", icon: "🎬", color: "#ED93B1" },
  { id: "salute", label: "Salute", icon: "💊", color: "#5DCAA5" },
  { id: "abbigliamento", label: "Abbigliamento", icon: "👕", color: "#AFA9EC" },
  { id: "tecnologia", label: "Tecnologia", icon: "💻", color: "#378ADD" },
  { id: "altro", label: "Altro", icon: "📦", color: "#888780" },
];

const MONTHS = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const catMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

function formatEur(n) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n);
}

function toMonthKey(y, m) { return `${y}-${String(m + 1).padStart(2, "0")}`; }
function parseMonthKey(k) { const [y, m] = k.split("-"); return { year: parseInt(y), month: parseInt(m) - 1 }; }
function addMonths(y, m, n) {
  const d = new Date(y, m + n, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function getRecurringForMonth(recurring, monthKey) {
  return recurring.filter(r => {
    if (r.startMonth > monthKey) return false;
    if (r.endMonth && r.endMonth < monthKey) return false;
    return true;
  });
}

function MainApp({ user, onLogout }) {
  const now = new Date();
  const [data, setData] = useState(() => loadData(user.id));
  const [view, setView] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [editingIncome, setEditingIncome] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState({ description: "", amount: "", category: "cibo", date: new Date().toISOString().split("T")[0], note: "" });
  const [rForm, setRForm] = useState({ description: "", amount: "", category: "casa", startMonth: toMonthKey(now.getFullYear(), now.getMonth()), duration: "ongoing", durationMonths: "12", note: "" });
  const [incomeForm, setIncomeForm] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => { saveData(user.id, data); }, [data, user.id]);

  const monthKey = toMonthKey(selectedYear, selectedMonth);
  const manualExpenses = data.expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });
  const activeRecurring = getRecurringForMonth(data.recurring || [], monthKey);
  const allMonthExpenses = [
    ...manualExpenses.map(e => ({ ...e, isRecurring: false })),
    ...activeRecurring.map(r => ({ ...r, id: `rec_${r.id}`, date: `${monthKey}-01`, isRecurring: true })),
  ];
  const totalSpent = allMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalRecurring = activeRecurring.reduce((s, r) => s + r.amount, 0);
  const income = data.income[monthKey] || 0;
  const saved = income - totalSpent;

  const filtered = allMonthExpenses
    .filter(e => filterCat === "all" || e.category === filterCat)
    .filter(e => filterType === "all" || (filterType === "manual" ? !e.isRecurring : e.isRecurring))
    .sort((a, b) => {
      if (a.isRecurring && !b.isRecurring) return -1;
      if (!a.isRecurring && b.isRecurring) return 1;
      return new Date(b.date) - new Date(a.date);
    });

  const byCategory = CATEGORIES.map(c => ({
    ...c,
    total: allMonthExpenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0),
    count: allMonthExpenses.filter(e => e.category === c.id).length,
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const maxCatTotal = byCategory[0]?.total || 1;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  function openAdd() {
    setEditingExpense(null);
    setForm({ description: "", amount: "", category: "cibo", date: new Date().toISOString().split("T")[0], note: "" });
    setShowForm(true);
  }
  function openEdit(exp) {
    setEditingExpense(exp);
    setForm({ description: exp.description, amount: String(exp.amount), category: exp.category, date: exp.date, note: exp.note || "" });
    setShowForm(true);
  }
  function submitForm() {
    const amount = parseFloat(form.amount.replace(",", "."));
    if (!form.description.trim() || isNaN(amount) || amount <= 0) { showToast("Compila tutti i campi", "error"); return; }
    const entry = { id: editingExpense?.id || Date.now(), description: form.description.trim(), amount, category: form.category, date: form.date, note: form.note };
    setData(d => ({ ...d, expenses: editingExpense ? d.expenses.map(e => e.id === editingExpense.id ? entry : e) : [...d.expenses, entry] }));
    setShowForm(false);
    showToast(editingExpense ? "Spesa aggiornata" : "Spesa aggiunta");
  }
  function deleteExpense(id) {
    setData(d => ({ ...d, expenses: d.expenses.filter(e => e.id !== id) }));
    showToast("Spesa eliminata", "error");
  }

  function openAddRecurring() {
    setEditingRecurring(null);
    setRForm({ description: "", amount: "", category: "casa", startMonth: monthKey, duration: "ongoing", durationMonths: "12", note: "" });
    setShowRecurringForm(true);
  }
  function openEditRecurring(r) {
    if (!r) return;
    setEditingRecurring(r);
    const hasEnd = !!r.endMonth;
    let durationMonths = "12";
    if (hasEnd) {
      const start = parseMonthKey(r.startMonth);
      const end = parseMonthKey(r.endMonth);
      durationMonths = String((end.year - start.year) * 12 + (end.month - start.month) + 1);
    }
    setRForm({ description: r.description, amount: String(r.amount), category: r.category, startMonth: r.startMonth, duration: hasEnd ? "fixed" : "ongoing", durationMonths, note: r.note || "" });
    setShowRecurringForm(true);
  }
  function submitRecurring() {
    const amount = parseFloat(rForm.amount.replace(",", "."));
    if (!rForm.description.trim() || isNaN(amount) || amount <= 0) { showToast("Compila tutti i campi", "error"); return; }
    let endMonth = null;
    if (rForm.duration === "fixed") {
      const n = parseInt(rForm.durationMonths);
      if (isNaN(n) || n < 1) { showToast("Numero di mesi non valido", "error"); return; }
      const start = parseMonthKey(rForm.startMonth);
      const end = addMonths(start.year, start.month, n - 1);
      endMonth = toMonthKey(end.year, end.month);
    }
    const entry = { id: editingRecurring?.id || Date.now(), description: rForm.description.trim(), amount, category: rForm.category, startMonth: rForm.startMonth, endMonth, note: rForm.note };
    setData(d => ({ ...d, recurring: editingRecurring ? (d.recurring || []).map(r => r.id === editingRecurring.id ? entry : r) : [...(d.recurring || []), entry] }));
    setShowRecurringForm(false);
    showToast(editingRecurring ? "Spesa fissa aggiornata" : "Spesa fissa aggiunta");
  }
  function deleteRecurring(id) {
    setData(d => ({ ...d, recurring: (d.recurring || []).filter(r => r.id !== id) }));
    showToast("Spesa fissa eliminata", "error");
  }
  function stopRecurringNow(r) {
    const prev = addMonths(now.getFullYear(), now.getMonth(), -1);
    const endMonth = toMonthKey(prev.year, prev.month);
    setData(d => ({ ...d, recurring: (d.recurring || []).map(x => x.id === r.id ? { ...x, endMonth: endMonth < x.startMonth ? x.startMonth : endMonth } : x) }));
    showToast("Spesa fissa terminata");
  }
  function saveIncome() {
    const val = parseFloat(incomeForm.replace(",", "."));
    if (!isNaN(val) && val >= 0) {
      setData(d => ({ ...d, income: { ...d.income, [monthKey]: val } }));
      setEditingIncome(false);
      showToast("Entrate aggiornate");
    }
  }
  function changeMonth(dir) {
    let m = selectedMonth + dir, y = selectedYear;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setSelectedMonth(m); setSelectedYear(y);
  }
  function recurringLabel(r) {
    if (!r.endMonth) return "Senza scadenza";
    const start = parseMonthKey(r.startMonth);
    const end = parseMonthKey(r.endMonth);
    const n = (end.year - start.year) * 12 + (end.month - start.month) + 1;
    return `${n} ${n === 1 ? "mese" : "mesi"} · fino a ${MONTHS[end.month]} ${end.year}`;
  }

  const endMonthPreview = () => {
    if (rForm.duration !== "fixed") return null;
    const n = parseInt(rForm.durationMonths);
    if (isNaN(n) || n < 1) return null;
    const start = parseMonthKey(rForm.startMonth);
    const end = addMonths(start.year, start.month, n - 1);
    return `fino a ${MONTHS[end.month]} ${end.year}`;
  };

  function navigateTo(id) {
    setView(id);
    if (isMobile) setSidebarOpen(false);
  }

  const S = {
    root: { fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh", background: "#F7F6F2", color: "#1a1a18" },
    sidebar: {
      width: 220,
      background: "#1a1a18",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem 1rem",
      position: "fixed",
      top: 0,
      left: isMobile ? (sidebarOpen ? 0 : -240) : 0,
      bottom: 0,
      zIndex: 200,
      transition: "left 0.25s ease",
      boxShadow: isMobile && sidebarOpen ? "4px 0 32px rgba(0,0,0,0.35)" : "none",
    },
    main: {
      marginLeft: isMobile ? 0 : 220,
      padding: isMobile ? "1rem 0.875rem" : "2rem",
      maxWidth: isMobile ? "100%" : 980,
      paddingBottom: isMobile ? "2rem" : "2rem",
    },
    nav: (a) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", marginBottom: 4, background: a ? "#2e2e2b" : "transparent", color: a ? "#fff" : "#888", fontSize: 14, fontWeight: a ? 500 : 400, border: "none", width: "100%", textAlign: "left", transition: "all 0.15s", minHeight: 44 }),
    card: { background: "#fff", borderRadius: 16, padding: isMobile ? "1rem" : "1.25rem 1.5rem", border: "1px solid #ebebeb", marginBottom: "1.25rem" },
    metricCard: (bg) => ({ background: bg || "#fff", borderRadius: 14, padding: "1.25rem", border: "1px solid #ebebeb", flex: 1, minWidth: isMobile ? 0 : 160 }),
    btn: (v) => ({ padding: v === "icon" ? "7px 10px" : "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.15s", whiteSpace: "nowrap", minHeight: 40,
      ...(v === "primary" ? { background: "#1a1a18", color: "#fff" } :
        v === "accent" ? { background: "#E6F1FB", color: "#185FA5" } :
        v === "danger" ? { background: "#FCEBEB", color: "#A32D2D" } :
        v === "ghost" ? { background: "transparent", color: "#555", border: "1px solid #e0e0e0" } :
        v === "icon" ? { background: "transparent", color: "#aaa", border: "1px solid #ebebeb", minWidth: 40, minHeight: 40 } :
        { background: "#F0EEE8", color: "#1a1a18" }) }),
    input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 16, fontFamily: "inherit", background: "#fafafa", color: "#1a1a18", boxSizing: "border-box" },
    label: { fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.06em" },
    badge: (cat) => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: catMap[cat]?.color + "22", color: catMap[cat]?.color }),
    recBadge: { display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 20, fontSize: 11, background: "#E6F1FB", color: "#185FA5", fontWeight: 500 },
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.32)", zIndex: 100, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : "1rem" },
    modal: {
      background: "#fff",
      borderRadius: isMobile ? "20px 20px 0 0" : 20,
      padding: isMobile ? "1.5rem 1rem 2rem" : "2rem",
      width: "100%",
      maxWidth: isMobile ? "100%" : 500,
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      maxHeight: isMobile ? "92vh" : "92vh",
      overflowY: "auto",
    },
    toast: (t) => ({ position: "fixed", bottom: 24, right: isMobile ? 12 : 24, left: isMobile ? 12 : "auto", zIndex: 300, background: t === "error" ? "#A32D2D" : "#1a1a18", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "fadeIn .25s ease", textAlign: isMobile ? "center" : "left" }),
  };

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box} button:hover{opacity:.85} input:focus,select:focus,textarea:focus{border-color:#1a1a18!important;outline:none}
        .row:hover{background:#fafaf8!important} .nav-btn:hover{background:#2e2e2b!important;color:#fff!important}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px} select{appearance:none}
        @media(max-width:767px){
          input,select,textarea{font-size:16px!important;}
          .metric-row{flex-direction:column!important;}
          .modal-grid-2{grid-template-columns:1fr!important;}
          .topbar-month{min-width:130px!important;font-size:16px!important;}
        }
      `}</style>

      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 199 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>💰 Spesometro</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Traccia le tue finanze</div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer", padding: "2px 4px", lineHeight: 1, marginTop: -2 }}
              aria-label="Chiudi menu"
            >
              ✕
            </button>
          )}
        </div>
        {[
          { id: "dashboard", icon: "▦", label: "Dashboard" },
          { id: "expenses", icon: "≡", label: "Spese" },
          { id: "recurring", icon: "⟳", label: "Spese fisse", count: (data.recurring || []).length },
          { id: "stats", icon: "◉", label: "Statistiche" },
        ].map(i => (
          <button key={i.id} className="nav-btn" onClick={() => navigateTo(i.id)} style={S.nav(view === i.id)}>
            <span style={{ fontSize: 15 }}>{i.icon}</span>
            {i.label}
            {i.count > 0 && <span style={{ marginLeft: "auto", background: "#2e2e2b", color: "#888", borderRadius: 20, fontSize: 11, padding: "1px 7px" }}>{i.count}</span>}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ borderTop: "1px solid #2a2a27", paddingTop: "1rem", marginTop: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2e2e2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="nav-btn"
            style={{ ...S.nav(false), width: "100%", fontSize: 13, color: "#666" }}
          >
            <span>↩</span> Esci
          </button>
        </div>

        <div style={{ fontSize: 11, color: "#444", lineHeight: 1.8, marginTop: 8 }}>
          {manualExpenses.length} spese manuali<br />
          {activeRecurring.length} fisse attive
        </div>
      </div>

      {/* Main content */}
      <div style={S.main}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <button
                style={{ ...S.btn("icon"), fontSize: 18, padding: "7px 12px" }}
                onClick={() => setSidebarOpen(o => !o)}
                aria-label="Menu"
              >
                ☰
              </button>
            )}
            <button style={S.btn("icon")} onClick={() => changeMonth(-1)}>‹</button>
            <div className="topbar-month" style={{ fontSize: 20, fontWeight: 600, minWidth: 190, textAlign: "center" }}>{MONTHS[selectedMonth]} {selectedYear}</div>
            <button style={S.btn("icon")} onClick={() => changeMonth(1)}>›</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.btn("accent")} onClick={openAddRecurring}>{isMobile ? "⟳" : "⟳ Spesa fissa"}</button>
            <button style={S.btn("primary")} onClick={openAdd}>{isMobile ? "+" : "+ Nuova spesa"}</button>
          </div>
        </div>

        {/* ══ DASHBOARD ══ */}
        {view === "dashboard" && (<>
          <div className="metric-row" style={{ display: "flex", gap: 12, marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={S.metricCard()}>
              <div style={S.label}>Entrate</div>
              {editingIncome ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input style={{ ...S.input, width: 110 }} value={incomeForm} onChange={e => setIncomeForm(e.target.value)} placeholder="0.00" autoFocus onKeyDown={e => e.key === "Enter" && saveIncome()} />
                  <button style={S.btn("primary")} onClick={saveIncome}>✓</button>
                  <button style={S.btn("ghost")} onClick={() => setEditingIncome(false)}>✕</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color: "#0F6E56" }}>{formatEur(income)}</div>
                  <button style={{ ...S.btn("ghost"), padding: "3px 10px", fontSize: 12 }} onClick={() => { setIncomeForm(String(income)); setEditingIncome(true); }}>modifica</button>
                </div>
              )}
            </div>
            <div style={S.metricCard()}>
              <div style={S.label}>Spese totali</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#A32D2D" }}>{formatEur(totalSpent)}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>
                {formatEur(totalRecurring)} fisse · {formatEur(totalSpent - totalRecurring)} variabili
              </div>
            </div>
            <div style={S.metricCard(saved >= 0 ? "#EAF3DE" : "#FCEBEB")}>
              <div style={S.label}>Risparmio</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: saved >= 0 ? "#3B6D11" : "#A32D2D" }}>{saved >= 0 ? "+" : ""}{formatEur(saved)}</div>
              {income > 0 && <div style={{ fontSize: 12, color: saved >= 0 ? "#3B6D11" : "#A32D2D", marginTop: 3 }}>{saved >= 0 ? "✓" : "⚠"} {Math.abs(Math.round(saved / income * 100))}% {saved >= 0 ? "risparmiato" : "in rosso"}</div>}
            </div>
          </div>

          {activeRecurring.length > 0 && (
            <div style={{ ...S.card, background: "#F0F6FE", border: "1px solid #B5D4F4" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#0C447C" }}>⟳ Spese fisse attive — {MONTHS[selectedMonth]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#0C447C" }}>{formatEur(totalRecurring)}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {activeRecurring.map(r => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 10, padding: "6px 12px", border: "1px solid #B5D4F4", fontSize: 13 }}>
                    <span>{catMap[r.category]?.icon}</span>
                    <span style={{ fontWeight: 500 }}>{r.description}</span>
                    <span style={{ color: "#185FA5", fontWeight: 600 }}>{formatEur(r.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {income > 0 && (
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Utilizzo budget mensile</span>
                <span style={{ fontSize: 13, color: "#888" }}>{formatEur(totalSpent)} / {formatEur(income)}</span>
              </div>
              <div style={{ height: 10, background: "#f0ede8", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${Math.min(100, totalSpent / income * 100).toFixed(1)}%`, background: totalSpent > income ? "#E24B4A" : totalSpent / income > 0.8 ? "#EF9F27" : "#1D9E75", borderRadius: 99, transition: "width .4s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888", flexWrap: "wrap" }}>
                <span>🔵 Fisse: {formatEur(totalRecurring)} ({income > 0 ? Math.round(totalRecurring / income * 100) : 0}%)</span>
                <span>🟠 Variabili: {formatEur(totalSpent - totalRecurring)} ({income > 0 ? Math.round((totalSpent - totalRecurring) / income * 100) : 0}%)</span>
              </div>
            </div>
          )}

          {byCategory.length > 0 && (
            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: "1rem" }}>Spese per categoria</div>
              {byCategory.map(cat => (
                <div key={cat.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{cat.icon} {cat.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{formatEur(cat.total)} <span style={{ color: "#aaa", fontWeight: 400 }}>({cat.count})</span></span>
                  </div>
                  <div style={{ height: 6, background: "#f0ede8", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(cat.total / maxCatTotal * 100).toFixed(1)}%`, background: cat.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {allMonthExpenses.length > 0 ? (
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Ultime spese</div>
                <button style={{ ...S.btn("ghost"), fontSize: 13 }} onClick={() => setView("expenses")}>Vedi tutte →</button>
              </div>
              {[...allMonthExpenses].sort((a, b) => {
                if (a.isRecurring && !b.isRecurring) return -1;
                if (!a.isRecurring && b.isRecurring) return 1;
                return new Date(b.date) - new Date(a.date);
              }).slice(0, 6).map(exp => (
                <div key={exp.id} className="row" style={{ display: "flex", alignItems: "center", padding: "10px 6px", borderBottom: "1px solid #f5f4f0", gap: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 22 }}>{catMap[exp.category]?.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{exp.description}</span>
                      {exp.isRecurring && <span style={S.recBadge}>⟳ fissa</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{exp.isRecurring ? "Mensile" : new Date(exp.date).toLocaleDateString("it-IT")}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#A32D2D", flexShrink: 0 }}>-{formatEur(exp.amount)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...S.card, textAlign: "center", padding: "3rem 1rem", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Nessuna spesa questo mese</div>
              <div style={{ fontSize: 14 }}>Aggiungi una spesa con i bottoni in alto</div>
            </div>
          )}
        </>)}

        {/* ══ EXPENSES LIST ══ */}
        {view === "expenses" && (<>
          <div style={{ display: "flex", gap: 8, marginBottom: "0.75rem", flexWrap: "wrap" }}>
            {["all", "manual", "recurring"].map(t => (
              <button key={t} style={{ ...S.btn(filterType === t ? "primary" : "ghost"), fontSize: 13 }} onClick={() => setFilterType(t)}>
                {t === "all" ? "Tutte" : t === "manual" ? "Variabili" : "⟳ Fisse"}
              </button>
            ))}
            <div style={{ width: 1, background: "#e0e0e0", margin: "0 4px" }} />
            {CATEGORIES.filter(c => allMonthExpenses.some(e => e.category === c.id)).map(cat => (
              <button key={cat.id} style={{ ...S.btn(filterCat === cat.id ? "primary" : "ghost"), fontSize: 13 }} onClick={() => setFilterCat(filterCat === cat.id ? "all" : cat.id)}>{cat.icon} {cat.label}</button>
            ))}
          </div>
          <div style={S.card}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>Nessuna spesa</div>
            ) : filtered.map(exp => (
              <div key={exp.id} className="row" style={{ display: "flex", alignItems: "center", padding: "12px 6px", borderBottom: "1px solid #f5f4f0", gap: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{catMap[exp.category]?.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{exp.description}</span>
                    <span style={S.badge(exp.category)}>{catMap[exp.category]?.label}</span>
                    {exp.isRecurring && <span style={S.recBadge}>⟳ fissa</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>
                    {exp.isRecurring ? "Mensile ricorrente" : new Date(exp.date).toLocaleDateString("it-IT")}
                    {exp.note && <span style={{ marginLeft: 8 }}>· {exp.note}</span>}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#A32D2D", marginRight: 4, flexShrink: 0 }}>-{formatEur(exp.amount)}</div>
                {exp.isRecurring ? (
                  <button style={S.btn("icon")} onClick={() => openEditRecurring((data.recurring || []).find(r => r.id === parseInt(exp.id.toString().replace("rec_", ""))))} title="Modifica">✎</button>
                ) : (<>
                  <button style={S.btn("icon")} onClick={() => openEdit(exp)} title="Modifica">✎</button>
                  <button style={{ ...S.btn("icon"), color: "#A32D2D" }} onClick={() => deleteExpense(exp.id)} title="Elimina">✕</button>
                </>)}
              </div>
            ))}
          </div>
          {filtered.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ fontSize: 14, color: "#888" }}>Totale: <strong style={{ color: "#A32D2D" }}>{formatEur(filtered.reduce((s, e) => s + e.amount, 0))}</strong></div>
            </div>
          )}
        </>)}

        {/* ══ RECURRING ══ */}
        {view === "recurring" && (<>
          <div className="metric-row" style={{ display: "flex", gap: 12, marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={S.metricCard()}>
              <div style={S.label}>Totale spese fisse</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#185FA5" }}>{formatEur((data.recurring || []).reduce((s, r) => s + r.amount, 0))}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{(data.recurring || []).length} voci configurate</div>
            </div>
            <div style={S.metricCard("#F0F6FE")}>
              <div style={S.label}>Attive — {MONTHS[selectedMonth]}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#185FA5" }}>{formatEur(totalRecurring)}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{activeRecurring.length} attive questo mese</div>
            </div>
          </div>

          {(data.recurring || []).length === 0 ? (
            <div style={{ ...S.card, textAlign: "center", padding: "3rem 1rem", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⟳</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Nessuna spesa fissa</div>
              <div style={{ fontSize: 14, marginBottom: "1.5rem" }}>Affitto, abbonamenti, rate — aggiungi spese che si ripetono ogni mese</div>
              <button style={S.btn("primary")} onClick={openAddRecurring}>+ Aggiungi spesa fissa</button>
            </div>
          ) : (
            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: "1rem" }}>Tutte le spese fisse</div>
              {[...(data.recurring || [])].sort((a, b) => b.amount - a.amount).map(r => {
                const isActive = getRecurringForMonth([r], monthKey).length > 0;
                const isPast = r.endMonth && r.endMonth < monthKey;
                const isFuture = r.startMonth > monthKey;
                return (
                  <div key={r.id} className="row" style={{ display: "flex", alignItems: "center", padding: "14px 8px", borderBottom: "1px solid #f5f4f0", gap: 10, borderRadius: 8, opacity: isPast ? 0.5 : 1, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                    <div style={{ fontSize: 26, flexShrink: 0 }}>{catMap[r.category]?.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{r.description}</span>
                        <span style={S.badge(r.category)}>{catMap[r.category]?.label}</span>
                        {isActive && <span style={{ ...S.recBadge, background: "#EAF3DE", color: "#3B6D11" }}>● attiva</span>}
                        {isPast && <span style={{ ...S.recBadge, background: "#F1EFE8", color: "#5F5E5A" }}>terminata</span>}
                        {isFuture && <span style={{ ...S.recBadge, background: "#FAEEDA", color: "#854F0B" }}>futura</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        Da {MONTHS[parseMonthKey(r.startMonth).month]} {parseMonthKey(r.startMonth).year} · {recurringLabel(r)}
                        {r.note && <span style={{ marginLeft: 8 }}>· {r.note}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", marginRight: 4, flexShrink: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#185FA5" }}>{formatEur(r.amount)}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>/mese</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button style={S.btn("icon")} onClick={() => openEditRecurring(r)} title="Modifica">✎</button>
                      {isActive && !r.endMonth && (
                        <button style={{ ...S.btn("icon"), fontSize: 11, padding: "6px 9px", color: "#854F0B", border: "1px solid #FAC775" }} onClick={() => stopRecurringNow(r)} title="Termina ora">⏹</button>
                      )}
                      <button style={{ ...S.btn("icon"), color: "#A32D2D" }} onClick={() => deleteRecurring(r.id)} title="Elimina">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>)}

        {/* ══ STATS ══ */}
        {view === "stats" && (<>
          <div style={S.card}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: "1rem" }}>Riepilogo {MONTHS[selectedMonth]}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
              {byCategory.map(cat => (
                <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fafaf8", padding: "12px 14px", borderRadius: 12 }}>
                  <div style={{ fontSize: 28 }}>{cat.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "#888" }}>{cat.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{formatEur(cat.total)}</div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>{cat.count} voci · avg {formatEur(cat.total / cat.count)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {totalSpent > 0 && (
            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: "1rem" }}>Distribuzione % categoria</div>
              {byCategory.map(cat => {
                const pct = cat.total / totalSpent * 100;
                return (
                  <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 22, textAlign: "center", flexShrink: 0 }}>{cat.icon}</div>
                    <div style={{ flex: 1, height: 8, background: "#f0ede8", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct.toFixed(1)}%`, background: cat.color, borderRadius: 99 }} />
                    </div>
                    <div style={{ fontSize: 12, width: 44, textAlign: "right", color: "#666", flexShrink: 0 }}>{pct.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={S.card}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: "1rem" }}>Andamento giornaliero (spese variabili)</div>
            {(() => {
              const dm = {};
              manualExpenses.forEach(e => { dm[e.date] = (dm[e.date] || 0) + e.amount; });
              const entries = Object.entries(dm).sort(([a], [b]) => a.localeCompare(b));
              const max = Math.max(...entries.map(([, v]) => v), 1);
              return entries.length === 0 ? (
                <div style={{ color: "#aaa", textAlign: "center", padding: "1rem" }}>Nessun dato</div>
              ) : entries.map(([date, total]) => (
                <div key={date} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: "#888", width: 62, flexShrink: 0 }}>{new Date(date).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}</div>
                  <div style={{ flex: 1, height: 8, background: "#f0ede8", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(total / max * 100).toFixed(1)}%`, background: "#1a1a18", borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, width: 72, textAlign: "right", flexShrink: 0 }}>{formatEur(total)}</div>
                </div>
              ));
            })()}
          </div>
        </>)}
      </div>

      {/* ── Modal: spesa manuale ── */}
      {showForm && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={S.modal}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.5rem" }}>{editingExpense ? "Modifica spesa" : "Nuova spesa"}</div>
            <div style={{ display: "grid", gap: 14 }}>
              <div><label style={S.label}>Descrizione</label><input style={S.input} placeholder="es. Spesa al supermercato" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} autoFocus /></div>
              <div className="modal-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={S.label}>Importo (€)</label><input style={S.input} placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
                <div><label style={S.label}>Data</label><input type="date" style={S.input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              </div>
              <div><label style={S.label}>Categoria</label><select style={S.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select></div>
              <div><label style={S.label}>Note (opzionale)</label><input style={S.input} placeholder="Aggiungi una nota..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: "1.5rem" }}>
              <button style={{ ...S.btn("ghost"), flex: 1 }} onClick={() => setShowForm(false)}>Annulla</button>
              <button style={{ ...S.btn("primary"), flex: 2 }} onClick={submitForm}>{editingExpense ? "Salva modifiche" : "Aggiungi spesa"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: spesa fissa ── */}
      {showRecurringForm && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowRecurringForm(false)}>
          <div style={S.modal}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{editingRecurring ? "Modifica spesa fissa" : "Nuova spesa fissa"}</div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: "1.5rem" }}>Affitti, abbonamenti, rate — si aggiunge automaticamente ogni mese</div>
            <div style={{ display: "grid", gap: 14 }}>
              <div><label style={S.label}>Descrizione</label><input style={S.input} placeholder="es. Affitto, Netflix, Rata mutuo..." value={rForm.description} onChange={e => setRForm(f => ({ ...f, description: e.target.value }))} autoFocus /></div>
              <div className="modal-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={S.label}>Importo mensile (€)</label><input style={S.input} placeholder="0.00" value={rForm.amount} onChange={e => setRForm(f => ({ ...f, amount: e.target.value }))} /></div>
                <div><label style={S.label}>Categoria</label><select style={S.input} value={rForm.category} onChange={e => setRForm(f => ({ ...f, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select></div>
              </div>
              <div><label style={S.label}>Mese di inizio</label><input type="month" style={S.input} value={rForm.startMonth} onChange={e => setRForm(f => ({ ...f, startMonth: e.target.value }))} /></div>
              <div>
                <label style={S.label}>Durata</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[{ v: "ongoing", l: "♾ Senza scadenza" }, { v: "fixed", l: "📅 N mesi fissi" }].map(opt => (
                    <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${rForm.duration === opt.v ? "#1a1a18" : "#e0e0e0"}`, cursor: "pointer", flex: 1, fontSize: 13, fontWeight: rForm.duration === opt.v ? 500 : 400, background: rForm.duration === opt.v ? "#f5f4f0" : "#fafafa", minWidth: 120 }}>
                      <input type="radio" name="dur" value={opt.v} checked={rForm.duration === opt.v} onChange={() => setRForm(f => ({ ...f, duration: opt.v }))} style={{ accentColor: "#1a1a18" }} />
                      {opt.l}
                    </label>
                  ))}
                </div>
              </div>
              {rForm.duration === "fixed" && (
                <div>
                  <label style={S.label}>Numero di mesi</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input style={{ ...S.input, width: 100 }} type="number" min="1" max="120" placeholder="12" value={rForm.durationMonths} onChange={e => setRForm(f => ({ ...f, durationMonths: e.target.value }))} />
                    {endMonthPreview() && <span style={{ fontSize: 13, color: "#378ADD", fontWeight: 500 }}>→ {endMonthPreview()}</span>}
                  </div>
                </div>
              )}
              <div><label style={S.label}>Note (opzionale)</label><input style={S.input} placeholder="es. Contratto n.123..." value={rForm.note} onChange={e => setRForm(f => ({ ...f, note: e.target.value }))} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: "1.5rem" }}>
              <button style={{ ...S.btn("ghost"), flex: 1 }} onClick={() => setShowRecurringForm(false)}>Annulla</button>
              <button style={{ ...S.btn("primary"), flex: 2 }} onClick={submitRecurring}>{editingRecurring ? "Salva modifiche" : "Aggiungi spesa fissa"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={S.toast(toast.type)}>{toast.msg}</div>}
    </div>
  );
}

// ── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => getSession());

  function handleLogin(session) {
    setUser(session);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <MainApp key={user.id} user={user} onLogout={handleLogout} />;
}
