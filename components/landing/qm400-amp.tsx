"use client";

import * as React from "react";

const W = 660;
const H = 158;
const D = 220;
const hZ = D / 2;
const hW = W / 2;
const hH = H / 2;

const CSS = `
.qm-scene{ perspective:1600px; perspective-origin:52% 38%; width:100%;
  display:flex; align-items:center; justify-content:center; padding:34px 0 18px; }
.qm-pivot{ position:relative; transform-style:preserve-3d; }
.qm{ position:relative; width:${W}px; height:${H}px; transform-style:preserve-3d;
  transform:rotateX(8deg) rotateY(-22deg); will-change:transform; }
.qm__f{ position:absolute; top:50%; left:50%; }
.qm__front{ width:${W}px; height:${H}px; transform:translate(-50%,-50%) translateZ(${hZ}px);
  border-radius:6px; overflow:hidden; border:1px solid #000;
  background:linear-gradient(180deg,#26282c,#141518 16%,#101113 84%,#0a0b0d);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10), inset 0 -2px 6px rgba(0,0,0,.5); }
.qm__back{ width:${W}px; height:${H}px; transform:translate(-50%,-50%) translateZ(-${hZ}px) rotateY(180deg);
  background:#0a0b0d; border-radius:6px; }
.qm__right{ width:${D}px; height:${H}px; transform:translate(-50%,-50%) rotateY(90deg) translateZ(${hW}px);
  background:linear-gradient(90deg,#070809,#1b1d21 55%,#0c0d0f);
  background-image:repeating-linear-gradient(90deg,#0a0b0d 0 7px,#202327 8px,#0a0b0d 10px);
  border-top:1px solid #2a2d31; }
.qm__left{ width:${D}px; height:${H}px; transform:translate(-50%,-50%) rotateY(-90deg) translateZ(${hW}px);
  background:linear-gradient(90deg,#0c0d0f,#1a1c20);
  background-image:repeating-linear-gradient(90deg,#0a0b0d 0 7px,#1c1e22 8px,#0a0b0d 10px); }
.qm__top{ width:${W}px; height:${D}px; transform:translate(-50%,-50%) rotateX(90deg) translateZ(${hH}px);
  background:linear-gradient(180deg,#34373c,#1a1c1f 60%,#141518);
  background-image:repeating-linear-gradient(90deg,#16181b 0 3px,#2c2f34 5px,#16181b 7px); }
.qm__bottom{ width:${W}px; height:${D}px; transform:translate(-50%,-50%) rotateX(-90deg) translateZ(${hH}px);
  background:#070809; }
.qm-shadow{ position:absolute; left:50%; bottom:-30px; width:${W - 30}px; height:54px;
  transform:translateX(-50%) rotateX(74deg); z-index:-1; filter:blur(11px);
  background:radial-gradient(ellipse,rgba(0,0,0,.6),transparent 70%); }
.qm-ear{ position:absolute; top:0; bottom:0; width:30px;
  background:linear-gradient(90deg,#0a0b0d,#26282c 45%,#15171a);
  border-right:1px solid #000; }
.qm-ear--l{ left:0; border-radius:6px 0 0 6px; }
.qm-ear--r{ right:0; border-left:1px solid #000; border-right:0; border-radius:0 6px 6px 0;
  background:linear-gradient(90deg,#15171a,#26282c 55%,#0a0b0d); }
.qm-eslot{ position:absolute; left:50%; transform:translateX(-50%); width:9px; height:15px; border-radius:5px;
  background:radial-gradient(circle at 40% 30%,#000,#070809); box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 1px 0 rgba(255,255,255,.05); }
.qm-grille{ position:absolute; top:13px; bottom:13px; border-radius:4px;
  background-color:#191b1f;
  background-image:radial-gradient(circle,#050506 0 2px,transparent 2.4px);
  background-size:7px 7px; background-position:0 0;
  box-shadow:inset 0 2px 9px rgba(0,0,0,.85), inset 0 0 0 1px #000, inset 0 -1px 0 rgba(255,255,255,.04); }
.qm-grille--l{ left:38px; right:calc(50% + 132px); }
.qm-grille--r{ right:38px; left:calc(50% + 132px); }
.qm-panel{ position:absolute; top:9px; bottom:9px; left:50%; transform:translateX(-50%); width:250px;
  border-radius:5px; padding:9px 12px 8px;
  background:linear-gradient(180deg,#202227,#121316 70%,#0d0e10); border:1px solid #000;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07), inset 0 0 0 1px rgba(0,0,0,.4); }
.qm-logo{ display:flex; align-items:center; justify-content:center; gap:6px; height:17px; }
.qm-logo img{ height:14px; width:auto; opacity:.96; }
.qm-leds{ display:flex; justify-content:space-between; padding:0 4px; margin-top:7px; }
.qm-ledcol{ display:flex; flex-direction:column; align-items:center; gap:3px; }
.qm-led{ width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.07); }
.qm-led.on{ box-shadow:0 0 5px currentColor, inset 0 0 1px rgba(255,255,255,.6); background:currentColor; }
.qm-led.sig{ animation:qmSig 1.5s var(--d,0s) infinite; }
.qm-led.clip{ animation:qmClip 3.2s var(--d,0s) infinite; }
@keyframes qmSig{ 0%,100%{opacity:.3} 45%{opacity:1} }
@keyframes qmClip{ 0%,90%,100%{opacity:.16} 94%{opacity:1} }
.qm-knobs{ display:flex; align-items:center; justify-content:center; gap:11px; margin-top:6px; }
.qm-knob{ width:25px; height:25px; border-radius:50%; position:relative;
  background:radial-gradient(circle at 38% 30%,#34373c,#101216 78%); border:1px solid #000;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 2px 5px rgba(0,0,0,.6); }
.qm-knob::after{ content:""; position:absolute; left:50%; top:3px; width:2px; height:9px; border-radius:2px;
  background:var(--accent,#E11507); transform:translateX(-50%) rotate(var(--kr,0deg)); transform-origin:50% 9.5px;
  box-shadow:0 0 4px var(--accent,#E11507); }
.qm-pwr{ width:18px; height:25px; border-radius:3px; position:relative;
  background:linear-gradient(180deg,#2a2d31,#0d0e10); border:1px solid #000; box-shadow:inset 0 1px 0 rgba(255,255,255,.12); }
.qm-pwr::after{ content:""; position:absolute; left:50%; top:4px; transform:translateX(-50%); width:8px; height:8px; border-radius:50%;
  background:var(--accent,#E11507); box-shadow:0 0 6px var(--accent,#E11507); }
.qm-silk{ display:flex; align-items:baseline; justify-content:center; gap:6px; margin-top:5px; }
.qm-model{ font-family:var(--font-display,Oswald),sans-serif; font-weight:700; font-size:14px; color:#eceef1; letter-spacing:.02em; line-height:1; }
.qm-sub{ font-family:var(--font-mono,monospace); font-size:6px; letter-spacing:.16em; color:#7f858c; text-transform:uppercase; }
.qm-screw{ position:absolute; width:9px; height:9px; border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#4a4d54,#141619); border:1px solid #000; }
.qm-screw::after{ content:""; position:absolute; inset:2.5px; border-top:1.4px solid rgba(255,255,255,.22); transform:rotate(42deg); }
`;

const KNOB_ROT = [-34, 18, -12, 30];

function LedStack({ ch, accent, live }: { ch: number; accent: string; live: boolean }) {
  const d = `${ch * 0.4}s`;
  return (
    <div className="qm-ledcol">
      <span className="qm-led on" style={{ color: "var(--nag-red-300)", opacity: 0.35 }} />
      <span
        className={`qm-led clip${live ? "" : " on"}`}
        style={{ color: accent, ["--d" as string]: d }}
      />
      <span
        className="qm-led sig on"
        style={{ color: "var(--nag-amber-500)", ["--d" as string]: d }}
      />
      <span className="qm-led on" style={{ color: "var(--nag-green-500)" }} />
    </div>
  );
}

export default function QM400Amp({
  logo = "/brand/nag-logo-mono-white.png",
  accent = "var(--accent)",
  scale = 1,
  live = true,
}: {
  logo?: string;
  accent?: string;
  scale?: number;
  live?: boolean;
}) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    let curRY = -22;
    let curRX = 8;
    let tgtRY = -22;
    let tgtRX = 8;
    let hot = false;

    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tgtRY = -22 + x * 40;
      tgtRX = 8 - y * 20;
      hot = true;
    }
    function onLeave() {
      hot = false;
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    function loop() {
      t += 0.011;
      if (!hot) {
        tgtRY = -20 + Math.sin(t) * 8;
        tgtRX = 8 + Math.sin(t * 0.7) * 2.4;
      }
      curRY += (tgtRY - curRY) * 0.07;
      curRX += (tgtRX - curRX) * 0.07;
      if (boxRef.current) {
        boxRef.current.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
      }
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="qm-scene" ref={sceneRef}>
      <style>{CSS}</style>
      <div className="qm-pivot" style={{ transform: `scale(${scale})` }}>
        <div className="qm" ref={boxRef}>
          <div className="qm__f qm__back" />
          <div className="qm__f qm__left" />
          <div className="qm__f qm__right" />
          <div className="qm__f qm__top" />
          <div className="qm__f qm__bottom" />
          <div className="qm__f qm__front">
            <div className="qm-ear qm-ear--l">
              <div className="qm-eslot" style={{ top: 30 }} />
              <div className="qm-eslot" style={{ bottom: 30 }} />
            </div>
            <div className="qm-ear qm-ear--r">
              <div className="qm-eslot" style={{ top: 30 }} />
              <div className="qm-eslot" style={{ bottom: 30 }} />
            </div>
            <div className="qm-grille qm-grille--l" />
            <div className="qm-grille qm-grille--r" />
            <div className="qm-panel">
              <div className="qm-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="NAG" />
              </div>
              <div className="qm-leds">
                {[0, 1, 2, 3].map((ch) => (
                  <LedStack key={ch} ch={ch} accent={accent} live={live} />
                ))}
              </div>
              <div className="qm-knobs">
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[0]}deg` }} />
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[1]}deg` }} />
                <div className="qm-pwr" />
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[2]}deg` }} />
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[3]}deg` }} />
              </div>
              <div className="qm-silk">
                <span className="qm-model">QM-400</span>
                <span className="qm-sub">Professional Power Amplifier</span>
              </div>
            </div>
            <div className="qm-screw" style={{ top: 7, left: 10 }} />
            <div className="qm-screw" style={{ bottom: 7, left: 10 }} />
            <div className="qm-screw" style={{ top: 7, right: 10 }} />
            <div className="qm-screw" style={{ bottom: 7, right: 10 }} />
          </div>
        </div>
        <div className="qm-shadow" />
      </div>
    </div>
  );
}
