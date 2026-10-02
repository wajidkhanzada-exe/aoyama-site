import { NextResponse } from 'next/server';
import { safeEq, makeToken, validToken } from '@/lib/auth';
import { listRows, updateRow, deleteRow } from '@/lib/store';

export const dynamic = 'force-dynamic';
const STATUSES = ['new', 'contacted', 'closed'];
const json = (body, status = 200) => NextResponse.json(body, { status });
const cookieOpts = { httpOnly: true, sameSite: 'strict', path: '/', secure: process.env.NODE_ENV === 'production' };

async function handle(req, ctx) {
  const params = (await ctx.params) || {};
  const p = (params.path || []).join('/');
  if (!process.env.ADMIN_PASS)
    return json({ ok: false, error: 'Admin password is not set. Add ADMIN_PASS to .env.local and restart the server.' }, 503);
  try {
    if (p === 'login' && req.method === 'POST') {
      const { user, pass } = await req.json().catch(() => ({}));
      const userOk = safeEq(String(user || '').trim().toLowerCase(), String(process.env.ADMIN_USER || 'admin').trim().toLowerCase());
      const passOk = safeEq(pass || '', process.env.ADMIN_PASS);
      if (userOk && passOk) {
        const res = json({ ok: true });
        res.cookies.set('adm', makeToken(), { ...cookieOpts, maxAge: 28800 });
        return res;
      }
      await new Promise(r => setTimeout(r, 800)); // slows down password guessing
      return json({ ok: false, error: 'Incorrect username or password.' }, 401);
    }
    if (p === 'logout') {
      const res = json({ ok: true });
      res.cookies.set('adm', '', { ...cookieOpts, maxAge: 0 });
      return res;
    }
    if (!validToken(req.cookies.get('adm')?.value)) return json({ ok: false, error: 'Login required' }, 401);
    if (p === 'me') return json({ ok: true });
    if (p === 'inquiries' && req.method === 'GET') return json({ ok: true, rows: await listRows() });

    const m = p.match(/^inquiries\/(\d+)$/);
    if (m && req.method === 'PATCH') {
      const { status, note } = await req.json().catch(() => ({}));
      if (status !== undefined && !STATUSES.includes(status)) return json({ ok: false, error: 'Bad status' }, 400);
      await updateRow(Number(m[1]), { status, note: note === undefined ? undefined : String(note).slice(0, 1000) });
      return json({ ok: true });
    }
    if (m && req.method === 'DELETE') { await deleteRow(Number(m[1])); return json({ ok: true }); }

    if (p === 'export.csv') {
      const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
      const rows = await listRows();
      const csv = ['id,created_at_utc,name,phone,category,status,message,note',
        ...rows.map(r => [r.id, r.created_at, r.name, r.phone, r.category, r.status, r.message, r.note].map(q).join(','))].join('\n');
      return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="inquiries.csv"' } });
    }
    return json({ ok: false, error: 'Not found' }, 404);
  } catch (e) {
    console.error('Admin error:', e.message);
    return json({ ok: false, error: 'Server error' }, 500);
  }
}
export const GET = handle, POST = handle, PATCH = handle, DELETE = handle;
