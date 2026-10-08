/**
 * A consent-screen designer. Each design switch either keeps or breaks one of the qualities that
 * s.6(1) demands of consent, or triggers s.6(2) invalidity. Pre-ticked boxes and bundling fail by
 * the Act's wording ("clear affirmative action", "specific"); consumer law bans them expressly.
 */

export interface Design {
  [key: string]: boolean;
  preTicked: boolean;
  bundled: boolean;
  contacts: boolean;
  conditional: boolean;
  lopsided: boolean;
  waiver: boolean;
}

export const SWITCHES: { id: keyof Design; label: string; on: string; off: string }[] = [
  { id: "preTicked", label: "Consent box", on: "Pre-ticked", off: "Empty: the person ticks it" },
  { id: "bundled", label: "Purposes", on: "One box for everything", off: "A box per purpose" },
  { id: "contacts", label: "Also ask for", on: "The phone's contact list", off: "Nothing extra" },
  { id: "conditional", label: "Marketing consent", on: "Required to sign up", off: "Optional" },
  {
    id: "lopsided",
    label: "Decline button",
    on: "Grey, 'No, I like paying more'",
    off: "Same size and wording",
  },
  {
    id: "waiver",
    label: "Small print",
    on: "'I waive my right to complain to the Board'",
    off: "None",
  },
];

export type Quality =
  "free" | "specific" | "informed" | "unconditional" | "unambiguous" | "necessary" | "lawful";

export const QUALITIES: { id: Quality; label: string; clause: string }[] = [
  { id: "free", label: "Free", clause: "s.6(1)" },
  { id: "specific", label: "Specific", clause: "s.6(1)" },
  { id: "informed", label: "Informed", clause: "s.6(1), s.5" },
  { id: "unconditional", label: "Unconditional", clause: "s.6(1)" },
  { id: "unambiguous", label: "Unambiguous, by a clear action", clause: "s.6(1)" },
  { id: "necessary", label: "Only the data needed", clause: "s.6(1)" },
  { id: "lawful", label: "No unlawful terms", clause: "s.6(2)" },
];

export interface Finding {
  quality: Quality;
  why: string;
}

export function assess(d: Design): Finding[] {
  const f: Finding[] = [];
  if (d.preTicked)
    f.push({
      quality: "unambiguous",
      why: "A pre-ticked box isn't a clear affirmative action by the person.",
    });
  if (d.bundled)
    f.push({
      quality: "specific",
      why: "One box for several purposes isn't specific to each purpose.",
    });
  if (d.contacts)
    f.push({
      quality: "necessary",
      why: "Contacts aren't needed for the service, so consent covers only the necessary data (the Act's telemedicine example).",
    });
  if (d.conditional)
    f.push({
      quality: "unconditional",
      why: "Tying sign-up to marketing consent makes it conditional.",
    });
  if (d.lopsided)
    f.push({
      quality: "free",
      why: "Steering people with a shaming, hard-to-see 'no' undermines a free choice. Consumer law calls these dark patterns.",
    });
  if (d.waiver)
    f.push({
      quality: "lawful",
      why: "Consent to give up the right to complain is invalid to that extent (the Act's insurance example). The rest can stand.",
    });
  return f;
}

export const BAD_DESIGN: Design = {
  preTicked: true,
  bundled: true,
  contacts: true,
  conditional: true,
  lopsided: true,
  waiver: true,
};
