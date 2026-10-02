# Aoyama Elevator, Pakistan: Official Distributor Website

A modern, animated marketing website and inquiry-management system for **Aoyama Elevator Global Ltd.** in Pakistan, operated by **Al Hamid Engineering Services**, Karachi.

Built with **Next.js 14 (App Router)**, **Tailwind CSS** and **Framer Motion**, with a built-in admin dashboard for managing customer quotation requests.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Data Storage](#data-storage)
7. [API Overview](#api-overview)
8. [Deployment (Vercel + Neon)](#deployment-vercel--neon)
9. [Customisation Guide](#customisation-guide)
10. [Security Notes](#security-notes)
11. [Troubleshooting](#troubleshooting)
12. [Roadmap](#roadmap)
13. [Credits & Legal](#credits--legal)

---

## Features

### Public website
- **Cinematic hero** with an animated 2.5D elevator shaft: live floor counter, door open/close sequence, mouse-tilt parallax and scroll-linked motion.
- **Product catalogue** of six lift categories (Passenger, Villa/Home, Escalator, Cargo, Hospital, Panoramic) with dynamic routes at `/products/[slug]`.
- **Reusable product detail template**: hero band, interactive gallery, technical specification grid and brochure download.
- **Live cabin customiser**: choose wall material, COP finish and ceiling light and watch the 2.5D cabin preview update instantly.
- **Lift planner**: select a building type and number of floors to get a recommended lift type and capacity, which pre-fills the quote form.
- **"Inside every ride"** interactive lift cutaway (motor, cabin, counterweight, governor, buffers, control panel).
- Safety features, FAQ, company story, service process and Google Maps contact section.
- Floating WhatsApp button, mobile-first navigation and SEO-ready metadata.

### Admin dashboard
- Secure login (signed, HTTP-only session cookie; case-insensitive username).
- Summary cards: total, new, contacted, closed and today's inquiries.
- Category breakdown chart, search and status filters.
- Update status, add internal notes, or delete inquiries.
- One-click **CSV export**.

### Quote form
- Server-side validation with clear English error messages.
- Honeypot field for bot protection.
- Per-IP rate limiting (5 requests per 15 minutes).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion, GSAP |
| Database | Neon Serverless Postgres (production), local JSON file (development) |
| Hosting | Vercel |
| Auth | HMAC-signed session cookie (no third-party auth library) |

---

## Project Structure

```
jawedhamidelevotor/
├── app/
│   ├── layout.js                  # Root layout, fonts, SEO metadata
│   ├── page.js                    # Home page
│   ├── globals.css                # Tailwind + site styles
│   ├── products/[slug]/page.js    # Dynamic product detail pages
│   └── api/
│       ├── quote/route.js         # POST: submit a quotation request
│       └── admin/[...path]/route.js  # Admin login, inquiries, CSV export
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx                   # Animated shaft hero
│   ├── ProductsGrid.jsx
│   ├── ProductDetail.jsx          # Reusable product template + cabin preview
│   ├── Footer.jsx
│   └── LegacyScripts.jsx          # Client scripts for planner, cutaway, admin UI
├── lib/
│   ├── products.js                # Product catalogue data
│   ├── store.js                   # Storage layer (Neon or local JSON)
│   ├── auth.js                    # Session token helpers
│   └── legacy.js                  # Static HTML sections (about, FAQ, contact...)
├── public/
│   └── brochures/                 # Downloadable PDF brochures
├── .env.example
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18.17 or later (LTS recommended)
- npm (included with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/wajidkhanzada-exe/aoyama-site.git
cd aoyama-site

# 2. Install dependencies
npm install

# 3. Create your local environment file
#    macOS / Linux
cp .env.example .env.local
#    Windows (cmd)
copy .env.example .env.local

# 4. Edit .env.local and set your admin password and session secret

# 5. Start the development server
npm run dev
```

Open **http://localhost:3000**. Admin login is available from the **Admin** button in the header.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimised production build |
| `npm start` | Run the production build locally |

---

## Environment Variables

Create a `.env.local` file in the project root (never commit it):

| Variable | Required | Description |
|---|---|---|
| `ADMIN_USER` | Yes | Admin username (comparison is case-insensitive) |
| `ADMIN_PASS` | Yes | Admin password. Use a strong, unique value |
| `SESSION_SECRET` | Yes | Long random string used to sign the session cookie |
| `DATABASE_URL` | Production | Neon Postgres connection string. Leave empty locally |

Generate a strong session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Changing `SESSION_SECRET` signs out any active admin session. It is safe to use different values locally and on Vercel.

---

## Data Storage

The storage layer (`lib/store.js`) selects its backend automatically:

| Mode | When | Where data lives |
|---|---|---|
| **Neon Postgres** | `DATABASE_URL` is set | `inquiries` table (created automatically on first use) |
| **Local JSON file** | `DATABASE_URL` is empty | `data/inquiries.json` (auto-created, git-ignored) |

This allows zero-configuration local testing while keeping a real database in production.

### Inquiry schema

| Column | Type | Notes |
|---|---|---|
| `id` | serial | Primary key |
| `name` | text | Customer name |
| `phone` | text | Customer phone number |
| `category` | text | Selected lift category |
| `message` | text | Project details |
| `status` | text | `new`, `contacted` or `closed` |
| `note` | text | Internal admin note |
| `ip` | text | Used for rate limiting |
| `created_at` | timestamptz | Submission time |

---

## API Overview

### Public

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/quote` | Submit a quotation request (validated and rate-limited) |

### Admin (session cookie required, except login)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Sign in |
| `POST` | `/api/admin/logout` | Sign out |
| `GET` | `/api/admin/me` | Check the current session |
| `GET` | `/api/admin/inquiries` | List all inquiries |
| `PATCH` | `/api/admin/inquiries/:id` | Update status or note |
| `DELETE` | `/api/admin/inquiries/:id` | Delete an inquiry |
| `GET` | `/api/admin/export.csv` | Download all inquiries as CSV |

---

## Deployment (Vercel + Neon)

### 1. Push to GitHub

```bash
git add .
git commit -m "Update website"
git push
```

### 2. Create the Vercel project
1. Sign in to [Vercel](https://vercel.com) and click **Add New, Project**.
2. Import the `aoyama-site` repository.
3. Ensure **Framework Preset** is **Next.js** and no Build/Output overrides are enabled.

### 3. Add a database
In the Vercel project, open **Storage** and add **Neon (Postgres)**. This injects `DATABASE_URL` automatically.

### 4. Set environment variables
In **Settings, Environment Variables**, add `ADMIN_USER`, `ADMIN_PASS` and `SESSION_SECRET`.

### 5. Deploy
Click **Deploy** (or **Redeploy** after changing variables). Every future `git push` to `main` deploys automatically.

---

## Customisation Guide

| To change... | Edit |
|---|---|
| Products, specs, features, images | `lib/products.js` |
| Brochure PDFs | Replace files in `public/brochures/` (keep the file name equal to the product slug, e.g. `passenger.pdf`) |
| Hero headline and buttons | `components/Hero.jsx` |
| About, services, safety, FAQ, contact text | `lib/legacy.js` |
| Colours and fonts | `tailwind.config.js` (accent gold `#f59e0b`, fonts Sora and Inter) |
| Page title and SEO description | `app/layout.js` |
| Phone numbers and WhatsApp link | `lib/legacy.js` and `components/Navbar.jsx` |
| Cabin materials in the customiser | `components/ProductDetail.jsx` |

To add a new product, append an object to the `PRODUCTS` array in `lib/products.js`. Its page at `/products/<slug>` and its card on the home page are generated automatically.

---

## Security Notes

- Choose a **strong, unique `ADMIN_PASS`** before going live.
- Never commit `.env.local` (it is already in `.gitignore`).
- Session cookies are HTTP-only, signed with HMAC and verified using timing-safe comparison.
- Inquiries contain personal data (names and phone numbers). Restrict admin access and delete records you no longer need.
- Rotate `ADMIN_PASS` and `SESSION_SECRET` whenever access is handed to another person.

---

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Admin login says "Server setup is incomplete" | `ADMIN_USER`, `ADMIN_PASS` or `SESSION_SECRET` is missing. Add it and restart or redeploy |
| Incorrect username or password | Check for typos or extra spaces in `.env.local` / Vercel variables, then restart |
| Changes to `.env.local` have no effect | Stop and restart `npm run dev` |
| Quote form fails on Vercel | Confirm the Neon database is connected and `DATABASE_URL` exists, then redeploy |
| Vercel shows 404 on every page | Set Framework Preset to **Next.js** and turn off Output Directory overrides |
| Build fails | Open the failed deployment, read **Build Logs**, and fix the first error shown |
| `git push` rejected | Run `git pull --rebase` first, or use `--force` only when intentionally replacing history |

---

## Roadmap

- Replace placeholder brochures with official Aoyama PDFs.
- Replace stock product photography with real project and product images.
- Convert remaining static sections (About, Services, FAQ, Planner) into native React components.
- Email or WhatsApp notification when a new inquiry arrives.
- Urdu language toggle.

---

## Credits & Legal

- Developed for **Al Hamid Engineering Services**, Gulistan-e-Jauhar, Karachi.
- **Aoyama Elevator** name, logo and brand materials belong to Aoyama Elevator Global Ltd. and are used here under distributor authorisation. Confirm usage rights before reuse or redistribution.
- Product images are currently sourced from Unsplash and should be replaced with licensed or original photography for production.

**Contact:** 0301-2932901 / 0321-2971357
**Address:** Flat No. BL-1, Ground Floor, Kishwer Heights, Block-6, Gulistan-e-Jauhar, Karachi, Pakistan