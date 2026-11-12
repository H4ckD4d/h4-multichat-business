import {createHmac, timingSafeEqual} from 'node:crypto';

export function validMetaSignature(rawBody, signature, appSecret) {
  if (!appSecret || !Buffer.isBuffer(rawBody) || typeof signature !== 'string') return false;
  if (!/^sha256=[0-9a-f]{64}$/i.test(signature)) return false;
  const expected = `sha256=${createHmac('sha256', appSecret).update(rawBody).digest('hex')}`;
  const got = Buffer.from(signature.toLowerCase());
  const want = Buffer.from(expected);
  return got.length === want.length && timingSafeEqual(got, want);
}

export function verifyHandshake(url, verifyToken) {
  if (!verifyToken || url.searchParams.get('hub.mode') !== 'subscribe') return null;
  if (url.searchParams.get('hub.verify_token') !== verifyToken) return null;
  return url.searchParams.get('hub.challenge');
}
