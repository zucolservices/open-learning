/** Barriers in a made-up pension service's online application, and who each one stops. */

export type Who = "blind" | "lowvision";

export interface Barrier {
  id: string;
  step: string;
  problem: string;
  blocks: Who[];
  fix: string;
  wcag: string;
}

export const BARRIERS: Barrier[] = [
  {
    id: "labels",
    step: "Personal details",
    problem: "Form fields have no labels, only grey placeholder text.",
    blocks: ["blind", "lowvision"],
    fix: "Give every field a visible, programmatic label",
    wcag: "1.3.1, 4.1.2",
  },
  {
    id: "contrast",
    step: "Personal details",
    problem: "Light grey text on white.",
    blocks: ["lowvision"],
    fix: "Raise text contrast to at least 4.5:1",
    wcag: "1.4.3",
  },
  {
    id: "zoom",
    step: "Upload documents",
    problem: "At 200% zoom the Upload button is cut off.",
    blocks: ["lowvision"],
    fix: "Let the layout reflow when zoomed",
    wcag: "1.4.4, 1.4.10",
  },
  {
    id: "captcha",
    step: "Verify you're human",
    problem: "An image-only CAPTCHA.",
    blocks: ["blind", "lowvision"],
    fix: "Offer an accessible alternative, such as an OTP",
    wcag: "1.1.1, 3.3.8 (2.2)",
  },
  {
    id: "blink",
    step: "Video KYC",
    problem: "“Blink twice to prove you're alive.”",
    blocks: ["blind"],
    fix: "Offer other liveness checks and an assisted route",
    wcag: "Supreme Court, 2025",
  },
  {
    id: "timeout",
    step: "Video KYC",
    problem: "The session expires after two minutes, without warning.",
    blocks: ["blind", "lowvision"],
    fix: "Warn before time-outs and allow more time",
    wcag: "2.2.1",
  },
];

export const PEOPLE: { id: Who; label: string; how: string }[] = [
  { id: "blind", label: "A blind applicant", how: "Uses a screen reader on a phone." },
  {
    id: "lowvision",
    label: "An applicant with low vision",
    how: "Zooms to 200% and needs strong contrast.",
  },
];

/** The first unfixed barrier that stops this person, if any. */
export function stuckAt(who: Who, fixed: Set<string>) {
  return BARRIERS.find((b) => b.blocks.includes(who) && !fixed.has(b.id));
}
