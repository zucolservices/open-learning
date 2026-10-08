/**
 * Rule 6(1)'s minimum safeguards as switches on a made-up clinic system (CareNest), and three
 * rules-based incidents whose outcome depends on which controls are on. No real attack details.
 */

export type Control =
  "encrypt" | "mask" | "access" | "logs" | "backups" | "retain" | "contract" | "people";

export const CONTROLS: { id: Control; label: string; clause: string; plain: string }[] = [
  {
    id: "encrypt",
    label: "Encrypt the database, backups and laptops",
    clause: "6(1)(a)",
    plain: "Encryption",
  },
  {
    id: "mask",
    label: "Mask phone and ID numbers on screens; tokenise IDs sent to the lab",
    clause: "6(1)(a)",
    plain: "Masking and virtual tokens",
  },
  {
    id: "access",
    label: "Role-based access and MFA for staff",
    clause: "6(1)(b)",
    plain: "Access control",
  },
  {
    id: "logs",
    label: "Log every record access and alert on bulk exports",
    clause: "6(1)(c)",
    plain: "Logs, monitoring and review",
  },
  {
    id: "backups",
    label: "Offline, tested backups",
    clause: "6(1)(d)",
    plain: "Keep processing going",
  },
  {
    id: "retain",
    label: "Keep access logs for a year",
    clause: "6(1)(e)",
    plain: "One-year log retention",
  },
  {
    id: "contract",
    label: "Security terms in the cloud host's contract",
    clause: "6(1)(f)",
    plain: "Processor contracts",
  },
  {
    id: "people",
    label: "Training, patching and a named owner",
    clause: "6(1)(g)",
    plain: "Technical and organisational measures",
  },
];

export type Incident = "password" | "ransomware" | "laptop";

export const INCIDENTS: { id: Incident; label: string; setup: string }[] = [
  {
    id: "password",
    label: "A stolen staff password",
    setup:
      "A receptionist's password is phished. At 2 a.m. someone signs in and starts exporting patient records.",
  },
  {
    id: "ransomware",
    label: "Ransomware",
    setup: "Malware encrypts the clinic's main database on a Monday morning.",
  },
  {
    id: "laptop",
    label: "A lost laptop",
    setup: "A doctor leaves a laptop holding a copy of patient records in a taxi.",
  },
];

export interface Outcome {
  lines: { text: string; good: boolean | null }[];
  severity: "contained" | "limited" | "serious";
}

export function run(inc: Incident, on: Set<Control>): Outcome {
  const lines: { text: string; good: boolean | null }[] = [];
  let score = 0;
  if (inc === "password") {
    if (on.has("access")) {
      lines.push({ text: "MFA blocks the sign-in: the password alone isn't enough.", good: true });
      score += 3;
    } else {
      lines.push({ text: "The password works; the intruder is in.", good: false });
      if (on.has("logs")) {
        lines.push({
          text: "The bulk-export alert fires within minutes and the account is locked.",
          good: true,
        });
        score += 2;
      } else lines.push({ text: "Nobody notices the export for weeks.", good: false });
      if (on.has("mask")) {
        lines.push({
          text: "Exported screens show masked numbers, limiting what leaks.",
          good: true,
        });
        score += 1;
      }
    }
    lines.push(
      on.has("retain")
        ? { text: "A year of access logs shows exactly whose records were touched.", good: true }
        : { text: "Without kept logs, the clinic can't tell who was affected.", good: false },
    );
    if (on.has("retain")) score += 1;
  }
  if (inc === "ransomware") {
    if (on.has("people")) {
      lines.push({ text: "Patched systems close the hole the malware usually uses.", good: true });
      score += 1;
    }
    lines.push(
      on.has("backups")
        ? { text: "An offline backup restores the database by the afternoon.", good: true }
        : { text: "No usable backup: appointments run on paper for days.", good: false },
    );
    if (on.has("backups")) score += 2;
    lines.push(
      on.has("logs")
        ? { text: "Monitoring shows the malware didn't copy data out first.", good: true }
        : { text: "Nobody can say whether data was copied out before it was locked.", good: false },
    );
    if (on.has("logs")) score += 1;
    lines.push({
      text: "Losing access is itself a personal data breach, so it must still be reported.",
      good: null,
    });
  }
  if (inc === "laptop") {
    lines.push(
      on.has("encrypt")
        ? { text: "The disk is encrypted: whoever finds it sees nothing readable.", good: true }
        : { text: "The disk is readable by anyone who finds it.", good: false },
    );
    if (on.has("encrypt")) score += 3;
    lines.push(
      on.has("access")
        ? { text: "IT revokes the laptop's access remotely.", good: true }
        : { text: "The laptop's saved sessions still work.", good: false },
    );
    if (on.has("access")) score += 1;
  }
  const severity = score >= 3 ? "contained" : score >= 2 ? "limited" : "serious";
  return { lines, severity };
}
