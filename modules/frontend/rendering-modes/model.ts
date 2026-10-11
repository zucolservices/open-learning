/** The same product page rendered four ways. All times are illustrative, in seconds. */

export type Mode = "csr" | "ssr" | "ssg" | "isr";

export const MODES: {
  id: Mode;
  label: string;
  where: string;
  ttfb: number;
  content: number;
  interactive: number;
  jsHeavy: boolean;
  fresh: string;
  cost: string;
}[] = [
  {
    id: "csr",
    label: "Client-side (CSR)",
    where: "An empty HTML shell; JavaScript builds the page and fetches data in the browser.",
    ttfb: 0.1,
    content: 1.8,
    interactive: 1.8,
    jsHeavy: true,
    fresh: "Always fresh",
    cost: "Low: static files from a CDN",
  },
  {
    id: "ssr",
    label: "Server-side (SSR)",
    where: "The server fetches data and renders HTML for every request.",
    ttfb: 0.6,
    content: 0.8,
    interactive: 1.6,
    jsHeavy: false,
    fresh: "Always fresh",
    cost: "Higher: a render per visit",
  },
  {
    id: "ssg",
    label: "Static (SSG)",
    where: "HTML is built once at build time and served from a CDN.",
    ttfb: 0.1,
    content: 0.3,
    interactive: 1.1,
    jsHeavy: false,
    fresh: "As of the last build",
    cost: "Lowest: files only",
  },
  {
    id: "isr",
    label: "Static + revalidate (ISR)",
    where: "Like static, but pages are quietly rebuilt in the background after a set time.",
    ttfb: 0.1,
    content: 0.3,
    interactive: 1.1,
    jsHeavy: false,
    fresh: "Up to a few minutes old",
    cost: "Low: occasional rebuilds",
  },
];

export function times(mode: Mode, slowPhone: boolean) {
  const m = MODES.find((x) => x.id === mode)!;
  const extra = slowPhone ? (m.jsHeavy ? 1.2 : 0.9) : 0;
  return {
    ttfb: m.ttfb,
    content: m.jsHeavy ? m.content + extra : m.content,
    interactive: m.interactive + extra,
  };
}
