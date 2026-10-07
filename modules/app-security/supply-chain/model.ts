/** A dependency tree where one deep package is vulnerable, and the defences along the supply chain. */

export interface Dep {
  name: string;
  depth: number;
  direct?: boolean;
  bad?: boolean;
  note?: string;
}

export const TREE: Dep[] = [
  { name: "your-shop-api", depth: 0, note: "The one package your team actually wrote." },
  { name: "web-framework", depth: 1, direct: true },
  { name: "image-resizer", depth: 1, direct: true },
  { name: "date-helper", depth: 2 },
  {
    name: "logging-lib",
    depth: 2,
    bad: true,
    note: "A known critical flaw lives here, three levels down. You never chose it directly.",
  },
  { name: "string-utils", depth: 3 },
  { name: "network-client", depth: 3 },
];

export type Step = "sbom" | "scan" | "pin" | "sign";

export const STEPS: { id: Step; name: string; detail: string; catches: string }[] = [
  {
    id: "sbom",
    name: "Keep an SBOM",
    detail: "A full ingredients list: every package and version you ship, direct and indirect.",
    catches: "Now you can answer “do we even use this?” in minutes, not weeks.",
  },
  {
    id: "scan",
    name: "Scan for known flaws",
    detail: "Check every dependency against vulnerability databases, in CI and on a schedule.",
    catches: "The flaw in logging-lib is flagged, three levels down.",
  },
  {
    id: "pin",
    name: "Pin and review updates",
    detail: "Lock exact versions; let bots open update PRs that a human reviews.",
    catches: "A surprise malicious version can't slip in automatically.",
  },
  {
    id: "sign",
    name: "Verify provenance",
    detail: "Check that a package was built from the source it claims, by signatures.",
    catches: "A tampered build fails the check before you install it.",
  },
];

export const ATTACKS: { id: string; name: string; detail: string }[] = [
  {
    id: "vuln",
    name: "A flaw in a popular library (Log4Shell, 2021)",
    detail:
      "One bug in a tiny logging library, rated maximum severity, was in so many Java apps that finding every use took weeks.",
  },
  {
    id: "build",
    name: "A poisoned build (SolarWinds, 2020)",
    detail:
      "Attackers broke into the build system, so the tainted update was properly signed. Up to ~18,000 customers installed it.",
  },
  {
    id: "backdoor",
    name: "A planted backdoor (xz utils, 2024)",
    detail:
      "Someone spent two years earning a tired volunteer maintainer's trust, then slipped a backdoor into a core Linux library. Caught by luck.",
  },
  {
    id: "account",
    name: "Hijacked maintainer accounts (2025–26)",
    detail:
      "Phishing and self-spreading worms took over popular npm packages. Even a security scanner's own release was briefly trojanised.",
  },
];
