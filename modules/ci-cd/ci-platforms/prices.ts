/**
 * List prices read on 3 October 2026, in US dollars (vendor pricing pages; see SOURCES.md).
 * Compute only: per-user seat prices are left out. Prices change; check the vendor page.
 */

export interface Platform {
  id: string;
  name: string;
  plan: string;
  /** Free Linux minutes per month on this plan (2-vCPU class). */
  includedLinux: number;
  linuxPerMin: number;
  /** macOS price per minute, or null if not offered on demand. */
  macPerMin: number | null;
  /** macOS minutes also draw down included minutes at this multiple (GitLab cost factor). */
  macFactor?: number;
  note: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: "github",
    name: "GitHub Actions",
    plan: "Team",
    includedLinux: 3000,
    linuxPerMin: 0.006,
    macPerMin: 0.062,
    note: "Self-hosted runners are free; a planned $0.002/min fee for them was postponed.",
  },
  {
    id: "gitlab",
    name: "GitLab.com",
    plan: "Premium",
    includedLinux: 10000,
    linuxPerMin: 0.01,
    macPerMin: 0.06,
    macFactor: 6,
    note: "Extra compute minutes are $10 per 1,000; macOS uses minutes at 6×. Premium seats are $29/user/month.",
  },
  {
    id: "circleci",
    name: "CircleCI",
    plan: "Free credits, then pay as you go",
    includedLinux: 3000,
    linuxPerMin: 0.006,
    macPerMin: 0.12,
    note: "Priced in credits: $15 per 25,000; Linux medium is 10 credits a minute, macOS M4 Pro 200.",
  },
  {
    id: "codebuild",
    name: "AWS CodeBuild",
    plan: "On demand",
    includedLinux: 100,
    linuxPerMin: 0.005,
    macPerMin: null,
    note: "general1.small Linux. macOS only on reserved capacity.",
  },
  {
    id: "cloudbuild",
    name: "Google Cloud Build",
    plan: "On demand",
    includedLinux: 2500,
    linuxPerMin: 0.006,
    macPerMin: null,
    note: "e2-standard-2, billed per second. No macOS.",
  },
];

/** Self-hosted on AWS EC2 (us-east-1, on demand). */
export const EC2 = { instance: "m7i.large", perHour: 0.1008, hoursPerMonth: 730 };

export function monthlyCost(p: Platform, linux: number, mac: number): number | null {
  if (mac > 0 && p.macPerMin === null) return null;
  if (p.macFactor) {
    // GitLab: macOS minutes draw down the same pool at their cost factor.
    const used = linux + mac * p.macFactor;
    return Math.max(0, used - p.includedLinux) * p.linuxPerMin;
  }
  return Math.max(0, linux - p.includedLinux) * p.linuxPerMin + mac * (p.macPerMin ?? 0);
}

/** Always-on self-hosted runners needed for a month's Linux minutes (one job at a time each). */
export function selfHosted(linux: number) {
  const machines = Math.max(1, Math.ceil(linux / (EC2.hoursPerMonth * 60 * 0.5)));
  return { machines, cost: machines * EC2.perHour * EC2.hoursPerMonth };
}
