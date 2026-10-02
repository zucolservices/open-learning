/** Kafka's default key hash: a port of org.apache.kafka.common.utils.Utils.murmur2 (32-bit). */
export function murmur2(data: Uint8Array): number {
  const length = data.length;
  const seed = 0x9747b28c;
  const m = 0x5bd1e995;
  const r = 24;
  let h = (seed ^ length) | 0;
  const length4 = length >> 2;
  for (let i = 0; i < length4; i++) {
    const i4 = i * 4;
    let k =
      (data[i4] & 0xff) +
      ((data[i4 + 1] & 0xff) << 8) +
      ((data[i4 + 2] & 0xff) << 16) +
      ((data[i4 + 3] & 0xff) << 24);
    k = Math.imul(k, m);
    k ^= k >>> r;
    k = Math.imul(k, m);
    h = Math.imul(h, m);
    h ^= k;
  }
  const base = length & ~3;
  switch (length % 4) {
    case 3:
      h ^= (data[base + 2] & 0xff) << 16;
    // falls through
    case 2:
      h ^= (data[base + 1] & 0xff) << 8;
    // falls through
    case 1:
      h ^= data[base] & 0xff;
      h = Math.imul(h, m);
  }
  h ^= h >>> 13;
  h = Math.imul(h, m);
  h ^= h >>> 15;
  return h | 0;
}

const enc = new TextEncoder();

/** The partition Kafka's Java producer picks for a string key: toPositive(murmur2(bytes)) % n. */
export function partitionFor(key: string, n: number): number {
  return (murmur2(enc.encode(key)) & 0x7fffffff) % n;
}
