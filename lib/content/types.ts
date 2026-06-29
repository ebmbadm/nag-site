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

/* ---- Company & legal (P3) ---- */

export interface ContactsContent {
  eyebrow: string;
  title: string;
  lede: string;
  phone: { display: string; href: string };
  email: { display: string; href: string };
  address: { lines: string[] };
  form: { title: string; note: string; disabled: true };
}

export interface GuaranteeContent {
  hero: { eyebrow: string; title: string; lede: string };
  terms: { value: string; label: string }[];
  service: { eyebrow: string; title: string; blocks: HistoryBlock[] };
  cta: { text: string; href: string; label: string };
}

export interface CompanyHubCard {
  kicker: string;
  title: string;
  text: string;
  href: string;
}

export interface CompanyHubContent {
  eyebrow: string;
  title: string;
  lede: string;
  cards: CompanyHubCard[];
  stat: { value: string; label: string };
}

/* ---- Tubes boutique (P3) ---- */

export interface BoutiqueCta { label: string; href: string }
export interface BoutiqueFeature { title: string }
export interface BoutiqueAreaCard { title: string; text: string; href: string }
export interface BoutiqueCustom { title: string; body: string[]; cta: BoutiqueCta }
export interface BoutiquePage {
  slug: "boutique" | "savers" | "converters";
  eyebrow: string;
  title: string;
  lede: string;
  hero?: { src: string; alt: string; caption?: string };
  heroDark?: { src: string; alt: string };
  features?: { title: string; items: BoutiqueFeature[] };
  areaCards?: BoutiqueAreaCard[];
  custom?: BoutiqueCustom;
  cta: BoutiqueCta;
}
