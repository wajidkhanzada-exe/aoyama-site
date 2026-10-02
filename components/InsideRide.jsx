'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';

const PARTS = [
  { k: 'motor', n: '01', label: 'Motor', t: 'Motor & sheave',
    d: 'The compact gearless motor sits inside the shaft, so no separate machine room is needed. Steel ropes run over the sheave to lift the cabin smoothly and quietly.',
    w: 'Saves building space and electricity.', chips: ['Gearless motor', 'No machine room', 'Variable-speed drive'] },
  { k: 'cabin', n: '02', label: 'Cabin', t: 'Passenger cabin',
    d: 'The cabin travels between guide rails and has automatic centre-opening doors. Finishes range from stainless steel to wood and panoramic glass.',
    w: 'Designed around your interior and load.', chips: ['Centre-opening doors', 'LED lighting', 'Custom finishes'] },
  { k: 'counterweight', n: '03', label: 'Counterweight', t: 'Counterweight',
    d: 'A weighted frame balances the cabin and an average load. The motor only moves the difference, which reduces energy use and wear.',
    w: 'Less effort for the motor, longer life.', chips: ['Balances the cabin', 'Stacked steel plates', 'Own guide rails'] },
  { k: 'governor', n: '04', label: 'Governor', t: 'Overspeed governor',
    d: 'A speed-sensing wheel is linked to the cabin by its own rope. If the cabin ever runs too fast, it triggers the safety gear that grips the guide rails.',
    w: 'Stops the cabin mechanically.', chips: ['Rope-driven wheel', 'Safety gear trigger', 'Works without power'] },
  { k: 'buffer', n: '05', label: 'Buffers', t: 'Pit buffers',
    d: "Spring or oil buffers at the bottom of the shaft absorb the cabin's energy if it ever travels past the lowest floor.",
    w: 'A final line of protection.', chips: ['Spring or oil type', 'Mounted in the pit', 'Cabin and counterweight'] },
  { k: 'control', n: '06', label: 'Controller', t: 'Control panel',
    d: 'The controller manages calls, door timing, floor stops and fault checks. Al Hamid engineers set it up and service it in Karachi.',
    w: 'Backed by 24/7 technical support.', chips: ['Call and door control', 'Fault checks', '24/7 support'] },
];
const KEYS = PARTS.map((p) => p.k);
const pillW = (s) => s.length * 6.2 + 14;

function Node({ k, n, label, x, y, px, py, active, pick, leader }) {
  const on = active === k;
  const w = pillW(label);
  return (
    <g className="ir-node" role="button" tabIndex={0} aria-label={label}
      onClick={() => pick(k)} onMouseEnter={() => pick(k)} onFocus={() => pick(k)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } }}>
      {leader && <line x1={leader[0]} y1={leader[1]} x2={leader[2]} y2={leader[3]} stroke="#f59e0b" strokeOpacity={on ? 0.8 : 0.3} strokeDasharray="3 3" />}
      {on && <circle className="ir-ring" cx={x} cy={y} r="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" />}
      <circle cx={x} cy={y} r="10" fill="#0b1220" stroke="#f59e0b" strokeWidth={on ? 2 : 1.2} />
      <text x={x} y={y + 3.4} textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" fill={on ? '#f59e0b' : '#cbd5e1'}>{n}</text>
      <g className={'ir-tag' + (on ? ' on' : '')}>
        <rect x={px} y={py} width={w} height="16" rx="8" fill="#0b1220" stroke="#f59e0b" strokeOpacity=".8" />
        <text x={px + w / 2} y={py + 11.4} textAnchor="middle" fontSize="9" letterSpacing=".6" fontFamily="ui-monospace,monospace" fill="#fbbf24">{label.toUpperCase()}</text>
      </g>
    </g>
  );
}

function Buffer({ x, on }) {
  return (
    <g>
      <rect x={x - 10} y="531" width="20" height="3" fill="#475569" />
      <path className={'ir-part' + (on ? ' on' : '')} d={`M${x - 8} 534l16 4-16 4 16 4-16 4`} fill="none" stroke="#94a3b8" strokeWidth="1.6" />
      <rect className={'ir-part' + (on ? ' on' : '')} x={x - 12} y="550" width="24" height="5" fill="#334155" stroke="#64748b" />
    </g>
  );
}

export default function InsideRide() {
  const [active, setActive] = useState('motor');
  const [auto, setAuto] = useState(true);
  const root = useRef(null), inView = useRef(false);
  const cab = useRef(null), cw = useRef(null), sheave = useRef(null), gov = useRef(null), doors = useRef(null);
  const ropes = useRef([]);
  const floorEl = useRef(null), speedEl = useRef(null), statEl = useRef(null);
  const part = PARTS.find((p) => p.k === active);
  const pick = (k) => { setAuto(false); setActive(k); };
  const cls = (k) => 'ir-part' + (active === k ? ' on' : '');

  useEffect(() => {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = { p: 0, t: performance.now() }, sm = 0;
    const set = (p, moving) => {
      if (!cab.current) return;
      const cy = 131 + 315 * p, wy = 438 - 320 * p;
      cab.current.setAttribute('transform', `translate(0 ${cy})`);
      cw.current.setAttribute('transform', `translate(0 ${wy})`);
      [0, 1, 2].forEach((i) => ropes.current[i] && ropes.current[i].setAttribute('y2', cy - 8));
      [3, 4, 5].forEach((i) => ropes.current[i] && ropes.current[i].setAttribute('y2', wy - 6));
      sheave.current.setAttribute('transform', `rotate(${p * 900} 270 80)`);
      gov.current.setAttribute('transform', `rotate(${-p * 1300} 150 82)`);
      const open = p < 0.025 || p > 0.975;
      doors.current.classList.toggle('open', open);
      const now = performance.now(), dt = (now - last.t) / 1000;
      if (moving && dt > 0) sm = sm * 0.85 + ((Math.abs(p - last.p) / dt) * 9) * 0.15;
      if (open) sm = 0;
      last = { p, t: now };
      floorEl.current.textContent = Math.round((1 - p) * 3) === 0 ? 'G' : Math.round((1 - p) * 3);
      speedEl.current.textContent = sm.toFixed(1);
      statEl.current.textContent = open ? 'DOORS OPEN' : 'IN MOTION';
    };
    set(rm ? 0.35 : 0, false);
    if (rm) return;
    const ctl = animate(0, 1, {
      duration: 6.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.6,
      onUpdate: (p) => set(p, true),
    });
    ctl.pause();
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      e.isIntersecting ? ctl.play() : ctl.pause();
    }, { threshold: 0.15 });
    io.observe(root.current);
    return () => { ctl.stop(); io.disconnect(); };
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      if (inView.current) setActive((a) => KEYS[(KEYS.indexOf(a) + 1) % KEYS.length]);
    }, 5000);
    return () => clearInterval(id);
  }, [auto]);

  const rope = (i, x, y2, stroke, w, dash) => (
    <line key={i} ref={(el) => (ropes.current[i] = el)} x1={x} y1={x === 240 ? 80 : 68} x2={x} y2={y2} stroke={stroke} strokeWidth={w} strokeDasharray={dash} />
  );

  return (
    <section id="how" ref={root} className="relative py-28 overflow-hidden bg-[#05070d]">
      <style>{`
        .ir-part{transition:stroke .3s,filter .3s}
        .ir-part.on{stroke:#f59e0b;stroke-width:2;filter:drop-shadow(0 0 7px rgba(245,158,11,.75))}
        .ir-node{cursor:pointer;outline:none}
        .ir-tag{opacity:0;transition:opacity .3s;pointer-events:none}
        .ir-tag.on{opacity:1}
        .ir-ring{transform-box:fill-box;transform-origin:center;animation:ir-ring 1.8s ease-out infinite}
        @keyframes ir-ring{from{transform:scale(1);opacity:.9}to{transform:scale(2.3);opacity:0}}
        .ir-flow{animation:ir-flow 1.6s linear infinite}
        @keyframes ir-flow{to{stroke-dashoffset:-24}}
        .ir-scan{animation:ir-scan 7s ease-in-out infinite}
        @keyframes ir-scan{0%{transform:translateY(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(440px);opacity:0}}
        .ir-pt{transform-box:fill-box;animation:ir-pt linear infinite}
        @keyframes ir-pt{0%{transform:translateY(0);opacity:0}15%{opacity:.8}100%{transform:translateY(-420px);opacity:0}}
        .ir-led{animation:ir-led 1.4s ease-in-out infinite alternate}
        @keyframes ir-led{from{opacity:.25}to{opacity:1}}
        .ir-door{transition:transform .9s cubic-bezier(.65,0,.35,1)}
        .ir-doors.open .ir-dl{transform:translateX(-50px)}
        .ir-doors.open .ir-dr{transform:translateX(50px)}
        @keyframes ir-prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @media (prefers-reduced-motion:reduce){.ir-ring,.ir-flow,.ir-scan,.ir-pt,.ir-led{animation:none}}
      `}</style>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: 'radial-gradient(60rem 40rem at 85% 10%,rgba(245,158,11,.08),transparent 60%),radial-gradient(50rem 40rem at 0% 90%,rgba(56,189,248,.06),transparent 60%),linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px)', backgroundSize: 'auto,auto,44px 44px,44px 44px' }} />

      <div className="relative max-w-7xl mx-auto px-5 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[11px] tracking-widest text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> LIVE CUTAWAY
          </span>
          <h2 className="mt-4 font-display font-extrabold text-white text-4xl lg:text-5xl leading-tight">Inside every ride</h2>
          <p className="mt-3 text-slate-400 max-w-md">Learn how an Aoyama lift works. Hover or tap a numbered node on the lift, or pick a part below.</p>

          <div className="relative mt-8 rounded-3xl border border-white/10 bg-white/[.04] backdrop-blur-xl p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] overflow-hidden" aria-live="polite">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">{part.t}</h3>
                  <span className="font-mono text-4xl font-bold text-gold/25 leading-none">{part.n}</span>
                </div>
                <p className="mt-4 text-slate-300 leading-relaxed">{part.d}</p>
                <p className="mt-4 text-sm font-semibold text-gold">{part.w}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {part.chips.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-300">{c}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            {auto && <div key={'p' + active} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold" style={{ animation: 'ir-prog 5s linear forwards' }} />}
          </div>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Lift parts">
            {PARTS.map((p) => (
              <button key={p.k} type="button" onClick={() => pick(p.k)} aria-pressed={active === p.k}
                className={'rounded-full border px-4 py-2 text-sm font-semibold transition ' + (active === p.k ? 'border-gold bg-gold text-black shadow-[0_0_24px_-4px_rgba(245,158,11,.8)]' : 'border-white/15 bg-white/5 text-slate-200 hover:border-gold/60')}>
                <span className="font-mono text-[10px] opacity-60 mr-1.5">{p.n}</span>{p.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-white/10 bg-[#070b14]/80 p-3 sm:p-5 shadow-[0_0_90px_-25px_rgba(245,158,11,.35)]">
          <span className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-gold/70 rounded-tl" />
          <span className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-gold/70 rounded-tr" />
          <span className="absolute left-2 bottom-2 h-4 w-4 border-l-2 border-b-2 border-gold/70 rounded-bl" />
          <span className="absolute right-2 bottom-2 h-4 w-4 border-r-2 border-b-2 border-gold/70 rounded-br" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl bg-white/10 font-mono text-[11px]">
            <div className="bg-[#0a0f1a] px-3 py-2"><p className="text-slate-500">STATUS</p><p className="text-emerald-400"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /><span ref={statEl}>DOORS OPEN</span></p></div>
            <div className="bg-[#0a0f1a] px-3 py-2"><p className="text-slate-500">FLOOR</p><p className="text-white text-sm" ref={floorEl}>3</p></div>
            <div className="bg-[#0a0f1a] px-3 py-2"><p className="text-slate-500">SPEED</p><p className="text-white"><span ref={speedEl}>0.0</span> m/s</p></div>
            <div className="bg-[#0a0f1a] px-3 py-2"><p className="text-slate-500">RATED LOAD</p><p className="text-white">630 kg</p></div>
          </div>

          <svg viewBox="0 0 660 600" className="mt-3 w-full h-auto" role="img" aria-label="Animated cutaway of a lift showing motor, cabin, counterweight, governor, buffers and control panel">
            <defs>
              <linearGradient id="ir-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1e293b" /><stop offset=".35" stopColor="#94a3b8" /><stop offset=".5" stopColor="#e2e8f0" /><stop offset=".7" stopColor="#64748b" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
              <linearGradient id="ir-steelV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cbd5e1" /><stop offset=".5" stopColor="#475569" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
              <radialGradient id="ir-hub" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#e2e8f0" /><stop offset=".6" stopColor="#64748b" /><stop offset="1" stopColor="#1e293b" /></radialGradient>
              <linearGradient id="ir-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2e8f0" /><stop offset=".5" stopColor="#94a3b8" /><stop offset="1" stopColor="#475569" /></linearGradient>
              <linearGradient id="ir-int" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#92400e" /></linearGradient>
              <linearGradient id="ir-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#64748b" /><stop offset=".5" stopColor="#e2e8f0" /><stop offset="1" stopColor="#64748b" /></linearGradient>
              <linearGradient id="ir-cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52525b" /><stop offset="1" stopColor="#18181b" /></linearGradient>
              <linearGradient id="ir-scan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f59e0b" stopOpacity="0" /><stop offset=".9" stopColor="#f59e0b" stopOpacity=".22" /><stop offset="1" stopColor="#f59e0b" stopOpacity=".6" /></linearGradient>
              <pattern id="ir-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="2" /></pattern>
              <filter id="ir-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="ir-noise"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".1" /></feComponentTransfer></filter>
              <clipPath id="ir-door-clip"><rect x="186" y="10" width="108" height="68" /></clipPath>
            </defs>

            {/* Hoistway wall, concrete texture and inner shaft */}
            <rect x="90" y="30" width="470" height="545" rx="6" fill="#0d1526" stroke="#334155" />
            <rect x="90" y="30" width="470" height="545" rx="6" filter="url(#ir-noise)" />
            <rect x="106" y="46" width="438" height="509" fill="#04070d" stroke="#1e293b" />

            {/* Landings */}
            {[[215, '3'], [320, '2'], [425, '1'], [530, 'G']].map(([y, l]) => (
              <g key={l}>
                <rect x="90" y={y} width="16" height="5" fill="#475569" /><rect x="544" y={y} width="16" height="5" fill="#475569" />
                <line x1="106" y1={y} x2="544" y2={y} stroke="#1e3a5f" strokeDasharray="2 6" />
                <text x="112" y={y - 6} fontSize="10" fontFamily="ui-monospace,monospace" fill="#64748b">{l}</text>
              </g>
            ))}
            <rect x="106" y="530" width="438" height="25" fill="url(#ir-hatch)" opacity=".5" />

            {/* Guide rails */}
            {[173, 301, 432, 488].map((x) => (
              <g key={x}>
                <rect x={x} y="100" width="6" height="455" fill="url(#ir-steel)" />
                {Array.from({ length: 9 }, (_, i) => <rect key={i} x={x - 5} y={140 + i * 50} width="16" height="4" fill="#475569" />)}
              </g>
            ))}

            {/* Machine bed, motor and sheaves */}
            <rect x="252" y="114" width="204" height="7" fill="url(#ir-steelV)" />
            <rect x="441" y="86" width="8" height="28" fill="#475569" />
            <rect className={cls('motor')} x="300" y="60" width="64" height="40" rx="8" fill="url(#ir-steelV)" stroke="#64748b" />
            {[312, 324, 336, 348].map((x) => <line key={x} x1={x} y1="63" x2={x} y2="97" stroke="#0b1220" strokeOpacity=".55" />)}
            <rect x="354" y="72" width="5" height="16" fill="#f59e0b" opacity=".8" />
            <g ref={sheave}>
              <circle className={cls('motor')} cx="270" cy="80" r="30" fill="url(#ir-hub)" stroke="#94a3b8" />
              <circle cx="270" cy="80" r="23" fill="none" stroke="#0b1220" strokeWidth="2" />
              {[0, 60, 120].map((a) => <line key={a} x1="270" y1="58" x2="270" y2="102" stroke="#0b1220" strokeWidth="3" transform={`rotate(${a} 270 80)`} />)}
              <circle cx="270" cy="80" r="6" fill="#f59e0b" /><circle cx="270" cy="54" r="2.5" fill="#f59e0b" />
            </g>
            <circle cx="445" cy="68" r="18" fill="url(#ir-hub)" stroke="#64748b" /><circle cx="445" cy="68" r="4" fill="#0b1220" />

            {/* Ropes (static over-sheave path + live segments) */}
            <path d="M240 80A30 30 0 0 1 270 50H445A18 18 0 0 1 463 68" fill="none" stroke="#0f172a" strokeWidth="3.4" />
            <path d="M240 80A30 30 0 0 1 270 50H445A18 18 0 0 1 463 68" fill="none" stroke="#cbd5e1" strokeWidth="1.6" />
            <path d="M240 80A30 30 0 0 1 270 50H445A18 18 0 0 1 463 68" fill="none" stroke="#475569" strokeWidth="1.6" strokeDasharray="2 3" />
            {rope(0, 240, 123, '#0f172a', 3.4)}{rope(1, 240, 123, '#cbd5e1', 1.6)}{rope(2, 240, 123, '#475569', 1.6, '2 3')}
            {rope(3, 463, 432, '#0f172a', 3.4)}{rope(4, 463, 432, '#cbd5e1', 1.6)}{rope(5, 463, 432, '#475569', 1.6, '2 3')}

            {/* Governor */}
            <line x1="138" y1="82" x2="138" y2="540" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="162" y1="82" x2="162" y2="540" stroke="#94a3b8" strokeWidth="1.2" />
            <g ref={gov}>
              <circle className={cls('governor')} cx="150" cy="82" r="12" fill="url(#ir-hub)" stroke="#94a3b8" />
              <line x1="150" y1="72" x2="150" y2="92" stroke="#0b1220" strokeWidth="2" /><line x1="140" y1="82" x2="160" y2="82" stroke="#0b1220" strokeWidth="2" />
            </g>
            <circle className={cls('governor')} cx="150" cy="540" r="12" fill="url(#ir-hub)" stroke="#94a3b8" />

            {/* Buffers */}
            <Buffer x={205} on={active === 'buffer'} /><Buffer x={275} on={active === 'buffer'} /><Buffer x={463} on={active === 'buffer'} />

            {/* Counterweight */}
            <g ref={cw} transform="translate(0 438)">
              <rect className={cls('counterweight')} x="438" y="0" width="50" height="92" rx="2" fill="url(#ir-cw)" stroke="#a16207" />
              {[12, 24, 36, 48, 60, 72, 84].map((y) => <line key={y} x1="440" y1={y} x2="486" y2={y} stroke="#a1a1aa" strokeOpacity=".35" />)}
              <rect x="436" y="40" width="4" height="12" fill="#f59e0b" /><rect x="486" y="40" width="4" height="12" fill="#f59e0b" />
              <circle cx="463" cy="-6" r="3" fill="#f59e0b" />
              <Node k="counterweight" n="03" label="Counterweight" x={463} y={46} px={476} py={38} active={active} pick={pick} />
            </g>

            {/* Cabin */}
            <g ref={cab} transform="translate(0 131)">
              <rect x="172" y="-8" width="136" height="8" fill="url(#ir-steelV)" /><circle cx="240" cy="-8" r="3" fill="#f59e0b" />
              <rect className={cls('cabin')} x="180" y="0" width="120" height="84" rx="3" fill="url(#ir-cab)" stroke="#94a3b8" />
              <rect x="190" y="3" width="100" height="2" fill="#fbbf24" filter="url(#ir-glow)" />
              <g clipPath="url(#ir-door-clip)">
                <rect x="186" y="10" width="108" height="68" fill="url(#ir-int)" />
                <line x1="190" y1="42" x2="290" y2="42" stroke="#fef3c7" strokeOpacity=".5" />
                <g ref={doors} className="ir-doors open">
                  <rect className="ir-door ir-dl" x="186" y="10" width="54" height="68" fill="url(#ir-door)" stroke="#475569" />
                  <rect className="ir-door ir-dr" x="240" y="10" width="54" height="68" fill="url(#ir-door)" stroke="#475569" />
                </g>
              </g>
              <rect x="170" y="60" width="10" height="16" fill="#78350f" stroke="#f59e0b" /><rect x="300" y="60" width="10" height="16" fill="#78350f" stroke="#f59e0b" />
              <line x1="162" y1="68" x2="170" y2="68" stroke="#f59e0b" strokeWidth="1.5" />
              <Node k="cabin" n="02" label="Cabin" x={322} y={42} px={336} py={34} active={active} pick={pick} />
            </g>

            {/* Controller cabinet and live cable */}
            <path d="M607 270V38H332V60" fill="none" stroke="#1e293b" strokeWidth="3" />
            <path className="ir-flow" d="M607 270V38H332V60" fill="none" stroke="#f59e0b" strokeOpacity=".7" strokeWidth="1.4" strokeDasharray="4 8" />
            <rect className={cls('control')} x="572" y="270" width="72" height="110" rx="6" fill="#0f172a" stroke="#64748b" />
            <rect x="582" y="282" width="52" height="26" rx="2" fill="#031a14" stroke="#134e4a" />
            <text x="608" y="299" textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" fill="#34d399">READY</text>
            <circle className="ir-led" cx="588" cy="322" r="3" fill="#f59e0b" /><circle className="ir-led" style={{ animationDelay: '.4s' }} cx="608" cy="322" r="3" fill="#34d399" /><circle className="ir-led" style={{ animationDelay: '.8s' }} cx="628" cy="322" r="3" fill="#38bdf8" />
            {[338, 348, 358, 368].map((y) => <line key={y} x1="584" y1={y} x2="632" y2={y} stroke="#334155" />)}

            {/* Ambient: data particles and scan line */}
            {[140, 215, 330, 410, 520, 255, 380].map((x, i) => <circle key={x} className="ir-pt" cx={x} cy="520" r="1.6" fill="#f59e0b" style={{ animationDuration: 5 + (i % 4) * 1.3 + 's', animationDelay: i * 0.9 + 's' }} />)}
            <rect className="ir-scan" x="106" y="46" width="438" height="70" fill="url(#ir-scan)" pointerEvents="none" />

            {/* Static nodes */}
            <Node k="motor" n="01" label="Motor" x={366} y={66} px={380} py={58} active={active} pick={pick} />
            <Node k="governor" n="04" label="Governor" x={150} y={82} px={172} py={74} active={active} pick={pick} />
            <Node k="buffer" n="05" label="Buffers" x={350} y={541} px={364} py={533} leader={[287, 541, 340, 541]} active={active} pick={pick} />
            <Node k="control" n="06" label="Controller" x={608} y={262} px={570} py={232} active={active} pick={pick} />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
