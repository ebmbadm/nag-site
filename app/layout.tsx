import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://novikamps.com"),
  title: {
    default: "NAG · NOVIK — профессиональное звуковое оборудование",
    template: "%s — NAG · NOVIK",
  },
  description:
    "Производство, продажа и сервис профессионального звукового оборудования: DSP-процессоры, усилители мощности, ламповые усилители. На рынке с 1992 года.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "NAG · NOVIK",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body className="bg-noise flex min-h-screen flex-col">
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
