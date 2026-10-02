'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MATERIALS = [
  { id: 'steel', name: 'Brushed Stainless Steel', wall: '#b9bdc3', side: '#8d9299', ceil: '#d8dbe0', floor: '#3b3e43', note: 'Timeless, durable and easy to clean.' },
  { id: 'gold', name: 'Mirror Gold', wall: '#d4af37', side: '#a8851f', ceil: '#ecd27a', floor: '#3a2f12', note: 'A high-shine finish for statement lobbies.' },
  { id: 'black', name: 'Titanium Black', wall: '#2d3035', side: '#1d1f23', ceil: '#3a3d43', floor: '#0e0f11', note: 'Dark, modern and fingerprint resistant.' },
  { id: 'glass', name: 'Full Panoramic Glass', wall: '#7cc4e8', side: '#4f9cc4', ceil: '#cfe9f7', floor: '#23313b', note: 'Open views and natural light.' },
];
const COPS = [{ id: 'steel', name: 'Brushed steel', c: '#c4c8ce' }, { id: 'black', name: 'Black glass', c: '#15171a' }, { id: 'gold', name: 'Gold plated', c: '#d4af37' }];
const LIGHTS = [{ id: 'cove', name: 'Cove LED' }, { id: 'spot', name: 'Spot matrix' }, { id: 'star', name: 'Starlight' }];
const STARS = [[90, 10], [130, 26], [170, 8], [200, 22], [240, 12], [275, 28], [310, 9], [150, 18], [255, 20], [110, 14], [225, 7], [190, 30]];

function CabinPreview({ m, cop, light, uid }) {
  const t = { duration: 0.5 };
  return (
    <svg viewBox="0 0 400 300" className="h-auto w-full rounded-2xl bg-[#0b0c0e]" role="img" aria-label={`Cabin preview in ${m.name}`}>
      <defs>
        <radialGradient id={`g${uid}`}><stop offset="0" stopColor="#fff3c4" stopOpacity=".95" /><stop offset="1" stopColor="#fff3c4" stopOpacity="0" /></radialGradient>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset="1" stopColor="#000" stopOpacity=".25" /></linearGradient>
      </defs>
      <motion.polygon points="60,40 340,40 340,250 60,250" animate={{ fill: m.wall }} transition={t} />
      <motion.polygon points="0,0 60,40 60,250 0,300" animate={{ fill: m.side }} transition={t} />
      <motion.polygon points="400,0 340,40 340,250 400,300" animate={{ fill: m.side }} transition={t} />
      <motion.polygon points="0,0 400,0 340,40 60,40" animate={{ fill: m.ceil }} transition={t} />
      <motion.polygon points="0,300 400,300 340,250 60,250" animate={{ fill: m.floor }} transition={t} />
      <polygon points="60,40 340,40 340,250 60,250" fill={`url(#s${uid})`} />
      {m.id === 'glass' && (
        <g fill="#fff" fillOpacity=".28">
          {[[70, 170, 28], [104, 140, 34], [142, 185, 26], [176, 120, 40], [222, 160, 30], [258, 135, 36], [298, 175, 30]].map(([x, y, w], i) => <rect key={i} x={x} y={y} width={w} height={250 - y} />)}
          <path d="M70 90h40M230 70h50M120 60h30" stroke="#fff" strokeOpacity=".5" />
        </g>
      )}
      <line x1="200" y1="40" x2="200" y2="250" stroke="#000" strokeOpacity=".25" />
      <rect x="60" y="150" width="280" height="6" fill="#fff" fillOpacity=".55" />
      <motion.polygon points="356,95 380,85 380,210 356,200" animate={{ fill: cop.c }} transition={t} stroke="#000" strokeOpacity=".3" />
      {[0, 1, 2, 3].map(i => <circle key={i} cx="368" cy={112 + i * 22} r="3.5" fill="#f59e0b" fillOpacity={0.9} />)}
      {light.id === 'cove' && <><polygon points="70,12 330,12 322,32 78,32" fill={`url(#g${uid})`} /><line x1="70" y1="12" x2="330" y2="12" stroke="#fff3c4" strokeWidth="2" /></>}
      {light.id === 'spot' && [110, 160, 210, 260, 310].map(x => <g key={x}><circle cx={x} cy="20" r="14" fill={`url(#g${uid})`} /><circle cx={x} cy="20" r="3.5" fill="#fff" /></g>)}
      {light.id === 'star' && STARS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#fff" />)}
    </svg>
  );
}

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7 } };

function Bubbles({ items, value, onChange, ring, render }) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((it, i) => (
        <button key={it.id} type="button" onClick={() => onChange(i)} aria-pressed={value === i} className="group flex flex-col items-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 transition group-hover:border-gold" style={render(it)}>
            {value === i && <motion.span layoutId={ring} className="absolute -inset-1.5 rounded-full border-2 border-gold shadow-[0_0_18px_rgba(245,158,11,.6)]" />}
          </span>
          {it.name}
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail({ product: p }) {
  const [mi, setMi] = useState(0);
  const [ci, setCi] = useState(0);
  const [li, setLi] = useState(0);
  const m = MATERIALS[mi], cop = COPS[ci], light = LIGHTS[li];
  const specs = [['Capacity', p.specs.capacity], ['Max speed', p.specs.speed], ['Max travel', p.specs.travel], ['Control system', p.specs.control]];
  return (
    <div className="text-slate-200">
      <section className="relative overflow-hidden">
        <img src={p.image} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 to-[#0A0A0A]" />
        <div className="relative mx-auto max-w-7xl px-5 py-24">
          <Link href="/#products" className="text-sm text-gold hover:underline">&larr; All products</Link>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl text-4xl font-extrabold text-white sm:text-6xl">{p.name}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 max-w-2xl text-lg text-slate-300">{p.tagline}</motion.p>
          <a href="/#contact" className="mt-8 inline-block rounded-full bg-gold px-8 py-4 font-semibold text-slate-950 transition hover:bg-amber-400">Request a quote</a>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
        <motion.div {...fade}>
          {p.cabin === false
            ? <img src={p.image} alt={p.name} onError={e => { e.currentTarget.style.display = 'none'; }} className="h-[380px] w-full rounded-2xl object-cover ring-1 ring-white/10" />
            : <CabinPreview m={m} cop={cop} light={light} uid="a" />}
        </motion.div>
        <motion.div {...fade} className="space-y-8">
          <h2 className="text-3xl font-extrabold text-white">{p.cabin === false ? 'Built for busy public spaces' : 'Configure the cabin'}</h2>
          {p.cabin === false ? (
            <ul className="space-y-3 text-slate-300">{p.features.map(f => <li key={f} className="flex gap-3"><span className="text-gold">&#9670;</span>{f}</li>)}</ul>
          ) : (
            <>
              <div><p className="mb-4 text-sm tracking-widest text-gold">CONTROL PANEL (COP) FINISH</p>
                <Bubbles items={COPS} value={ci} onChange={setCi} ring="copRing" render={c => ({ background: c.c })} /></div>
              <div><p className="mb-4 text-sm tracking-widest text-gold">CEILING LIGHTING</p>
                <Bubbles items={LIGHTS} value={li} onChange={setLi} ring="lightRing" render={() => ({ background: 'radial-gradient(circle,#fff3c4,#3b3a33)' })} /></div>
              <ul className="space-y-2 text-sm text-slate-400">{p.features.map(f => <li key={f} className="flex gap-3"><span className="text-gold">&#9670;</span>{f}</li>)}</ul>
            </>
          )}
        </motion.div>
      </section>

      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <motion.h2 {...fade} className="text-3xl font-extrabold text-white">Technical specifications</motion.h2>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map(([k, v], i) => (
              <motion.div key={k} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#0A0A0A] p-7">
                <p className="text-xs tracking-widest text-slate-500">{k.toUpperCase()}</p>
                <p className="mt-3 text-lg font-semibold text-white">{v}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Indicative specifications. Final configuration is confirmed after a site survey.</p>
        </div>
      </section>

      {p.cabin !== false && (
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
          <motion.div {...fade}>
            <h2 className="text-3xl font-extrabold text-white">Material customizer</h2>
            <p className="mt-3 text-slate-400">Pick a wall material and watch the cabin change.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {MATERIALS.map((mt, i) => (
                <button key={mt.id} type="button" onClick={() => setMi(i)} aria-pressed={mi === i}
                  className={'relative rounded-xl border p-4 text-left transition ' + (mi === i ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30')}>
                  <span className="mb-3 block h-10 rounded-md" style={{ background: `linear-gradient(135deg, ${mt.ceil}, ${mt.wall} 55%, ${mt.side})` }} />
                  <span className="block font-semibold text-white">{mt.name}</span>
                  <span className="mt-1 block text-xs text-slate-400">{mt.note}</span>
                </button>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade}><CabinPreview m={m} cop={cop} light={light} uid="b" /></motion.div>
        </section>
      )}

      <section className="px-5 pb-24">
        <motion.div {...fade} className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-slate-900 to-slate-950 p-10 text-center shadow-[0_0_80px_rgba(245,158,11,.12)]">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Engineering documents for {p.name}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Get the specification sheet for this product. For site-specific layout drawings, send us your shaft or building details and our engineers will prepare them.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href={`/brochures/${p.slug}.pdf`} download className="rounded-full bg-gold px-8 py-4 font-semibold text-slate-950">
              Download Technical Layout Drawings &amp; PDF Specifications
            </motion.a>
            <a href="/#contact" className="rounded-full border border-white/20 px-8 py-4 text-white transition hover:border-gold hover:text-gold">Request a quote</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
