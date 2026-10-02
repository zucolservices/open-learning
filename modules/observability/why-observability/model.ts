/**
 * 2,000 checkout requests from one night (illustrative), each with a few attributes. The failures
 * are concentrated in one bank's payments on the newest app version, which only slicing reveals.
 */

export type Attr = "bank" | "app" | "region" | "device";

export const ATTRS: Record<Attr, { name: string; values: string[] }> = {
  bank: { name: "Customer's bank", values: ["Bank A", "Bank B", "Bank C", "Bank D", "Bank E"] },
  app: { name: "App version", values: ["5.0", "5.1", "5.2"] },
  region: { name: "Region", values: ["North", "South", "East", "West"] },
  device: { name: "Device", values: ["Android", "iPhone", "Web"] },
};

export interface Req {
  bank: string;
  app: string;
  region: string;
  device: string;
  failed: boolean;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export const REQUESTS: Req[] = (() => {
  const r = rng(7);
  const pick = (a: string[]) => a[Math.floor(r() * a.length)];
  return Array.from({ length: 2000 }, () => {
    const bank = pick(ATTRS.bank.values);
    const app = r() < 0.5 ? "5.2" : pick(["5.0", "5.1"]);
    const region = pick(ATTRS.region.values);
    const device = pick(ATTRS.device.values);
    // Background failures everywhere; Bank C on app 5.2 fails most of the time.
    const p = bank === "Bank C" && app === "5.2" ? 0.62 : 0.006;
    return { bank, app, region, device, failed: r() < p };
  });
})();

export function errorRate(rows: Req[]): number {
  return rows.length ? rows.filter((x) => x.failed).length / rows.length : 0;
}

export function groupBy(rows: Req[], attr: Attr) {
  return ATTRS[attr].values.map((v) => {
    const sub = rows.filter((x) => x[attr] === v);
    return { value: v, count: sub.length, rate: errorRate(sub) };
  });
}
