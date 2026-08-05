/**
 * Yandex Metrika counter for novikamps.com.
 *
 * The counter existed on the old Tilda site and kept its history; the Next
 * replatform shipped without it, so it went dark in July 2026. Direct campaigns
 * need it back — auto-strategies, retargeting and conversion reporting all key
 * off this ID.
 *
 * Rendered as a plain inline <script> rather than next/script so the tag is in
 * the server-rendered HTML and fires before hydration.
 */
export const METRIKA_ID = 94760065;

const INIT = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${METRIKA_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`;

export function YandexMetrika() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INIT }} />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

/** Fire a Metrika goal. No-op when the counter has not loaded (adblock, SSR). */
export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const ym = (window as unknown as { ym?: (...a: unknown[]) => void }).ym;
  ym?.(METRIKA_ID, "reachGoal", goal, params);
}
