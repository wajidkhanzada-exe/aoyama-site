import crypto from 'crypto';

const sha = v => crypto.createHash('sha256').update(String(v)).digest();
export const safeEq = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const sign = p => crypto.createHmac('sha256', process.env.SESSION_SECRET || 'aoyama:' + process.env.ADMIN_PASS).update(p).digest('hex');
export const makeToken = () => { const exp = String(Date.now() + 8 * 3600e3); return exp + '.' + sign(exp); };
export function validToken(t) {
  if (!t) return false;
  const [exp, sig] = t.split('.');
  if (!exp || !sig) return false;
  const good = sign(exp);
  if (sig.length !== good.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)) && Number(exp) > Date.now();
}
