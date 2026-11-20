import { createServerFn } from "@tanstack/react-start";
import type { Piece } from "./types";

const SYSTEM = `You design one small personal app as JSON only. No markdown.
Schema:
{
  "title": string,
  "description": string (one sentence),
  "icon": one of dumbbell|home|sprout|receipt|flame|calendar|wallet|heart|book|briefcase,
  "assumptions": string[] (2-4 short chips),
  "reminder": { "title": string, "schedule": string } or null,
  "today": { "title": string, "subtitle": string, "action": string },
  "entities": [{ "name": string, "fields": [{ "id": string, "label": string, "type": "text"|"number"|"integer"|"date"|"choice", "required": boolean, "options": string[]?, "unit": string? }] }],
  "screens": [{ "id": string, "title": string, "components": Component[] }],
  "records": object[] (3-5 sample rows using field ids)
}
Component is one of:
{"type":"stats","stats":[{"label","value","sub"?}]}
{"type":"progress","label","value":number,"goal":number,"unit"?}
{"type":"heading","title"}
{"type":"list","entity"}
{"type":"checklist","entity"}
{"type":"form","entity"}
Rules: at most 2 screens and 1 entity. First screen shows data. Second screen is a form. Include sample records so lists look alive. Prefer fewer fields.`;

export const generatePiece = createServerFn({ method: "POST" })
  .validator((input: { prompt: string }) => {
    const prompt = String(input?.prompt ?? "").trim().slice(0, 400);
    if (prompt.length < 4) throw new Error("Describe what you need in a sentence.");
    return { prompt };
  })
  .handler(async ({ data }): Promise<{ ok: true; piece: Piece } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Generation is unavailable right now." };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 1400,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (!res.ok) return { ok: false, error: `Could not generate (${res.status}).` };

    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content ?? "";
    const piece = parsePiece(text, data.prompt);
    if (!piece) return { ok: false, error: "The draft was not usable. Try a more specific need." };
    return { ok: true, piece };
  });

function parsePiece(text: string, prompt: string): Piece | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const title = str(o.title);
  if (!title) return null;
  const entities = Array.isArray(o.entities) ? o.entities : [];
  const screens = Array.isArray(o.screens) ? o.screens : [];
  if (!entities.length || !screens.length) return null;

  const icons = ["dumbbell", "home", "sprout", "receipt", "flame", "calendar", "wallet", "heart", "book", "briefcase"] as const;
  const icon = icons.includes(o.icon as (typeof icons)[number]) ? (o.icon as (typeof icons)[number]) : "briefcase";

  const reminder =
    o.reminder && typeof o.reminder === "object"
      ? {
          title: str((o.reminder as Record<string, unknown>).title) || "Reminder",
          schedule: str((o.reminder as Record<string, unknown>).schedule) || "Daily",
        }
      : undefined;

  const todayObj = (o.today && typeof o.today === "object" ? o.today : {}) as Record<string, unknown>;

  return {
    id: crypto.randomUUID(),
    title,
    description: str(o.description) || "A small app for one job.",
    icon,
    assumptions: Array.isArray(o.assumptions) ? o.assumptions.map(str).filter(Boolean).slice(0, 5) : [],
    entities: entities.slice(0, 2) as Piece["entities"],
    screens: screens.slice(0, 3) as Piece["screens"],
    reminder,
    records: Array.isArray(o.records) ? (o.records as Piece["records"]).slice(0, 8) : [],
    today: {
      title: str(todayObj.title) || title,
      subtitle: str(todayObj.subtitle) || "Open to use it",
      action: str(todayObj.action) || "Open",
    },
    createdAt: new Date().toISOString(),
    prompt,
  };
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
