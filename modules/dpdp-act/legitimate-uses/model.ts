/**
 * Section 7's legitimate uses, and everyday jobs matched to the right ground. From May 2027.
 * Fraud checks are a grey area: there is no general fraud or legitimate-interests ground.
 */

export type Ground = "consent" | "7a" | "7b" | "7d" | "7e" | "7f" | "7i" | "none";

export const GROUND_LABEL: Record<Ground, string> = {
  consent: "Consent",
  "7a": "Voluntarily given, 7(a)",
  "7b": "State benefit, 7(b)",
  "7d": "Legal duty to disclose, 7(d)",
  "7e": "Court order, 7(e)",
  "7f": "Medical emergency, 7(f)",
  "7i": "Employment, 7(i)",
  none: "Not allowed",
};

export interface Job {
  id: string;
  text: string;
  ground: Ground;
  why: string;
  grey?: string;
}

export const JOBS: Job[] = [
  {
    id: "receipt",
    text: "Text a receipt to the number a customer gave at checkout",
    ground: "7a",
    why: "Almost exactly the Act's pharmacy example: data given for that purpose.",
  },
  {
    id: "newsletter",
    text: "Add those checkout numbers to a promotional newsletter",
    ground: "consent",
    why: "Marketing is a new purpose; 7(a) covers only the purpose the data was given for.",
  },
  {
    id: "payroll",
    text: "Run payroll and attendance for staff",
    ground: "7i",
    why: "Purposes of employment.",
  },
  {
    id: "analytics",
    text: "Track how users move through an app to improve it",
    ground: "consent",
    why: "Not needed for the purpose the user gave data for, and no s.7 clause fits.",
  },
  {
    id: "collapse",
    text: "Share an event attendee's details with paramedics after they collapse",
    ground: "7f",
    why: "A medical emergency threatening someone's life or health.",
  },
  {
    id: "tax",
    text: "Answer a statutory notice from the tax department",
    ground: "7d",
    why: "An obligation under law to disclose information to the State.",
  },
  {
    id: "court",
    text: "Hand over records the police seek under a court order",
    ground: "7e",
    why: "Complying with a judgment or order issued under law.",
  },
  {
    id: "subsidy",
    text: "A private app checks a farmer's eligibility for a government subsidy",
    ground: "none",
    why: "7(b) is for the State and its bodies only. A private company would need consent.",
  },
  {
    id: "broker",
    text: "Keep emailing a lead who said they no longer need help",
    ground: "none",
    why: "The Act's broker example: once they say so, processing must stop.",
  },
  {
    id: "fraud",
    text: "Score a card payment for fraud risk",
    ground: "consent",
    why: "There's no general fraud ground. Use consent, or a specific legal duty where one applies.",
    grey: "Some argue fraud checks are part of the purpose the customer gave data for under 7(a). It hasn't been tested; treat it as a grey area.",
  },
];

export const USES: { id: string; title: string; body: string; who: string }[] = [
  {
    id: "a",
    title: "7(a) Voluntarily given",
    body: "Data a person gave for a specified purpose, until they say they no longer want it.",
    who: "Anyone",
  },
  {
    id: "b",
    title: "7(b) State benefits",
    body: "Subsidies, services, certificates, licences and permits, with prior consent or a notified database.",
    who: "State only",
  },
  {
    id: "c",
    title: "7(c) State functions",
    body: "Any function under law, or sovereignty, integrity or security of the State.",
    who: "State only",
  },
  {
    id: "d",
    title: "7(d) Disclosure required by law",
    body: "Meeting a legal duty to disclose information to the State.",
    who: "Anyone",
  },
  {
    id: "e",
    title: "7(e) Judgments and orders",
    body: "Complying with an Indian judgment or order, or a foreign one in a civil or contract matter.",
    who: "Anyone",
  },
  {
    id: "f",
    title: "7(f) Medical emergency",
    body: "A threat to the life or immediate health of the person or anyone else.",
    who: "Anyone",
  },
  {
    id: "g",
    title: "7(g) Public health",
    body: "Treatment or health services during an epidemic or other public-health threat.",
    who: "Anyone",
  },
  {
    id: "h",
    title: "7(h) Disasters and public order",
    body: "Safety and help for people during a disaster or a breakdown of public order.",
    who: "Anyone",
  },
  {
    id: "i",
    title: "7(i) Employment",
    body: "Employment purposes, and protecting the employer from loss or liability, such as trade-secret leaks.",
    who: "Employers",
  },
];
