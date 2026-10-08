/**
 * Section 3 as a decision path. Each scenario records how it answers five questions; the path
 * stops at the first question that takes it out of scope. Scenarios are made up and assume the
 * date is after 13 May 2027, when s.3 comes into force.
 */

export type QId = "personal" | "digital" | "link" | "personalUse" | "madePublic";

export const QUESTIONS: { id: QId; ask: string; clause: string; outIf: boolean }[] = [
  {
    id: "personal",
    ask: "Is it about a person who can be identified?",
    clause: "s.2(t)",
    outIf: false,
  },
  { id: "digital", ask: "Is it digital, or digitised later?", clause: "s.3(a)", outIf: false },
  {
    id: "link",
    ask: "Processed in India, or to offer goods or services to people in India?",
    clause: "s.3(a), s.3(b)",
    outIf: false,
  },
  {
    id: "personalUse",
    ask: "Is an individual using it only for personal or domestic purposes?",
    clause: "s.3(c)(i)",
    outIf: true,
  },
  {
    id: "madePublic",
    ask: "Did the person make it public, or someone legally required to publish it?",
    clause: "s.3(c)(ii)",
    outIf: true,
  },
];

export interface Scenario {
  id: string;
  text: string;
  answers: Record<QId, boolean>;
  why: string;
  /** Extra caveat shown with the verdict. */
  note?: string;
}

const A = (
  personal: boolean,
  digital: boolean,
  link: boolean,
  personalUse: boolean,
  madePublic: boolean,
) => ({
  personal,
  digital,
  link,
  personalUse,
  madePublic,
});

export const SCENARIOS: Scenario[] = [
  {
    id: "saas",
    text: "A Pune startup stores its Indian customers' names and emails in a cloud database.",
    answers: A(true, true, true, false, false),
    why: "Digital personal data processed in India: the core case.",
  },
  {
    id: "ledger",
    text: "A corner shop keeps customers' credit in a handwritten ledger, never typed up.",
    answers: A(true, false, true, false, false),
    why: "Paper that is never digitised is outside the Act.",
  },
  {
    id: "scanned",
    text: "A clinic scans its old paper patient files into a document system.",
    answers: A(true, true, true, false, false),
    why: "Data collected on paper comes into scope once it is digitised.",
  },
  {
    id: "foreign-shop",
    text: "A shop abroad, with no Indian office, sells to buyers in India with rupee checkout.",
    answers: A(true, true, true, false, false),
    why: "Processing outside India to offer goods to people in India is covered.",
  },
  {
    id: "contacts",
    text: "You keep friends' birthdays and numbers in your own phone's contacts.",
    answers: A(true, true, true, true, false),
    why: "Personal or domestic use by an individual is outside the Act.",
  },
  {
    id: "blog",
    text: "A blogger writes about their own life and posts it publicly on social media.",
    answers: A(true, true, true, false, true),
    why: "The Act's own illustration: data the person chose to make public is outside it.",
  },
  {
    id: "leak",
    text: "A website republishes a leaked customer database that is now 'on the internet'.",
    answers: A(true, true, true, false, false),
    why: "Leaked isn't the same as made public by the person. Still in scope.",
  },
  {
    id: "filings",
    text: "An app shows company directors' details that companies must file publicly by law.",
    answers: A(true, true, true, false, true),
    why: "Data published by someone under a legal duty to publish it is outside the Act.",
  },
  {
    id: "anon",
    text: "A researcher uses a truly anonymous dataset where no one can be identified.",
    answers: A(false, true, true, false, false),
    why: "If no one can be identified, it isn't personal data at all.",
  },
  {
    id: "bpo",
    text: "An Indian back office processes German customers' data under a contract with a German bank.",
    answers: A(true, true, true, false, false),
    why: "Processed in India, so in scope.",
    note: "Section 17(1)(d) then switches off most duties for data about people outside India, but security safeguards and the fiduciary's responsibility still apply.",
  },
];

export interface Walk {
  /** Index of the question where the path stopped, or QUESTIONS.length if it got through. */
  stop: number;
  inScope: boolean;
}

export function walk(s: Scenario): Walk {
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    if (s.answers[q.id] === q.outIf) return { stop: i, inScope: false };
  }
  return { stop: QUESTIONS.length, inScope: true };
}
