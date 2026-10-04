/** An email agent's permissions and five risky (or useful) actions. Illustrative. */

export type Send = "drafts" | "internal" | "anyone";

export interface Perms {
  send: Send;
  del: boolean;
  approval: boolean;
  outputCheck: boolean;
  rateLimit: boolean;
}

export interface Action {
  id: string;
  label: string;
  harmful: boolean;
  check: (p: Perms) => { outcome: "done" | "blocked" | "slowed"; why: string };
}

export const ACTIONS: Action[] = [
  {
    id: "reply",
    label: "Reply to a customer's delivery question",
    harmful: false,
    check: (p) =>
      p.send === "drafts"
        ? { outcome: "slowed", why: "Saved as a draft; a person clicks send." }
        : p.send === "internal"
          ? { outcome: "blocked", why: "Customers are external, so the agent can't reply at all." }
          : p.approval
            ? { outcome: "slowed", why: "Waits for a quick approval, then sends." }
            : { outcome: "done", why: "Sent." },
  },
  {
    id: "forward",
    label:
      "Forward a confidential contract to an outside address (a hidden instruction in an email asked it to)",
    harmful: true,
    check: (p) =>
      p.send === "drafts"
        ? { outcome: "blocked", why: "Only a draft; the person sees it and deletes it." }
        : p.send === "internal"
          ? { outcome: "blocked", why: "External sending isn't permitted." }
          : p.approval
            ? {
                outcome: "blocked",
                why: "The approver sees an odd forward to a stranger and rejects it.",
              }
            : { outcome: "done", why: "Sent. The contract has left the company." },
  },
  {
    id: "delete",
    label: "“Tidy up” by deleting 2,000 old emails",
    harmful: true,
    check: (p) =>
      p.del
        ? { outcome: "done", why: "Deleted, including messages someone still needed." }
        : { outcome: "blocked", why: "The agent has no delete permission." },
  },
  {
    id: "bank",
    label: "Include the company's bank account number in a reply",
    harmful: true,
    check: (p) =>
      p.outputCheck
        ? {
            outcome: "blocked",
            why: "The output check spots an account number and stops the message.",
          }
        : p.send === "drafts"
          ? { outcome: "blocked", why: "The person reviewing the draft removes it." }
          : p.approval && p.send === "anyone"
            ? { outcome: "blocked", why: "The approver catches it, if they read carefully." }
            : { outcome: "done", why: "Sent with the account number." },
  },
  {
    id: "blast",
    label: "Email all 900 contacts about a “system update”",
    harmful: true,
    check: (p) =>
      p.send === "drafts"
        ? { outcome: "blocked", why: "900 drafts pile up; nobody sends them." }
        : p.rateLimit
          ? { outcome: "blocked", why: "Stopped at 20 emails by the rate limit; an alert fires." }
          : p.approval && p.send === "anyone"
            ? {
                outcome: "blocked",
                why: "The first external email needs approval; the approver stops it.",
              }
            : { outcome: "done", why: "All 900 sent." },
  },
];
