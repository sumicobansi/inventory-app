import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Home, Factory, ShoppingCart, Clock, Truck, Users, Package, Boxes,
  FileText, Shield, Settings as SettingsIcon, Search, Plus, Minus, Check,
  AlertTriangle, X, Share2, Printer, ChevronRight, ChevronLeft, LogOut, User,
  MessageCircle, Menu, TrendingDown, TrendingUp, ClipboardList, Store,
  CheckCircle2, XCircle, Eye, EyeOff, RotateCcw, Download, Trash2, Pencil
} from "lucide-react";

/* =========================================================================
   DEMO / MOCK DATA LAYER
   -------------------------------------------------------------------------
   Every read/write in this file goes through the small set of setters below
   (setCategories, setItems, setProduction, setOrders, setDispatches, ...).
   To connect a real Google Sheets backend: replace the seed data with a
   fetch() to your Google Apps Script Web App on load, and replace each
   "setX(prev => ...)" mutation with a POST to the same Apps Script endpoint
   (the shapes of the objects match the sheet columns described in Settings
   > Google Sheets Setup). No other part of the UI needs to change.
   ========================================================================= */

const INK = "#1C2333";
const PAPER = "#F1EEE6";
const PAPER_RAISED = "#FBFAF6";
const LINE = "#D9D3C4";
const MUTED = "#6B6656";
const GOOD = "#2F6B4F";
const GOOD_BG = "#E7EFE8";
const WARN = "#B5461E";
const WARN_BG = "#F5E6DE";
const ACCENT = "#3A5A8C";
const ACCENT_BG = "#E5EAF2";

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function timeStr() {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}
function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const seedCategories = [
  { id: "CHOCOLATE", name: "Chocolate", order: 1, active: true },
  { id: "BISCUITS", name: "Biscuits", order: 2, active: true },
  { id: "NAMKEEN", name: "Namkeen", order: 3, active: true },
];

const seedItems = [
  { id: "CHOC_A", categoryId: "CHOCOLATE", name: "Chocolate A", order: 1, active: true },
  { id: "CHOC_B", categoryId: "CHOCOLATE", name: "Chocolate B", order: 2, active: true },
  { id: "CHOC_C", categoryId: "CHOCOLATE", name: "Chocolate C", order: 3, active: true },
  { id: "BISC_A", categoryId: "BISCUITS", name: "Biscuit A", order: 1, active: true },
  { id: "BISC_B", categoryId: "BISCUITS", name: "Biscuit B", order: 2, active: true },
  { id: "BISC_C", categoryId: "BISCUITS", name: "Biscuit C", order: 3, active: true },
  { id: "NAM_A", categoryId: "NAMKEEN", name: "Namkeen A", order: 1, active: true },
  { id: "NAM_B", categoryId: "NAMKEEN", name: "Namkeen B", order: 2, active: true },
  { id: "NAM_C", categoryId: "NAMKEEN", name: "Namkeen C", order: 3, active: true },
];

const seedUsers = [
  { id: "U1", name: "Admin User", username: "admin", password: "admin123", role: "ADMIN", active: true, created: todayStr(), lastLogin: "" },
  { id: "U2", name: "Amit Kumar", username: "production01", password: "prod123", role: "PRODUCTION", active: true, created: todayStr(), lastLogin: "" },
  { id: "U3", name: "Rahul Sharma", username: "sales01", password: "sales123", role: "SALES", active: true, created: todayStr(), lastLogin: "" },
  { id: "U4", name: "Vijay Singh", username: "dispatch01", password: "disp123", role: "DISPATCH", active: true, created: todayStr(), lastLogin: "" },
];

const seedParties = [
  { id: "P1", name: "ABC General Store", contact: "Suresh Patel", mobile: "9876543210", address: "", area: "Ring Road", active: true, created: todayStr() },
  { id: "P2", name: "Shree Krishna Traders", contact: "Manoj Gupta", mobile: "9998887770", address: "", area: "Station Road", active: true, created: todayStr() },
  { id: "P3", name: "New Bombay Provision", contact: "Iqbal Shaikh", mobile: "9123456780", address: "", area: "Textile Market", active: true, created: todayStr() },
];

const DEMO_DATE = todayStr();

const seedProduction = [
  {
    id: "PRD-DEMO-001", date: DEMO_DATE, time: "09:15",
    employeeId: "U2", employeeName: "Amit Kumar",
    items: [
      { itemId: "CHOC_A", categoryId: "CHOCOLATE", qty: 500 },
      { itemId: "CHOC_B", categoryId: "CHOCOLATE", qty: 300 },
      { itemId: "CHOC_C", categoryId: "CHOCOLATE", qty: 150 },
      { itemId: "BISC_A", categoryId: "BISCUITS", qty: 400 },
      { itemId: "BISC_B", categoryId: "BISCUITS", qty: 250 },
      { itemId: "BISC_C", categoryId: "BISCUITS", qty: 100 },
      { itemId: "NAM_A", categoryId: "NAMKEEN", qty: 200 },
      { itemId: "NAM_B", categoryId: "NAMKEEN", qty: 180 },
      { itemId: "NAM_C", categoryId: "NAMKEEN", qty: 90 },
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
  },
];

const seedOrders = [
  {
    id: "ORD-DEMO-001", date: DEMO_DATE, time: "11:30",
    employeeId: "U3", employeeName: "Rahul Sharma",
    partyId: "P1", partyName: "ABC General Store",
    items: [
      { itemId: "CHOC_A", categoryId: "CHOCOLATE", qty: 100, dispatchedQty: 40 },
      { itemId: "CHOC_B", categoryId: "CHOCOLATE", qty: 50, dispatchedQty: 0 },
      { itemId: "BISC_A", categoryId: "BISCUITS", qty: 100, dispatchedQty: 0 },
    ],
    status: "PARTIALLY DISPATCHED",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
];

const seedDispatches = [
  {
    id: "DSP-DEMO-001", date: DEMO_DATE, time: "13:10",
    employeeId: "U4", employeeName: "Vijay Singh",
    orderId: "ORD-DEMO-001", partyName: "ABC General Store",
    items: [{ itemId: "CHOC_A", categoryId: "CHOCOLATE", qty: 40 }],
    timestamp: Date.now() - 1000 * 60 * 60,
  },
];

const seedAudit = [
  { timestamp: Date.now() - 1000 * 60 * 60 * 4, user: "Amit Kumar", role: "PRODUCTION", action: "Added Production", recordId: "PRD-DEMO-001", description: "9 items across 3 categories" },
  { timestamp: Date.now() - 1000 * 60 * 60 * 2, user: "Rahul Sharma", role: "SALES", action: "Created Order", recordId: "ORD-DEMO-001", description: "ABC General Store — 3 items, 250 units" },
  { timestamp: Date.now() - 1000 * 60 * 60, user: "Vijay Singh", role: "DISPATCH", action: "Dispatched Order", recordId: "DSP-DEMO-001", description: "Chocolate A x 40 against ORD-DEMO-001" },
];

const ROLE_LABEL = { ADMIN: "Admin", PRODUCTION: "Production", SALES: "Sales", DISPATCH: "Dispatch" };

/* ---------------- small shared UI atoms ---------------- */

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#EDEAE0", fg: INK },
    good: { bg: GOOD_BG, fg: GOOD },
    warn: { bg: WARN_BG, fg: WARN },
    accent: { bg: ACCENT_BG, fg: ACCENT },
  };
  const t = tones[tone];
  return (
    <span
      style={{ background: t.bg, color: t.fg }}
      className="px-2 py-0.5 rounded text-[11px] font-medium tracking-wide whitespace-nowrap"
    >
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    NEW: "neutral", CONFIRMED: "accent", "PARTIALLY DISPATCHED": "warn",
    DISPATCHED: "good", COMPLETED: "good", CANCELLED: "neutral",
  };
  return <Badge tone={map[status] || "neutral"}>{status}</Badge>;
}

function QtyInput({ value, onChange, quickAdds = [5, 10, 20, 50], compact = false }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        onClick={() => onChange(Math.max(0, (value || 0) - 1))}
        className="w-9 h-9 shrink-0 rounded-md border flex items-center justify-center active:scale-95"
        style={{ borderColor: LINE, background: PAPER_RAISED }}
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value || ""}
        placeholder="0"
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") return onChange(0);
          const n = Math.max(0, parseInt(v.replace(/[^0-9]/g, ""), 10) || 0);
          onChange(n);
        }}
        className="w-16 h-9 text-center rounded-md border font-semibold tabular-nums"
        style={{ borderColor: LINE, background: "#fff" }}
      />
      <button
        onClick={() => onChange((value || 0) + 1)}
        className="w-9 h-9 shrink-0 rounded-md border flex items-center justify-center active:scale-95"
        style={{ borderColor: LINE, background: PAPER_RAISED }}
      >
        <Plus size={16} />
      </button>
      {!compact && (
        <div className="flex gap-1 ml-1">
          {quickAdds.map((q) => (
            <button
              key={q}
              onClick={() => onChange((value || 0) + q)}
              className="px-2 h-9 rounded-md text-xs font-medium border active:scale-95"
              style={{ borderColor: LINE, background: "#fff", color: MUTED }}
            >
              +{q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[15px] font-semibold" style={{ color: INK }}>{children}</h2>
      {right}
    </div>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-lg border p-4 ${className}`}
      style={{ borderColor: LINE, background: PAPER_RAISED, ...style }}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, tone = "neutral" }) {
  const color = tone === "warn" ? WARN : tone === "good" ? GOOD : INK;
  return (
    <Card>
      <div className="text-[11px] uppercase tracking-wide" style={{ color: MUTED }}>{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-1" style={{ color }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: MUTED }}>{sub}</div>}
    </Card>
  );
}

function EmptyState({ icon: Icon, title, note }) {
  return (
    <div className="text-center py-14 px-6">
      <Icon size={28} className="mx-auto mb-3" style={{ color: MUTED }} />
      <div className="font-medium" style={{ color: INK }}>{title}</div>
      {note && <div className="text-sm mt-1" style={{ color: MUTED }}>{note}</div>}
    </div>
  );
}

/* =========================================================================
   GOOGLE SHEETS SYNC ENGINE
   -------------------------------------------------------------------------
   Two settings — a Web App URL and a token — are entered once in
   Settings > Google Sheets and saved to this browser's storage. When both
   are present, every read/write in the app also talks to your Apps Script
   backend. When they're empty, the app runs on in-memory demo data exactly
   like before — nothing else changes.
   ========================================================================= */

function safeLocalGet(key) {
  try { return localStorage.getItem(key) || ""; } catch { return ""; }
}
function safeLocalSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}
function safeLocalRemove(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

// Shrinks any uploaded image down to a small square JPEG before it's stored,
// so it fits comfortably in the browser's storage limit (raw phone photos
// are often several MB, which silently fails to save otherwise).
function resizeImageFile(file, maxSize = 256, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read that image."));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function sheetsLoadAll(apiUrl, apiToken) {
  const res = await fetch(`${apiUrl}?token=${encodeURIComponent(apiToken)}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function sheetsPost(apiUrl, apiToken, body) {
  if (!apiUrl || !apiToken) return null;
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token: apiToken, ...body }),
    });
    return await res.json();
  } catch (err) {
    console.error("Google Sheets sync failed:", err);
    return null;
  }
}

const asBool = (v) => v === true || v === "TRUE" || v === "true";

function groupByRecordId(rows, header, itemFields) {
  const map = {};
  rows.forEach((r) => {
    if (!map[r.recordId]) {
      map[r.recordId] = { id: r.recordId, items: [] };
      header.forEach((h) => { if (h !== "recordId") map[r.recordId][h] = r[h]; });
    }
    const itemRow = {};
    itemFields.forEach((f) => { itemRow[f] = typeof r[f] === "number" || f.toLowerCase().includes("qty") ? Number(r[f]) : r[f]; });
    map[r.recordId].items.push(itemRow);
  });
  return Object.values(map);
}

/* =========================================================================
   YOUR GOOGLE SHEETS CONNECTION
   -------------------------------------------------------------------------
   Fill these in with YOUR Web App URL and SECRET before you deploy the app
   (Settings > Google Sheets in the running app shows you both). Once these
   are set here, every device that opens the published link connects
   automatically — nobody has to type anything into Settings themselves.
   Leave them blank to keep using the temporary in-browser demo data.
   ========================================================================= */
const DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyV8CbkyPZ7-jFv4Hg1NpN6v9YBIfaVRRPP9qlGQNvdu_e3Ggc1fXD4oCGRO26nPoEN/exec";
const DEFAULT_SHEETS_TOKEN = "BANSI_GUNDARANIYA";

/* ================================= APP ================================= */

export default function InventoryApp() {
  // ---- Google Sheets connection ----
  const [sheetsUrl, setSheetsUrl] = useState(() => safeLocalGet("sheetsApiUrl") || DEFAULT_SHEETS_URL);
  const [sheetsToken, setSheetsToken] = useState(() => safeLocalGet("sheetsApiToken") || DEFAULT_SHEETS_TOKEN);
  const [sheetsStatus, setSheetsStatus] = useState("offline"); // offline | loading | connected | error
  const [sheetsError, setSheetsError] = useState("");
  const isConnected = sheetsStatus === "connected";

  const syncAppend = (sheet, rows) => sheetsPost(sheetsUrl, sheetsToken, { action: "append", sheet, rows });
  const syncUpdate = (sheet, match, patch) => sheetsPost(sheetsUrl, sheetsToken, { action: "update", sheet, match, patch });
  const syncDelete = (sheet, match) => sheetsPost(sheetsUrl, sheetsToken, { action: "delete", sheet, match });

  const [users, setUsers] = useState(seedUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginErr, setLoginErr] = useState("");

  // ---- core data ----
  const [categories, setCategories] = useState(seedCategories);
  const [items, setItems] = useState(seedItems);
  const [parties, setParties] = useState(seedParties);
  const [production, setProduction] = useState(seedProduction);
  const [orders, setOrders] = useState(seedOrders);
  const [dispatches, setDispatches] = useState(seedDispatches);
  const [stockAdj, setStockAdj] = useState([]); // {id,itemId,type:'opening'|'adjustment',qty,reason,date,employee}
  const [auditLog, setAuditLog] = useState(seedAudit);
  const [minStock, setMinStock] = useState({}); // itemId -> number
  const [businessName, setBusinessNameState] = useState(() => safeLocalGet("businessName") || "Gopinath Foods");
  function setBusinessName(name) {
    setBusinessNameState(name);
    safeLocalSet("businessName", name);
  }
  const [logoDataUrl, setLogoDataUrlState] = useState(() => safeLocalGet("businessLogo"));
  function setLogo(dataUrl) {
    const saved = safeLocalSet("businessLogo", dataUrl);
    if (saved) {
      setLogoDataUrlState(dataUrl);
    }
    return saved;
  }
  function removeLogo() {
    setLogoDataUrlState("");
    safeLocalRemove("businessLogo");
  }

  const seqRef = useRef({});
  function nextId(prefix) {
    const day = todayStr().replace(/-/g, "");
    const key = prefix + day;
    seqRef.current[key] = (seqRef.current[key] || 0) + 1;
    return `${prefix}-${day}-${String(seqRef.current[key]).padStart(3, "0")}`;
  }

  function addAudit(action, recordId, description) {
    const entry = { timestamp: Date.now(), user: currentUser?.name || "System", role: currentUser?.role || "-", action, recordId, description };
    setAuditLog((prev) => [entry, ...prev]);
    syncAppend("AUDIT_LOG", [entry]);
  }

  const [dataLoading, setDataLoading] = useState(() => !!(safeLocalGet("sheetsApiUrl") || DEFAULT_SHEETS_URL));

  function applySheetData(data) {
    setCategories(data.CATEGORIES.map((c) => ({ ...c, order: Number(c.order), active: asBool(c.active) })));
    setItems(data.ITEMS.map((i) => ({ ...i, order: Number(i.order), active: asBool(i.active) })));
    setParties(data.PARTIES.map((p) => ({ ...p, active: asBool(p.active) })));
    setUsers(data.USERS.map((u) => ({ ...u, active: asBool(u.active) })));
    setProduction(groupByRecordId(data.PRODUCTION, ["date", "time", "employeeId", "employeeName", "timestamp"], ["itemId", "categoryId", "qty"]));
    setOrders(groupByRecordId(data.ORDERS, ["date", "time", "employeeId", "employeeName", "partyId", "partyName", "status", "timestamp"], ["itemId", "categoryId", "qty", "dispatchedQty"]));
    setDispatches(groupByRecordId(data.DISPATCH, ["orderId", "date", "time", "employeeId", "employeeName", "partyName", "timestamp"], ["itemId", "categoryId", "qty"]));
    setStockAdj((data.STOCK_ADJUSTMENTS || []).map((a) => ({ ...a, qty: Number(a.qty) })));
    setAuditLog((data.AUDIT_LOG || []).slice().reverse());
  }

  async function connectSheets(url, token) {
    setSheetsStatus("loading");
    setSheetsError("");
    try {
      const data = await sheetsLoadAll(url, token);
      applySheetData(data);
      safeLocalSet("sheetsApiUrl", url);
      safeLocalSet("sheetsApiToken", token);
      setSheetsUrl(url);
      setSheetsToken(token);
      setSheetsStatus("connected");
      return true;
    } catch (err) {
      setSheetsStatus("error");
      setSheetsError(err.message || "Could not reach that URL.");
      return false;
    }
  }

  function disconnectSheets() {
    safeLocalRemove("sheetsApiUrl");
    safeLocalRemove("sheetsApiToken");
    setSheetsUrl("");
    setSheetsToken("");
    setSheetsStatus("offline");
    setSheetsError("");
  }

  // Auto-reconnect on page load if we've connected before in this browser.
  useEffect(() => {
    if (sheetsUrl && sheetsToken) {
      setDataLoading(true);
      connectSheets(sheetsUrl, sheetsToken).finally(() => setDataLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- navigation ----
  const [screen, setScreen] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [editOrderRequest, setEditOrderRequest] = useState(null);

  // ---- printable / whatsapp ----
  const [printDoc, setPrintDoc] = useState(null);
  useEffect(() => {
    if (printDoc) {
      const t = setTimeout(() => window.print(), 150);
      return () => clearTimeout(t);
    }
  }, [printDoc]);
  useEffect(() => {
    const onAfterPrint = () => setPrintDoc(null);
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);
  function shareWhatsApp(text) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  /* ---------------- derived inventory math ---------------- */

  const itemById = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items]);
  const catById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const openingByItem = useMemo(() => {
    const m = {};
    stockAdj.filter((a) => a.type === "opening").forEach((a) => (m[a.itemId] = (m[a.itemId] || 0) + a.qty));
    return m;
  }, [stockAdj]);

  const adjByItem = useMemo(() => {
    const m = {};
    stockAdj.filter((a) => a.type === "adjustment").forEach((a) => (m[a.itemId] = (m[a.itemId] || 0) + a.qty));
    return m;
  }, [stockAdj]);

  const productionByItem = useMemo(() => {
    const m = {};
    production.forEach((p) => p.items.forEach((i) => (m[i.itemId] = (m[i.itemId] || 0) + i.qty)));
    return m;
  }, [production]);

  const dispatchedByItem = useMemo(() => {
    const m = {};
    dispatches.forEach((d) => d.items.forEach((i) => (m[i.itemId] = (m[i.itemId] || 0) + i.qty)));
    return m;
  }, [dispatches]);

  function available(itemId) {
    return (openingByItem[itemId] || 0) + (productionByItem[itemId] || 0) + (adjByItem[itemId] || 0) - (dispatchedByItem[itemId] || 0);
  }

  const pendingByItem = useMemo(() => {
    const m = {};
    orders.filter((o) => o.status !== "CANCELLED").forEach((o) =>
      o.items.forEach((i) => (m[i.itemId] = (m[i.itemId] || 0) + Math.max(0, i.qty - i.dispatchedQty)))
    );
    return m;
  }, [orders]);

  function todayFilter(dateStr) { return dateStr === todayStr(); }

  const todayProdQty = useMemo(
    () => production.filter((p) => todayFilter(p.date)).reduce((s, p) => s + p.items.reduce((s2, i) => s2 + i.qty, 0), 0),
    [production]
  );
  const todayDispatchQty = useMemo(
    () => dispatches.filter((d) => todayFilter(d.date)).reduce((s, d) => s + d.items.reduce((s2, i) => s2 + i.qty, 0), 0),
    [dispatches]
  );
  const totalAvailableQty = useMemo(() => items.reduce((s, i) => s + available(i.id), 0), [items, openingByItem, productionByItem, adjByItem, dispatchedByItem]);
  const totalPendingQty = useMemo(() => Object.values(pendingByItem).reduce((s, v) => s + v, 0), [pendingByItem]);
  const pendingPartiesCount = useMemo(
    () => new Set(orders.filter((o) => o.status !== "CANCELLED" && o.status !== "COMPLETED").map((o) => o.partyId)).size,
    [orders]
  );

  function recomputeOrderStatus(order) {
    const total = order.items.reduce((s, i) => s + i.qty, 0);
    const disp = order.items.reduce((s, i) => s + i.dispatchedQty, 0);
    if (order.status === "CANCELLED") return "CANCELLED";
    if (disp === 0) return "CONFIRMED";
    if (disp >= total) return "COMPLETED";
    return "PARTIALLY DISPATCHED";
  }

  /* ---------------- auth actions ---------------- */

  function handleLogin(username, password) {
    const u = users.find((x) => x.username === username && x.password === password);
    if (!u) { setLoginErr("Incorrect username or password."); return; }
    if (!u.active) { setLoginErr("This account has been deactivated. Contact your admin."); return; }
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, lastLogin: new Date().toLocaleString("en-IN") } : x)));
    setCurrentUser(u);
    safeLocalSet("loggedInUserId", u.id);
    setLoginErr("");
    setScreen("home");
  }

  // Stay logged in across page reloads/reopens on this device, once data has finished loading.
  const sessionRestoredRef = useRef(false);
  useEffect(() => {
    if (dataLoading || sessionRestoredRef.current || currentUser) return;
    sessionRestoredRef.current = true;
    const savedId = safeLocalGet("loggedInUserId");
    if (!savedId) return;
    const u = users.find((x) => x.id === savedId && x.active);
    if (u) setCurrentUser(u);
    else safeLocalRemove("loggedInUserId");
  }, [dataLoading, users, currentUser]);

  function handleLogout() { setCurrentUser(null); safeLocalRemove("loggedInUserId"); setScreen("home"); }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: PAPER, color: MUTED }}>
        {logoDataUrl ? (
          <img src={logoDataUrl} alt="" className="w-16 h-16 rounded-lg object-cover" style={{ border: `1px solid ${LINE}` }} />
        ) : (
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: INK }}>
            <Boxes size={22} color="#fff" />
          </div>
        )}
        <div className="font-semibold" style={{ color: INK }}>{businessName}</div>
        <div className="text-sm">Loading your data from Google Sheets…</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} error={loginErr} businessName={businessName} logoDataUrl={logoDataUrl} />;
  }

  const role = currentUser.role;

  const NAV = [
    { key: "home", label: "Home", icon: Home, roles: ["ADMIN", "PRODUCTION", "SALES", "DISPATCH"] },
    { key: "production", label: "Production", icon: Factory, roles: ["ADMIN", "PRODUCTION"] },
    { key: "orders", label: "Orders", icon: ShoppingCart, roles: ["ADMIN", "SALES"] },
    { key: "pending", label: "Pending", icon: Clock, roles: ["ADMIN", "SALES", "DISPATCH"] },
    { key: "dispatch", label: "Dispatch", icon: Truck, roles: ["ADMIN", "DISPATCH"] },
    { key: "inventory", label: "Inventory", icon: Boxes, roles: ["ADMIN"] },
    { key: "parties", label: "Parties", icon: Store, roles: ["ADMIN"] },
    { key: "items", label: "Items & Categories", icon: Package, roles: ["ADMIN"] },
    { key: "employees", label: "Employees", icon: Users, roles: ["ADMIN"] },
    { key: "reports", label: "Reports", icon: FileText, roles: ["ADMIN", "PRODUCTION", "SALES", "DISPATCH"] },
    { key: "auditlog", label: "Audit Log", icon: Shield, roles: ["ADMIN"] },
    { key: "settings", label: "Settings", icon: SettingsIcon, roles: ["ADMIN"] },
  ].filter((n) => n.roles.includes(role));

  const mobileNavByRole = {
    ADMIN: ["home", "orders", "pending", "dispatch", "more"],
    PRODUCTION: ["home", "production", "reports", "more"],
    SALES: ["home", "orders", "pending", "more"],
    DISPATCH: ["home", "pending", "dispatch", "more"],
  };

  const ctx = {
    currentUser, role, categories, items, parties, users, production, orders, dispatches,
    stockAdj, auditLog, minStock, businessName, itemById, catById, available, pendingByItem,
    productionByItem, dispatchedByItem, openingByItem, adjByItem,
    setCategories, setItems, setParties, setUsers, setProduction, setOrders, setDispatches,
    setStockAdj, setMinStock, setBusinessName, nextId, addAudit, recomputeOrderStatus,
    todayProdQty, todayDispatchQty, totalAvailableQty, totalPendingQty, pendingPartiesCount,
    setPrintDoc, shareWhatsApp, setScreen, editOrderRequest, setEditOrderRequest,
    sheetsUrl, sheetsToken, sheetsStatus, sheetsError, isConnected, connectSheets, disconnectSheets,
    syncAppend, syncUpdate, syncDelete, logoDataUrl, setLogo, removeLogo,
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: PAPER, color: INK, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; top: 0; left: 0; width: 100%; }
        }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {printDoc && <PrintView doc={printDoc} businessName={businessName} onClose={() => setPrintDoc(null)} />}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col border-r shrink-0" style={{ borderColor: LINE, background: PAPER_RAISED }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: LINE }}>
          <div className="font-bold text-lg leading-tight" style={{ color: INK }}>{businessName}</div>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>Inventory &amp; Sales Control</div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setScreen(n.key)}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left"
              style={{
                background: screen === n.key ? ACCENT_BG : "transparent",
                color: screen === n.key ? ACCENT : INK,
                fontWeight: screen === n.key ? 600 : 500,
                borderLeft: screen === n.key ? `3px solid ${ACCENT}` : "3px solid transparent",
              }}
            >
              <n.icon size={17} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t flex items-center justify-between" style={{ borderColor: LINE }}>
          <div>
            <div className="text-sm font-medium">{currentUser.name}</div>
            <div className="text-xs" style={{ color: MUTED }}>{ROLE_LABEL[role]}</div>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-md hover:bg-black/5"><LogOut size={16} /></button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20" style={{ borderColor: LINE, background: PAPER_RAISED }}>
        <div>
          <div className="font-bold leading-tight">{businessName}</div>
          <div className="text-[11px]" style={{ color: MUTED }}>{currentUser.name} · {ROLE_LABEL[role]}</div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-md" style={{ color: MUTED }}><LogOut size={18} /></button>
      </header>

      {/* Content */}
      <main className="flex-1 min-w-0 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {screen === "home" && <HomeScreen ctx={ctx} />}
          {screen === "production" && <ProductionScreen ctx={ctx} />}
          {screen === "orders" && <OrdersScreen ctx={ctx} />}
          {screen === "pending" && <PendingScreen ctx={ctx} />}
          {screen === "dispatch" && <DispatchScreen ctx={ctx} />}
          {screen === "inventory" && <InventoryScreen ctx={ctx} />}
          {screen === "parties" && <PartiesScreen ctx={ctx} />}
          {screen === "items" && <ItemsScreen ctx={ctx} />}
          {screen === "employees" && <EmployeesScreen ctx={ctx} />}
          {screen === "reports" && <ReportsScreen ctx={ctx} />}
          {screen === "auditlog" && <AuditLogScreen ctx={ctx} />}
          {screen === "settings" && <SettingsScreen ctx={ctx} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t flex z-20" style={{ borderColor: LINE, background: PAPER_RAISED }}>
        {mobileNavByRole[role].map((key) => {
          if (key === "more") {
            return (
              <button key="more" onClick={() => setMoreOpen(true)} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px]" style={{ color: MUTED }}>
                <Menu size={19} /> More
              </button>
            );
          }
          const n = NAV.find((x) => x.key === key);
          if (!n) return null;
          const active = screen === n.key;
          return (
            <button
              key={key}
              onClick={() => setScreen(n.key)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px]"
              style={{ color: active ? ACCENT : MUTED, fontWeight: active ? 700 : 500 }}
            >
              <n.icon size={19} /> {n.label}
            </button>
          );
        })}
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex items-end" style={{ background: "rgba(28,35,51,0.4)" }} onClick={() => setMoreOpen(false)}>
          <div className="w-full rounded-t-2xl p-4 pb-8" style={{ background: PAPER_RAISED }} onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: LINE }} />
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => { setScreen(n.key); setMoreOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm rounded-md"
                style={{ color: INK }}
              >
                <n.icon size={18} /> {n.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 text-sm rounded-md mt-1 border-t" style={{ borderColor: LINE, color: WARN }}>
              <LogOut size={18} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== LOGIN ============================== */

function LoginScreen({ onLogin, error, businessName, logoDataUrl }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: PAPER }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {logoDataUrl ? (
            <img src={logoDataUrl} alt="" className="w-16 h-16 rounded-lg mx-auto mb-3 object-cover" style={{ border: `1px solid ${LINE}` }} />
          ) : (
            <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: INK }}>
              <Boxes size={22} color="#fff" />
            </div>
          )}
          <div className="font-bold text-xl" style={{ color: INK }}>{businessName}</div>
          <div className="text-sm mt-1" style={{ color: MUTED }}>Inventory, Production &amp; Sales</div>
        </div>

        <div className="rounded-lg border p-5" style={{ borderColor: LINE, background: PAPER_RAISED }}>
          <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-11 px-3 rounded-md border mb-3"
            style={{ borderColor: LINE }}
            placeholder="e.g. sales01"
          />
          <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>Password</label>
          <div className="relative mb-4">
            <input
              value={password}
              type={showPw ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onLogin(username, password)}
              className="w-full h-11 px-3 pr-10 rounded-md border"
              style={{ borderColor: LINE }}
              placeholder="••••••••"
            />
            <button onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm mb-3 px-3 py-2 rounded-md" style={{ background: WARN_BG, color: WARN }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}
          <button
            onClick={() => onLogin(username, password)}
            className="w-full h-11 rounded-md font-semibold text-white"
            style={{ background: INK }}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== HOME ============================== */

function ItemWiseStock({ ctx }) {
  const { categories, items, available, minStock } = ctx;
  const activeCats = categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
  return (
    <Card>
      <div className="space-y-4">
        {activeCats.map((c) => (
          <div key={c.id}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: MUTED }}>{c.name}</div>
            <div className="divide-y" style={{ borderColor: LINE }}>
              {items.filter((i) => i.categoryId === c.id && i.active).sort((a, b) => a.order - b.order).map((i) => {
                const av = available(i.id);
                const low = minStock[i.id] > 0 && av < minStock[i.id];
                return (
                  <div key={i.id} className="flex items-center justify-between py-1.5 text-sm">
                    <span>{i.name}</span>
                    <span className="flex items-center gap-2">
                      {low && <Badge tone="warn">low</Badge>}
                      {av < 0 && <Badge tone="warn">negative</Badge>}
                      <span className="font-semibold tabular-nums w-12 text-right" style={{ color: av < 0 ? WARN : INK }}>{av}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HomeScreen({ ctx }) {
  const { role, currentUser, items, categories, available, pendingByItem, minStock,
    todayProdQty, todayDispatchQty, totalAvailableQty, totalPendingQty, pendingPartiesCount,
    production, dispatches, orders, setScreen } = ctx;

  const lowStock = items.filter((i) => i.active && available(i.id) < (minStock[i.id] ?? 0) + 1 && (minStock[i.id] ?? 0) > 0);
  const shortageItems = items
    .filter((i) => i.active)
    .map((i) => ({ item: i, avail: available(i.id), pending: pendingByItem[i.id] || 0, shortage: (pendingByItem[i.id] || 0) - available(i.id) }))
    .filter((x) => x.shortage > 0)
    .sort((a, b) => b.shortage - a.shortage);

  const todaysProd = production.filter((p) => p.date === todayStr());
  const todaysDisp = dispatches.filter((d) => d.date === todayStr());
  const todaysOrders = orders.filter((o) => o.date === todayStr());

  if (role === "ADMIN") {
    return (
      <div>
        <SectionTitle>Today — {fmtDate(todayStr())}</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <StatCard label="Available stock" value={totalAvailableQty} sub="all items, all categories" />
          <StatCard label="Today's production" value={todayProdQty} />
          <StatCard label="Today's sales / dispatch" value={todayDispatchQty} />
          <StatCard label="Today's orders (sales)" value={todaysOrders.length} sub={`${todaysOrders.reduce((s, o) => s + o.items.reduce((s2, i) => s2 + i.qty, 0), 0)} units ordered`} />
          <StatCard label="Pending order qty" value={totalPendingQty} tone={totalPendingQty > 0 ? "warn" : "neutral"} />
          <StatCard label="Parties with pending orders" value={pendingPartiesCount} />
        </div>

        <SectionTitle>Live stock — item wise</SectionTitle>
        <div className="mb-6"><ItemWiseStock ctx={ctx} /></div>

        <SectionTitle right={<span className="text-xs" style={{ color: MUTED }}>needs production</span>}>
          Stock shortage against orders
        </SectionTitle>
        <Card className="mb-6">
          {shortageItems.length === 0 ? (
            <div className="text-sm py-2" style={{ color: MUTED }}>No item is currently short against pending orders.</div>
          ) : (
            <div className="divide-y" style={{ borderColor: LINE }}>
              {shortageItems.map((x) => (
                <div key={x.item.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <div className="font-medium">{x.item.name}</div>
                    <div className="text-xs" style={{ color: MUTED }}>Available {x.avail} · Pending orders {x.pending}</div>
                  </div>
                  <Badge tone="warn">⚠ {x.shortage} short</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <SectionTitle>Today's production</SectionTitle>
            <Card>
              {todaysProd.length === 0 ? <div className="text-sm" style={{ color: MUTED }}>No production logged yet today.</div> :
                <div className="space-y-2 text-sm">
                  {todaysProd.flatMap((p) => p.items.map((i) => (
                    <div key={p.id + i.itemId} className="flex justify-between">
                      <span>{ctx.itemById[i.itemId]?.name}</span>
                      <span className="tabular-nums font-medium">{i.qty}</span>
                    </div>
                  )))}
                </div>}
            </Card>
          </div>
          <div>
            <SectionTitle>Today's orders (sales)</SectionTitle>
            <Card>
              {todaysOrders.length === 0 ? <div className="text-sm" style={{ color: MUTED }}>No orders taken yet today.</div> :
                <div className="space-y-2 text-sm">
                  {todaysOrders.map((o) => (
                    <div key={o.id} className="flex justify-between">
                      <span>{o.partyName} <span style={{ color: MUTED }}>· {o.employeeName}</span></span>
                      <span className="tabular-nums font-medium">{o.items.reduce((s, i) => s + i.qty, 0)}</span>
                    </div>
                  ))}
                </div>}
            </Card>
          </div>
          <div>
            <SectionTitle>Today's dispatch</SectionTitle>
            <Card>
              {todaysDisp.length === 0 ? <div className="text-sm" style={{ color: MUTED }}>No dispatch logged yet today.</div> :
                <div className="space-y-2 text-sm">
                  {todaysDisp.flatMap((d) => d.items.map((i) => (
                    <div key={d.id + i.itemId} className="flex justify-between">
                      <span>{d.partyName} · {ctx.itemById[i.itemId]?.name}</span>
                      <span className="tabular-nums font-medium">{i.qty}</span>
                    </div>
                  )))}
                </div>}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Employee (non-admin) simplified home
  const myProdToday = production.filter((p) => p.date === todayStr() && p.employeeId === currentUser.id).reduce((s, p) => s + p.items.reduce((a, i) => a + i.qty, 0), 0);
  const myOrdersToday = orders.filter((o) => o.date === todayStr() && o.employeeId === currentUser.id).length;
  const myDispatchToday = dispatches.filter((d) => d.date === todayStr() && d.employeeId === currentUser.id).reduce((s, d) => s + d.items.reduce((a, i) => a + i.qty, 0), 0);

  return (
    <div>
      <SectionTitle>Hello, {currentUser.name.split(" ")[0]}</SectionTitle>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Available stock" value={totalAvailableQty} />
        <StatCard label="Pending order qty" value={totalPendingQty} tone={totalPendingQty > 0 ? "warn" : "neutral"} />
        {role === "PRODUCTION" && <StatCard label="You logged today" value={myProdToday} />}
        {role === "SALES" && <StatCard label="Your orders today" value={myOrdersToday} />}
        {role === "DISPATCH" && <StatCard label="You dispatched today" value={myDispatchToday} />}
      </div>

      {role === "PRODUCTION" && (
        <button onClick={() => setScreen("production")} className="w-full h-12 rounded-md font-semibold text-white flex items-center justify-center gap-2 mb-6" style={{ background: INK }}>
          <Factory size={18} /> Add production
        </button>
      )}
      {role === "SALES" && (
        <button onClick={() => setScreen("orders")} className="w-full h-12 rounded-md font-semibold text-white flex items-center justify-center gap-2 mb-6" style={{ background: INK }}>
          <ShoppingCart size={18} /> New order
        </button>
      )}
      {role === "DISPATCH" && (
        <button onClick={() => setScreen("pending")} className="w-full h-12 rounded-md font-semibold text-white flex items-center justify-center gap-2 mb-6" style={{ background: INK }}>
          <Truck size={18} /> View pending orders
        </button>
      )}

      <SectionTitle>Live stock — item wise</SectionTitle>
      <ItemWiseStock ctx={ctx} />
    </div>
  );
}

/* ============================== PRODUCTION ============================== */

function ProductionScreen({ ctx }) {
  const { categories, items, currentUser, role, setProduction, nextId, addAudit, setPrintDoc, shareWhatsApp, production, syncAppend, syncDelete } = ctx;
  const [tab, setTab] = useState("add");
  const [date, setDate] = useState(todayStr());
  const [qtys, setQtys] = useState({}); // itemId -> qty
  const [lastSaved, setLastSaved] = useState(null);

  function canDelete(p) { return role === "ADMIN" || p.employeeId === currentUser.id; }
  function deleteProduction(id) {
    const p = production.find((x) => x.id === id);
    const total = p.items.reduce((s, i) => s + i.qty, 0);
    if (!window.confirm(`Delete production entry ${id}? This will reduce available stock by ${total} units.`)) return;
    setProduction((prev) => prev.filter((x) => x.id !== id));
    syncDelete("PRODUCTION", { recordId: id });
    addAudit("Deleted Production", id, `${total} units removed`);
  }

  const activeCats = categories.filter((c) => c.active).sort((a, b) => a.order - b.order);

  function submit() {
    const rows = Object.entries(qtys).filter(([, q]) => q > 0).map(([itemId, qty]) => ({
      itemId, categoryId: items.find((i) => i.id === itemId)?.categoryId, qty,
    }));
    if (rows.length === 0) return;
    const id = nextId("PRD");
    const rec = { id, date, time: timeStr(), employeeId: currentUser.id, employeeName: currentUser.name, items: rows, timestamp: Date.now() };
    setProduction((prev) => [rec, ...prev]);
    syncAppend("PRODUCTION", rows.map((r) => ({
      recordId: id, itemId: r.itemId, categoryId: r.categoryId, qty: r.qty,
      date: rec.date, time: rec.time, employeeId: rec.employeeId, employeeName: rec.employeeName, timestamp: rec.timestamp,
    })));
    addAudit("Added Production", id, `${rows.length} item(s), ${rows.reduce((s, r) => s + r.qty, 0)} units`);
    setLastSaved(rec);
    setQtys({});
  }

  function waText(rec) {
    const lines = rec.items.map((i) => `${items.find((x) => x.id === i.itemId)?.name} — ${i.qty}`);
    return `PRODUCTION ENTRY\n\nProduction ID: ${rec.id}\nDate: ${fmtDate(rec.date)}\nEmployee: ${rec.employeeName}\n\nITEMS\n${lines.join("\n")}\n\nTOTAL QUANTITY: ${rec.items.reduce((s, i) => s + i.qty, 0)}`;
  }

  if (lastSaved) {
    return (
      <div className="max-w-md">
        <div className="rounded-lg border p-6 text-center" style={{ borderColor: GOOD, background: GOOD_BG }}>
          <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: GOOD }} />
          <div className="font-semibold" style={{ color: GOOD }}>Production saved successfully</div>
          <div className="text-sm mt-1 tabular-nums" style={{ color: INK }}>{lastSaved.id}</div>
        </div>
        <Card className="mt-4">
          {lastSaved.items.map((i) => (
            <div key={i.itemId} className="flex justify-between text-sm py-1">
              <span>{items.find((x) => x.id === i.itemId)?.name}</span>
              <span className="font-medium tabular-nums">{i.qty}</span>
            </div>
          ))}
        </Card>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={() => shareWhatsApp(waText(lastSaved))} className="h-11 rounded-md font-semibold text-white flex items-center justify-center gap-2" style={{ background: GOOD }}>
            <MessageCircle size={17} /> Share on WhatsApp
          </button>
          <button
            onClick={() => setPrintDoc({
              title: "Production Report", meta: [["Production ID", lastSaved.id], ["Date", fmtDate(lastSaved.date)], ["Employee", lastSaved.employeeName]],
              columns: ["Item", "Quantity"], rows: lastSaved.items.map((i) => [items.find((x) => x.id === i.itemId)?.name, i.qty]),
            })}
            className="h-11 rounded-md font-semibold border flex items-center justify-center gap-2" style={{ borderColor: LINE }}
          >
            <Printer size={17} /> Generate PDF
          </button>
        </div>
        <button onClick={() => setLastSaved(null)} className="w-full h-11 rounded-md font-medium mt-3 border" style={{ borderColor: LINE }}>
          Add more production
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {[["add", "Add production"], ["history", "History"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ background: tab === k ? INK : "transparent", color: tab === k ? "#fff" : MUTED, border: `1px solid ${tab === k ? INK : LINE}` }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "add" ? (
        <div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>Production date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 px-3 rounded-md border" style={{ borderColor: LINE }} />
          </div>

          {activeCats.map((c) => (
            <div key={c.id} className="mb-5">
              <div className="text-sm font-semibold mb-2 pb-1 border-b" style={{ borderColor: LINE, color: INK }}>{c.name}</div>
              <div className="space-y-2">
                {items.filter((i) => i.categoryId === c.id && i.active).sort((a, b) => a.order - b.order).map((i) => (
                  <div key={i.id} className="flex items-center justify-between gap-2 py-1.5">
                    <span className="text-sm flex-1">{i.name}</span>
                    <QtyInput value={qtys[i.id] || 0} onChange={(v) => setQtys((p) => ({ ...p, [i.id]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="sticky bottom-20 md:bottom-4 z-10">
            <button onClick={submit} className="w-full h-12 rounded-md font-semibold text-white shadow-lg" style={{ background: INK }}>
              Submit production
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {production.length === 0 && <EmptyState icon={Factory} title="No production entries yet" />}
          {production.map((p) => (
            <Card key={p.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-sm tabular-nums">{p.id}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{fmtDate(p.date)} · {p.employeeName}</div>
                </div>
                <Badge>{p.items.reduce((s, i) => s + i.qty, 0)} units</Badge>
              </div>
              <div className="text-sm space-y-1">
                {p.items.map((i) => (
                  <div key={i.itemId} className="flex justify-between">
                    <span style={{ color: MUTED }}>{items.find((x) => x.id === i.itemId)?.name}</span>
                    <span className="tabular-nums">{i.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => shareWhatsApp(waText(p))} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: LINE }}>
                  <MessageCircle size={13} /> WhatsApp
                </button>
                {canDelete(p) && (
                  <button onClick={() => deleteProduction(p.id)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}>
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== ORDERS (SALES) ============================== */

function OrdersScreen({ ctx }) {
  const { categories, items, parties, currentUser, available, setParties, setOrders,
    nextId, addAudit, setPrintDoc, shareWhatsApp, orders, role, recomputeOrderStatus,
    editOrderRequest, setEditOrderRequest, syncAppend, syncUpdate, syncDelete } = ctx;

  const [step, setStep] = useState("party"); // party -> category -> summary -> done
  const [party, setParty] = useState(null);
  const [search, setSearch] = useState("");
  const [showAddParty, setShowAddParty] = useState(false);
  const [newParty, setNewParty] = useState({ name: "", mobile: "", area: "", address: "", contact: "" });
  const [activeCat, setActiveCat] = useState(null);
  const [qtys, setQtys] = useState({});
  const [savedOrder, setSavedOrder] = useState(null);
  const [tab, setTab] = useState("new");
  const [editingOrderId, setEditingOrderId] = useState(null);

  const activeCats = categories.filter((c) => c.active).sort((a, b) => a.order - b.order);
  const myOrders = role === "ADMIN" ? orders : orders.filter((o) => o.employeeId === currentUser.id);
  const editingOrder = editingOrderId ? orders.find((o) => o.id === editingOrderId) : null;

  function minQtyFor(itemId) {
    if (!editingOrder) return 0;
    return editingOrder.items.find((i) => i.itemId === itemId)?.dispatchedQty || 0;
  }

  function startEdit(o) {
    const p = parties.find((x) => x.id === o.partyId) || { id: o.partyId, name: o.partyName, area: "" };
    const q = {};
    o.items.forEach((i) => { q[i.itemId] = i.qty; });
    setParty(p);
    setQtys(q);
    setEditingOrderId(o.id);
    setActiveCat(null);
    setStep("category");
    setTab("new");
  }

  // If Pending Orders (or another screen) asked us to edit a specific order, do it now.
  useEffect(() => {
    if (!editOrderRequest) return;
    const o = orders.find((x) => x.id === editOrderRequest);
    if (o) startEdit(o);
    setEditOrderRequest(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOrderRequest]);


  const filteredParties = parties.filter((p) => p.active && p.name.toLowerCase().includes(search.toLowerCase()));
  const orderedRows = Object.entries(qtys).filter(([, q]) => q > 0).map(([itemId, qty]) => {
    const it = items.find((i) => i.id === itemId);
    const av = available(itemId);
    return { itemId, name: it.name, categoryId: it.categoryId, qty, available: av, short: Math.max(0, qty - av) };
  });
  const totalItems = orderedRows.length;
  const totalShort = orderedRows.filter((r) => r.short > 0).length;

  function saveParty() {
    if (!newParty.name.trim()) return;
    const id = "P" + (parties.length + 1) + "-" + Date.now().toString().slice(-4);
    const p = { id, ...newParty, active: true, created: todayStr() };
    setParties((prev) => [...prev, p]);
    syncAppend("PARTIES", [p]);
    addAudit("Added Party", id, newParty.name);
    setParty(p);
    setShowAddParty(false);
    setStep("category");
  }

  function submitOrder() {
    if (orderedRows.length === 0) return;

    if (editingOrderId) {
      const existing = orders.find((o) => o.id === editingOrderId);
      const newItems = orderedRows.map((r) => ({
        itemId: r.itemId, categoryId: r.categoryId, qty: r.qty,
        dispatchedQty: existing.items.find((i) => i.itemId === r.itemId)?.dispatchedQty || 0,
      }));
      const draft = { ...existing, items: newItems };
      const updated = { ...draft, status: recomputeOrderStatus(draft) };
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? updated : o)));
      // Simplest reliable sync for an edit: replace all of this order's rows in the sheet.
      syncDelete("ORDERS", { recordId: editingOrderId });
      syncAppend("ORDERS", newItems.map((i) => ({
        recordId: editingOrderId, itemId: i.itemId, categoryId: i.categoryId, qty: i.qty, dispatchedQty: i.dispatchedQty,
        date: updated.date, time: updated.time, employeeId: updated.employeeId, employeeName: updated.employeeName,
        partyId: updated.partyId, partyName: updated.partyName, status: updated.status, timestamp: updated.timestamp,
      })));
      addAudit("Edited Order", editingOrderId, `${party.name} — now ${newItems.length} items, ${newItems.reduce((s, r) => s + r.qty, 0)} units`);
      setSavedOrder(updated);
      setStep("done");
      return;
    }

    const id = nextId("ORD");
    const rec = {
      id, date: todayStr(), time: timeStr(), employeeId: currentUser.id, employeeName: currentUser.name,
      partyId: party.id, partyName: party.name,
      items: orderedRows.map((r) => ({ itemId: r.itemId, categoryId: r.categoryId, qty: r.qty, dispatchedQty: 0 })),
      status: "CONFIRMED", timestamp: Date.now(),
    };
    setOrders((prev) => [rec, ...prev]);
    syncAppend("ORDERS", rec.items.map((i) => ({
      recordId: id, itemId: i.itemId, categoryId: i.categoryId, qty: i.qty, dispatchedQty: i.dispatchedQty,
      date: rec.date, time: rec.time, employeeId: rec.employeeId, employeeName: rec.employeeName,
      partyId: rec.partyId, partyName: rec.partyName, status: rec.status, timestamp: rec.timestamp,
    })));
    addAudit("Created Order", id, `${party.name} — ${orderedRows.length} items, ${orderedRows.reduce((s, r) => s + r.qty, 0)} units`);
    setSavedOrder(rec);
    setStep("done");
  }

  function resetFlow() {
    setStep("party"); setParty(null); setSearch(""); setQtys({}); setActiveCat(null); setSavedOrder(null); setTab("new"); setEditingOrderId(null);
  }

  function canManage(o) { return role === "ADMIN" || o.employeeId === currentUser.id; }
  function cancelOrder(o) {
    if (!window.confirm(`Cancel order ${o.id}? It will stop appearing in pending orders and dispatch.`)) return;
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: "CANCELLED" } : x)));
    syncUpdate("ORDERS", { recordId: o.id }, { status: "CANCELLED" });
    addAudit("Cancelled Order", o.id, o.partyName);
  }
  function deleteOrder(o) {
    if (o.items.some((i) => i.dispatchedQty > 0)) {
      alert("This order already has dispatch recorded against it — cancel it instead so dispatch history stays consistent.");
      return;
    }
    if (!window.confirm(`Delete order ${o.id}? This cannot be undone.`)) return;
    setOrders((prev) => prev.filter((x) => x.id !== o.id));
    syncDelete("ORDERS", { recordId: o.id });
    addAudit("Deleted Order", o.id, o.partyName);
  }

  function waText(order) {
    const lines = order.items.map((i) => {
      const it = items.find((x) => x.id === i.itemId);
      const av = available(i.itemId) + i.qty; // approx at time of order isn't stored; use current stock note
      return `${it?.name} — ${i.qty}`;
    });
    const shortLines = order.items.map((i) => {
      const it = items.find((x) => x.id === i.itemId);
      const av = available(i.itemId) + i.qty;
      return `${it?.name} — ${av >= i.qty ? "Available" : `Short by ${i.qty - av}`}`;
    });
    return `ORDER CONFIRMATION\n\nParty: ${order.partyName}\nOrder No: ${order.id}\nDate: ${fmtDate(order.date)}\nSalesperson: ${order.employeeName}\n\nITEMS\n${lines.join("\n")}\n\nTOTAL QUANTITY: ${order.items.reduce((s, i) => s + i.qty, 0)}\n\nSTOCK STATUS\n${shortLines.join("\n")}\n\nThank you.`;
  }

  if (step === "done" && savedOrder) {
    return (
      <div className="max-w-md">
        <div className="rounded-lg border p-6 text-center" style={{ borderColor: GOOD, background: GOOD_BG }}>
          <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: GOOD }} />
          <div className="font-semibold" style={{ color: GOOD }}>{editingOrderId ? "Order updated" : "Order submitted"}</div>
          <div className="text-sm mt-1 tabular-nums" style={{ color: INK }}>{savedOrder.id}</div>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>{savedOrder.partyName}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={() => shareWhatsApp(waText(savedOrder))} className="h-11 rounded-md font-semibold text-white flex items-center justify-center gap-2" style={{ background: GOOD }}>
            <MessageCircle size={17} /> Share on WhatsApp
          </button>
          <button
            onClick={() => setPrintDoc({
              title: "Order", meta: [["Order No", savedOrder.id], ["Party", savedOrder.partyName], ["Date", fmtDate(savedOrder.date)], ["Salesperson", savedOrder.employeeName]],
              columns: ["Item", "Ordered Qty"], rows: savedOrder.items.map((i) => [items.find((x) => x.id === i.itemId)?.name, i.qty]),
            })}
            className="h-11 rounded-md font-semibold border flex items-center justify-center gap-2" style={{ borderColor: LINE }}
          >
            <Printer size={17} /> Generate PDF
          </button>
        </div>
        <button onClick={resetFlow} className="w-full h-11 rounded-md font-medium mt-3 border" style={{ borderColor: LINE }}>
          Create another order
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {[["new", "New order"], ["mine", role === "ADMIN" ? "All orders" : "My orders"]].map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); if (k === "new") resetFlow(); }} className="px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ background: tab === k ? INK : "transparent", color: tab === k ? "#fff" : MUTED, border: `1px solid ${tab === k ? INK : LINE}` }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "mine" ? (
        <div className="space-y-3">
          {myOrders.length === 0 && <EmptyState icon={ShoppingCart} title="No orders yet" />}
          {myOrders.map((o) => (
            <Card key={o.id}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="font-medium text-sm">{o.partyName}</div>
                  <div className="text-xs tabular-nums" style={{ color: MUTED }}>{o.id} · {fmtDate(o.date)}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <div className="text-sm mt-2 space-y-1">
                {o.items.map((i) => (
                  <div key={i.itemId} className="flex justify-between">
                    <span style={{ color: MUTED }}>{items.find((x) => x.id === i.itemId)?.name}</span>
                    <span className="tabular-nums">{i.dispatchedQty}/{i.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <button onClick={() => shareWhatsApp(waText(o))} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: LINE }}>
                  <MessageCircle size={13} /> WhatsApp
                </button>
                {canManage(o) && o.status !== "CANCELLED" && (
                  <button onClick={() => startEdit(o)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: ACCENT, color: ACCENT }}>
                    <Pencil size={13} /> Edit order
                  </button>
                )}
                {canManage(o) && o.status !== "CANCELLED" && o.status !== "COMPLETED" && (
                  <button onClick={() => cancelOrder(o)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}>
                    <XCircle size={13} /> Cancel order
                  </button>
                )}
                {role === "ADMIN" && (
                  <button onClick={() => deleteOrder(o)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}>
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {step === "party" && (
            <div>
              <SectionTitle>Select party</SectionTitle>
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search party or shop name"
                  className="w-full h-11 pl-9 pr-3 rounded-md border" style={{ borderColor: LINE }} />
              </div>
              <button onClick={() => setShowAddParty(true)} className="w-full h-11 rounded-md border font-medium flex items-center justify-center gap-2 mb-4" style={{ borderColor: ACCENT, color: ACCENT }}>
                <Plus size={16} /> Add new party
              </button>

              {showAddParty && (
                <Card className="mb-4">
                  <div className="space-y-2">
                    <input placeholder="Party / shop name" value={newParty.name} onChange={(e) => setNewParty((p) => ({ ...p, name: e.target.value }))} className="w-full h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
                    <input placeholder="Contact person" value={newParty.contact} onChange={(e) => setNewParty((p) => ({ ...p, contact: e.target.value }))} className="w-full h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
                    <input placeholder="Mobile number" value={newParty.mobile} onChange={(e) => setNewParty((p) => ({ ...p, mobile: e.target.value }))} className="w-full h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
                    <input placeholder="Area" value={newParty.area} onChange={(e) => setNewParty((p) => ({ ...p, area: e.target.value }))} className="w-full h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
                    <input placeholder="Address (optional)" value={newParty.address} onChange={(e) => setNewParty((p) => ({ ...p, address: e.target.value }))} className="w-full h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
                    <button onClick={saveParty} className="w-full h-10 rounded-md font-semibold text-white" style={{ background: INK }}>Save party &amp; continue</button>
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                {filteredParties.map((p) => (
                  <button key={p.id} onClick={() => { setParty(p); setStep("category"); }} className="w-full text-left p-3 rounded-md border flex items-center justify-between" style={{ borderColor: LINE, background: PAPER_RAISED }}>
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs" style={{ color: MUTED }}>{p.area} {p.mobile && `· ${p.mobile}`}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: MUTED }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "category" && party && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => (editingOrderId ? setTab("mine") : setStep("party"))} className="p-1.5 rounded-md border" style={{ borderColor: LINE }}><ChevronLeft size={16} /></button>
                <div>
                  <div className="font-semibold">{party.name}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{party.area}</div>
                </div>
                {editingOrderId && <span className="ml-auto"><Badge tone="accent">Editing {editingOrderId}</Badge></span>}
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-20 md:w-44 shrink-0 sticky top-2 self-start max-h-[75vh] overflow-y-auto space-y-1.5 pr-1">
                  {activeCats.map((c) => {
                    const catCount = items.filter((i) => i.categoryId === c.id).reduce((s, i) => s + (qtys[i.id] || 0), 0);
                    const isActive = (activeCat || activeCats[0]?.id) === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveCat(c.id)}
                        className="w-full text-left p-2.5 md:p-3 rounded-lg border relative"
                        style={{ borderColor: isActive ? ACCENT : LINE, background: isActive ? ACCENT_BG : PAPER_RAISED }}
                      >
                        <div className="text-xs md:text-sm font-semibold leading-tight" style={{ color: isActive ? ACCENT : INK }}>{c.name}</div>
                        {catCount > 0 && <div className="absolute -top-1.5 -right-1.5"><Badge tone="accent">{catCount}</Badge></div>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="text-sm font-semibold mb-1">{categories.find((c) => c.id === (activeCat || activeCats[0]?.id))?.name}</div>
                  {items.filter((i) => i.categoryId === (activeCat || activeCats[0]?.id) && i.active).sort((a, b) => a.order - b.order).map((i) => {
                    const av = available(i.id);
                    const q = qtys[i.id] || 0;
                    const short = q > av;
                    const floor = minQtyFor(i.id);
                    return (
                      <div key={i.id} className="p-3 rounded-md border" style={{ borderColor: short ? WARN : LINE, background: short ? WARN_BG : PAPER_RAISED }}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm font-medium">{i.name}</div>
                            <div className="text-xs" style={{ color: MUTED }}>Available: <span className="font-medium tabular-nums">{av}</span></div>
                          </div>
                        </div>
                        <QtyInput value={q} onChange={(v) => setQtys((p) => ({ ...p, [i.id]: Math.max(v, floor) }))} />
                        {short && (
                          <div className="text-xs mt-2 font-medium flex items-center gap-1" style={{ color: WARN }}>
                            <AlertTriangle size={13} /> Short stock — only {av} available, {q - av} short. You can still place this order.
                          </div>
                        )}
                        {floor > 0 && (
                          <div className="text-xs mt-1" style={{ color: MUTED }}>Already dispatched {floor} — quantity can't go below this.</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="sticky bottom-20 md:bottom-4 mt-6 z-10">
                <button
                  disabled={totalItems === 0}
                  onClick={() => setStep("summary")}
                  className="w-full h-12 rounded-md font-semibold text-white shadow-lg disabled:opacity-40"
                  style={{ background: INK }}
                >
                  {editingOrderId ? "Review changes" : "Review order"} {totalItems > 0 && `(${totalItems} item${totalItems > 1 ? "s" : ""})`}
                </button>
              </div>
            </div>
          )}

          {step === "summary" && party && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep("category")} className="p-1.5 rounded-md border" style={{ borderColor: LINE }}><ChevronLeft size={16} /></button>
                <div className="font-semibold">{editingOrderId ? "Review changes" : "Order summary"} — {party.name}</div>
              </div>

              <SectionTitle>Stock check</SectionTitle>
              <Card className="mb-4">
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold pb-2 border-b" style={{ borderColor: LINE, color: MUTED }}>
                  <div className="col-span-2">Item</div><div className="text-right">Available</div><div className="text-right">Ordered</div>
                </div>
                {orderedRows.map((r) => (
                  <div key={r.itemId} className="grid grid-cols-4 gap-2 text-sm py-2 border-b last:border-0" style={{ borderColor: LINE }}>
                    <div className="col-span-2">{r.name}{r.short > 0 && <span className="ml-1 text-xs" style={{ color: WARN }}>(short {r.short})</span>}</div>
                    <div className="text-right tabular-nums">{r.available}</div>
                    <div className="text-right tabular-nums font-medium">{r.qty}</div>
                  </div>
                ))}
              </Card>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard label="Items ordered" value={totalItems} />
                <StatCard label="Fully available" value={totalItems - totalShort} tone="good" />
                <StatCard label="Items short" value={totalShort} tone={totalShort ? "warn" : "neutral"} />
              </div>

              <button onClick={submitOrder} className="w-full h-12 rounded-md font-semibold text-white shadow-lg" style={{ background: INK }}>
                {editingOrderId ? "Update order" : "Submit order"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============================== PENDING ORDERS ============================== */

function PendingScreen({ ctx }) {
  const { orders, items, parties, setPrintDoc, shareWhatsApp, role, setOrders, addAudit, currentUser, setEditOrderRequest, setScreen, syncUpdate } = ctx;
  const [filterParty, setFilterParty] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("PENDING");

  function canManage(o) { return role === "ADMIN" || o.employeeId === currentUser.id; }
  function cancelOrder(o) {
    if (!window.confirm(`Cancel order ${o.id}? It will stop appearing in pending orders and dispatch.`)) return;
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: "CANCELLED" } : x)));
    syncUpdate("ORDERS", { recordId: o.id }, { status: "CANCELLED" });
    addAudit("Cancelled Order", o.id, o.partyName);
  }
  function editOrder(o) {
    setEditOrderRequest(o.id);
    setScreen("orders");
  }

  const pendingOrders = orders.filter((o) => {
    const pendingQty = o.items.reduce((s, i) => s + Math.max(0, i.qty - i.dispatchedQty), 0);
    if (filterStatus === "PENDING" && (o.status === "COMPLETED" || o.status === "CANCELLED")) return false;
    if (filterStatus === "ALL" ? false : filterStatus !== "PENDING" && o.status !== filterStatus) return false;
    if (filterParty !== "ALL" && o.partyId !== filterParty) return false;
    return filterStatus === "PENDING" ? pendingQty > 0 : true;
  });

  const grouped = {};
  pendingOrders.forEach((o) => { grouped[o.partyName] = grouped[o.partyName] || []; grouped[o.partyName].push(o); });

  function waTextParty(partyName, ords) {
    const lines = ords.flatMap((o) => o.items.filter((i) => i.qty - i.dispatchedQty > 0).map((i) =>
      `${items.find((x) => x.id === i.itemId)?.name} — Pending ${i.qty - i.dispatchedQty}`
    ));
    return `PENDING ORDERS\n\nParty: ${partyName}\n\n${lines.join("\n")}\n\nTotal Pending: ${ords.reduce((s, o) => s + o.items.reduce((s2, i) => s2 + Math.max(0, i.qty - i.dispatchedQty), 0), 0)} units`;
  }

  return (
    <div>
      <SectionTitle>Pending orders</SectionTitle>
      <div className="flex gap-2 mb-5 flex-wrap">
        <select value={filterParty} onChange={(e) => setFilterParty(e.target.value)} className="h-10 px-3 rounded-md border text-sm" style={{ borderColor: LINE }}>
          <option value="ALL">All parties</option>
          {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-md border text-sm" style={{ borderColor: LINE }}>
          <option value="PENDING">Pending only</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PARTIALLY DISPATCHED">Partially dispatched</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {Object.keys(grouped).length === 0 && <EmptyState icon={Clock} title="No pending orders" note="Everything is caught up." />}

      {Object.entries(grouped).map(([partyName, ords]) => {
        const totalPending = ords.reduce((s, o) => s + o.items.reduce((s2, i) => s2 + Math.max(0, i.qty - i.dispatchedQty), 0), 0);
        return (
          <div key={partyName} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">{partyName}</div>
              <Badge tone="warn">{totalPending} units pending</Badge>
            </div>
            {ords.map((o) => (
              <Card key={o.id} className="mb-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium tabular-nums">{o.id}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{fmtDate(o.date)}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold pb-1 mb-1 border-b" style={{ borderColor: LINE, color: MUTED }}>
                  <div>Item</div><div className="text-right">Ordered</div><div className="text-right">Dispatched</div><div className="text-right">Pending</div>
                </div>
                {o.items.map((i) => (
                  <div key={i.itemId} className="grid grid-cols-4 gap-2 text-sm py-1">
                    <div>{items.find((x) => x.id === i.itemId)?.name}</div>
                    <div className="text-right tabular-nums">{i.qty}</div>
                    <div className="text-right tabular-nums">{i.dispatchedQty}</div>
                    <div className="text-right tabular-nums font-medium">{i.qty - i.dispatchedQty}</div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {canManage(o) && o.status !== "CANCELLED" && (
                    <button onClick={() => editOrder(o)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: ACCENT, color: ACCENT }}>
                      <Pencil size={13} /> Edit order
                    </button>
                  )}
                  {role === "ADMIN" && o.status !== "CANCELLED" && o.status !== "COMPLETED" && (
                    <button onClick={() => cancelOrder(o)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}>
                      <XCircle size={13} /> Cancel this order
                    </button>
                  )}
                </div>
              </Card>
            ))}
            <div className="flex gap-2 mt-1">
              <button onClick={() => shareWhatsApp(waTextParty(partyName, ords))} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: LINE }}>
                <MessageCircle size={13} /> Share WhatsApp
              </button>
              <button
                onClick={() => setPrintDoc({
                  title: "Pending Order Report", meta: [["Party", partyName], ["Date", fmtDate(todayStr())]],
                  columns: ["Order", "Item", "Ordered", "Dispatched", "Pending"],
                  rows: ords.flatMap((o) => o.items.map((i) => [o.id, items.find((x) => x.id === i.itemId)?.name, i.qty, i.dispatchedQty, i.qty - i.dispatchedQty])),
                })}
                className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: LINE }}
              >
                <Printer size={13} /> PDF
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================== DISPATCH ============================== */

function DispatchScreen({ ctx }) {
  const { orders, items, categories, currentUser, available, setOrders, setDispatches, nextId, addAudit,
    recomputeOrderStatus, setPrintDoc, shareWhatsApp, role, syncAppend, syncDelete } = ctx;
  const [selectedId, setSelectedId] = useState(null);
  const [dispQtys, setDispQtys] = useState({});
  const [extraItems, setExtraItems] = useState([]); // items dispatched that weren't on the original order
  const [showAddItem, setShowAddItem] = useState(false);
  const [addCat, setAddCat] = useState("");
  const [addItemId, setAddItemId] = useState("");
  const [tab, setTab] = useState("pending");
  const [savedDispatch, setSavedDispatch] = useState(null);

  const pendingOrders = orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED" && o.items.some((i) => i.qty - i.dispatchedQty > 0));
  const dispatchHistory = ctx.dispatches.filter((d) => role === "ADMIN" || d.employeeId === currentUser.id);
  const order = orders.find((o) => o.id === selectedId);

  function submitDispatch() {
    if (!order) return;
    const fromOrder = Object.entries(dispQtys).filter(([, q]) => q > 0).map(([itemId, qty]) => ({
      itemId, categoryId: items.find((i) => i.id === itemId)?.categoryId, qty,
    }));
    const extra = extraItems.filter((r) => r.qty > 0);
    const rows = [...fromOrder, ...extra];
    if (rows.length === 0) return;

    const id = nextId("DSP");
    const rec = { id, date: todayStr(), time: timeStr(), employeeId: currentUser.id, employeeName: currentUser.name, orderId: order.id, partyName: order.partyName, items: rows, timestamp: Date.now() };
    setDispatches((prev) => [rec, ...prev]);
    syncAppend("DISPATCH", rows.map((r) => ({
      recordId: id, orderId: order.id, itemId: r.itemId, categoryId: r.categoryId, qty: r.qty,
      date: rec.date, time: rec.time, employeeId: rec.employeeId, employeeName: rec.employeeName, partyName: rec.partyName, timestamp: rec.timestamp,
    })));

    let addedExtra = false;
    let bumpedQty = false;
    let updatedItems = order.items.map((i) => {
      const add = rows.find((r) => r.itemId === i.itemId)?.qty || 0;
      if (add === 0) return i;
      const newDispatched = i.dispatchedQty + add;
      const newQty = newDispatched > i.qty ? newDispatched : i.qty;
      if (newDispatched > i.qty) bumpedQty = true;
      return { ...i, dispatchedQty: newDispatched, qty: newQty };
    });
    rows.forEach((r) => {
      if (!updatedItems.some((i) => i.itemId === r.itemId)) {
        updatedItems = [...updatedItems, { itemId: r.itemId, categoryId: r.categoryId, qty: r.qty, dispatchedQty: r.qty }];
        addedExtra = true;
      }
    });
    const draft = { ...order, items: updatedItems };
    const updatedOrder = { ...draft, status: recomputeOrderStatus(draft) };
    setOrders((prev) => prev.map((o) => (o.id === order.id ? updatedOrder : o)));

    // Replace this order's rows in the sheet wholesale — simplest reliable way to reflect
    // quantity bumps and any brand-new (previously unordered) items.
    syncDelete("ORDERS", { recordId: order.id });
    syncAppend("ORDERS", updatedItems.map((i) => ({
      recordId: order.id, itemId: i.itemId, categoryId: i.categoryId, qty: i.qty, dispatchedQty: i.dispatchedQty,
      date: updatedOrder.date, time: updatedOrder.time, employeeId: updatedOrder.employeeId, employeeName: updatedOrder.employeeName,
      partyId: updatedOrder.partyId, partyName: updatedOrder.partyName, status: updatedOrder.status, timestamp: updatedOrder.timestamp,
    })));

    let note = `${rows.length} item(s) against ${order.id}`;
    if (addedExtra) note += " — order updated with item(s) not originally on it";
    if (bumpedQty) note += " — ordered quantity increased to match what was actually sent";
    addAudit("Dispatched Order", id, note);
    setSavedDispatch(rec);
    setSelectedId(null);
    setDispQtys({});
    setExtraItems([]);
  }

  function waText(rec) {
    const lines = rec.items.map((i) => `${items.find((x) => x.id === i.itemId)?.name} — ${i.qty}`);
    return `DISPATCH CONFIRMATION\n\nDispatch ID: ${rec.id}\nAgainst Order: ${rec.orderId}\nParty: ${rec.partyName}\nDate: ${fmtDate(rec.date)}\n\nITEMS\n${lines.join("\n")}\n\nTOTAL: ${rec.items.reduce((s, i) => s + i.qty, 0)} units`;
  }

  function deleteDispatch(d) {
    if (!window.confirm(`Delete dispatch ${d.id}? This puts the dispatched quantity back into pending for order ${d.orderId} and restores available stock.`)) return;
    setDispatches((prev) => prev.filter((x) => x.id !== d.id));
    syncDelete("DISPATCH", { recordId: d.id });

    const affectedOrder = orders.find((o) => o.id === d.orderId);
    if (affectedOrder) {
      const updatedItems = affectedOrder.items.map((i) => {
        const remove = d.items.find((r) => r.itemId === i.itemId)?.qty || 0;
        return { ...i, dispatchedQty: Math.max(0, i.dispatchedQty - remove) };
      });
      const draft = { ...affectedOrder, items: updatedItems };
      const updatedOrder = { ...draft, status: recomputeOrderStatus(draft) };
      setOrders((prev) => prev.map((o) => (o.id === d.orderId ? updatedOrder : o)));
      syncDelete("ORDERS", { recordId: d.orderId });
      syncAppend("ORDERS", updatedItems.map((i) => ({
        recordId: d.orderId, itemId: i.itemId, categoryId: i.categoryId, qty: i.qty, dispatchedQty: i.dispatchedQty,
        date: updatedOrder.date, time: updatedOrder.time, employeeId: updatedOrder.employeeId, employeeName: updatedOrder.employeeName,
        partyId: updatedOrder.partyId, partyName: updatedOrder.partyName, status: updatedOrder.status, timestamp: updatedOrder.timestamp,
      })));
    }
    addAudit("Deleted Dispatch", d.id, `Reversed ${d.items.reduce((s, i) => s + i.qty, 0)} units against ${d.orderId}`);
  }

  if (savedDispatch) {
    return (
      <div className="max-w-md">
        <div className="rounded-lg border p-6 text-center" style={{ borderColor: GOOD, background: GOOD_BG }}>
          <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: GOOD }} />
          <div className="font-semibold" style={{ color: GOOD }}>Dispatch saved — inventory updated</div>
          <div className="text-sm mt-1 tabular-nums" style={{ color: INK }}>{savedDispatch.id}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={() => shareWhatsApp(waText(savedDispatch))} className="h-11 rounded-md font-semibold text-white flex items-center justify-center gap-2" style={{ background: GOOD }}>
            <MessageCircle size={17} /> Share on WhatsApp
          </button>
          <button
            onClick={() => setPrintDoc({
              title: "Dispatch Note", meta: [["Dispatch ID", savedDispatch.id], ["Order ID", savedDispatch.orderId], ["Party", savedDispatch.partyName], ["Date", fmtDate(savedDispatch.date)]],
              columns: ["Item", "Dispatched Qty"], rows: savedDispatch.items.map((i) => [items.find((x) => x.id === i.itemId)?.name, i.qty]),
            })}
            className="h-11 rounded-md font-semibold border flex items-center justify-center gap-2" style={{ borderColor: LINE }}
          >
            <Printer size={17} /> Generate PDF
          </button>
        </div>
        <button onClick={() => setSavedDispatch(null)} className="w-full h-11 rounded-md font-medium mt-3 border" style={{ borderColor: LINE }}>
          Back to pending orders
        </button>
      </div>
    );
  }

  if (order) {
    const addableItems = items.filter((i) => i.active && i.categoryId === addCat && !order.items.some((oi) => oi.itemId === i.id) && !extraItems.some((e) => e.itemId === i.id));
    return (
      <div>
        <button onClick={() => { setSelectedId(null); setExtraItems([]); setShowAddItem(false); }} className="flex items-center gap-1 text-sm font-medium mb-4" style={{ color: ACCENT }}>
          <ChevronLeft size={15} /> Back to pending orders
        </button>
        <div className="mb-4">
          <div className="font-semibold">{order.partyName}</div>
          <div className="text-xs" style={{ color: MUTED }}>{order.id} · Ordered {fmtDate(order.date)} by {order.employeeName}</div>
        </div>

        <Card className="mb-3">
          <div className="grid grid-cols-5 gap-2 text-xs font-semibold pb-2 mb-1 border-b" style={{ borderColor: LINE, color: MUTED }}>
            <div>Item</div><div className="text-right">Pending</div><div className="text-right">Stock</div><div className="text-right col-span-2">Dispatch qty</div>
          </div>
          <div className="space-y-3">
            {order.items.map((i) => {
              const pending = i.qty - i.dispatchedQty;
              const av = available(i.itemId);
              const val = dispQtys[i.itemId] || 0;
              const exceedsStock = val > av;
              const exceedsPending = val > pending;
              return (
                <div key={i.itemId} className="grid grid-cols-5 gap-2 items-center">
                  <div className="text-sm">{items.find((x) => x.id === i.itemId)?.name}</div>
                  <div className="text-right text-sm tabular-nums">{pending}</div>
                  <div className="text-right text-sm tabular-nums">{av}</div>
                  <div className="col-span-2">
                    <QtyInput compact value={val} onChange={(v) => setDispQtys((p) => ({ ...p, [i.itemId]: Math.max(0, v) }))} />
                    {exceedsPending && (
                      <div className="text-xs mt-1 flex items-center gap-1" style={{ color: WARN }}>
                        <AlertTriangle size={12} /> More than was ordered ({pending} pending) — the order will be updated to match what's actually sent.
                      </div>
                    )}
                    {exceedsStock && (
                      <div className="text-xs mt-1 flex items-center gap-1" style={{ color: WARN }}>
                        <AlertTriangle size={12} /> More than logged stock ({av}) — allowed if you physically have it; stock will show negative until production catches up.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {extraItems.length > 0 && (
            <div className="space-y-3 mt-3 pt-3 border-t" style={{ borderColor: LINE }}>
              {extraItems.map((e) => {
                const it = items.find((x) => x.id === e.itemId);
                const av = available(e.itemId);
                return (
                  <div key={e.itemId} className="grid grid-cols-5 gap-2 items-center">
                    <div className="text-sm flex items-center gap-1">{it?.name} <Badge tone="accent">not ordered</Badge></div>
                    <div className="text-right text-sm tabular-nums">—</div>
                    <div className="text-right text-sm tabular-nums">{av}</div>
                    <div className="col-span-2 flex items-center gap-2">
                      <QtyInput compact value={e.qty} onChange={(v) => setExtraItems((prev) => prev.map((x) => (x.itemId === e.itemId ? { ...x, qty: Math.max(0, v) } : x)))} />
                      <button onClick={() => setExtraItems((prev) => prev.filter((x) => x.itemId !== e.itemId))} className="p-1.5 rounded border" style={{ borderColor: LINE }}>
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {showAddItem ? (
          <Card className="mb-4">
            <div className="text-sm font-semibold mb-2">Add an item not on this order</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select value={addCat} onChange={(e) => { setAddCat(e.target.value); setAddItemId(""); }} className="h-10 px-2 rounded-md border text-sm" style={{ borderColor: LINE }}>
                <option value="">Choose category</option>
                {categories.filter((c) => c.active).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={addItemId} onChange={(e) => setAddItemId(e.target.value)} className="h-10 px-2 rounded-md border text-sm" disabled={!addCat} style={{ borderColor: LINE }}>
                <option value="">Choose item</option>
                {addableItems.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!addItemId) return;
                  const it = items.find((x) => x.id === addItemId);
                  setExtraItems((prev) => [...prev, { itemId: it.id, categoryId: it.categoryId, qty: 1 }]);
                  setAddItemId(""); setAddCat(""); setShowAddItem(false);
                }}
                disabled={!addItemId}
                className="h-10 px-4 rounded-md font-semibold text-white disabled:opacity-40"
                style={{ background: INK }}
              >
                Add to dispatch
              </button>
              <button onClick={() => { setShowAddItem(false); setAddCat(""); setAddItemId(""); }} className="h-10 px-4 rounded-md border font-medium" style={{ borderColor: LINE }}>
                Cancel
              </button>
            </div>
          </Card>
        ) : (
          <button onClick={() => setShowAddItem(true)} className="w-full h-11 rounded-md border font-medium flex items-center justify-center gap-2 mb-4" style={{ borderColor: ACCENT, color: ACCENT }}>
            <Plus size={16} /> Add item not on this order
          </button>
        )}

        <button
          onClick={submitDispatch}
          className="w-full h-12 rounded-md font-semibold text-white shadow-lg"
          style={{ background: INK }}
        >
          Submit dispatch
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {[["pending", "Pending orders"], ["history", "History"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ background: tab === k ? INK : "transparent", color: tab === k ? "#fff" : MUTED, border: `1px solid ${tab === k ? INK : LINE}` }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        <div className="space-y-2">
          {pendingOrders.length === 0 && <EmptyState icon={Truck} title="No orders waiting for dispatch" />}
          {pendingOrders.map((o) => {
            const pendingQty = o.items.reduce((s, i) => s + Math.max(0, i.qty - i.dispatchedQty), 0);
            return (
              <button key={o.id} onClick={() => setSelectedId(o.id)} className="w-full text-left p-3 rounded-md border flex items-center justify-between" style={{ borderColor: LINE, background: PAPER_RAISED }}>
                <div>
                  <div className="font-medium text-sm">{o.partyName}</div>
                  <div className="text-xs tabular-nums" style={{ color: MUTED }}>{o.id} · {fmtDate(o.date)}</div>
                </div>
                <div className="text-right">
                  <StatusBadge status={o.status} />
                  <div className="text-xs mt-1 font-medium tabular-nums" style={{ color: MUTED }}>{pendingQty} units pending</div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {dispatchHistory.length === 0 && <EmptyState icon={Truck} title="No dispatch history yet" />}
          {dispatchHistory.map((d) => (
            <Card key={d.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-sm">{d.partyName}</div>
                  <div className="text-xs tabular-nums" style={{ color: MUTED }}>{d.id} · against {d.orderId} · {fmtDate(d.date)}</div>
                </div>
                <Badge tone="good">{d.items.reduce((s, i) => s + i.qty, 0)} units</Badge>
              </div>
              <div className="text-sm space-y-1">
                {d.items.map((i) => (
                  <div key={i.itemId} className="flex justify-between">
                    <span style={{ color: MUTED }}>{items.find((x) => x.id === i.itemId)?.name}</span>
                    <span className="tabular-nums">{i.qty}</span>
                  </div>
                ))}
              </div>
              {role === "ADMIN" && (
                <button onClick={() => deleteDispatch(d)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1 mt-3" style={{ borderColor: WARN, color: WARN }}>
                  <Trash2 size={13} /> Delete dispatch
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== INVENTORY (ADMIN) ============================== */

function InventoryScreen({ ctx }) {
  const { categories, items, available, openingByItem, productionByItem, dispatchedByItem, adjByItem,
    setStockAdj, addAudit, currentUser, minStock, setMinStock, syncAppend } = ctx;
  const [filterCat, setFilterCat] = useState("ALL");
  const [showAdjust, setShowAdjust] = useState(null);
  const [adjForm, setAdjForm] = useState({ type: "opening", qty: "", reason: "" });

  const rows = items.filter((i) => filterCat === "ALL" || i.categoryId === filterCat).map((i) => ({
    item: i,
    category: categories.find((c) => c.id === i.categoryId)?.name,
    opening: openingByItem[i.id] || 0,
    production: productionByItem[i.id] || 0,
    dispatch: dispatchedByItem[i.id] || 0,
    adj: adjByItem[i.id] || 0,
    avail: available(i.id),
  }));

  function submitAdjust(itemId) {
    const qty = parseInt(adjForm.qty, 10);
    if (!qty && qty !== 0) return;
    const id = "ADJ-" + Date.now();
    const rec = { id, itemId, type: adjForm.type, qty: adjForm.type === "opening" ? Math.abs(qty) : qty, reason: adjForm.reason, date: todayStr(), employee: currentUser.name };
    setStockAdj((prev) => [...prev, rec]);
    syncAppend("STOCK_ADJUSTMENTS", [rec]);
    addAudit(adjForm.type === "opening" ? "Set Opening Stock" : "Stock Adjustment", id, `${itemById(itemId)} · ${qty} · ${adjForm.reason || "no reason given"}`);
    setShowAdjust(null);
    setAdjForm({ type: "opening", qty: "", reason: "" });
  }
  function itemById(id) { return items.find((i) => i.id === id)?.name; }

  return (
    <div>
      <SectionTitle>Inventory — item-wise stock</SectionTitle>
      <div className="flex gap-2 mb-4 flex-wrap">
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="h-10 px-3 rounded-md border text-sm" style={{ borderColor: LINE }}>
          <option value="ALL">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-lg border" style={{ borderColor: LINE }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ background: "#EDEAE0" }}>
              {["Category", "Item", "Opening", "Production", "Dispatch/Sales", "Adjustments", "Available", "Min stock", ""].map((h) => (
                <th key={h} className="px-3 py-2 font-semibold text-xs" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.item.id} className="border-t" style={{ borderColor: LINE }}>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2 font-medium">{r.item.name}</td>
                <td className="px-3 py-2 tabular-nums">{r.opening}</td>
                <td className="px-3 py-2 tabular-nums">{r.production}</td>
                <td className="px-3 py-2 tabular-nums">{r.dispatch}</td>
                <td className="px-3 py-2 tabular-nums">{r.adj}</td>
                <td className="px-3 py-2 tabular-nums font-semibold">
                  {r.avail}
                  {minStock[r.item.id] > 0 && r.avail < minStock[r.item.id] && <span className="ml-1"><Badge tone="warn">low</Badge></span>}
                </td>
                <td className="px-3 py-2">
                  <input type="number" value={minStock[r.item.id] ?? ""} placeholder="—" onChange={(e) => setMinStock((p) => ({ ...p, [r.item.id]: parseInt(e.target.value, 10) || 0 }))} className="w-16 h-8 px-2 rounded border text-xs" style={{ borderColor: LINE }} />
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => setShowAdjust(r.item.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: LINE }}>Adjust</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="md:hidden space-y-2">
        {rows.map((r) => (
          <Card key={r.item.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-sm">{r.item.name}</div>
                <div className="text-xs" style={{ color: MUTED }}>{r.category}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold tabular-nums">{r.avail}</div>
                <div className="text-[10px]" style={{ color: MUTED }}>available</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: MUTED }}>
              <div>Opening<div className="font-medium tabular-nums" style={{ color: INK }}>{r.opening}</div></div>
              <div>Production<div className="font-medium tabular-nums" style={{ color: INK }}>{r.production}</div></div>
              <div>Dispatched<div className="font-medium tabular-nums" style={{ color: INK }}>{r.dispatch}</div></div>
            </div>
            <button onClick={() => setShowAdjust(r.item.id)} className="text-xs px-2.5 py-1.5 rounded border mt-3" style={{ borderColor: LINE }}>Adjust stock</button>
          </Card>
        ))}
      </div>

      {showAdjust && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(28,35,51,0.4)" }} onClick={() => setShowAdjust(null)}>
          <div className="w-full max-w-sm rounded-lg p-5" style={{ background: PAPER_RAISED }} onClick={(e) => e.stopPropagation()}>
            <div className="font-semibold mb-3">Adjust stock — {itemById(showAdjust)}</div>
            <div className="flex gap-2 mb-3">
              {["opening", "adjustment"].map((t) => (
                <button key={t} onClick={() => setAdjForm((p) => ({ ...p, type: t }))} className="px-3 py-1.5 rounded-md text-sm font-medium capitalize"
                  style={{ background: adjForm.type === t ? INK : "transparent", color: adjForm.type === t ? "#fff" : MUTED, border: `1px solid ${adjForm.type === t ? INK : LINE}` }}>
                  {t === "opening" ? "Opening stock" : "Adjustment (+/-)"}
                </button>
              ))}
            </div>
            <input type="number" placeholder={adjForm.type === "opening" ? "Opening quantity" : "Quantity (use minus for reduction)"} value={adjForm.qty} onChange={(e) => setAdjForm((p) => ({ ...p, qty: e.target.value }))} className="w-full h-10 px-3 rounded-md border mb-2" style={{ borderColor: LINE }} />
            <input placeholder="Reason (e.g. stock count correction, damage)" value={adjForm.reason} onChange={(e) => setAdjForm((p) => ({ ...p, reason: e.target.value }))} className="w-full h-10 px-3 rounded-md border mb-4" style={{ borderColor: LINE }} />
            <div className="flex gap-2">
              <button onClick={() => setShowAdjust(null)} className="flex-1 h-10 rounded-md border font-medium" style={{ borderColor: LINE }}>Cancel</button>
              <button onClick={() => submitAdjust(showAdjust)} className="flex-1 h-10 rounded-md font-semibold text-white" style={{ background: INK }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== PARTIES ============================== */

function PartiesScreen({ ctx }) {
  const { parties, setParties, orders, addAudit, syncAppend, syncUpdate, syncDelete } = ctx;
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", mobile: "", area: "", address: "" });
  const [openParty, setOpenParty] = useState(null);

  const filtered = parties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  function save() {
    if (!form.name.trim()) return;
    const id = "P" + Date.now().toString().slice(-6);
    const p = { id, ...form, active: true, created: todayStr() };
    setParties((prev) => [...prev, p]);
    syncAppend("PARTIES", [p]);
    addAudit("Added Party", id, form.name);
    setForm({ name: "", contact: "", mobile: "", area: "", address: "" });
    setShowAdd(false);
  }
  function toggleActive(id) {
    setParties((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    const p = parties.find((x) => x.id === id);
    syncUpdate("PARTIES", { id }, { active: !p?.active });
  }
  function deleteParty(id) {
    const p = parties.find((x) => x.id === id);
    if (!window.confirm(`Delete party "${p?.name}"? Their past order history will be kept, but the party record itself will be removed.`)) return;
    setParties((prev) => prev.filter((x) => x.id !== id));
    syncDelete("PARTIES", { id });
    addAudit("Deleted Party", id, p?.name);
    if (openParty === id) setOpenParty(null);
  }

  if (openParty) {
    const p = parties.find((x) => x.id === openParty);
    const partyOrders = orders.filter((o) => o.partyId === openParty);
    const totalPending = partyOrders.reduce((s, o) => s + o.items.reduce((s2, i) => s2 + Math.max(0, i.qty - i.dispatchedQty), 0), 0);
    return (
      <div>
        <button onClick={() => setOpenParty(null)} className="flex items-center gap-1 text-sm font-medium mb-4" style={{ color: ACCENT }}><ChevronLeft size={15} /> All parties</button>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="font-bold text-lg">{p.name}</div>
            <div className="text-sm" style={{ color: MUTED }}>{p.area} {p.mobile && `· ${p.mobile}`}</div>
          </div>
          <button onClick={() => deleteParty(p.id)} className="text-xs px-2.5 py-1.5 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}><Trash2 size={13} /> Delete party</button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total orders" value={partyOrders.length} />
          <StatCard label="Pending qty" value={totalPending} tone={totalPending ? "warn" : "neutral"} />
          <StatCard label="Last order" value={partyOrders[0] ? fmtDate(partyOrders[0].date) : "—"} />
        </div>
        <SectionTitle>Order history</SectionTitle>
        <div className="space-y-2">
          {partyOrders.map((o) => (
            <Card key={o.id}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium tabular-nums">{o.id}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{fmtDate(o.date)} · {o.items.reduce((s, i) => s + i.qty, 0)} units</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle right={<button onClick={() => setShowAdd((s) => !s)} className="px-3 py-1.5 rounded-md text-sm font-semibold text-white flex items-center gap-1" style={{ background: INK }}><Plus size={14} /> Add party</button>}>
        Parties
      </SectionTitle>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parties" className="w-full h-11 pl-9 pr-3 rounded-md border" style={{ borderColor: LINE }} />
      </div>

      {showAdd && (
        <Card className="mb-4">
          <div className="grid md:grid-cols-2 gap-2">
            <input placeholder="Party / shop name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
            <input placeholder="Contact person" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
            <input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
            <input placeholder="Area" value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="h-10 px-3 rounded-md border md:col-span-2" style={{ borderColor: LINE }} />
          </div>
          <button onClick={save} className="h-10 px-4 rounded-md font-semibold text-white mt-3" style={{ background: INK }}>Save party</button>
        </Card>
      )}

      <div className="space-y-2">
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-md border" style={{ borderColor: LINE, background: PAPER_RAISED, opacity: p.active ? 1 : 0.5 }}>
            <button onClick={() => setOpenParty(p.id)} className="text-left flex-1">
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs" style={{ color: MUTED }}>{p.area} {p.mobile && `· ${p.mobile}`}</div>
            </button>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(p.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: LINE }}>{p.active ? "Deactivate" : "Activate"}</button>
              <button onClick={() => deleteParty(p.id)} className="text-xs px-2 py-1 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== ITEMS & CATEGORIES ============================== */

function ItemsScreen({ ctx }) {
  const { categories, items, setCategories, setItems, addAudit, syncAppend, syncUpdate, syncDelete } = ctx;
  const [tab, setTab] = useState("items");
  const [newCat, setNewCat] = useState("");
  const [newItem, setNewItem] = useState({ name: "", categoryId: categories[0]?.id || "" });

  function addCategory() {
    if (!newCat.trim()) return;
    const id = newCat.trim().toUpperCase().replace(/\s+/g, "_");
    const order = categories.length + 1;
    setCategories((prev) => [...prev, { id, name: newCat.trim(), order, active: true }]);
    syncAppend("CATEGORIES", [{ id, name: newCat.trim(), order, active: true }]);
    addAudit("Added Category", id, newCat.trim());
    setNewCat("");
  }
  function toggleCat(id) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    const c = categories.find((x) => x.id === id);
    syncUpdate("CATEGORIES", { id }, { active: !c?.active });
  }
  function deleteCategory(id) {
    const cat = categories.find((c) => c.id === id);
    if (items.some((i) => i.categoryId === id)) {
      alert(`"${cat?.name}" still has items in it. Delete or move those items first.`);
      return;
    }
    if (!window.confirm(`Delete category "${cat?.name}"? This cannot be undone.`)) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    syncDelete("CATEGORIES", { id });
    addAudit("Deleted Category", id, cat?.name);
  }
  function deleteItem(id) {
    const item = items.find((i) => i.id === id);
    if (!window.confirm(`Delete "${item?.name}"? Past production, order and dispatch history will keep showing its name, but it will no longer appear in entry screens.`)) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    syncDelete("ITEMS", { id });
    addAudit("Deleted Item", id, item?.name);
  }
  function addItem() {
    if (!newItem.name.trim() || !newItem.categoryId) return;
    const id = newItem.categoryId + "_" + newItem.name.trim().toUpperCase().replace(/\s+/g, "_");
    const orderN = items.filter((i) => i.categoryId === newItem.categoryId).length + 1;
    const rec = { id, categoryId: newItem.categoryId, name: newItem.name.trim(), order: orderN, active: true };
    setItems((prev) => [...prev, rec]);
    syncAppend("ITEMS", [rec]);
    addAudit("Added Item", id, `${newItem.name.trim()} in ${categories.find((c) => c.id === newItem.categoryId)?.name}`);
    setNewItem({ name: "", categoryId: newItem.categoryId });
  }
  function toggleItem(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    const it = items.find((x) => x.id === id);
    syncUpdate("ITEMS", { id }, { active: !it?.active });
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {[["items", "Items"], ["categories", "Categories"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ background: tab === k ? INK : "transparent", color: tab === k ? "#fff" : MUTED, border: `1px solid ${tab === k ? INK : LINE}` }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "categories" ? (
        <div>
          <Card className="mb-4">
            <div className="flex gap-2">
              <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category name" className="flex-1 h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
              <button onClick={addCategory} className="h-10 px-4 rounded-md font-semibold text-white" style={{ background: INK }}>Add</button>
            </div>
          </Card>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-md border" style={{ borderColor: LINE, background: PAPER_RAISED, opacity: c.active ? 1 : 0.5 }}>
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{items.filter((i) => i.categoryId === c.id).length} items</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleCat(c.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: LINE }}>{c.active ? "Deactivate" : "Activate"}</button>
                  <button onClick={() => deleteCategory(c.id)} className="text-xs px-2 py-1 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Card className="mb-4">
            <div className="grid md:grid-cols-3 gap-2">
              <select value={newItem.categoryId} onChange={(e) => setNewItem((p) => ({ ...p, categoryId: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} placeholder="New item name" className="h-10 px-3 rounded-md border md:col-span-1" style={{ borderColor: LINE }} />
              <button onClick={addItem} className="h-10 px-4 rounded-md font-semibold text-white" style={{ background: INK }}>Add item</button>
            </div>
          </Card>
          {categories.map((c) => (
            <div key={c.id} className="mb-4">
              <div className="text-sm font-semibold mb-2">{c.name}</div>
              <div className="space-y-1.5">
                {items.filter((i) => i.categoryId === c.id).map((i) => (
                  <div key={i.id} className="flex items-center justify-between p-2.5 rounded-md border" style={{ borderColor: LINE, background: PAPER_RAISED, opacity: i.active ? 1 : 0.5 }}>
                    <span className="text-sm">{i.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleItem(i.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: LINE }}>{i.active ? "Deactivate" : "Activate"}</button>
                      <button onClick={() => deleteItem(i.id)} className="text-xs px-2 py-1 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}><Trash2 size={12} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== EMPLOYEES ============================== */

function EmployeesScreen({ ctx }) {
  const { users, setUsers, addAudit, syncAppend, syncUpdate, syncDelete } = ctx;
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "SALES" });

  function addEmployee() {
    if (!form.name || !form.username || !form.password) return;
    const id = "U" + Date.now().toString().slice(-6);
    const rec = { id, ...form, active: true, created: todayStr(), lastLogin: "" };
    setUsers((prev) => [...prev, rec]);
    syncAppend("USERS", [rec]);
    addAudit("Added Employee", id, `${form.name} (${form.role})`);
    setForm({ name: "", username: "", password: "", role: "SALES" });
    setShowAdd(false);
  }
  function toggleActive(id) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
    const u = users.find((x) => x.id === id);
    syncUpdate("USERS", { id }, { active: !u?.active });
  }
  function deleteEmployee(id) {
    if (id === ctx.currentUser.id) { alert("You can't delete the account you're currently logged in as."); return; }
    const u = users.find((x) => x.id === id);
    if (!window.confirm(`Delete employee "${u?.name}"? This removes their login. Their past production, order and dispatch records will be kept.`)) return;
    setUsers((prev) => prev.filter((x) => x.id !== id));
    syncDelete("USERS", { id });
    addAudit("Deleted Employee", id, u?.name);
  }
  function resetPassword(id) {
    const np = prompt("Enter new password for this employee:");
    if (!np) return;
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, password: np } : u)));
    syncUpdate("USERS", { id }, { password: np });
    addAudit("Reset Password", id, "Credential changed by admin");
  }

  return (
    <div>
      <SectionTitle right={<button onClick={() => setShowAdd((s) => !s)} className="px-3 py-1.5 rounded-md text-sm font-semibold text-white flex items-center gap-1" style={{ background: INK }}><Plus size={14} /> Add employee</button>}>
        Employees
      </SectionTitle>

      {showAdd && (
        <Card className="mb-4">
          <div className="grid md:grid-cols-2 gap-2">
            <input placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }}>
              <option value="ADMIN">Admin</option><option value="PRODUCTION">Production</option><option value="SALES">Sales</option><option value="DISPATCH">Dispatch</option>
            </select>
            <input placeholder="Username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
            <input placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="h-10 px-3 rounded-md border" style={{ borderColor: LINE }} />
          </div>
          <button onClick={addEmployee} className="h-10 px-4 rounded-md font-semibold text-white mt-3" style={{ background: INK }}>Save employee</button>
        </Card>
      )}

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-3 rounded-md border flex-wrap gap-2" style={{ borderColor: LINE, background: PAPER_RAISED, opacity: u.active ? 1 : 0.5 }}>
            <div>
              <div className="font-medium text-sm">{u.name}</div>
              <div className="text-xs" style={{ color: MUTED }}>@{u.username} · {ROLE_LABEL[u.role]}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => resetPassword(u.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: LINE }}>Reset password</button>
              <button onClick={() => toggleActive(u.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: LINE }}>{u.active ? "Deactivate" : "Activate"}</button>
              <button onClick={() => deleteEmployee(u.id)} className="text-xs px-2 py-1 rounded border flex items-center gap-1" style={{ borderColor: WARN, color: WARN }}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== REPORTS ============================== */

function ReportsScreen({ ctx }) {
  const { categories, items, production, orders, dispatches, available, openingByItem, productionByItem, dispatchedByItem,
    setPrintDoc, shareWhatsApp, role, currentUser } = ctx;
  const [type, setType] = useState("inventory");
  const [dateFrom, setDateFrom] = useState(todayStr());
  const [dateTo, setDateTo] = useState(todayStr());
  const [catFilter, setCatFilter] = useState("ALL");

  const availableTypes = role === "ADMIN"
    ? [["inventory", "Inventory"], ["production", "Production"], ["sales", "Sales / Dispatch"], ["pending", "Pending orders"]]
    : role === "PRODUCTION" ? [["production", "Production"]]
    : role === "SALES" ? [["sales_orders", "My orders"]]
    : [["sales", "Dispatch"]];

  useEffect(() => { setType(availableTypes[0][0]); }, [role]);

  const inRange = (d) => d >= dateFrom && d <= dateTo;

  let columns = [], rows = [], title = "";

  if (type === "inventory") {
    title = "Inventory Report";
    columns = ["Category", "Item", "Opening", "Production", "Sales/Dispatch", "Available"];
    rows = items.filter((i) => catFilter === "ALL" || i.categoryId === catFilter).map((i) => [
      categories.find((c) => c.id === i.categoryId)?.name, i.name, openingByItem[i.id] || 0, productionByItem[i.id] || 0, dispatchedByItem[i.id] || 0, available(i.id),
    ]);
  } else if (type === "production") {
    title = "Production Report";
    columns = ["Date", "Employee", "Category", "Item", "Quantity"];
    rows = production.filter((p) => inRange(p.date) && (role !== "PRODUCTION" || p.employeeId === currentUser.id))
      .flatMap((p) => p.items.filter((i) => catFilter === "ALL" || i.categoryId === catFilter).map((i) => [
        fmtDate(p.date), p.employeeName, categories.find((c) => c.id === i.categoryId)?.name, items.find((x) => x.id === i.itemId)?.name, i.qty,
      ]));
  } else if (type === "sales" || type === "sales_orders") {
    title = type === "sales" ? "Sales / Dispatch Report" : "My Orders Report";
    columns = ["Date", "Party", "Order ID", "Item", "Ordered", "Dispatched", "Employee"];
    rows = orders.filter((o) => inRange(o.date) && (role !== "SALES" || o.employeeId === currentUser.id))
      .flatMap((o) => o.items.filter((i) => catFilter === "ALL" || i.categoryId === catFilter).map((i) => [
        fmtDate(o.date), o.partyName, o.id, items.find((x) => x.id === i.itemId)?.name, i.qty, i.dispatchedQty, o.employeeName,
      ]));
  } else if (type === "pending") {
    title = "Pending Orders Report";
    columns = ["Party", "Order ID", "Item", "Ordered", "Dispatched", "Pending"];
    rows = orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
      .flatMap((o) => o.items.filter((i) => i.qty - i.dispatchedQty > 0).map((i) => [
        o.partyName, o.id, items.find((x) => x.id === i.itemId)?.name, i.qty, i.dispatchedQty, i.qty - i.dispatchedQty,
      ]));
  }

  const totalQtyCol = columns.length - 1;
  const totalQty = rows.reduce((s, r) => s + (typeof r[totalQtyCol] === "number" ? r[totalQtyCol] : 0), 0);

  return (
    <div>
      <SectionTitle>Reports</SectionTitle>
      <div className="flex gap-2 mb-4 flex-wrap">
        {availableTypes.map(([k, l]) => (
          <button key={k} onClick={() => setType(k)} className="px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ background: type === k ? INK : "transparent", color: type === k ? "#fff" : MUTED, border: `1px solid ${type === k ? INK : LINE}` }}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {type !== "inventory" && type !== "pending" && (
          <>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-10 px-3 rounded-md border text-sm" style={{ borderColor: LINE }} />
            <span className="text-sm" style={{ color: MUTED }}>to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-10 px-3 rounded-md border text-sm" style={{ borderColor: LINE }} />
          </>
        )}
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="h-10 px-3 rounded-md border text-sm" style={{ borderColor: LINE }}>
          <option value="ALL">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => setPrintDoc({ title, meta: [["Date range", `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`]], columns, rows })} className="text-xs px-3 py-2 rounded border flex items-center gap-1" style={{ borderColor: LINE }}>
            <Printer size={13} /> PDF / Print
          </button>
          <button onClick={() => shareWhatsApp(`${title.toUpperCase()}\n\n${rows.slice(0, 25).map((r) => r.join(" — ")).join("\n")}${rows.length > 25 ? `\n…and ${rows.length - 25} more rows` : ""}`)} className="text-xs px-3 py-2 rounded border flex items-center gap-1" style={{ borderColor: LINE }}>
            <MessageCircle size={13} /> WhatsApp
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: LINE }}>
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr style={{ background: "#EDEAE0" }}>
              {columns.map((c) => <th key={c} className="text-left px-3 py-2 text-xs font-semibold" style={{ color: MUTED }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={columns.length} className="text-center py-8 text-sm" style={{ color: MUTED }}>No data for this filter.</td></tr>}
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t" style={{ borderColor: LINE }}>
                {r.map((c, i) => <td key={i} className={`px-3 py-2 ${typeof c === "number" ? "tabular-nums" : ""}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && (
        <div className="text-sm mt-2" style={{ color: MUTED }}>
          {rows.length} rows{typeof rows[0][totalQtyCol] === "number" ? ` · total ${totalQty} units in last column` : ""}
        </div>
      )}
    </div>
  );
}

/* ============================== AUDIT LOG ============================== */

function AuditLogScreen({ ctx }) {
  const { auditLog } = ctx;
  const [search, setSearch] = useState("");
  const filtered = auditLog.filter((a) => (a.user + a.action + a.recordId + a.description).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionTitle>Activity log</SectionTitle>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, action, or record ID" className="w-full h-11 pl-9 pr-3 rounded-md border" style={{ borderColor: LINE }} />
      </div>
      <div className="space-y-2">
        {filtered.map((a, idx) => (
          <div key={idx} className="p-3 rounded-md border flex items-start justify-between gap-3" style={{ borderColor: LINE, background: PAPER_RAISED }}>
            <div>
              <div className="text-sm"><span className="font-semibold">{a.user}</span> <span style={{ color: MUTED }}>({ROLE_LABEL[a.role] || a.role})</span></div>
              <div className="text-sm mt-0.5">{a.action} <span className="tabular-nums" style={{ color: MUTED }}>· {a.recordId}</span></div>
              <div className="text-xs mt-0.5" style={{ color: MUTED }}>{a.description}</div>
            </div>
            <div className="text-xs whitespace-nowrap" style={{ color: MUTED }}>{new Date(a.timestamp).toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== SETTINGS ============================== */

const APPS_SCRIPT_TEMPLATE = `/** ---- CONFIG ---- */
const SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING";

const SHEET_HEADERS = {
  USERS:            ["id","name","username","password","role","active","created","lastLogin"],
  CATEGORIES:       ["id","name","order","active"],
  ITEMS:            ["id","categoryId","name","order","active"],
  PARTIES:          ["id","name","contact","mobile","address","area","active","created"],
  PRODUCTION:       ["recordId","itemId","categoryId","qty","date","time","employeeId","employeeName","timestamp"],
  ORDERS:           ["recordId","itemId","categoryId","qty","dispatchedQty","date","time","employeeId","employeeName","partyId","partyName","status","timestamp"],
  DISPATCH:         ["recordId","orderId","itemId","categoryId","qty","date","time","employeeId","employeeName","partyName","timestamp"],
  STOCK_ADJUSTMENTS:["id","itemId","type","qty","reason","date","employee"],
  AUDIT_LOG:        ["timestamp","user","role","action","recordId","description"],
  SETTINGS:         ["key","value"],
};

function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEET_HEADERS).forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, SHEET_HEADERS[name].length).setValues([SHEET_HEADERS[name]]);
  });
}

function doGet(e) {
  if (e.parameter.token !== SECRET) return json({ error: "Unauthorized" });
  const out = {};
  Object.keys(SHEET_HEADERS).forEach(name => { out[name] = readSheet(name); });
  return json(out);
}

function readSheet(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.token !== SECRET) return json({ error: "Unauthorized" });
  const { action, sheet, rows, match, patch } = body;
  const headers = SHEET_HEADERS[sheet];
  if (!headers) return json({ error: "Unknown sheet: " + sheet });
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet);

  if (action === "append") {
    rows.forEach(rowObj => sh.appendRow(headers.map(h => rowObj[h] ?? "")));
  } else if (action === "delete") {
    deleteRowsWhere(sh, headers, match);
  } else if (action === "update") {
    updateRowsWhere(sh, headers, match, patch);
  } else {
    return json({ error: "Unknown action: " + action });
  }
  return json({ ok: true });
}

function rowMatches(row, headers, match) {
  return Object.keys(match).every(col => {
    const idx = headers.indexOf(col);
    return idx > -1 && String(row[idx]) === String(match[col]);
  });
}

function deleteRowsWhere(sh, headers, match) {
  const values = sh.getDataRange().getValues();
  for (let r = values.length - 1; r >= 1; r--) {
    if (rowMatches(values[r], headers, match)) sh.deleteRow(r + 1);
  }
}

function updateRowsWhere(sh, headers, match, patch) {
  const values = sh.getDataRange().getValues();
  for (let r = 1; r < values.length; r++) {
    if (rowMatches(values[r], headers, match)) {
      Object.keys(patch).forEach(col => {
        const idx = headers.indexOf(col);
        if (idx > -1) sh.getRange(r + 1, idx + 1).setValue(patch[col]);
      });
    }
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}`;

function SettingsScreen({ ctx }) {
  const { businessName, setBusinessName, minStock, items, categories, users, parties, production, orders, dispatches, stockAdj, auditLog,
    sheetsUrl, sheetsToken, sheetsStatus, sheetsError, isConnected, connectSheets, disconnectSheets, logoDataUrl, setLogo, removeLogo } = ctx;
  const [tab, setTab] = useState("general");
  const [urlInput, setUrlInput] = useState(sheetsUrl);
  const [tokenInput, setTokenInput] = useState(sheetsToken);
  const [connecting, setConnecting] = useState(false);

  async function handleConnect() {
    if (!urlInput.trim() || !tokenInput.trim()) return;
    setConnecting(true);
    const ok = await connectSheets(urlInput.trim(), tokenInput.trim());
    setConnecting(false);
    if (ok) {
      alert("Connected! Your data now loads from and saves to this Google Sheet.");
    }
  }

  function handleDisconnect() {
    if (!window.confirm("Disconnect from Google Sheets? The app will go back to using temporary in-browser data until you reconnect.")) return;
    disconnectSheets();
  }

  function exportData() {
    const payload = { categories, items, parties, users: users.map(({ password, ...u }) => u), production, orders, dispatches, stockAdj, auditLog };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `inventory-backup-${todayStr()}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <SectionTitle>Settings</SectionTitle>
      <div className="flex gap-2 mb-5 flex-wrap">
        {[["general", "General"], ["sheets", "Google Sheets"], ["backup", "Backup / export"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ background: tab === k ? INK : "transparent", color: tab === k ? "#fff" : MUTED, border: `1px solid ${tab === k ? INK : LINE}` }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <Card>
          <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>Business name</label>
          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full h-10 px-3 rounded-md border mb-4" style={{ borderColor: LINE }} />

          <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>Logo</label>
          <div className="flex items-center gap-3 mb-4">
            {logoDataUrl ? (
              <img src={logoDataUrl} alt="" className="w-14 h-14 rounded-md object-cover" style={{ border: `1px solid ${LINE}` }} />
            ) : (
              <div className="w-14 h-14 rounded-md flex items-center justify-center" style={{ background: INK }}>
                <Boxes size={20} color="#fff" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="h-9 px-3 rounded-md border font-medium text-sm cursor-pointer inline-flex items-center" style={{ borderColor: LINE }}>
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const smallDataUrl = await resizeImageFile(file);
                      const saved = setLogo(smallDataUrl);
                      if (!saved) alert("That image still couldn't be saved — try a smaller or simpler picture.");
                    } catch (err) {
                      alert(err.message || "Couldn't process that image.");
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              {logoDataUrl && (
                <button onClick={removeLogo} className="h-9 px-3 rounded-md border font-medium text-sm" style={{ borderColor: WARN, color: WARN }}>
                  Remove logo
                </button>
              )}
            </div>
          </div>
          <div className="text-xs mb-4" style={{ color: MUTED }}>
            Shows on the login screen and the loading screen. Saved to this device/browser only — if you use the app on multiple computers, upload it on each one.
          </div>

          <div className="text-xs" style={{ color: MUTED }}>
            Minimum stock levels are set per item from the Inventory screen — they drive the "low stock" flags on the dashboard.
          </div>
        </Card>
      )}

      {tab === "sheets" && (
        <div>
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Connection status</div>
              {isConnected ? <Badge tone="good">Connected</Badge> : <Badge tone="warn">Not connected — using temporary data</Badge>}
            </div>

            <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>Web app URL (from Apps Script → Deploy)</label>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full h-10 px-3 rounded-md border mb-3 text-sm"
              style={{ borderColor: LINE }}
            />
            <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>Secret token (the SECRET value from your Apps Script code)</label>
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="your-secret-token"
              className="w-full h-10 px-3 rounded-md border mb-4 text-sm"
              style={{ borderColor: LINE }}
            />

            {sheetsStatus === "error" && (
              <div className="text-sm mb-3 px-3 py-2 rounded-md flex items-start gap-2" style={{ background: WARN_BG, color: WARN }}>
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <span>Couldn't connect: {sheetsError}. Double check the URL is the full `/exec` link and the token matches exactly what's in your Apps Script code.</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleConnect}
                disabled={connecting || !urlInput.trim() || !tokenInput.trim()}
                className="h-10 px-4 rounded-md font-semibold text-white disabled:opacity-40"
                style={{ background: INK }}
              >
                {connecting ? "Connecting…" : isConnected ? "Reconnect / Test again" : "Connect"}
              </button>
              {isConnected && (
                <button onClick={handleDisconnect} className="h-10 px-4 rounded-md border font-medium" style={{ borderColor: WARN, color: WARN }}>
                  Disconnect
                </button>
              )}
            </div>
          </Card>

          <Card className="mb-4">
            <div className="font-semibold mb-2">Setup guide (do this first, once)</div>
            <ol className="text-sm space-y-1.5 list-decimal pl-4" style={{ color: INK }}>
              <li>Create a new Google Sheet for this business.</li>
              <li>Open Extensions → Apps Script and paste the code below.</li>
              <li>Change the <code>SECRET</code> value at the top to your own password, and run <code>initializeSheets()</code> once — it creates all required tabs with the correct columns.</li>
              <li>Deploy it: Deploy → New deployment → Web app (execute as you, access: anyone with the link).</li>
              <li>Copy the deployment URL and paste it, along with your SECRET, into the two fields above, then click Connect.</li>
            </ol>
          </Card>
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Apps Script backend code</div>
            </div>
            <pre className="text-xs overflow-x-auto p-3 rounded-md" style={{ background: "#12182A", color: "#D9E2F3" }}>{APPS_SCRIPT_TEMPLATE}</pre>
          </Card>
          <div className="text-xs px-3 py-3 rounded-md flex gap-2" style={{ background: ACCENT_BG, color: ACCENT }}>
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>Without a connection, the app runs on temporary in-browser data that resets on refresh — fine for testing, not for real use. Once connected, every screen reads and writes straight to this Sheet, and reconnects automatically next time you open the app on this device.</span>
          </div>
        </div>
      )}

      {tab === "backup" && (
        <Card>
          <div className="font-semibold mb-2">Export current data</div>
          <div className="text-sm mb-4" style={{ color: MUTED }}>Downloads a JSON snapshot of categories, items, parties, production, orders, dispatch and audit log (passwords excluded).</div>
          <button onClick={exportData} className="h-10 px-4 rounded-md font-semibold text-white flex items-center gap-2" style={{ background: INK }}>
            <Download size={16} /> Export as JSON
          </button>
        </Card>
      )}
    </div>
  );
}

/* ============================== PRINT VIEW ============================== */

function PrintView({ doc, businessName, onClose }) {
  return (
    <div className="fixed inset-0 z-50" style={{ background: "#fff" }}>
      <div className="no-print p-3 flex justify-end gap-2 border-b" style={{ borderColor: LINE }}>
        <button onClick={() => window.print()} className="px-3 py-1.5 rounded-md text-sm font-semibold text-white flex items-center gap-1" style={{ background: INK }}>
          <Printer size={14} /> Print / Save as PDF
        </button>
        <button onClick={onClose} className="px-3 py-1.5 rounded-md text-sm font-medium border flex items-center gap-1" style={{ borderColor: LINE }}>
          <X size={14} /> Close
        </button>
      </div>
      <div className="print-area p-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-start border-b pb-4 mb-4" style={{ borderColor: "#000" }}>
          <div>
            <div className="font-bold text-lg">{businessName}</div>
            <div className="text-sm text-gray-600">{doc.title}</div>
          </div>
          <div className="text-right text-xs text-gray-600">Generated {fmtDate(todayStr())}</div>
        </div>
        {doc.meta && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4">
            {doc.meta.map(([k, v]) => (
              <div key={k}><span className="text-gray-500">{k}: </span><span className="font-medium">{v}</span></div>
            ))}
          </div>
        )}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {doc.columns.map((c) => <th key={c} className="text-left border-b-2 border-black py-1.5 pr-3">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {doc.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => <td key={j} className="border-b border-gray-300 py-1.5 pr-3">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-gray-400 mt-6">No prices, rates, or amounts are shown — this report reflects quantities only.</div>
      </div>
    </div>
  );
}