/** A made-up product page that users complain about, the evidence, and the fixes. Numbers are illustrative. */

export const FIELD = { lcp: 4.8, inp: 380, cls: 0.22 };

export type Metric = "lcp" | "inp" | "cls" | "none";

export const FINDINGS: { id: string; text: string; answer: Metric; why: string }[] = [
  {
    id: "bg",
    text: "The hero photo is a CSS background in a stylesheet that JavaScript loads",
    answer: "lcp",
    why: "The browser can't discover the largest image until late.",
  },
  {
    id: "task",
    text: "A 1.2 MB script runs a 600 ms task as the page starts",
    answer: "inp",
    why: "Taps during that task wait. It delays loading too, but responsiveness suffers most.",
  },
  {
    id: "banner",
    text: "A cookie banner pushes the page down after it loads",
    answer: "cls",
    why: "Unexpected movement of visible content.",
  },
  {
    id: "reviews",
    text: "The reviews filter re-renders all 400 reviews on every keystroke",
    answer: "inp",
    why: "Each key press triggers a long task.",
  },
  {
    id: "favicon",
    text: "The favicon is 40 KB",
    answer: "none",
    why: "Wasteful, but it doesn't affect any vital noticeably.",
  },
  {
    id: "font",
    text: "The web font arrives late and text reflows when it swaps",
    answer: "cls",
    why: "A size change on swap moves content.",
  },
];

export const FIXES: {
  id: string;
  label: string;
  effort: string;
  lcp?: number;
  inp?: number;
  cls?: number;
  note: string;
}[] = [
  {
    id: "hero",
    label: 'Make the hero a real <img> with fetchpriority="high", in a modern format',
    effort: "Small",
    lcp: -2.1,
    note: "Discovered by the HTML parser immediately, and smaller.",
  },
  {
    id: "split",
    label: "Split the big script and defer non-critical work",
    effort: "Medium",
    inp: -190,
    lcp: -0.4,
    note: "The start-up task drops below 50 ms chunks.",
  },
  {
    id: "space",
    label: "Reserve space for the banner and use a size-matched font fallback",
    effort: "Small",
    cls: -0.19,
    note: "Nothing moves after first paint.",
  },
  {
    id: "favicon",
    label: "Compress the favicon",
    effort: "Small",
    note: "Fine to do, but users won't feel it.",
  },
  {
    id: "rewrite",
    label: "Rewrite the page in a newer framework",
    effort: "Huge",
    note: "Months of work, high risk, and the same problems can come back.",
  },
  {
    id: "spinner",
    label: "Add a loading spinner over the page",
    effort: "Small",
    note: "Hides the problem; the page is no faster.",
  },
];

export const AUDIT: { id: string; text: string; now: boolean; why: string }[] = [
  {
    id: "alt",
    text: "Product photos have no alt text",
    now: true,
    why: "Screen-reader users can't tell what's for sale.",
  },
  {
    id: "div",
    text: "“Add to cart” is a clickable div",
    now: true,
    why: "Keyboard users can't buy anything at all.",
  },
  {
    id: "token",
    text: "The session token is kept in localStorage",
    now: true,
    why: "Any injected script could steal sessions.",
  },
  {
    id: "skip",
    text: "Headings jump from h2 to h4",
    now: false,
    why: "Worth fixing, but people can still use the page.",
  },
];

export const PROVE: { id: string; label: string; best: boolean; outcome: string }[] = [
  {
    id: "revert",
    label: "Revert the changes",
    best: false,
    outcome:
      "The field numbers haven't had time to move yet; reverting throws away real improvements.",
  },
  {
    id: "wait",
    label:
      "Check your own real-user monitoring now, and watch the public field data improve over the next four weeks",
    best: true,
    outcome:
      "Right: CrUX is a rolling 28-day window, so it lags a fix. Your own RUM (for example, the web-vitals library) shows the change within days.",
  },
  {
    id: "lab",
    label: "Announce success from the new Lighthouse score",
    best: false,
    outcome:
      "A lab score is one simulated load on one machine. It's a useful check, not proof that users' experience changed.",
  },
];
