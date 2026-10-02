'use client';
import { useEffect } from 'react';
import { motion, animate, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';

const TRAVEL = 300;
const WORDS = ['The', 'Future', 'of', 'Vertical', 'Mobility,', 'Engineered.'];

function Shaft() {
  const reduce = useReducedMotion();
  const y = useMotionValue(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-16, 16]), { stiffness: 80, damping: 15 });
  const rotX = useSpring(useTransform(my, [-1, 1], [12, -12]), { stiffness: 80, damping: 15 });
  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, [0, 700], [0, 70]);
  const floor = useTransform(y, v => Math.round(1 + (-v / TRAVEL) * 7));
  const open = useTransform(y, v => Math.max(0, 1 - Math.min(Math.abs(v), Math.abs(v + TRAVEL)) / 24));
  const doorR = useTransform(open, o => o * 28);
  const doorL = useTransform(open, o => -o * 28);
  const cable = useTransform(y, v => 356 + v);

  useEffect(() => {
    if (reduce) return;
    const c = animate(y, [0, -TRAVEL, -TRAVEL, 0], { duration: 12, times: [0, 0.42, 0.58, 1], ease: 'easeInOut', repeat: Infinity });
    return () => c.stop();
  }, [reduce, y]);

  const move = e => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}
      style={{ y: lift, perspective: 1200 }}
      className="relative mx-auto w-[300px] sm:w-[340px] h-[520px]"
      onMouseMove={move} onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="absolute inset-0">
        <div className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-b from-[#12151a] to-[#050607] shadow-[0_0_90px_rgba(245,158,11,.18)]" style={{ transform: 'translateZ(-50px)' }} />
        <div className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0c0e11]/60" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute left-3 flex items-center gap-1 text-[10px] text-slate-500" style={{ bottom: 24 + i * (TRAVEL / 7) + 60 }}>
            <span className="w-3 border-t border-slate-600" />{i + 1}
          </div>
        ))}
        <div className="absolute left-[68px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-white/30 to-white/5" />
        <div className="absolute right-[68px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-white/30 to-white/5" />
        <div className="absolute top-3 inset-x-0 mx-auto w-14 h-9 rounded bg-black border border-amber-400/40 flex items-center justify-center text-amber-400 font-display font-extrabold text-lg">
          <motion.span>{floor}</motion.span>
        </div>
        <motion.div style={{ height: cable }} className="absolute top-12 left-1/2 w-px bg-white/40" />
        <motion.div
          style={{ y }}
          className="absolute inset-x-0 mx-auto bottom-6 w-[170px] h-[140px] overflow-hidden rounded-md border border-amber-300/60 bg-gradient-to-b from-amber-100/30 via-amber-300/10 to-black/70 shadow-[0_0_60px_rgba(245,158,11,.55)]"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-amber-200/90 blur-[1px]" />
          <motion.div style={{ x: doorL }} className="absolute left-0 top-3 bottom-0 w-1/2 border-r border-slate-500 bg-gradient-to-r from-slate-300 to-slate-400" />
          <motion.div style={{ x: doorR }} className="absolute right-0 top-3 bottom-0 w-1/2 border-l border-slate-500 bg-gradient-to-l from-slate-300 to-slate-400" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[.04] via-transparent to-white/[.1]" style={{ transform: 'translateZ(40px)' }} />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const grid = 'linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)';
  const mask = 'radial-gradient(ellipse at center, black 30%, transparent 75%)';
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#0A0A0A] pt-32 pb-20 flex items-center">
      <div aria-hidden className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(60rem 40rem at 12% 8%, rgba(245,158,11,.20), transparent 60%), radial-gradient(50rem 40rem at 92% 30%, rgba(56,189,248,.13), transparent 60%), radial-gradient(40rem 30rem at 50% 105%, rgba(168,85,247,.12), transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: grid, backgroundSize: '56px 56px', maskImage: mask, WebkitMaskImage: mask }} />
      <div className="relative max-w-7xl mx-auto px-5 grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center w-full">
        <div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs tracking-widest text-gold">
            AOYAMA ELEVATOR &middot; SOLE DISTRIBUTOR IN PAKISTAN
          </motion.p>
          <motion.h1
            initial="hide" animate="show" transition={{ staggerChildren: 0.09, delayChildren: 0.2 }}
            className="mt-6 font-extrabold text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.05]" aria-label={WORDS.join(' ')}
          >
            {WORDS.map((w, i) => (
              <motion.span key={i} aria-hidden="true" variants={{ hide: { opacity: 0, y: 40, rotateX: -50 }, show: { opacity: 1, y: 0, rotateX: 0 } }} transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                className={'inline-block mr-[.25em] ' + (i === 5 ? 'bg-gradient-to-r from-amber-300 to-gold bg-clip-text text-transparent' : '')}>
                {w}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300 leading-relaxed backdrop-blur-xl">
            Custom-built lifts and escalators, designed around your building and made to Japanese safety standards. Installed and serviced in Karachi by Al Hamid Engineering Services.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-10 flex flex-wrap gap-4">
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} href="#planner" className="bg-gold text-slate-950 font-semibold px-8 py-4 rounded-full shadow-[0_0_35px_rgba(245,158,11,.35)]">Design Your Lift</motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} href="#products" className="border border-white/20 text-white px-8 py-4 rounded-full hover:border-gold hover:text-gold transition">Explore Catalog</motion.a>
          </motion.div>
        </div>
        <Shaft />
      </div>
    </section>
  );
}
