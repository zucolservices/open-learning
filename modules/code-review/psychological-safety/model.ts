/**
 * One pull request replayed in two made-up team cultures, and team habits that build or erode
 * safety. Sam is fictional (they/them).
 */

export const THREAD: { a: string; b: string }[] = [
  {
    a: "Why would you do it like this?",
    b: "Nice and readable. What made you pick a map here? I'd have reached for a loop.",
  },
  {
    a: "Sam quietly rewrites it as a loop and says nothing else.",
    b: "Sam explains, then adds: “I wasn't sure formatPrice is safe for refunds. Is it?”",
  },
  {
    a: "Nobody asks about formatPrice. Refunds show a positive amount on receipts for a month.",
    b: "“Good catch: it isn't. Let's fix it in this change.” The bug never ships.",
  },
];

export const HABITS: { id: string; label: string }[] = [
  { id: "why", label: "Reviewers ask questions and explain why" },
  { id: "praise", label: "Reviewers point out what's good, too" },
  { id: "seniors", label: "Seniors' code gets reviewed like everyone's" },
  { id: "thanks", label: "People thank whoever catches their bug" },
  { id: "labels", label: "Optional points are labelled as optional" },
];

export const PEOPLE: { name: string; role: string; needs: number; says: string }[] = [
  { name: "Asha", role: "senior engineer", needs: 1, says: "Points out a missing index." },
  { name: "Ravi", role: "two years in", needs: 3, says: "Asks why the cache expires so soon." },
  {
    name: "Sam",
    role: "joined last week",
    needs: 5,
    says: "Admits they don't understand the retry logic, which turns out to be wrong.",
  },
];
