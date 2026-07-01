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

/**
 * 301 redirect map: legacy novikamps.ru (Joomla, then Tilda) → novikamps.com.
 *
 * novikamps.ru was a second, independently-run site (not a mirror of .com) — the two
 * domains are now being consolidated onto one Next.js deployment, with .ru becoming a
 * pure redirect front. Sources come from the Wayback Machine CDX index (novikamps.ru
 * was never added to this account's Yandex Webmaster, so there's no indexing history
 * there to query — archive.org is the only surviving record of its URL structure).
 *
 * Every entry is scoped with `has: [{ type: "host", value: "novikamps.ru" }]` so it can
 * never fire for novikamps.com requests once both domains point at the same container.
 * Destinations are absolute (cross-domain hop, .ru → .com).
 *
 * Discontinued exact models → /catalog/arhiv (that page's own "current replacement"
 * links resolve any ambiguity between old model numbers). Discontinued product LINES
 * novikamps.com no longer sells at all (speakers, components, mixers, radio-mic
 * systems, resold third-party brands) → /kontakty — there's no page to send them to,
 * a human answering is more honest than a mismatched landing page.
 */
type HostRedirect = {
  source: string;
  destination: string;
  statusCode: 301;
  has: [{ type: "host"; value: string }];
};

function ruRedirect(source: string, destination: string): HostRedirect {
  return {
    source,
    destination,
    statusCode: 301,
    has: [{ type: "host", value: "novikamps.ru" }],
  };
}

const ARCHIVE = "https://novikamps.com/catalog/arhiv";
const CONTACTS = "https://novikamps.com/kontakty";

export const ruLegacyRedirects: HostRedirect[] = [
  // --- history ---
  ruRedirect("/istoriya-kompanii.html", "https://novikamps.com/istoriya"),
  ruRedirect("/istoriya-novik.html", "https://novikamps.com/istoriya"),

  // --- current products (exact model match, all historical Joomla nesting variants) ---
  ruRedirect("/novik-e12.html", "https://novikamps.com/catalog/e12"),
  ruRedirect("/usilitel/lampovye-usiliteli/novik-e12.html", "https://novikamps.com/catalog/e12"),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/novik-e12.html", "https://novikamps.com/catalog/e12"),
  ruRedirect("/usilitel/usiliteli/lampovye-usiliteli/novik-e12.html", "https://novikamps.com/catalog/e12"),

  ruRedirect("/novik-black-fire.html", "https://novikamps.com/catalog/black-fire"),
  ruRedirect("/usilitel/lampovye-usiliteli/novik-black-fire.html", "https://novikamps.com/catalog/black-fire"),
  ruRedirect("/usilitel/usiliteli/lampovye-usiliteli/novik-black-fire.html", "https://novikamps.com/catalog/black-fire"),

  ruRedirect("/novik-bass-tube.html", "https://novikamps.com/catalog/tubes"),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/novik-bass-tube.html", "https://novikamps.com/catalog/tubes"),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli/novik-bass-tube.html", "https://novikamps.com/catalog/tubes"),

  ruRedirect("/redbear-mkx-50.html", "https://novikamps.com/catalog/redbear"),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/redbear-mkx-50.html", "https://novikamps.com/catalog/redbear"),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli/redbear-mkx-50.html", "https://novikamps.com/catalog/redbear"),

  ruRedirect("/nag-qm-400.html", "https://novikamps.com/catalog/qm-400"),
  ruRedirect("/d-8000-wi-fi.html", "https://novikamps.com/catalog/d-8000"),
  ruRedirect("/usilitel/usiliteli/tranzistornye-usiliteli/nagtdhtds.html", "https://novikamps.com/catalog/modules"),

  // --- DSP / processors category ---
  ruRedirect("/comp.html", "https://novikamps.com/catalog/processors"),
  ruRedirect("/dsp.html", "https://novikamps.com/catalog/processors"),
  ruRedirect("/dseries.html", "https://novikamps.com/catalog/processors"),
  ruRedirect("/potsessory-dsp.html", "https://novikamps.com/catalog/processors"),
  ruRedirect("/usilitel/protsessory-dsp.html", "https://novikamps.com/catalog/processors"),
  ruRedirect("/usilitel/usiliteli/tranzistornye-usiliteli/dsp.html", "https://novikamps.com/catalog/processors"),
  ruRedirect("/usilitel/usiliteli/tranzistornye-usiliteli/dseries.html", "https://novikamps.com/catalog/processors"),
  ruRedirect("/usilitel/protsessory-dsp/protsessor-d-factory.html", "https://novikamps.com/catalog/processors"),

  // --- category index pages → current matching category ---
  ruRedirect("/usilitel.html", "https://novikamps.com/catalog/amplifiers"),
  ruRedirect("/usilitel/usiliteli.html", "https://novikamps.com/catalog/amplifiers"),
  ruRedirect("/usilitel/tranzistornye-usiliteli.html", "https://novikamps.com/catalog/amplifiers"),
  ruRedirect("/usilitel/usiliteli/tranzistornye-usiliteli.html", "https://novikamps.com/catalog/amplifiers"),
  ruRedirect("/usilitel/lampovye-usiliteli.html", "https://novikamps.com/catalog/tubes"),
  ruRedirect("/usilitel/usiliteli/lampovye-usiliteli.html", "https://novikamps.com/catalog/tubes"),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli.html", "https://novikamps.com/catalog/tubes"),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli.html", "https://novikamps.com/catalog/tubes"),

  // --- discontinued NAG amps / DSP models → archive ---
  ruRedirect("/nag-mq.html", ARCHIVE),
  ruRedirect("/nag-qm-1.html", ARCHIVE),
  ruRedirect("/nag-qm.html", ARCHIVE),
  ruRedirect("/nag-rf.html", ARCHIVE),
  ruRedirect("/usilitel/protsessory-dsp/nag-rf.html", ARCHIVE),
  ruRedirect("/usilitel/tranzistornye-usiliteli/nag-mq.html", ARCHIVE),
  ruRedirect("/usilitel/tranzistornye-usiliteli/nag-qm.html", ARCHIVE),
  ruRedirect("/usilitel/tranzistornye-usiliteli/nag-rf.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/tranzistornye-usiliteli/nag-mq.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/tranzistornye-usiliteli/nag-qm-1.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/tranzistornye-usiliteli/nag-qm.html", ARCHIVE),

  // --- discontinued NAG portable amps → archive ---
  ruRedirect("/nag-pg31.html", ARCHIVE),
  ruRedirect("/nag-pg32.html", ARCHIVE),
  ruRedirect("/usilitel/portativnye-usiliteli.html", ARCHIVE),
  ruRedirect("/usilitel/portativnye-usiliteli/nag-pg31.html", ARCHIVE),
  ruRedirect("/usilitel/portativnye-usiliteli/nag-pg32.html", ARCHIVE),

  // --- discontinued NOVIK tube models (602/1202/MK-series/NG-1) → archive ---
  // (archive page lists NOVIK 602 explicitly and links current N1202/E12/BLACK FIRE
  // as replacements, so it resolves old-model-number ambiguity better than guessing)
  ruRedirect("/novik-02.html", ARCHIVE),
  ruRedirect("/novik-1202.html", ARCHIVE),
  ruRedirect("/novik-202.html", ARCHIVE),
  ruRedirect("/novik-602.html", ARCHIVE),
  ruRedirect("/novik-mk-6.html", ARCHIVE),
  ruRedirect("/novik-mk25k-mk50k.html", ARCHIVE),
  ruRedirect("/novik-mk60-mk120.html", ARCHIVE),
  ruRedirect("/novik-n602-n1202.html", ARCHIVE),
  ruRedirect("/novik-ng-1.html", ARCHIVE),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/novik-mk-6.html", ARCHIVE),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/novik-mk25k-mk50k.html", ARCHIVE),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/novik-mk60-mk120.html", ARCHIVE),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/novik-n602c-n1202c.html", ARCHIVE),
  ruRedirect("/usilitel/gitarnye-lampovye-usiliteli/novik-ng-1.html", ARCHIVE),
  ruRedirect("/usilitel/lampovye-usiliteli/novik-02.html", ARCHIVE),
  ruRedirect("/usilitel/lampovye-usiliteli/novik-1202.html", ARCHIVE),
  ruRedirect("/usilitel/lampovye-usiliteli/novik-202.html", ARCHIVE),
  ruRedirect("/usilitel/lampovye-usiliteli/novik-602.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli/novik-mk-6.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli/novik-mk25k-mk50k.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli/novik-mk60-mk120.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli/novik-n602c-n1202c.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/gitarnye-lampovye-usiliteli/novik-ng-1.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/lampovye-usiliteli/novik-02.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/lampovye-usiliteli/novik-1202.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/lampovye-usiliteli/novik-202.html", ARCHIVE),
  ruRedirect("/usilitel/usiliteli/lampovye-usiliteli/novik-602.html", ARCHIVE),

  // --- discontinued product lines with no modern equivalent → contacts ---
  // acoustics / speakers
  ruRedirect("/aktivnaya-akustika-novik.html", CONTACTS),
  ruRedirect("/akustika.html", CONTACTS),
  ruRedirect("/akustika/aktivnaya-akustika-novik.html", CONTACTS),
  ruRedirect("/akustika/arkhiv-starykh-modelej.html", CONTACTS),
  ruRedirect("/akustika/obrabotka-zvuka.html", CONTACTS),
  ruRedirect("/akustika/passivnaya-akustika-novik.html", CONTACTS),
  ruRedirect("/arkhivnye-modeli.html", CONTACTS),
  ruRedirect("/obrabotka-zvuka.html", CONTACTS),
  ruRedirect("/passivnaya-akustika-novik.html", CONTACTS),
  ruRedirect("/usilitel/akustika.html", CONTACTS),
  ruRedirect("/usilitel/akustika/aktivnaya-akustika-novik.html", CONTACTS),
  ruRedirect("/usilitel/akustika/arkhiv-starykh-modelej.html", CONTACTS),
  ruRedirect("/usilitel/akustika/passivnaya-akustika-novik.html", CONTACTS),
  ruRedirect("/usilitel/akustika/tda-audio.html", CONTACTS),
  // components / drivers
  ruRedirect("/dinamiki.html", CONTACTS),
  ruRedirect("/komplektuyushchie/dinamiki.html", CONTACTS),
  ruRedirect("/komplektuyushchie/dinamiki/item/51-fatailpro-3f22.html", CONTACTS),
  ruRedirect("/komplektuyushchie/dinamiki/item/52-fatailpro-3f25.html", CONTACTS),
  ruRedirect("/komplektuyushchie/lampovaya-apparatura.html", CONTACTS),
  ruRedirect("/usilitel/komplektuyushchie1/dinamiki.html", CONTACTS),
  ruRedirect("/usilitel/komplektuyushchie1/dinamiki/item/52-fatailpro-3f25.html", CONTACTS),
  ruRedirect("/usilitel/komplektuyushchie1/lampovaya-apparatura.html", CONTACTS),
  // mixers
  ruRedirect("/seriya-ex.html", CONTACTS),
  ruRedirect("/seriya-v.html", CONTACTS),
  ruRedirect("/usb-miksher.html", CONTACTS),
  ruRedirect("/usilitel/mikshernye-pulty.html", CONTACTS),
  ruRedirect("/usilitel/mikshernye-pulty/seriya-ex.html", CONTACTS),
  ruRedirect("/usilitel/mikshernye-pulty/seriya-v.html", CONTACTS),
  ruRedirect("/usilitel/mikshernye-pulty/usb-miksher.html", CONTACTS),
  // radio mic systems
  ruRedirect("/uhf-radiosistemy.html", CONTACTS),
  ruRedirect("/vhf-radiosistemy.html", CONTACTS),
  ruRedirect("/usilitel/radiomikrofony.html", CONTACTS),
  ruRedirect("/usilitel/radiomikrofony/uhf-radiosistemy.html", CONTACTS),
  ruRedirect("/usilitel/radiomikrofony/vhf-radiosistemy.html", CONTACTS),
  // resold third-party brands (never NAG/NOVIK's own product)
  ruRedirect("/cuboturic-12.html", CONTACTS),
  ruRedirect("/dance-energy-dcs-112.html", CONTACTS),
  ruRedirect("/double-loud-horn-115.html", CONTACTS),
  // order / repair-service / support
  ruRedirect("/zakaz.html", CONTACTS),
  ruRedirect("/tekhpodderzhka-i-servis.html", CONTACTS),
  ruRedirect("/novik-labs.html", CONTACTS),
  ruRedirect("/novik-labs/podbor-i-zamena-lamp.html", CONTACTS),
  ruRedirect("/novik-labs/remont-marshall-fender-mesa-i-dr/diagnostika.html", CONTACTS),
  ruRedirect("/novik-labs/remont-marshall-fender-mesa-i-dr/podbor.html", CONTACTS),
  ruRedirect("/novik-labs/remont-marshall-fender-mesa-i-dr/remont.html", CONTACTS),
  ruRedirect("/novik-labs/remont-marshall-fender-mesa-i-dr1.html", CONTACTS),
  ruRedirect("/novik-labs/remont-nag/diagnostika.html", CONTACTS),
  ruRedirect("/novik-labs/remont-nag/remont.html", CONTACTS),
  ruRedirect("/novik-labs/remont-nag/skhemy-nag.html", CONTACTS),
  ruRedirect("/novik-labs/remont-novik-nag.html", CONTACTS),
  ruRedirect("/novik-labs/remont-novik/diagnostika.html", CONTACTS),
  ruRedirect("/novik-labs/remont-novik/podbor.html", CONTACTS),
  ruRedirect("/novik-labs/remont-novik/remont.html", CONTACTS),
  ruRedirect("/novik-labs/remont-novik/skhemy-novik.html", CONTACTS),

  // --- articles / misc → home ---
  ruRedirect("/stati-i-ssylki.html", "https://novikamps.com/"),

  // --- catch-all (MUST stay last): anything else on novikamps.ru → same path on
  //     novikamps.com. Mostly old images/JS/CSS/cache junk with no modern equivalent —
  //     a 301 straight to a 404 there is correct (tells search engines the URL is gone
  //     instead of implying it moved to the homepage). ---
  {
    source: "/:path*",
    destination: "https://novikamps.com/:path*",
    statusCode: 301,
    has: [{ type: "host", value: "novikamps.ru" }],
  },
];
