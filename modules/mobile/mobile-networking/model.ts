/** Loading the café menu over different networks, with four fixes. All numbers are illustrative. */

export type Net = "wifi" | "4g" | "slow" | "dropping";

export const NETS: Record<Net, { label: string; rtt: number; kbps: number; drops: boolean }> = {
  wifi: { label: "Wi-Fi", rtt: 30, kbps: 20000, drops: false },
  "4g": { label: "Good 4G", rtt: 80, kbps: 8000, drops: false },
  slow: { label: "Slow 3G", rtt: 400, kbps: 400, drops: false },
  dropping: { label: "Dropping", rtt: 150, kbps: 1500, drops: true },
};

export interface Fixes {
  timeout: boolean;
  retry: boolean;
  cache: boolean;
  smaller: boolean;
}

export const FIXES: [keyof Fixes, string, string][] = [
  [
    "timeout",
    "Set a sensible timeout",
    "Give up on a stalled connection after 8 s of silence, instead of 60.",
  ],
  [
    "retry",
    "Retry with backoff",
    "Wait a moment, then try again, with growing gaps between tries.",
  ],
  ["cache", "Cache the last menu", "Show the saved menu at once and refresh it in the background."],
  [
    "smaller",
    "Fewer, smaller requests",
    "One request for the whole menu, thumbnails instead of full photos.",
  ],
];

export interface Result {
  firstScreen: number | null;
  fresh: number | null;
  kb: number;
  story: string;
}

export function load(net: Net, f: Fixes): Result {
  const n = NETS[net];
  const reqs = f.smaller ? 1 : 12;
  const kb = f.smaller ? 180 : 1200;
  const rounds = Math.ceil(reqs / 4);
  const base = (rounds * n.rtt) / 1000 + (kb * 8) / n.kbps;
  let fresh: number | null = base;
  let used = kb;
  let story = `${reqs} request${reqs > 1 ? "s" : ""}, ${kb} KB, arrived in ${base.toFixed(1)} s.`;
  if (n.drops) {
    const wait = f.timeout ? 8 : 60;
    used += Math.round(kb / 3);
    if (f.retry) {
      fresh = wait + 1 + base;
      used += kb;
      story = `The first try stalled; after ${wait} s of silence it gave up, waited 1 s and retried successfully.`;
    } else {
      fresh = null;
      story = `The first try stalled; after ${wait} s of silence the app showed "Something went wrong".`;
    }
  } else if (net === "slow") {
    story += " Slow but steady: data kept trickling in, so the idle timeout never fired.";
  }
  return { firstScreen: f.cache ? 0.1 : fresh, fresh, kb: used, story };
}
