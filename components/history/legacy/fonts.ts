import { Oswald, JetBrains_Mono } from "next/font/google";

/* Frozen «История» typography — loaded only on /istoriya (see app/istoriya/layout.tsx). */
const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const legacyFontVariables = `${oswald.variable} ${jetbrainsMono.variable}`;
