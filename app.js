const KEY = "morphic.pieces.v1";
const ICONS = {
  dumbbell: '<path d="M6 10v4M10 8v8M14 6v12M18 8v8M22 10v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  home: '<path d="M4 12 12 5l8 7v7H4v-7z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  sprout: '<path d="M12 20V10M12 12c-4-1-6-4-6-7 4 0 7 2 8 5 2-1 5-1 7 0-1 4-4 6-7 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  receipt: '<path d="M7 4h10v16l-2-1-2 1-2-1-2 1-2-1V4z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  flame: '<path d="M12 21c4 0 6-3 6-6 0-4-3-5-3-8-2 2-3 3-4 3 0-3-1-5-3-7 0 4-2 5-2 8 0 5 3 10 6 10z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  briefcase: '<path d="M4 9h16v10H4zM9 9V7h6v2" fill="none" stroke="currentColor" stroke-width="1.7"/>',
};

const STARTERS = [
  ["Gym sets and deload", "Track my gym sets and tell me when to deload"],
  ["Split rent", "Split rent and shared expenses with my roommates"],
  ["Plant watering", "Keep a watering schedule for my plants"],
  ["Freelance invoices", "Track freelance invoices, due dates, and what I've been paid"],
  ["Habit streaks", "Build a habit tracker with streaks"],
];

const CATALOG = {
  gym: piece("Lift Log", "Sets, volume, and a simple deload cue.", "dumbbell", "Track my gym sets and tell me when to deload", ["Units: lb", "Deload after three failed attempts"], { title: "Lift day", schedule: "Mon, Wed, Fri · 5:30 PM" }, { title: "Log today's lifts", subtitle: "Weekly goal is 16 sets", action: "Log set" }, "Set", [{ id: "exercise", label: "Exercise", type: "choice", options: ["Squat", "Bench Press", "Deadlift", "Overhead Press", "Row"] }, { id: "weight", label: "Weight", type: "number" }, { id: "reps", label: "Reps", type: "integer" }, { id: "date", label: "Date", type: "date" }], [{ type: "stats", stats: [{ label: "This week", value: "0" }, { label: "Volume", value: "0" }, { label: "Est. 1RM", value: "—" }] }, { type: "progress", label: "Weekly goal", value: 0, goal: 16, unit: "sets" }, { type: "heading", title: "Recent sets" }, { type: "list" }], [{ exercise: "Bench Press", weight: 185, reps: 5, date: "2026-11-17" }, { exercise: "Squat", weight: 225, reps: 5, date: "2026-11-15" }, { exercise: "Deadlift", weight: 315, reps: 3, date: "2026-11-14" }]),
  rent: piece("Roommate Split", "Shared bills and who is owed what.", "home", "Split rent and shared expenses with my roommates", ["Three roommates", "Rent is $2,400"], { title: "Rent due", schedule: "1st of the month" }, { title: "Settle balances", subtitle: "Shared expenses", action: "Open" }, "Expense", [{ id: "description", label: "Description", type: "text" }, { id: "amount", label: "Amount", type: "number" }, { id: "paid_by", label: "Paid by", type: "choice", options: ["You", "Alex", "Jordan", "Sam"] }, { id: "date", label: "Date", type: "date" }], [{ type: "stats", stats: [{ label: "Entries", value: "0" }, { label: "Owed", value: "$0" }, { label: "Net", value: "$0" }] }, { type: "heading", title: "Recent expenses" }, { type: "list" }], [{ description: "November rent", amount: 2400, paid_by: "You", date: "2026-11-01" }, { description: "Electric", amount: 94, paid_by: "Alex", date: "2026-11-05" }]),
  plants: piece("Plant Care", "Who needs water, and when.", "sprout", "Keep a watering schedule for my plants", ["Morning reminders"], { title: "Water plants", schedule: "Daily · 9:00 AM" }, { title: "Check the plants", subtitle: "Due today", action: "Open" }, "Plant", [{ id: "name", label: "Name", type: "text" }, { id: "location", label: "Location", type: "text" }, { id: "every", label: "Every (days)", type: "integer" }, { id: "last", label: "Last watered", type: "date" }], [{ type: "stats", stats: [{ label: "Plants", value: "0" }, { label: "Due", value: "0" }, { label: "Overdue", value: "0" }] }, { type: "heading", title: "Schedule" }, { type: "list" }], [{ name: "Monstera", location: "Living room", every: 7, last: "2026-11-12" }, { name: "Snake plant", location: "Bedroom", every: 14, last: "2026-11-05" }]),
  invoices: piece("Invoice Tracker", "What is out, what is late, what landed.", "receipt", "Track freelance invoices, due dates, and what I've been paid", ["Currency: USD", "Net 15"], { title: "Follow up", schedule: "Mondays · 10:00 AM" }, { title: "Review invoices", subtitle: "Outstanding work", action: "Open" }, "Invoice", [{ id: "client", label: "Client", type: "text" }, { id: "amount", label: "Amount", type: "number" }, { id: "due", label: "Due", type: "date" }, { id: "status", label: "Status", type: "choice", options: ["Draft", "Sent", "Paid", "Overdue"] }], [{ type: "stats", stats: [{ label: "Outstanding", value: "$0" }, { label: "Paid", value: "$0" }, { label: "Invoices", value: "0" }] }, { type: "heading", title: "Invoices" }, { type: "list" }], [{ client: "Northwind Labs", amount: 2400, due: "2026-11-04", status: "Overdue" }, { client: "Bright Spark", amount: 950, due: "2026-11-23", status: "Paid" }]),
  habits: piece("Habit Streaks", "Daily habits, checked off as you go.", "flame", "Build a habit tracker with streaks", ["Reset at midnight"], { title: "Evening check-in", schedule: "Daily · 8:00 PM" }, { title: "Check in", subtitle: "Habits left today", action: "Open" }, "Habit", [{ id: "name", label: "Habit", type: "text" }, { id: "streak", label: "Streak", type: "integer" }], [{ type: "stats", stats: [{ label: "Habits", value: "0" }, { label: "Done", value: "0" }, { label: "Best", value: "0" }] }, { type: "heading", title: "Today" }, { type: "checklist" }], [{ name: "Morning stretch", streak: 12, done: true }, { name: "Read 20 pages", streak: 5, done: false }, { name: "Deep work block", streak: 3, done: false }]),
};

function piece(title, description, icon, prompt, assumptions, reminder, today, entity, fields, components, records) {
  return {
    title, description, icon, prompt, assumptions, reminder, today, records,
    entities: [{ name: entity, fields }],
    screens: [
      { id: "home", title: "Overview", components },
      { id: "add", title: "Add", components: [{ type: "form" }] },
    ],
  };
}

let pieces = [];
let view = "create";
let openId = null;
let tab = 0;
let prompt = "";
let note = "";
let edit = "";

try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      pieces = parsed;
      view = "home";
    }
  }
} catch { /* ignore */ }

function save() { localStorage.setItem(KEY, JSON.stringify(pieces)); }
function icon(name) {
  return `<span class="icon"><svg width="22" height="22" viewBox="0 0 24 24">${ICONS[name] || ICONS.briefcase}</svg></span>`;
}
function esc(s) { return String(s ?? "").replace(/&/g, String.fromCharCode(38)+"amp;").replace(/</g, String.fromCharCode(38)+"lt;").replace(/>/g, String.fromCharCode(38)+"gt;").replace(/"/g, String.fromCharCode(38)+"quot;"); }
function titleOf(row) { return row.exercise || row.name || row.description || row.client || "Entry"; }
function subOf(row) {
  if (row.weight) return `${row.weight} lb × ${row.reps ?? ""}`;
  if (row.amount) return `$${row.amount} · ${row.paid_by || row.status || ""}`;
  if (row.every) return `Every ${row.every} days · ${row.location || ""}`;
  if (row.streak != null) return `${row.streak} day streak`;
  return row.status || row.location || "";
}
function match(text) {
  const q = text.toLowerCase();
  if (/gym|lift|deload|squat|bench/.test(q)) return structuredClone(CATALOG.gym);
  if (/rent|roommate|split/.test(q)) return structuredClone(CATALOG.rent);
  if (/plant|water/.test(q)) return structuredClone(CATALOG.plants);
  if (/invoice|freelance|client/.test(q)) return structuredClone(CATALOG.invoices);
  if (/habit|streak/.test(q)) return structuredClone(CATALOG.habits);
  return null;
}
function fallback(text) {
  const title = text.slice(0, 42);
  return piece(title, "A small log for this one job.", "briefcase", text, ["Kept on this device"], null, { title, subtitle: "Add the first entry", action: "Open" }, "Entry", [{ id: "name", label: "Name", type: "text" }, { id: "note", label: "Note", type: "text" }, { id: "date", label: "Date", type: "date" }], [{ type: "stats", stats: [{ label: "Entries", value: "0" }] }, { type: "heading", title: "Entries" }, { type: "list" }], []);
}
function liveStats(p, stats) {
  const n = p.records.length;
  const done = p.records.filter((r) => r.done).length;
  const volume = p.records.reduce((s, r) => s + Number(r.weight || 0) * Number(r.reps || 0), 0);
  const money = p.records.reduce((s, r) => s + Number(r.amount || 0), 0);
  return stats.map((s) => {
    const label = s.label.toLowerCase();
    if (volume && label.includes("volume")) return { ...s, value: volume >= 1000 ? `${(volume / 1000).toFixed(1)}k` : String(volume) };
    if (money && /owed|outstanding|paid|net/.test(label)) return { ...s, value: label.includes("paid") ? `$${p.records.filter((r) => r.status === "Paid").reduce((a, r) => a + Number(r.amount || 0), 0)}` : `$${money}` };
    if (label.includes("done")) return { ...s, value: String(done) };
    if (/week|plant|habit|invoice|entr|set/.test(label)) return { ...s, value: String(n) };
    return s;
  });
}

const app = document.getElementById("app");

function render() {
  document.querySelectorAll("[data-nav]").forEach((b) => b.classList.toggle("on", b.dataset.nav === view));
  const open = pieces.find((p) => p.id === openId);
  if (view === "home") app.innerHTML = home();
  else if (view === "library") app.innerHTML = library();
  else if (view === "create") app.innerHTML = create();
  else if (view === "piece" && open) app.innerHTML = pieceView(open);
  else app.innerHTML = create();
  bind();
}

function home() {
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  if (!pieces.length) return `<p class="date">${date}</p><h1>Today</h1><div class="empty"><h1>Nothing waiting</h1><p>A Piece you create shows up here.</p><button class="primary" data-nav="create">Create a Piece</button></div>`;
  return `<p class="date">${date}</p><h1>Today</h1><div class="grid two">${pieces.map((p) => `<button class="card" data-open="${p.id}">${icon(p.icon)}<span><b>${esc(p.today.title)}</b><span class="sub">${esc(p.today.subtitle)}</span></span><span class="action">${esc(p.today.action)}</span></button>`).join("")}</div>`;
}
function library() {
  if (!pieces.length) return `<h1>Library</h1><div class="empty"><p>No Pieces yet.</p><button class="primary" data-nav="create">New Piece</button></div>`;
  return `<h1>Library</h1><p class="sub">${pieces.length} ${pieces.length === 1 ? "Piece" : "Pieces"}</p><div class="grid three">${pieces.map((p) => `<button class="card stack" data-open="${p.id}">${icon(p.icon)}<b style="font-family:var(--display);font-size:26px;font-weight:500">${esc(p.title)}</b><span>${esc(p.description)}</span><span class="meta">${p.records.length} entries</span></button>`).join("")}</div>`;
}
function create() {
  return `<section class="center"><h1>What do you need?<span class="rule"></span></h1><p class="lede">One sentence. A small app, built for that job only.</p><div class="composer" style="padding:16px;margin-top:28px"><textarea id="prompt" placeholder="Track mileage for the truck and flag when an oil change is due">${esc(prompt)}</textarea><div class="row"><button class="primary" id="go">Generate</button></div></div>${note ? `<p class="note danger">${esc(note)}</p>` : ""}<div class="chips">${STARTERS.map(([label, text]) => `<button class="chip" data-prompt="${esc(text)}">${esc(label)}</button>`).join("")}</div></section>`;
}
function pieceView(p) {
  const screen = p.screens[tab] || p.screens[0];
  return `<section class="piece"><div class="piece-head"><div style="display:flex;gap:12px">${icon(p.icon)}<div><h1>${esc(p.title)}</h1><p class="sub">${esc(p.description)}</p></div></div><button class="chip" id="del">Delete</button></div><div class="chips" style="justify-content:flex-start">${(p.assumptions || []).map((a) => `<span class="chip">${esc(a)}</span>`).join("")}</div>${p.reminder ? `<p class="sub">${esc(p.reminder.title)} · ${esc(p.reminder.schedule)}</p>` : ""}<div class="tabs">${p.screens.map((s, i) => `<button class="${i === tab ? "on" : ""}" data-tab="${i}">${esc(s.title)}</button>`).join("")}</div><div style="padding-top:8px">${screen.components.map((c) => component(c, p)).join("")}</div><form class="change card" id="edit-form"><span class="sub">Change</span><input id="edit" value="${esc(edit)}" placeholder="Rename to Truck log" /><button class="action" type="submit">Apply</button></form>${note ? `<p class="note">${esc(note)}</p>` : ""}</section>`;
}
function component(c, p) {
  if (c.type === "stats") {
    const stats = liveStats(p, c.stats).slice(0, 3);
    return `<div class="stats">${stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>`;
  }
  if (c.type === "progress") {
    const value = p.records.length;
    const pct = Math.max(0, Math.min(100, Math.round((value / c.goal) * 100)));
    const r = 28, circ = 2 * Math.PI * r;
    return `<div class="ring"><svg width="72" height="72" viewBox="0 0 72 72" style="transform:rotate(-90deg)"><circle cx="36" cy="36" r="${r}" fill="none" stroke="#2a292d" stroke-width="6"/><circle cx="36" cy="36" r="${r}" fill="none" stroke="#2dd4bf" stroke-width="6" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct / 100)}"/></svg><div><b>${esc(c.label)}</b><div class="sub">${value} / ${c.goal} ${esc(c.unit || "")}</div></div></div>`;
  }
  if (c.type === "heading") return `<h2 class="kicker">${esc(c.title)}</h2>`;
  if (c.type === "list") {
    if (!p.records.length) return `<p class="sub">Nothing logged yet.</p>`;
    return `<ul class="list">${p.records.map((row) => `<li><div><b>${esc(titleOf(row))}</b><div class="sub">${esc(subOf(row))}</div></div><span class="sub">${esc(row.date || row.due || row.last || "")}</span></li>`).join("")}</ul>`;
  }
  if (c.type === "checklist") {
    return `<ul class="list">${p.records.map((row, i) => `<li><button class="check" data-toggle="${i}"><span class="box ${row.done ? "on" : ""}">${row.done ? "✓" : ""}</span><span class="${row.done ? "done" : ""}">${esc(titleOf(row))}</span><span class="action">${esc(subOf(row))}</span></button></li>`).join("")}</ul>`;
  }
  if (c.type === "form") return form(p);
  return "";
}
function form(p) {
  const fields = p.entities[0].fields;
  return `<form id="entry">${fields.map((f) => `<label><span>${esc(f.label)}</span>${f.type === "choice" ? `<select name="${f.id}"><option value="">Select</option>${(f.options || []).map((o) => `<option>${esc(o)}</option>`).join("")}</select>` : `<input name="${f.id}" type="${f.type === "date" ? "date" : f.type === "text" ? "text" : "number"}" />`}</label>`).join("")}<button class="primary wide" type="submit">Save ${esc(p.entities[0].name)}</button></form>`;
}

function bind() {
  document.querySelectorAll("[data-nav]").forEach((b) => b.onclick = () => { note = ""; view = b.dataset.nav; render(); });
  document.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => { openId = b.dataset.open; tab = 0; note = ""; view = "piece"; render(); });
  document.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => { tab = Number(b.dataset.tab); render(); });
  document.querySelectorAll("[data-prompt]").forEach((b) => b.onclick = () => { prompt = b.dataset.prompt; render(); });
  document.querySelectorAll("[data-toggle]").forEach((b) => b.onclick = () => {
    const p = pieces.find((x) => x.id === openId);
    const i = Number(b.dataset.toggle);
    p.records[i].done = !p.records[i].done;
    save(); render();
  });
  const go = document.getElementById("go");
  const box = document.getElementById("prompt");
  if (box) box.oninput = () => { prompt = box.value; };
  if (go) go.onclick = generate;
  if (box) box.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } };
  const entry = document.getElementById("entry");
  if (entry) entry.onsubmit = (e) => {
    e.preventDefault();
    const p = pieces.find((x) => x.id === openId);
    const row = {};
    new FormData(entry).forEach((v, k) => { row[k] = v; });
    if (!Object.values(row).some((v) => String(v).trim())) return;
    p.records.unshift(row);
    tab = 0; note = "Saved."; save(); render();
  };
  const del = document.getElementById("del");
  if (del) del.onclick = () => { pieces = pieces.filter((p) => p.id !== openId); openId = null; view = "library"; save(); render(); };
  const editForm = document.getElementById("edit-form");
  if (editForm) editForm.onsubmit = (e) => {
    e.preventDefault();
    const text = document.getElementById("edit").value.trim();
    const p = pieces.find((x) => x.id === openId);
    if (!text || !p) return;
    const rename = text.match(/^(?:rename(?: it)? to|call it)\s+(.+)$/i);
    if (rename) { p.title = rename[1].trim(); p.today.title = p.title; note = `Renamed to ${p.title}.`; }
    else if (/note/i.test(text) && !p.entities[0].fields.some((f) => f.id === "notes")) { p.entities[0].fields.push({ id: "notes", label: "Notes", type: "text" }); note = "Added a notes field."; }
    else if (/^remind/i.test(text)) { p.reminder = { title: "Reminder", schedule: text }; note = "Reminder updated."; }
    else { p.assumptions = [...(p.assumptions || []), text].slice(0, 6); note = "Assumption saved."; }
    edit = ""; save(); render();
  };
}
function generate() {
  const text = prompt.trim();
  if (text.length < 4) { note = "Describe what you need in a sentence."; render(); return; }
  const made = match(text) || fallback(text);
  made.id = crypto.randomUUID();
  made.createdAt = new Date().toISOString();
  pieces.unshift(made);
  prompt = ""; note = ""; openId = made.id; tab = 0; view = "piece";
  save(); render();
}
document.getElementById("brand").onclick = () => { view = pieces.length ? "home" : "create"; note = ""; render(); };
render();
