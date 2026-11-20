import type { Piece } from "./types";

function piece(partial: Omit<Piece, "createdAt">): Piece {
  return { ...partial, createdAt: new Date().toISOString() };
}

export const STARTERS: { label: string; prompt: string }[] = [
  { label: "Gym sets and deload", prompt: "Track my gym sets and tell me when to deload" },
  { label: "Split rent", prompt: "Split rent and shared expenses with my roommates" },
  { label: "Plant watering", prompt: "Keep a watering schedule for my plants" },
  { label: "Freelance invoices", prompt: "Track freelance invoices, due dates, and what I've been paid" },
  { label: "Habit streaks", prompt: "Build a habit tracker with streaks" },
];

export const CATALOG: Record<string, Piece> = {
  "Track my gym sets and tell me when to deload": piece({
    id: "lift-log",
    title: "Lift Log",
    description: "Sets, volume, and a simple deload cue.",
    icon: "dumbbell",
    prompt: "Track my gym sets and tell me when to deload",
    assumptions: ["Units: lb", "Deload after three failed attempts", "Week starts Monday"],
    reminder: { title: "Lift day", schedule: "Mon, Wed, Fri · 5:30 PM" },
    today: { title: "Log today's lifts", subtitle: "Weekly goal is 16 sets", action: "Log set" },
    entities: [
      {
        name: "Set",
        fields: [
          { id: "exercise", label: "Exercise", type: "choice", required: true, options: ["Squat", "Bench Press", "Deadlift", "Overhead Press", "Row"] },
          { id: "weight", label: "Weight", type: "number", required: true, unit: "lb" },
          { id: "reps", label: "Reps", type: "integer", required: true },
          { id: "date", label: "Date", type: "date", required: true },
          { id: "notes", label: "Notes", type: "text" },
        ],
      },
    ],
    screens: [
      {
        id: "home",
        title: "Today",
        components: [
          { type: "stats", stats: [{ label: "This week", value: "12", sub: "sets" }, { label: "Volume", value: "18.4k", sub: "lb" }, { label: "Est. 1RM", value: "285", sub: "lb" }] },
          { type: "progress", label: "Weekly goal", value: 12, goal: 16, unit: "sets" },
          { type: "heading", title: "Recent sets" },
          { type: "list", entity: "Set" },
        ],
      },
      { id: "add", title: "Log set", components: [{ type: "form", entity: "Set" }] },
    ],
    records: [
      { exercise: "Bench Press", weight: 185, reps: 5, date: "2026-11-17", notes: "Felt strong" },
      { exercise: "Squat", weight: 225, reps: 5, date: "2026-11-15" },
      { exercise: "Deadlift", weight: 315, reps: 3, date: "2026-11-14" },
    ],
  }),
  "Split rent and shared expenses with my roommates": piece({
    id: "rent-split",
    title: "Roommate Split",
    description: "Shared bills and who is owed what.",
    icon: "home",
    prompt: "Split rent and shared expenses with my roommates",
    assumptions: ["Three roommates", "Rent is $2,400", "Remind on the 1st"],
    reminder: { title: "Rent due", schedule: "1st of the month · 9:00 AM" },
    today: { title: "Settle balances", subtitle: "Net +$83 this month", action: "Open" },
    entities: [
      {
        name: "Expense",
        fields: [
          { id: "description", label: "Description", type: "text", required: true },
          { id: "amount", label: "Amount", type: "number", required: true, unit: "$" },
          { id: "paid_by", label: "Paid by", type: "choice", required: true, options: ["You", "Alex", "Jordan", "Sam"] },
          { id: "date", label: "Date", type: "date", required: true },
          { id: "category", label: "Category", type: "choice", options: ["Rent", "Utilities", "Groceries", "Other"] },
        ],
      },
    ],
    screens: [
      {
        id: "home",
        title: "Balances",
        components: [
          { type: "stats", stats: [{ label: "Owed to you", value: "$128" }, { label: "You owe", value: "$45" }, { label: "Net", value: "+$83" }] },
          { type: "heading", title: "Recent expenses" },
          { type: "list", entity: "Expense" },
        ],
      },
      { id: "add", title: "Add expense", components: [{ type: "form", entity: "Expense" }] },
    ],
    records: [
      { description: "November rent", amount: 2400, paid_by: "You", date: "2026-11-01", category: "Rent" },
      { description: "Electric", amount: 94, paid_by: "Alex", date: "2026-11-05", category: "Utilities" },
      { description: "Groceries", amount: 86, paid_by: "You", date: "2026-11-12", category: "Groceries" },
    ],
  }),
  "Keep a watering schedule for my plants": piece({
    id: "plant-care",
    title: "Plant Care",
    description: "Who needs water, and when.",
    icon: "sprout",
    prompt: "Keep a watering schedule for my plants",
    assumptions: ["Morning reminders", "Track last watered"],
    reminder: { title: "Water plants", schedule: "Daily · 9:00 AM" },
    today: { title: "Water the Monstera", subtitle: "Due today", action: "Mark watered" },
    entities: [
      {
        name: "Plant",
        fields: [
          { id: "name", label: "Name", type: "text", required: true },
          { id: "location", label: "Location", type: "text" },
          { id: "every", label: "Water every (days)", type: "integer", required: true },
          { id: "last", label: "Last watered", type: "date", required: true },
        ],
      },
    ],
    screens: [
      {
        id: "home",
        title: "Plants",
        components: [
          { type: "stats", stats: [{ label: "Plants", value: "3" }, { label: "Due", value: "1" }, { label: "Overdue", value: "0" }] },
          { type: "heading", title: "Schedule" },
          { type: "list", entity: "Plant" },
        ],
      },
      { id: "add", title: "Add plant", components: [{ type: "form", entity: "Plant" }] },
    ],
    records: [
      { name: "Monstera", location: "Living room", every: 7, last: "2026-11-12" },
      { name: "Snake plant", location: "Bedroom", every: 14, last: "2026-11-05" },
      { name: "Pothos", location: "Kitchen", every: 5, last: "2026-11-16" },
    ],
  }),
  "Track freelance invoices, due dates, and what I've been paid": piece({
    id: "invoices",
    title: "Invoice Tracker",
    description: "What is out, what is late, what landed.",
    icon: "receipt",
    prompt: "Track freelance invoices, due dates, and what I've been paid",
    assumptions: ["Currency: USD", "Default terms: Net 15"],
    reminder: { title: "Follow up", schedule: "Mondays · 10:00 AM" },
    today: { title: "One invoice is overdue", subtitle: "Northwind Labs · $2,400", action: "Follow up" },
    entities: [
      {
        name: "Invoice",
        fields: [
          { id: "client", label: "Client", type: "text", required: true },
          { id: "amount", label: "Amount", type: "number", required: true, unit: "$" },
          { id: "due", label: "Due", type: "date", required: true },
          { id: "status", label: "Status", type: "choice", required: true, options: ["Draft", "Sent", "Paid", "Overdue"] },
          { id: "note", label: "Note", type: "text" },
        ],
      },
    ],
    screens: [
      {
        id: "home",
        title: "Overview",
        components: [
          { type: "stats", stats: [{ label: "Outstanding", value: "$4.2k" }, { label: "Paid", value: "$950" }, { label: "Overdue", value: "1" }] },
          { type: "heading", title: "Invoices" },
          { type: "list", entity: "Invoice" },
        ],
      },
      { id: "add", title: "New invoice", components: [{ type: "form", entity: "Invoice" }] },
    ],
    records: [
      { client: "Acme Design", amount: 1800, due: "2026-11-16", status: "Sent", note: "Brand refresh" },
      { client: "Northwind Labs", amount: 2400, due: "2026-11-04", status: "Overdue", note: "Dashboard" },
      { client: "Bright Spark", amount: 950, due: "2026-11-23", status: "Paid", note: "Landing page" },
    ],
  }),
  "Build a habit tracker with streaks": piece({
    id: "habits",
    title: "Habit Streaks",
    description: "Daily habits, checked off as you go.",
    icon: "flame",
    prompt: "Build a habit tracker with streaks",
    assumptions: ["Reset at midnight", "Streaks shown on the row"],
    reminder: { title: "Evening check-in", schedule: "Daily · 8:00 PM" },
    today: { title: "Two habits left today", subtitle: "Read · Deep work", action: "Check in" },
    entities: [
      {
        name: "Habit",
        fields: [
          { id: "name", label: "Habit", type: "text", required: true },
          { id: "streak", label: "Streak", type: "integer", required: true },
        ],
      },
    ],
    screens: [
      {
        id: "home",
        title: "Today",
        components: [
          { type: "stats", stats: [{ label: "Habits", value: "4" }, { label: "Done", value: "2" }, { label: "Best", value: "21" }] },
          { type: "heading", title: "Today" },
          { type: "checklist", entity: "Habit" },
        ],
      },
      { id: "add", title: "New habit", components: [{ type: "form", entity: "Habit" }] },
    ],
    records: [
      { name: "Morning stretch", streak: 12, done: true },
      { name: "Read 20 pages", streak: 5, done: false },
      { name: "No sugar", streak: 8, done: true },
      { name: "Deep work block", streak: 3, done: false },
    ],
  }),
};

export function matchCatalog(prompt: string): Piece | null {
  const lower = prompt.toLowerCase();
  for (const key of Object.keys(CATALOG)) {
    if (lower.includes(key.toLowerCase().slice(0, 22))) return structuredClone(CATALOG[key]);
  }
  if (/gym|lift|deload|squat|bench/.test(lower)) return structuredClone(CATALOG[Object.keys(CATALOG)[0]]);
  if (/rent|roommate|split/.test(lower)) return structuredClone(CATALOG[Object.keys(CATALOG)[1]]);
  if (/plant|water/.test(lower)) return structuredClone(CATALOG[Object.keys(CATALOG)[2]]);
  if (/invoice|freelance|client/.test(lower)) return structuredClone(CATALOG[Object.keys(CATALOG)[3]]);
  if (/habit|streak/.test(lower)) return structuredClone(CATALOG[Object.keys(CATALOG)[4]]);
  return null;
}
