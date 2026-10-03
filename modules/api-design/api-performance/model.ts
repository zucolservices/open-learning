/** Fetching one product five times in 21 minutes, with and without HTTP's performance tools (illustrative). */

export type Tool = "cache" | "etag" | "gzip" | "fields";

export const TOOLS: { id: Tool; label: string; header: string }[] = [
  { id: "cache", label: "Cache for a minute", header: "Cache-Control: max-age=60" },
  {
    id: "etag",
    label: "ETags and conditional requests",
    header: 'ETag: "v7" → If-None-Match: "v7"',
  },
  { id: "gzip", label: "Compression", header: "Content-Encoding: br" },
  { id: "fields", label: "Ask only for needed fields", header: "?fields=name,price_paise" },
];

export const FETCHES = [
  { at: "0:00", sec: 0 },
  { at: "0:30", sec: 30 },
  { at: "5:00", sec: 300 },
  { at: "16:00", sec: 960 },
  { at: "16:20", sec: 980 },
];
const CHANGE_AT = 900; // the price changes at 15:00

export interface Fetch {
  at: string;
  kind: "full" | "304" | "local";
  kb: number;
  note: string;
}

export function simulate(on: Tool[]) {
  const has = (t: Tool) => on.includes(t);
  const body = (has("fields") ? 2 : 48) * (has("gzip") ? 0.2 : 1);
  const out: Fetch[] = [];
  let cachedAt: number | null = null;
  let cachedVersion = 0;
  for (const f of FETCHES) {
    const version = f.sec >= CHANGE_AT ? 2 : 1;
    if (has("cache") && cachedAt !== null && f.sec - cachedAt < 60) {
      out.push({
        at: f.at,
        kind: "local",
        kb: 0,
        note: "Served from the app's cache: no request at all.",
      });
      continue;
    }
    if (has("etag") && cachedAt !== null) {
      if (cachedVersion === version) {
        out.push({
          at: f.at,
          kind: "304",
          kb: 0.3,
          note: '304 Not Modified: "you already have it".',
        });
        cachedAt = f.sec;
        continue;
      }
      out.push({
        at: f.at,
        kind: "full",
        kb: body,
        note: "It changed, so the server sends the new version.",
      });
      cachedAt = f.sec;
      cachedVersion = version;
      continue;
    }
    out.push({ at: f.at, kind: "full", kb: body, note: "200 OK with the whole body." });
    cachedAt = f.sec;
    cachedVersion = version;
  }
  const trips = out.filter((x) => x.kind !== "local").length;
  const kb = out.reduce((n, x) => n + x.kb, 0);
  return { out, trips, kb };
}
