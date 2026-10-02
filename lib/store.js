import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

// Neon Postgres when DATABASE_URL is set, otherwise a local JSON file (for testing on localhost).
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = url ? neon(url) : null;
const FILE = path.join(process.cwd(), 'data', 'inquiries.json');
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
const readFile = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return []; } };
const writeFile = rows => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(rows, null, 2)); };

let ready;
async function init() {
  ready = ready || sql`CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL, category TEXT NOT NULL,
    message TEXT, status TEXT DEFAULT 'new', note TEXT, ip TEXT, created_at TIMESTAMPTZ DEFAULT now())`;
  return ready;
}

export async function listRows() {
  if (!sql) return readFile().reverse();
  await init();
  return sql`SELECT id, name, phone, category, message, status, note,
    to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS created_at
    FROM inquiries ORDER BY id DESC LIMIT 1000`;
}
export async function addRow(r) {
  if (!sql) {
    const rows = readFile();
    rows.push({ id: (rows.length ? rows[rows.length - 1].id : 0) + 1, ...r, status: 'new', note: '', created_at: now() });
    return writeFile(rows);
  }
  await init();
  await sql`INSERT INTO inquiries (name, phone, category, message, ip) VALUES (${r.name}, ${r.phone}, ${r.category}, ${r.message}, ${r.ip})`;
}
export async function recentCount(ip) {
  if (!sql) {
    const cutoff = Date.now() - 15 * 60 * 1000;
    return readFile().filter(x => x.ip === ip && new Date(x.created_at.replace(' ', 'T') + 'Z').getTime() > cutoff).length;
  }
  await init();
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM inquiries WHERE ip = ${ip} AND created_at > now() - interval '15 minutes'`;
  return n;
}
export async function updateRow(id, { status, note }) {
  if (!sql) {
    return writeFile(readFile().map(r => r.id === id ? { ...r, ...(status !== undefined && { status }), ...(note !== undefined && { note }) } : r));
  }
  await init();
  if (status !== undefined) await sql`UPDATE inquiries SET status = ${status} WHERE id = ${id}`;
  if (note !== undefined) await sql`UPDATE inquiries SET note = ${note} WHERE id = ${id}`;
}
export async function deleteRow(id) {
  if (!sql) return writeFile(readFile().filter(r => r.id !== id));
  await init();
  await sql`DELETE FROM inquiries WHERE id = ${id}`;
}
