/** A made-up department's security incident, before, during and after. Described in words only. */

export interface Decision {
  id: string;
  when: string;
  title: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}

export const DECISIONS: Decision[] = [
  {
    id: "logs",
    when: "Months before",
    title: "How the department keeps logs",
    options: [
      {
        id: "short",
        label: "Each server keeps its own logs for 30 days",
        ok: false,
        outcome:
          "When investigators need last quarter's records, they're gone, and every server's clock says something different.",
      },
      {
        id: "rule",
        label: "Logs from all systems kept for 180 days, with clocks synced to NIC or NPL time",
        ok: true,
        outcome:
          "Right. That's what CERT-In's 2022 directions require, and it lets investigators line events up.",
      },
    ],
  },
  {
    id: "lead",
    when: "Months before",
    title: "Who is responsible for security",
    options: [
      {
        id: "ciso",
        label:
          "A named Chief Information Security Officer, with a security team separate from IT operations",
        ok: true,
        outcome: "Right. CERT-In's 2023 guidelines for government entities ask for exactly this.",
      },
      {
        id: "vendor",
        label: "Whichever vendor built the system",
        ok: false,
        outcome: "When something happens, nobody inside the department owns the response.",
      },
    ],
  },
  {
    id: "report",
    when: "9:40 a.m., day 1",
    title: "Staff notice the portal's home page has been replaced with an attacker's message",
    options: [
      {
        id: "wait",
        label: "Investigate fully first, and report to CERT-In next week",
        ok: false,
        outcome:
          "Too late: listed incidents, including defacement, must be reported within six hours of noticing them.",
      },
      {
        id: "six",
        label: "Report to CERT-In within six hours, even if details are still missing",
        ok: true,
        outcome: "Right. A first report can be incomplete and updated later.",
      },
      {
        id: "data",
        label: "Report only if personal data was taken",
        ok: false,
        outcome: "Defacement is itself a reportable incident under the directions.",
      },
    ],
  },
  {
    id: "recover",
    when: "Day 1 afternoon",
    title: "A file server's documents are also locked, with a demand for payment",
    options: [
      {
        id: "backup",
        label: "Isolate it, remove the cause, and restore from separate, offline backups",
        ok: true,
        outcome:
          "Right. When AIIMS Delhi was hit in 2022, data was restored from a backup server that wasn't affected.",
      },
      {
        id: "pay",
        label: "Pay to get the files back quickly",
        ok: false,
        outcome: "No guarantee of recovery, it funds more attacks, and the cause stays in place.",
      },
    ],
  },
  {
    id: "relaunch",
    when: "Week 2",
    title: "Bringing the portal back",
    options: [
      {
        id: "now",
        label: "Relaunch as soon as the page is fixed",
        ok: false,
        outcome: "Whatever let the attacker in may still be there.",
      },
      {
        id: "audit",
        label: "Relaunch after a security audit by a CERT-In-empanelled auditor",
        ok: true,
        outcome: "Right. Government systems are audited before going live and after major changes.",
      },
    ],
  },
];
