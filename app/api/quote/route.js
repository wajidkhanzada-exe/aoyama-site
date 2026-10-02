import { NextResponse } from 'next/server';
import { addRow, recentCount } from '@/lib/store';

export const dynamic = 'force-dynamic';
const CATEGORIES = ['Passenger / MRL Elevator', 'Villa / Home Lift', 'Escalator / Moving Walk', 'Repair & Maintenance'];
const fail = (error, status) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const name = String(b.name || '').trim().slice(0, 100);
  const phone = String(b.phone || '').trim().slice(0, 20);
  const category = String(b.category || '').trim();
  const message = String(b.message || '').trim().slice(0, 1500);
  if (name.length < 2) return fail('Please enter your name.', 400);
  if (!/^\+?[\d\s-]{10,16}$/.test(phone)) return fail('Please enter a valid phone number.', 400);
  if (!CATEGORIES.includes(category)) return fail('Please choose a lift category.', 400);
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim().slice(0, 60);
  try {
    if ((await recentCount(ip)) >= 5) return fail('Too many requests. Please try again in 15 minutes.', 429);
    await addRow({ name, phone, category, message, ip });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Quote error:', e.message);
    return fail('Server error. Please call 0301-2932901.', 500);
  }
}
