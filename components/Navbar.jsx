'use client';
import { useState } from 'react';
import Link from 'next/link';

const LINKS = [['About', '/#about'], ['Products', '/#products'], ['Services', '/#services'], ['Lift planner', '/#planner'], ['FAQ', '/#faq'], ['Contact', '/#contact']];
const lock = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const adminCls = 'hidden lg:inline-flex items-center gap-2 border border-gold/60 text-gold font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold hover:text-slate-950 hover:shadow-[0_0_28px_rgba(245,158,11,.4)] transition';

export default function Navbar({ home = false }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between" aria-label="Main">
        <Link href="/" className="leading-tight">
          <span className="block font-display font-extrabold tracking-[.18em] text-white text-lg">AOYAMA ELEVATOR</span>
          <span className="block text-[10px] sm:text-xs tracking-[.2em] text-gold">AL HAMID ENGINEERING SERVICES</span>
        </Link>
        <ul className="hidden lg:flex gap-8 text-sm text-slate-300">
          {LINKS.map(([n, h]) => <li key={n}><a className="hover:text-gold transition" href={h}>{n}</a></li>)}
        </ul>
        <div className="flex items-center gap-3">
          {home
            ? <button id="admBtn" type="button" className={adminCls}>{lock}Admin login</button>
            : <a id="admBtn" href="/?admin=1" className={adminCls}>{lock}Admin login</a>}
          <a href="tel:+923012932901" className="bg-gold text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-amber-400 hover:shadow-[0_0_28px_rgba(245,158,11,.5)] transition">Call now</a>
          <button className="lg:hidden text-white text-2xl px-2" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>&#9776;</button>
        </div>
      </nav>
      {open && (
        <div className="lg:hidden px-5 pb-5 space-y-3 text-slate-200">
          {LINKS.map(([n, h]) => <a key={n} className="block" href={h} onClick={() => setOpen(false)}>{n}</a>)}
          {home
            ? <button type="button" className="block text-gold" onClick={() => { setOpen(false); document.getElementById('admBtn').click(); }}>Admin login</button>
            : <a className="block text-gold" href="/?admin=1">Admin login</a>}
        </div>
      )}
    </header>
  );
}
