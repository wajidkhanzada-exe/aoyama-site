'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCTS } from '@/lib/products';

export default function ProductsGrid() {
  return (
    <section id="products" className="py-28 bg-slate-950">
      <div className="max-w-7xl mx-auto px-5">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-gold text-sm tracking-widest">PRODUCT CATALOG</p>
          <h2 className="mt-3 font-extrabold text-white text-4xl lg:text-5xl max-w-2xl">Vertical and horizontal transport, built to order</h2>
        </motion.div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }} whileHover={{ y: -6 }}>
              <Link href={`/products/${p.slug}`} className="group relative block h-[420px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 ring-1 ring-white/5">
                <img src={p.image} alt={p.name} loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-gold opacity-0 shadow-[0_0_35px_rgba(245,158,11,.45),inset_0_0_30px_rgba(245,158,11,.15)] transition duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-7 transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="text-xs tracking-widest text-gold">0{i + 1}</span>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{p.short}</p>
                  <span className="mt-4 inline-block translate-y-2 text-sm font-semibold text-gold opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                    View Specifications &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
