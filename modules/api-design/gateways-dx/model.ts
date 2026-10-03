/** A gateway in front of three services, and a newcomer's first API call (illustrative). */

export type Policy = "auth" | "limit" | "route" | "log" | "tls";

export const POLICIES: { id: Policy; label: string }[] = [
  { id: "tls", label: "TLS (HTTPS) termination" },
  { id: "auth", label: "Check API keys and tokens" },
  { id: "limit", label: "Rate limits per client" },
  { id: "route", label: "Route /v1 and /v2 to the right service" },
  { id: "log", label: "Logs and usage analytics" },
];

export const SERVICES = ["Tracking", "Booking", "Pricing"];

export type Feature = "selfserve" | "sandbox" | "examples" | "quickstart" | "collection" | "errors";

export const FEATURES: { id: Feature; label: string; saves: number; note: string }[] = [
  {
    id: "selfserve",
    label: "Sign up and get a key instantly",
    saves: 2880,
    note: "No waiting two days for an email with credentials.",
  },
  {
    id: "sandbox",
    label: "A sandbox with test keys",
    saves: 60,
    note: "Try things without real parcels or real money.",
  },
  {
    id: "quickstart",
    label: "A five-minute quickstart guide",
    saves: 40,
    note: "One page from zero to a working call.",
  },
  {
    id: "examples",
    label: "Copy-paste examples in several languages",
    saves: 30,
    note: "curl, Python, JavaScript, Java.",
  },
  {
    id: "collection",
    label: "A ready-made collection or SDK",
    saves: 20,
    note: "Import and run: no hand-built requests.",
  },
  {
    id: "errors",
    label: "Errors that say what to fix",
    saves: 25,
    note: "“Missing header X-Api-Key”, with a docs link.",
  },
];

/** Illustrative minutes from landing on the portal to a first successful call. */
export function ttfc(on: Feature[]): number {
  const base = 2880 + 200;
  return Math.max(
    4,
    base - FEATURES.filter((f) => on.includes(f.id)).reduce((n, f) => n + f.saves, 0),
  );
}

export function fmt(min: number): string {
  if (min >= 1440) return `${(min / 1440).toFixed(1)} days`;
  if (min >= 60) return `${(min / 60).toFixed(1)} hours`;
  return `${Math.round(min)} minutes`;
}
