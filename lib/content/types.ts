/* ============================================================
   Content types — shared shapes for structured page data.
   ============================================================ */

/* ---- History longread (typed data module pattern) ---- */

export type HistoryBlock =
  | { type: "p"; text: string } // supports **bold** inline
  | { type: "quote"; text: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "figure"; src: string; alt: string; caption?: string };

export interface HistoryChapter {
  id: string;
  year: string;
  label: string; // mono eyebrow
  title: string;
  blocks: HistoryBlock[];
}

export interface HistoryHero {
  kicker: string;
  titleLead: string;
  titleAccent: string;
  dropcap: string;
  lead: string; // first paragraph, WITHOUT the dropcap letter
  subLead: string;
  badge?: string;
  portrait: { src?: string; sign: string; caption: string };
}

export interface HistoryContent {
  hero: HistoryHero;
  chapters: HistoryChapter[];
}
