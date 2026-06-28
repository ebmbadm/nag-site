import { Oswald, Golos_Text, JetBrains_Mono } from "next/font/google";

/** Display / industrial condensed — headings, product names, large numerals. */
export const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

/** Body — Cyrillic-optimized grotesque. */
export const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-golos",
  display: "swap",
});

/** Mono — specs, part numbers, readouts, eyebrow labels. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** All three font CSS-variable classes, for the <html> element. */
export const fontVariables = `${oswald.variable} ${golos.variable} ${jetbrainsMono.variable}`;
