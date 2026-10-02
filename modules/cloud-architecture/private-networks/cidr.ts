/** Small IPv4 CIDR helpers: everything here is exact arithmetic, run live in the browser. */

export interface Block {
  base: number; // network address as an unsigned 32-bit number
  prefix: number; // 0–32
}

export function ipToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n;
}

export function intToIp(n: number): string {
  return [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join(".");
}

export function parse(cidr: string): Block | null {
  const [ip, p] = cidr.trim().split("/");
  const base = ipToInt(ip ?? "");
  const prefix = Number(p);
  if (base === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;
  return { base: base - (base % size({ base: 0, prefix })), prefix };
}

export const size = (b: Block) => 2 ** (32 - b.prefix);
export const last = (b: Block) => b.base + size(b) - 1;
export const format = (b: Block) => `${intToIp(b.base)}/${b.prefix}`;

export const contains = (outer: Block, inner: Block) =>
  inner.base >= outer.base && last(inner) <= last(outer);

export const overlaps = (a: Block, b: Block) => a.base <= last(b) && b.base <= last(a);

/** The first block of the given prefix inside `outer` that doesn't overlap any of `taken`. */
export function nextFree(outer: Block, prefix: number, taken: Block[]): Block | null {
  const step = 2 ** (32 - prefix);
  for (let base = outer.base; base + step - 1 <= last(outer); base += step) {
    const b = { base, prefix };
    if (!taken.some((t) => overlaps(t, b))) return b;
  }
  return null;
}

/** RFC 1918 private ranges. */
export const PRIVATE: Block[] = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].map((c) =>
  parse(c)!,
);
export const isPrivate = (b: Block) => PRIVATE.some((p) => contains(p, b));
