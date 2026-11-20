export const ICON_KEYS = [
  "dumbbell",
  "home",
  "sprout",
  "receipt",
  "flame",
  "calendar",
  "wallet",
  "heart",
  "book",
  "briefcase",
] as const;

export type IconKey = (typeof ICON_KEYS)[number];

export type FieldType = "text" | "number" | "integer" | "date" | "choice";

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  unit?: string;
};

export type Entity = {
  name: string;
  fields: Field[];
};

export type Stat = { label: string; value: string; sub?: string };

export type PieceComponent =
  | { type: "stats"; stats: Stat[] }
  | { type: "progress"; label: string; value: number; goal: number; unit?: string }
  | { type: "heading"; title: string }
  | { type: "list"; entity: string }
  | { type: "checklist"; entity: string }
  | { type: "form"; entity: string };

export type Screen = {
  id: string;
  title: string;
  components: PieceComponent[];
};

export type RecordRow = Record<string, string | number | boolean>;

export type Piece = {
  id: string;
  title: string;
  description: string;
  icon: IconKey;
  assumptions: string[];
  entities: Entity[];
  screens: Screen[];
  reminder?: { title: string; schedule: string };
  records: RecordRow[];
  today: { title: string; subtitle: string; action: string };
  createdAt: string;
  prompt: string;
};
