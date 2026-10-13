/** A scholarship department asks three other departments for proof. How much should each request return? */

export const SHAPES: [string, string, number][] = [
  ["all", "The whole record", 3],
  ["fields", "Only the fields needed", 2],
  ["yesno", "Just a yes or no", 1],
];

export interface Link {
  id: string;
  from: string;
  question: string;
  answer: string;
  feedback: Record<string, string>;
}

export const LINKS: Link[] = [
  {
    id: "income",
    from: "Revenue department",
    question: "Is family income below the scheme's ₹2.5 lakh limit?",
    answer: "yesno",
    feedback: {
      all: "The whole income file includes property, other family members and more: far beyond the question.",
      fields: "Better, but the exact income isn't needed to decide eligibility.",
      yesno: "Right. The scheme only needs to know the limit is met.",
    },
  },
  {
    id: "category",
    from: "Social welfare department",
    question: "Does the student belong to an eligible category?",
    answer: "yesno",
    feedback: {
      all: "The full certificate record reveals more than eligibility needs.",
      fields: "A yes or no answers the question with less exposure.",
      yesno: "Right. Eligibility is a yes or no question.",
    },
  },
  {
    id: "marks",
    from: "School board",
    question: "What percentage did the student score, for the merit list?",
    answer: "fields",
    feedback: {
      all: "Subject-by-subject marks and personal details aren't needed for ranking.",
      fields: "Right. Ranking needs the actual percentage, and nothing else.",
      yesno: "A yes or no can't rank students; the merit list needs the score.",
    },
  },
];
