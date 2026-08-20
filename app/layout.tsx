import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { YandexMetrika } from "@/components/analytics/yandex-metrika";
import { organizationSchema, webSiteSchema } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://novikamps.com"),
  title: {
    default: "NAG · NOVIK — профессиональное звуковое оборудование",
    template: "%s — NAG · NOVIK",
  },
  description:
    "Профессиональное звуковое оборудование NAG · NOVIK: DSP-процессоры, усилители мощности, ламповые усилители. Компания NAG создана в 1992 году.",
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
        <YandexMetrika />
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
