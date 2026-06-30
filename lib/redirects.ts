/**
 * 301 redirect map: legacy Tilda site → new Next.js routes (novikamps.com).
 *
 * The site is being replatformed on the SAME domain; Tilda slugs differ from the
 * new routes, so every valuable old URL must 301 to its new equivalent or the
 * existing Yandex/Google rankings (many at position 1–3) are lost.
 *
 * Targets verified against `content/products/*.mdx` frontmatter and `app/` routes.
 *
 * We use `statusCode: 301` (NOT Next's `permanent: true`, which emits 308). Yandex —
 * ~58% of this site's organic — officially relies on 301 for redirect/mirror склейка;
 * 308 is treated less predictably. Google handles both equally. Do not switch to
 * `permanent: true`.
 *
 * Order matters: Next.js evaluates top-to-bottom, so exact paths must precede the
 * `:path*` catch-alls.  `/` is intentionally absent (it stays).
 */
type TildaRedirect = { source: string; destination: string; statusCode: 301 };

export const tildaRedirects: TildaRedirect[] = [
  // --- high-value product pages ---
  { source: "/modules", destination: "/catalog/modules", statusCode: 301 },
  { source: "/td-series", destination: "/catalog/td-series", statusCode: 301 },
  { source: "/d8000", destination: "/catalog/d-8000", statusCode: 301 },
  { source: "/n1202", destination: "/catalog/n1202", statusCode: 301 },
  { source: "/qm400", destination: "/catalog/qm-400", statusCode: 301 },
  { source: "/cx-series", destination: "/catalog/cx-series", statusCode: 301 },
  { source: "/e12", destination: "/catalog/e12", statusCode: 301 },
  { source: "/black-fire", destination: "/catalog/black-fire", statusCode: 301 },
  { source: "/therogue", destination: "/catalog/the-rogue", statusCode: 301 },
  { source: "/tdx", destination: "/catalog/tdx", statusCode: 301 },
  { source: "/redbear", destination: "/catalog/redbear", statusCode: 301 },
  { source: "/dspd8", destination: "/catalog/d-8", statusCode: 301 },
  { source: "/dspd4", destination: "/catalog/d-4", statusCode: 301 },
  { source: "/f8000", destination: "/catalog/f-8", statusCode: 301 },
  { source: "/f8wifi", destination: "/catalog/f-8", statusCode: 301 },

  // --- category pages ---
  { source: "/tubes", destination: "/catalog/tubes", statusCode: 301 },
  { source: "/transistors", destination: "/catalog/amplifiers", statusCode: 301 },
  { source: "/converters", destination: "/catalog/converters", statusCode: 301 },
  { source: "/savers", destination: "/catalog/savers", statusCode: 301 },
  { source: "/dsp", destination: "/catalog/processors", statusCode: 301 },
  { source: "/f-series", destination: "/catalog/processors", statusCode: 301 },
  { source: "/F-series", destination: "/catalog/processors", statusCode: 301 },
  { source: "/bt", destination: "/catalog/f-8", statusCode: 301 },

  // --- info pages ---
  { source: "/history", destination: "/istoriya", statusCode: 301 },
  { source: "/History.html", destination: "/istoriya", statusCode: 301 },
  { source: "/contacts", destination: "/kontakty", statusCode: 301 },
  { source: "/contact", destination: "/kontakty", statusCode: 301 },
  { source: "/about", destination: "/o-kompanii", statusCode: 301 },
  { source: "/guarantee", destination: "/garantiya", statusCode: 301 },

  // --- menu / variant duplicates ---
  { source: "/modules_menu", destination: "/catalog/modules", statusCode: 301 },
  { source: "/moduli-dlja-akusticheskih-sistem-tds-tdh", destination: "/catalog/modules", statusCode: 301 },
  { source: "/tdseries", destination: "/catalog/td-series", statusCode: 301 },
  { source: "/nag-td100", destination: "/catalog/td-series", statusCode: 301 },
  { source: "/novik-mkx50", destination: "/catalog/redbear", statusCode: 301 },
  { source: "/novik-e12", destination: "/catalog/e12", statusCode: 301 },
  { source: "/tranzistornye-usiliteli", destination: "/catalog/amplifiers", statusCode: 301 },
  { source: "/md-serija", destination: "/catalog/amplifiers", statusCode: 301 },

  // --- historical (were indexed; clear target) ---
  { source: "/novik-n1202", destination: "/catalog/n1202", statusCode: 301 },
  { source: "/d8000-wi-fi", destination: "/catalog/d-8000", statusCode: 301 },
  { source: "/qm400-new", destination: "/catalog/qm-400", statusCode: 301 },
  { source: "/amplifier/valve.html", destination: "/catalog/tubes", statusCode: 301 },
  { source: "/comp.html", destination: "/catalog/processors", statusCode: 301 },
  { source: "/novik-bass-tube.html", destination: "/catalog/tubes", statusCode: 301 },
  { source: "/for-english-customers", destination: "/", statusCode: 301 },

  // --- Tilda internal category ids (low confidence; best-guess category) ---
  { source: "/c5", destination: "/catalog/processors", statusCode: 301 },
  { source: "/c17", destination: "/catalog/amplifiers", statusCode: 301 },
  { source: "/c18", destination: "/catalog/amplifiers", statusCode: 301 },
  { source: "/c31", destination: "/catalog/tubes", statusCode: 301 },
  { source: "/c42", destination: "/catalog/savers", statusCode: 301 },
  { source: "/c43", destination: "/catalog/converters", statusCode: 301 },
  { source: "/gruppa-7", destination: "/catalog/amplifiers", statusCode: 301 },
  { source: "/gruppa-5", destination: "/catalog/amplifiers", statusCode: 301 },

  // --- legacy Tilda auto page ids → home ---
  { source: "/page41123043.html", destination: "/", statusCode: 301 },
  { source: "/page41116171.html", destination: "/", statusCode: 301 },
  { source: "/page41412146.html", destination: "/", statusCode: 301 },
  { source: "/page41117185.html", destination: "/", statusCode: 301 },

  // --- request ("купить в 1 клик") landings: recover to the specific product where
  //     the model is identifiable from the Tilda slug, else fall through to contacts ---
  { source: "/rqst/tproduct/683581485-569525105351-usilitel-4h-kanalnii-nag-qm-400", destination: "/catalog/qm-400", statusCode: 301 },
  { source: "/rqst/tproduct/683581485-638422933081-usilitel-2h-kanalnii-nag-td-80", destination: "/catalog/td-series", statusCode: 301 },
  { source: "/rqst/tproduct/683581485-553318788701-usilitel-2h-kanalnii-nag-td-100", destination: "/catalog/td-series", statusCode: 301 },
  { source: "/rqst/tproduct/683581485-307685278171-protsessor-dsp-nag-d-8000-wi-fi", destination: "/catalog/d-8000", statusCode: 301 },
  { source: "/rqst/tproduct/683581485-595957017681-protsessor-2x44h8-dsp-by-nag-d4d8", destination: "/catalog/processors", statusCode: 301 },
  { source: "/rqst/tproduct/683581485-507150866581-usilitel-4h-kanalnii-amp-by-nag-dsp-seri", destination: "/catalog/processors", statusCode: 301 },
  { source: "/rqst", destination: "/kontakty", statusCode: 301 },

  // --- store / system prefixes (catch-alls — MUST stay after the exact paths above) ---
  { source: "/savers/tproduct/:path*", destination: "/catalog/savers", statusCode: 301 },
  { source: "/converters/tproduct/:path*", destination: "/catalog/converters", statusCode: 301 },
  { source: "/rqst/tproduct/:path*", destination: "/kontakty", statusCode: 301 },
  { source: "/tilda/product/detail/:path*", destination: "/catalog/savers", statusCode: 301 },
];
