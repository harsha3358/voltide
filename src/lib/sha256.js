// Pure-JS SHA-256. Used instead of crypto.subtle so hashing also works when the
// walkthrough is served over plain http on a classroom LAN (subtle needs https).
const primes = [];
for (let n = 2; primes.length < 64; n++) if (primes.every(p => n % p)) primes.push(n);
const frac = x => ((x - Math.floor(x)) * 2 ** 32) >>> 0;
const K = primes.map(p => frac(Math.cbrt(p)));
const H0 = primes.slice(0, 8).map(p => frac(Math.sqrt(p)));
const rotr = (x, n) => (x >>> n) | (x << (32 - n));

export function sha256Bytes(bytes) {
  const len = bytes.length;
  const size = ((len + 9 + 63) >> 6) << 6;
  const buf = new Uint8Array(size);
  buf.set(bytes);
  buf[len] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(size - 8, Math.floor(len / 0x20000000));
  view.setUint32(size - 4, (len << 3) >>> 0);
  const h = H0.slice();
  const w = new Uint32Array(64);
  for (let i = 0; i < size; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = view.getUint32(i + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let t = 0; t < 64; t++) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    [a, b, c, d, e, f, g, hh].forEach((v, k) => { h[k] = (h[k] + v) >>> 0; });
  }
  return h.map(x => x.toString(16).padStart(8, '0')).join('');
}

export const sha256 = text => sha256Bytes(new TextEncoder().encode(String(text)));
