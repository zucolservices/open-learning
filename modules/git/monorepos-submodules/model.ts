/** One product, organised as many repositories or one monorepo. Trade-offs are qualitative. */

export type Shape = "poly" | "mono";

export const PARTS = ["web app", "mobile app", "payments service", "shared UI kit", "menu API"];

export const TASK = "Rename a function in the shared UI kit that every app uses";

export const STEPS: Record<Shape, { step: string; note: string }[]> = {
  poly: [
    {
      step: "Change ui-kit, bump to v4.0, publish",
      note: "One pull request in the ui-kit repository.",
    },
    { step: "Update web app to ui-kit v4", note: "A second pull request, in another repository." },
    {
      step: "Update mobile app to ui-kit v4",
      note: "A third. The mobile team is busy; it waits a week.",
    },
    {
      step: "Payments still on v3 two months later",
      note: "Versions drift; two copies of the kit are now in production.",
    },
  ],
  mono: [
    {
      step: "Change the kit and every caller in one commit",
      note: "One pull request touches all five folders.",
    },
    {
      step: "CI tests only what the change affects",
      note: "Build tools work out which projects depend on the kit.",
    },
    { step: "Merge once", note: "Everything moves together; nothing drifts." },
    {
      step: "But: one huge repository",
      note: "Clones, permissions and CI need care (the previous module's tools help).",
    },
  ],
};

export const TOOLS: [string, string][] = [
  ["Bazel", "Google's open-source build system: hermetic, cached builds across many languages."],
  [
    "Nx",
    "Builds, caching and affected-project detection, popular for JavaScript and TypeScript (and now maintains Lerna).",
  ],
  ["Turborepo", "Fast task running and remote caching for JavaScript monorepos, from Vercel."],
  ["Pants and Buck2", "Bazel-like build systems from the open-source community and Meta."],
];
