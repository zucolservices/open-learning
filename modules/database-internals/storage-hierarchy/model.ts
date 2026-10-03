/** The latency ladder (rough, c. 2012, Jeff Dean's version of Norvig's table), plus a page-reading exercise. */

export const LADDER: { label: string; ns: number; note: string }[] = [
  { label: "CPU L1 cache", ns: 0.5, note: "On the chip itself" },
  { label: "Main memory", ns: 100, note: "Where the buffer pool lives" },
  { label: "SSD, 4 KB random read", ns: 150_000, note: "2012-era SSD; modern NVMe is tens of µs" },
  { label: "Spinning disk seek", ns: 10_000_000, note: "Moving the head to a new place" },
];

/** Express a duration as if an L1 cache hit took one second. */
export function human(ns: number): string {
  const s = ns / 0.5;
  if (s < 60) return `${s.toFixed(0)} second${s.toFixed(0) === "1" ? "" : "s"}`;
  if (s < 3600) return `${(s / 60).toFixed(1)} minutes`;
  if (s < 86400) return `${(s / 3600).toFixed(1)} hours`;
  if (s < 86400 * 60) return `${(s / 86400).toFixed(1)} days`;
  return `${(s / (86400 * 30.4)).toFixed(1)} months`;
}

export function real(ns: number): string {
  if (ns < 1000) return `${ns} ns`;
  if (ns < 1_000_000) return `${ns / 1000} µs`;
  return `${ns / 1_000_000} ms`;
}

export type Fetch = "one" | "samePage" | "spread";
export type Device = "ssd" | "hdd";

export const FETCHES: Record<Fetch, { label: string; rows: number; pages: number; note: string }> =
  {
    one: {
      label: "One order",
      rows: 1,
      pages: 1,
      note: "One row lives on one page, so one page is read.",
    },
    samePage: {
      label: "80 orders stored together",
      rows: 80,
      pages: 1,
      note: "All 80 fit on the same 8 kB page: still one read.",
    },
    spread: {
      label: "80 orders scattered",
      rows: 80,
      pages: 80,
      note: "Each lives on a different page: 80 reads.",
    },
  };

export const DEVICE_US: Record<Device, number> = { ssd: 100, hdd: 8000 };
