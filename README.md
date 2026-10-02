# jawedhamidelevotor

Next.js 14 (App Router) + Tailwind CSS + Framer Motion website for Aoyama Elevator / Al Hamid Engineering Services.

```
npm install
copy .env.example .env.local      (then edit ADMIN_PASS)
npm run dev                       -> http://localhost:3000
```

- Quote form and admin dashboard work locally with no database (data/inquiries.json).
- On Vercel, connect a Neon database; DATABASE_URL switches storage to Postgres automatically.
- Product data: lib/products.js. Spec sheets: public/brochures/<slug>.pdf (replace with official files).
