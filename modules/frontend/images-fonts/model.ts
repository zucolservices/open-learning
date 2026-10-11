/** A made-up product page's images and font, and fixes for each. Numbers are illustrative, on a phone. */

export const BASE = { kb: 4300, lcp: 4.6, cls: 0.21, invisible: 2.4 };

export const FIXES: {
  id: string;
  group: "Hero image" | "Thumbnails" | "Web font";
  problem: string;
  fix: string;
  kb?: number;
  lcp?: number;
  cls?: number;
  invisible?: number;
}[] = [
  {
    id: "avif",
    group: "Hero image",
    problem: "A 2.4 MB JPEG",
    fix: "AVIF (or WebP) at good quality",
    kb: -1500,
    lcp: -0.9,
  },
  {
    id: "srcset",
    group: "Hero image",
    problem: "The same 3000-pixel-wide file for every screen",
    fix: "srcset and sizes: phones get an 800-pixel version",
    kb: -700,
    lcp: -0.6,
  },
  {
    id: "eager",
    group: "Hero image",
    problem: 'loading="lazy" on the hero',
    fix: 'Load eagerly with fetchpriority="high"',
    lcp: -0.9,
  },
  {
    id: "lazy",
    group: "Thumbnails",
    problem: "All 12 thumbnails load straight away",
    fix: 'loading="lazy" on below-the-fold thumbnails',
    kb: -900,
  },
  {
    id: "dims",
    group: "Thumbnails",
    problem: "No width or height on images",
    fix: "width and height set, so space is reserved",
    cls: -0.14,
  },
  {
    id: "swap",
    group: "Web font",
    problem: "font-display: block hides text while the font loads",
    fix: "font-display: swap with a size-matched fallback",
    invisible: -2.4,
    cls: -0.06,
  },
  {
    id: "preload",
    group: "Web font",
    problem: "The font is discovered late, inside the CSS",
    fix: '<link rel="preload" as="font" crossorigin>',
    lcp: -0.3,
  },
];
