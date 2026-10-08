/**
 * Routing data to regions. DPDP s.16 (from May 2027) is a negative list: transfers are allowed
 * unless the government restricts a country (none restricted as of October 2026). Stricter sector
 * rules survive (s.16(2)). "Country X" is hypothetical, to show what a restriction would do.
 */

export type Region = "india" | "singapore" | "eu" | "us" | "x";

export const REGION_LABEL: Record<Region, string> = {
  india: "India",
  singapore: "Singapore",
  eu: "EU",
  us: "US",
  x: "Country X*",
};

export type DataKind = "profiles" | "payments" | "logs" | "backup" | "analytics";

export const KINDS: { id: DataKind; label: string }[] = [
  { id: "profiles", label: "User profiles" },
  { id: "payments", label: "Payment transactions" },
  { id: "logs", label: "Web server logs" },
  { id: "backup", label: "Disaster-recovery copy of the payments database" },
  { id: "analytics", label: "Aggregated usage statistics" },
];

export interface Verdict {
  ok: boolean;
  rule: string;
  why: string;
}

export function verdict(kind: DataKind, region: Region): Verdict {
  if (region === "india") return { ok: true, rule: "—", why: "Kept in India." };
  if (region === "x" && kind === "analytics")
    return {
      ok: true,
      rule: "DPDP s.2(t)",
      why: "Even a restriction wouldn't reach truly anonymous statistics: they aren't personal data.",
    };
  if (region === "x")
    return {
      ok: false,
      rule: "DPDP s.16(1)",
      why: "If the government notified a country, transfers there for processing could be restricted. None is notified today.",
    };
  if (kind === "payments")
    return {
      ok: false,
      rule: "RBI, 2018",
      why: "Payment data must be stored only in India. Processing abroad is allowed if the foreign copy is deleted and the data returned within 24 hours or one business day.",
    };
  if (kind === "backup")
    return {
      ok: false,
      rule: "RBI, 2018",
      why: "A backup abroad is storage abroad. Put the disaster-recovery site in another Indian region.",
    };
  if (kind === "logs")
    return {
      ok: true,
      rule: "CERT-In FAQ",
      why: "General logs may sit abroad if you can produce them to CERT-In in reasonable time. Logs of financial transactions must stay in India.",
    };
  if (kind === "analytics")
    return {
      ok: true,
      rule: "DPDP s.16",
      why: "Allowed. If it's truly anonymous it isn't personal data at all.",
    };
  return {
    ok: true,
    rule: "DPDP s.16",
    why: "Allowed. You stay responsible: security safeguards and a processor contract still apply.",
  };
}

export const HISTORY: { year: string; title: string; body: string }[] = [
  {
    year: "2018",
    title: "Mirror everything",
    body: "The first draft wanted at least one copy of all personal data kept in India.",
  },
  {
    year: "2019",
    title: "Sensitive data stays",
    body: "Sensitive data could go abroad but must also be stored in India; 'critical' data only in India.",
  },
  {
    year: "2022",
    title: "A whitelist",
    body: "The draft allowed transfers only to countries the government notified.",
  },
  {
    year: "2023",
    title: "A negative list",
    body: "The Act allows transfers anywhere unless a country is restricted, and keeps stricter sector rules.",
  },
  {
    year: "2025",
    title: "Targeted rules",
    body: "The Rules add conditions on giving data to foreign governments, and localisation only for data the government specifies for Significant Data Fiduciaries.",
  },
];

export const SECTORS: [string, string][] = [
  ["RBI (payments)", "All payment data stored only in India."],
  ["IRDAI (insurance)", "Policy and claim records in data centres in India."],
  ["SEBI (markets, on cloud)", "Data and logs of regulated entities on the cloud within India."],
  ["Government cloud", "MeitY-empanelled providers with data centres in India."],
  ["CERT-In", "Logs may be abroad if producible; financial-transaction logs in India."],
];
