import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  Dumbbell,
  Flame,
  HeartPulse,
  House,
  Layers,
  Plus,
  Receipt,
  Sprout,
  Trash2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { STARTERS, matchCatalog } from "@/lib/morphic/catalog";
import { generatePiece } from "@/lib/morphic/generate";
import type { Field, IconKey, Piece, PieceComponent, RecordRow, Screen } from "@/lib/morphic/types";

const KEY = "morphic.pieces.v1";

const ICONS: Record<IconKey, LucideIcon> = {
  dumbbell: Dumbbell,
  home: House,
  sprout: Sprout,
  receipt: Receipt,
  flame: Flame,
  calendar: CalendarDays,
  wallet: Wallet,
  heart: HeartPulse,
  book: BookOpen,
  briefcase: Briefcase,
};

type View = "home" | "library" | "create" | "generating" | "piece";

export function MorphicApp() {
  const [ready, setReady] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [view, setView] = useState<View>("create");
  const [prompt, setPrompt] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState("Reading the request");
  const [chips, setChips] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [edit, setEdit] = useState("");
  const [showSpec, setShowSpec] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Piece[];
        if (Array.isArray(parsed) && parsed.length) {
          setPieces(parsed);
          setView("home");
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(pieces));
  }, [pieces, ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (showSpec) {
        setShowSpec(false);
        return;
      }
      if (view === "piece") setView("library");
      else if (view === "create" || view === "generating") setView(pieces.length ? "home" : "library");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, pieces.length, showSpec]);

  const open = pieces.find((p) => p.id === openId) ?? null;
  const dateLabel = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    [],
  );

  function go(next: View) {
    setNote("");
    setShowSpec(false);
    setView(next);
  }

  function openPiece(id: string) {
    setOpenId(id);
    setTab(0);
    setShowSpec(false);
    setView("piece");
  }

  function updatePiece(id: string, fn: (p: Piece) => Piece) {
    setPieces((list) => list.map((p) => (p.id === id ? fn(p) : p)));
  }

  async function start() {
    const text = prompt.trim();
    if (text.length < 4) return;
    setChips([]);
    setStatus("Reading the request");
    setView("generating");

    const steps = [
      ["Sketching the data", 700],
      ["Laying out screens", 800],
      ["Checking it holds together", 600],
    ] as const;
    for (const [label, ms] of steps) {
      setStatus(label);
      await wait(ms);
    }

    const known = matchCatalog(text);
    let piece: Piece | null = known;
    if (!piece) {
      setStatus("Writing a new Piece");
      try {
        const result = await generatePiece({ data: { prompt: text } });
        if (result.ok) piece = result.piece;
        else setNote(result.error);
      } catch {
        setNote("Generation failed. Try one of the examples, or a shorter request.");
      }
    }
    if (!piece) {
      setView("create");
      return;
    }
    piece = {
      ...piece,
      id: crypto.randomUUID(),
      prompt: text,
      createdAt: new Date().toISOString(),
    };
    (piece.assumptions ?? []).forEach((a, i) => {
      window.setTimeout(() => setChips((c) => [...c, a]), i * 120);
    });
    await wait(500 + (piece.assumptions?.length ?? 0) * 120);
    setPieces((list) => [piece!, ...list.filter((p) => p.id !== piece!.id)]);
    setPrompt("");
    setOpenId(piece.id);
    setTab(0);
    setView("piece");
  }

  function removeOpen() {
    if (!open) return;
    setPieces((list) => list.filter((p) => p.id !== open.id));
    setOpenId(null);
    setView("library");
  }

  function addRow(piece: Piece, row: RecordRow) {
    updatePiece(piece.id, (p) => ({ ...p, records: [row, ...p.records] }));
    setTab(0);
    setNote("Saved.");
  }

  function toggleDone(piece: Piece, index: number) {
    updatePiece(piece.id, (p) => ({
      ...p,
      records: p.records.map((r, i) => (i === index ? { ...r, done: !r.done } : r)),
    }));
  }

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button type="button" onClick={() => go(pieces.length ? "home" : "create")} className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-fg text-sm font-semibold text-bg">M</span>
            <span className="font-display text-xl leading-none tracking-tight">Morphic</span>
          </button>
          <nav className="flex items-center gap-1 text-sm">
            <NavButton active={view === "home"} onClick={() => go("home")}>
              Today
            </NavButton>
            <NavButton active={view === "library"} onClick={() => go("library")}>
              Library
            </NavButton>
            <button
              type="button"
              onClick={() => go("create")}
              className="ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-bg"
            >
              <Plus className="size-4" />
              New
            </button>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-8">
        {view === "home" && (
          <section>
            <p className="text-sm text-faint">{dateLabel}</p>
            <h1 className="mt-1 font-display text-4xl tracking-tight">Today</h1>
            {pieces.length === 0 ? (
              <Empty
                title="Nothing waiting"
                body="A Piece you create shows up here as the one thing worth doing."
                action="Create a Piece"
                onClick={() => go("create")}
              />
            ) : (
              <ul className="mt-8 grid gap-3 md:grid-cols-2">
                {pieces.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openPiece(p.id)}
                      className="flex w-full items-center gap-4 rounded-card border border-line bg-surface p-4 text-left transition hover:border-accent/50"
                    >
                      <IconTile icon={p.icon} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{p.today.title}</span>
                        <span className="block truncate text-sm text-muted">{p.today.subtitle}</span>
                      </span>
                      <span className="shrink-0 text-sm text-accent">{p.today.action}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {view === "library" && (
          <section>
            <h1 className="font-display text-4xl tracking-tight">Library</h1>
            <p className="mt-1 text-sm text-muted">
              {pieces.length} {pieces.length === 1 ? "Piece" : "Pieces"}
            </p>
            {pieces.length === 0 ? (
              <Empty title="No Pieces yet" body="Describe one job. Morphic turns it into a small app." action="New Piece" onClick={() => go("create")} />
            ) : (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pieces.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openPiece(p.id)}
                      className="flex h-full w-full flex-col rounded-card border border-line bg-surface p-5 text-left transition hover:-translate-y-0.5 hover:border-accent/40"
                    >
                      <IconTile icon={p.icon} />
                      <span className="mt-4 font-display text-2xl leading-tight">{p.title}</span>
                      <span className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</span>
                      <span className="mt-4 text-xs uppercase tracking-wide text-faint">
                        {p.screens.length} screens · {p.records.length} entries
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {view === "create" && (
          <section className="mx-auto max-w-xl pt-6 text-center md:pt-16">
            <h1 className="font-display text-5xl leading-none tracking-tight md:text-6xl">What do you need?</h1>
            <p className="mx-auto mt-4 max-w-sm text-muted">One sentence. A small app, built for that job only.</p>
            <div className="relative mt-8 text-left">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void start();
                  }
                }}
                rows={3}
                placeholder="Track mileage for the truck and flag when an oil change is due"
                className="w-full resize-none rounded-card border border-line bg-surface px-5 py-4 text-lg outline-none placeholder:text-faint focus:border-accent"
              />
              <button
                type="button"
                onClick={() => void start()}
                className="absolute bottom-3 right-3 min-h-11 rounded-full bg-accent px-4 text-sm font-medium text-bg"
              >
                Generate
              </button>
            </div>
            {note && <p className="mt-3 text-sm text-danger">{note}</p>}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setPrompt(s.prompt)}
                  className="rounded-full border border-line px-3 py-2 text-sm text-muted hover:border-accent/50 hover:text-fg"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {view === "generating" && (
          <section className="mx-auto max-w-md pt-24 text-center">
            <p className="font-display text-3xl">{status}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {chips.map((c) => (
                <span key={c} className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent">
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {view === "piece" && open && (
          <PieceView
            piece={open}
            tab={tab}
            setTab={setTab}
            showSpec={showSpec}
            setShowSpec={setShowSpec}
            note={note}
            edit={edit}
            setEdit={setEdit}
            onBack={() => go("library")}
            onDelete={removeOpen}
            onAdd={(row) => addRow(open, row)}
            onToggle={(i) => toggleDone(open, i)}
            onEdit={() => {
              if (!edit.trim()) return;
              setNote(`Noted: “${edit.trim()}”. Surgical edits come next.`);
              setEdit("");
            }}
          />
        )}
      </main>
    </div>
  );
}

function PieceView({
  piece,
  tab,
  setTab,
  showSpec,
  setShowSpec,
  note,
  edit,
  setEdit,
  onBack,
  onDelete,
  onAdd,
  onToggle,
  onEdit,
}: {
  piece: Piece;
  tab: number;
  setTab: (n: number) => void;
  showSpec: boolean;
  setShowSpec: (v: boolean) => void;
  note: string;
  edit: string;
  setEdit: (v: string) => void;
  onBack: () => void;
  onDelete: () => void;
  onAdd: (row: RecordRow) => void;
  onToggle: (index: number) => void;
  onEdit: () => void;
}) {
  const screen = piece.screens[tab] ?? piece.screens[0];
  return (
    <section className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <IconTile icon={piece.icon} />
          <div>
            <h1 className="font-display text-4xl leading-none tracking-tight">{piece.title}</h1>
            <p className="mt-2 text-sm text-muted">{piece.description}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => setShowSpec(!showSpec)} className="min-h-11 rounded-lg px-3 text-sm text-muted hover:bg-surface">
            Spec
          </button>
          <button type="button" onClick={onDelete} aria-label="Delete Piece" className="grid size-11 place-items-center rounded-lg text-faint hover:text-danger">
            <Trash2 className="size-4" />
          </button>
          <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm text-muted">
            <ArrowLeft className="size-4" />
            Library
          </button>
        </div>
      </div>

      {piece.assumptions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {piece.assumptions.map((a) => (
            <span key={a} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
              {a}
            </span>
          ))}
        </div>
      )}

      {piece.reminder && (
        <p className="mt-4 text-sm text-faint">
          {piece.reminder.title} · {piece.reminder.schedule}
        </p>
      )}

      {showSpec ? (
        <pre className="mt-6 max-h-96 overflow-auto rounded-card border border-line bg-surface p-4 text-xs leading-relaxed text-muted">
          {JSON.stringify({ ...piece, records: `${piece.records.length} rows` }, null, 2)}
        </pre>
      ) : (
        <div className="mt-6 overflow-hidden rounded-card border border-line bg-surface">
          <div className="flex border-b border-line">
            {piece.screens.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setTab(i)}
                className={`min-h-11 px-4 text-sm ${i === tab ? "border-b-2 border-accent text-fg" : "text-muted"}`}
              >
                {s.title}
              </button>
            ))}
          </div>
          <div className="p-5">{screen && <ScreenBody screen={screen} piece={piece} onAdd={onAdd} onToggle={onToggle} />}</div>
        </div>
      )}

      <form
        className="mt-4 flex items-center gap-2 rounded-card border border-line bg-surface px-3"
        onSubmit={(e) => {
          e.preventDefault();
          onEdit();
        }}
      >
        <span className="text-sm text-faint">Change</span>
        <input
          value={edit}
          onChange={(e) => setEdit(e.target.value)}
          placeholder="Add a notes field, drop weekend reminders…"
          className="min-h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
        />
        <button type="submit" className="text-sm text-accent">
          Apply
        </button>
      </form>
      {note && <p className="mt-2 text-sm text-muted">{note}</p>}
    </section>
  );
}

function ScreenBody({
  screen,
  piece,
  onAdd,
  onToggle,
}: {
  screen: Screen;
  piece: Piece;
  onAdd: (row: RecordRow) => void;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="space-y-5">
      {screen.components.map((c, i) => (
        <ComponentView key={i} component={c} piece={piece} onAdd={onAdd} onToggle={onToggle} />
      ))}
    </div>
  );
}

function ComponentView({
  component,
  piece,
  onAdd,
  onToggle,
}: {
  component: PieceComponent;
  piece: Piece;
  onAdd: (row: RecordRow) => void;
  onToggle: (index: number) => void;
}) {
  if (component.type === "stats") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {component.stats.slice(0, 3).map((s) => (
          <div key={s.label} className="rounded-xl bg-surface-2 px-2 py-3 text-center">
            <div className="font-display text-2xl">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-faint">{s.label}</div>
          </div>
        ))}
      </div>
    );
  }
  if (component.type === "progress") {
    const pct = Math.max(0, Math.min(100, Math.round((component.value / Math.max(component.goal, 1)) * 100)));
    const r = 28;
    const c = 2 * Math.PI * r;
    return (
      <div className="flex items-center gap-4">
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" className="text-line" strokeWidth="6" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct / 100)}
          />
        </svg>
        <div>
          <div className="font-medium">{component.label}</div>
          <div className="text-sm text-muted">
            {component.value} / {component.goal} {component.unit ?? ""}
          </div>
        </div>
      </div>
    );
  }
  if (component.type === "heading") {
    return <h2 className="text-xs font-medium uppercase tracking-widest text-faint">{component.title}</h2>;
  }
  if (component.type === "list" || component.type === "checklist") {
    if (!piece.records.length) return <p className="py-8 text-center text-sm text-muted">Nothing logged yet.</p>;
    return (
      <ul className="divide-y divide-line">
        {piece.records.map((row, i) => (
          <li key={i}>
            {component.type === "checklist" ? (
              <button type="button" onClick={() => onToggle(i)} className="flex w-full items-center gap-3 py-3 text-left">
                <span className={`grid size-6 place-items-center rounded-full border ${row.done ? "border-accent bg-accent text-bg" : "border-line"}`}>
                  {row.done ? <Check className="size-3.5" /> : null}
                </span>
                <span className={row.done ? "text-muted line-through" : ""}>{titleOf(row)}</span>
                <span className="ml-auto text-sm text-faint">{subtitleOf(row)}</span>
              </button>
            ) : (
              <div className="flex items-baseline justify-between gap-4 py-3">
                <div>
                  <div className="font-medium">{titleOf(row)}</div>
                  <div className="text-sm text-muted">{subtitleOf(row)}</div>
                </div>
                <div className="text-xs text-faint">{String(row.date || row.due || row.last || "")}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (component.type === "form") {
    const entity = piece.entities.find((e) => e.name === component.entity) ?? piece.entities[0];
    if (!entity) return null;
    return <EntryForm fields={entity.fields} onSave={onAdd} label={entity.name} />;
  }
  return null;
}

function EntryForm({ fields, onSave, label }: { fields: Field[]; onSave: (row: RecordRow) => void; label: string }) {
  const [values, setValues] = useState<RecordRow>({});
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(values);
        setValues({});
      }}
    >
      {fields.map((f) => (
        <label key={f.id} className="block text-sm">
          <span className="mb-1 block text-muted">
            {f.label}
            {f.required ? " *" : ""}
          </span>
          {f.type === "choice" ? (
            <select
              className="min-h-11 w-full rounded-xl border border-line bg-bg px-3"
              value={String(values[f.id] ?? "")}
              onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
            >
              <option value="">Select</option>
              {(f.options ?? []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type === "date" ? "date" : f.type === "number" || f.type === "integer" ? "number" : "text"}
              value={values[f.id] === undefined ? "" : String(values[f.id])}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  [f.id]: f.type === "number" || f.type === "integer" ? Number(e.target.value) : e.target.value,
                }))
              }
              className="min-h-11 w-full rounded-xl border border-line bg-bg px-3 outline-none focus:border-accent"
            />
          )}
        </label>
      ))}
      <button type="submit" className="min-h-11 w-full rounded-xl bg-accent font-medium text-bg">
        Save {label}
      </button>
    </form>
  );
}

function IconTile({ icon }: { icon: IconKey }) {
  const Icon = ICONS[icon] ?? Layers;
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-lg px-3 text-sm ${active ? "bg-surface text-fg" : "text-muted hover:text-fg"}`}
    >
      {children}
    </button>
  );
}

function Empty({ title, body, action, onClick }: { title: string; body: string; action: string; onClick: () => void }) {
  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-muted">{body}</p>
      <button type="button" onClick={onClick} className="mt-6 min-h-11 rounded-full bg-accent px-5 text-sm font-medium text-bg">
        {action}
      </button>
    </div>
  );
}

function titleOf(row: RecordRow) {
  return String(row.exercise || row.name || row.description || row.client || row.title || "Entry");
}

function subtitleOf(row: RecordRow) {
  if (row.weight) return `${row.weight} lb × ${row.reps ?? ""}`;
  if (row.amount) return `$${row.amount} · ${row.paid_by || row.status || ""}`;
  if (row.every) return `Every ${row.every} days · ${row.location || ""}`;
  if (row.streak !== undefined) return `${row.streak} day streak`;
  if (row.status) return String(row.status);
  return "";
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
