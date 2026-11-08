import { legacyFontVariables } from "@/components/history/legacy/fonts";

/** «История» keeps its pre-redesign visual layer by owner's decision (2026-11-08). */
export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <div className={`legacy ${legacyFontVariables}`}>{children}</div>;
}
