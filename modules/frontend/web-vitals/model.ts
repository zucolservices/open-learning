/** A slow, jumpy, made-up shop page and fixes that move each Core Web Vital. Numbers are illustrative. */

export const BASE = { lcp: 5.1, inp: 480, cls: 0.29 };

export const FIXES: {
  id: string;
  metric: "lcp" | "inp" | "cls";
  problem: string;
  fix: string;
  delta: number;
}[] = [
  {
    id: "lazy",
    metric: "lcp",
    problem: 'The hero image has loading="lazy"',
    fix: 'Load it eagerly with fetchpriority="high"',
    delta: -1.4,
  },
  {
    id: "huge",
    metric: "lcp",
    problem: "The hero is a 2.4 MB photo",
    fix: "Serve a correctly sized AVIF or WebP",
    delta: -0.8,
  },
  {
    id: "blocking",
    metric: "lcp",
    problem: "A chat widget script blocks rendering in the head",
    fix: "Load it with defer, after the content",
    delta: -0.6,
  },
  {
    id: "handler",
    metric: "inp",
    problem: "“Add to cart” runs 400 ms of work before updating the screen",
    fix: "Update the button first, then do the rest in smaller chunks",
    delta: -330,
  },
  {
    id: "banner",
    metric: "cls",
    problem: "A promo banner is inserted above the content after load",
    fix: "Reserve its space in the layout from the start",
    delta: -0.18,
  },
  {
    id: "dims",
    metric: "cls",
    problem: "Images have no width and height",
    fix: "Add width and height (or aspect-ratio)",
    delta: -0.08,
  },
];

export const T = {
  lcp: { good: 2.5, poor: 4, unit: "s", label: "LCP · loading" },
  inp: { good: 200, poor: 500, unit: "ms", label: "INP · responsiveness" },
  cls: { good: 0.1, poor: 0.25, unit: "", label: "CLS · visual stability" },
} as const;

export const ALMANAC: [string, number, number][] = [
  ["All three good", 48, 56],
  ["Good LCP", 62, 74],
  ["Good INP", 77, 97],
  ["Good CLS", 81, 72],
];
