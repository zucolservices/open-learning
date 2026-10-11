/**
 * A server-rendered product page made interactive four ways. JavaScript sizes and stages are
 * illustrative.
 */

export type Approach = "full" | "islands" | "rsc" | "resume";
export type Status = "html" | "download" | "hydrate" | "live" | "never";

export const PARTS: { id: string; label: string; interactive: boolean }[] = [
  { id: "header", label: "Header and logo", interactive: false },
  { id: "desc", label: "Product description", interactive: false },
  { id: "gallery", label: "Photo gallery", interactive: true },
  { id: "cart", label: "Add to cart", interactive: true },
  { id: "reviews", label: "Reviews", interactive: false },
];

export const APPROACHES: { id: Approach; label: string; who: string; kb: number; note: string }[] =
  [
    {
      id: "full",
      label: "Full hydration",
      who: "Classic SSR in most frameworks",
      kb: 180,
      note: "Every component's code downloads and runs, even for parts that never change, before anything responds.",
    },
    {
      id: "islands",
      label: "Islands",
      who: "Astro; partial hydration elsewhere",
      kb: 40,
      note: "Only the interactive islands get JavaScript. The rest stays plain HTML.",
    },
    {
      id: "rsc",
      label: "Server components",
      who: "React Server Components (React 19)",
      kb: 70,
      note: "Server components never ship their code. Client components, plus React itself, still hydrate.",
    },
    {
      id: "resume",
      label: "Resumability",
      who: "Qwik",
      kb: 1,
      note: "A tiny loader waits; the code for a button downloads only when someone clicks it.",
    },
  ];

export const STAGES = ["HTML arrives", "JavaScript downloads", "Hydrating", "Done"];

export function status(a: Approach, part: (typeof PARTS)[number], stage: number): Status {
  if (a === "resume") return part.interactive ? (stage >= 1 ? "live" : "html") : "never";
  if (a === "full")
    return stage === 0 ? "html" : stage === 1 ? "download" : stage === 2 ? "hydrate" : "live";
  if (!part.interactive) return "never";
  return stage === 0
    ? "html"
    : stage === 1
      ? "download"
      : a === "islands" || stage === 3
        ? "live"
        : "hydrate";
}

export const LABEL: Record<Status, string> = {
  html: "looks ready, can't respond",
  download: "downloading code",
  hydrate: "hydrating",
  live: "interactive",
  never: "plain HTML (no JS needed)",
};
