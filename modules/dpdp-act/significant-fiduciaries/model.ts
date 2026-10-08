/**
 * Section 10's factors as qualitative dials. The law sets no numeric thresholds and the list is
 * open; the government decides. The "likelihood" shown is an illustration, not a legal test.
 */

export type Level = 0 | 1 | 2;
export const LEVEL_LABEL = ["Low", "Medium", "High"];

export type Factor = "volume" | "rights" | "sovereignty" | "elections" | "security" | "order";

export const FACTORS: { id: Factor; label: string; clause: string }[] = [
  { id: "volume", label: "Volume and sensitivity of data", clause: "10(1)(a)" },
  { id: "rights", label: "Risk to people's rights", clause: "10(1)(b)" },
  { id: "sovereignty", label: "Impact on sovereignty and integrity", clause: "10(1)(c)" },
  { id: "elections", label: "Risk to electoral democracy", clause: "10(1)(d)" },
  { id: "security", label: "Security of the State", clause: "10(1)(e)" },
  { id: "order", label: "Public order", clause: "10(1)(f)" },
];

export type Dials = Record<Factor, Level>;

export const PRESETS: { id: string; label: string; dials: Dials }[] = [
  {
    id: "bakery",
    label: "A town bakery's ordering app",
    dials: { volume: 0, rights: 0, sovereignty: 0, elections: 0, security: 0, order: 0 },
  },
  {
    id: "hospital",
    label: "A national hospital chain",
    dials: { volume: 2, rights: 2, sovereignty: 0, elections: 0, security: 1, order: 0 },
  },
  {
    id: "social",
    label: "A large social network",
    dials: { volume: 2, rights: 2, sovereignty: 1, elections: 2, security: 1, order: 2 },
  },
  {
    id: "payments",
    label: "A nationwide payments app",
    dials: { volume: 2, rights: 2, sovereignty: 1, elections: 0, security: 2, order: 1 },
  },
];

export function outlook(d: Dials): { label: string; level: 0 | 1 | 2 } {
  const score = Object.values(d).reduce<number>((n, v) => n + v, 0);
  if (score >= 7) return { label: "A likely candidate", level: 2 };
  if (score >= 3) return { label: "Possible", level: 1 };
  return { label: "Unlikely", level: 0 };
}

export const DUTIES: { title: string; body: string }[] = [
  {
    title: "A Data Protection Officer",
    body: "An individual based in India, answerable to the board of directors, who represents the company and handles grievances.",
  },
  { title: "An independent data auditor", body: "Audits compliance with the Act." },
  {
    title: "A yearly impact assessment",
    body: "A Data Protection Impact Assessment every 12 months: the rights affected, the purposes, and how risks are managed.",
  },
  {
    title: "A yearly audit",
    body: "With significant findings reported to the Data Protection Board.",
  },
  {
    title: "Algorithm checks",
    body: "Due diligence that its software and algorithms are not likely to put people's rights at risk.",
  },
  {
    title: "Some data kept in India",
    body: "Personal data the government specifies, with its traffic data, may not leave India. Nothing has been specified yet.",
  },
];
