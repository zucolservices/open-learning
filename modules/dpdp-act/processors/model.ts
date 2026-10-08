/**
 * One processor contract template and five vendor events at a made-up app (SabziBox). Only two
 * things are legally required in the contract (a valid contract, s.8(2); security terms, Rule
 * 6(1)(f)); the rest are needed so the fiduciary can meet its own duties, or are good practice.
 */

export type Tier = "required" | "needed" | "good";

export const TIER_LABEL: Record<Tier, string> = {
  required: "Required by law",
  needed: "Needed for your own duties",
  good: "Good practice",
};

export type ClauseId =
  | "contract"
  | "security"
  | "instructions"
  | "breach"
  | "stop"
  | "erase"
  | "rights"
  | "subs"
  | "audit"
  | "exit";

export const CLAUSES: { id: ClauseId; label: string; tier: Tier; basis: string }[] = [
  {
    id: "contract",
    label: "A signed contract before any processing",
    tier: "required",
    basis: "s.8(2)",
  },
  {
    id: "security",
    label: "Security safeguards (encryption, access control, logs, backups)",
    tier: "required",
    basis: "Rule 6(1)(f)",
  },
  {
    id: "instructions",
    label: "Process only on our instructions, for our purposes",
    tier: "needed",
    basis: "s.2(k), s.8(1)",
  },
  {
    id: "breach",
    label: "Tell us about any breach within 24 hours, with details",
    tier: "needed",
    basis: "s.8(6), Rule 7",
  },
  {
    id: "stop",
    label: "Stop processing when we say consent is withdrawn",
    tier: "needed",
    basis: "s.6(6)",
  },
  {
    id: "erase",
    label: "Erase on our instruction and confirm it",
    tier: "needed",
    basis: "s.8(7)(b)",
  },
  {
    id: "rights",
    label: "Help us answer rights requests on time",
    tier: "needed",
    basis: "ss.11–13",
  },
  {
    id: "subs",
    label: "No sub-processors without our approval, same terms flow down",
    tier: "good",
    basis: "Act is silent",
  },
  {
    id: "audit",
    label: "Audit rights or independent certification",
    tier: "good",
    basis: "Supports Rule 6(1)(g)",
  },
  {
    id: "exit",
    label: "Return or delete everything when the contract ends",
    tier: "good",
    basis: "Supports s.8(7)",
  },
];

export interface Event {
  id: string;
  vendor: string;
  happens: string;
  needs: ClauseId;
  ifMissing: string;
  ifPresent: string;
}

export const EVENTS: Event[] = [
  {
    id: "support",
    vendor: "Help-desk vendor",
    happens: "The vendor finds that an attacker read support tickets last week.",
    needs: "breach",
    ifMissing:
      "The vendor mentions it at the next quarterly call. SabziBox has missed its own duty to tell the Board and customers without delay.",
    ifPresent:
      "The vendor reports it the same day, with what was exposed. SabziBox starts its own notices in time.",
  },
  {
    id: "sms",
    vendor: "SMS gateway",
    happens: "A customer withdraws consent for marketing texts.",
    needs: "stop",
    ifMissing:
      "SabziBox stops its own campaigns, but the gateway keeps a saved audience and sends one more blast.",
    ifPresent:
      "SabziBox calls the gateway's suppression API; the number is off every list within minutes.",
  },
  {
    id: "backup",
    vendor: "Backup provider",
    happens: "A customer's data must be erased after they leave.",
    needs: "erase",
    ifMissing:
      "The provider has no process to erase or confirm erasure; the data lives on in its copies indefinitely.",
    ifPresent:
      "The provider erases on its next cycle and sends a confirmation SabziBox can keep on file.",
  },
  {
    id: "analytics",
    vendor: "Analytics vendor",
    happens: "The vendor quietly hands raw event data to another company to process.",
    needs: "subs",
    ifMissing:
      "SabziBox finds out from a news story. It still answers for the data, and can't even name who holds it.",
    ifPresent:
      "The vendor had to ask first; SabziBox approved a named sub-processor bound by the same terms.",
  },
  {
    id: "cloud",
    vendor: "Cloud host",
    happens: "SabziBox moves to a different cloud provider.",
    needs: "exit",
    ifMissing:
      "Old disks and snapshots sit in the former provider's account with no deadline for deletion.",
    ifPresent:
      "The old provider returns the data, deletes its copies within a set period and certifies it.",
  },
];

export const CLOUD_TERMS: [string, string][] = [
  [
    "AWS Data Processing Addendum",
    "Generic 'applicable data protection law'; incident notice without undue delay; notice of new sub-processors with a right to object.",
  ],
  [
    "Google Cloud Data Processing Addendum",
    "Generic 'applicable privacy law'; law-specific terms for several regions, none found for India's DPDP Act.",
  ],
  [
    "Microsoft Products and Services DPA",
    "Generic 'data protection requirements'; an India-specific section wasn't confirmed.",
  ],
];
