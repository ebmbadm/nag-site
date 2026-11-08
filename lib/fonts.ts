import { Golos_Text } from "next/font/google";

/** Golos Text — the only family of the NAG · NOVIK system (400 / 500 / 600). */
export const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-golos",
  display: "swap",
});

export const fontVariables = golos.variable;
