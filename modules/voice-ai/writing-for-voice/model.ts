/** A screen-style reply and the fixes that make it work spoken. */

export type Fix = "abbr" | "date" | "list" | "code" | "format" | "split";

export const FIXES: { id: Fix; label: string; why: string }[] = [
  {
    id: "format",
    label: "Remove bullets and symbols",
    why: "Bullets, asterisks and arrows are read out, or skipped unpredictably.",
  },
  {
    id: "abbr",
    label: "Write out abbreviations",
    why: "“Dr.” and “St.” can be read as “doctor”, “drive”, “saint” or “street”.",
  },
  {
    id: "date",
    label: "Say dates unambiguously",
    why: "“12/03” is 12 March in the UK and December 3 in the US.",
  },
  {
    id: "list",
    label: "Offer three options, and say so first",
    why: "Listeners can't scroll back; five options are too many to hold.",
  },
  {
    id: "code",
    label: "Spell codes slowly in groups",
    why: "“AX7-22Q” read as a word is gibberish.",
  },
  { id: "split", label: "Short sentences, one idea each", why: "Each should fit in a breath." },
];

export function render(fixes: Fix[]) {
  const has = (f: Fix) => fixes.includes(f);
  const doctor = has("abbr") ? "Doctor Rao" : "Dr. Rao";
  const street = has("abbr") ? "Main Street" : "Main St.";
  const date = has("date") ? "Thursday the twelfth of March" : "12/03";
  const code = has("code") ? "A, X, 7… 2, 2, Q" : "AX7-22Q";
  const options = has("list")
    ? "There are three ways to attend: in person, by video, or by phone. Which would you like?"
    : has("format")
      ? "Options: in person at " + street + ", video call, phone call, home visit, walk-in clinic."
      : "Options: • In-person (" + street + ") • Video call • Phone • Home visit • Walk-in clinic";
  const first = has("split")
    ? `${doctor} can see you on ${date}, at three thirty in the afternoon. Your reference is ${code}.`
    : `${doctor} can see you on ${date} at 3:30pm, ref ${code}, and the fee is $45.50 which is payable on the day${has("format") ? "" : " (cash/card)"}.`;
  const fee = has("split") ? " The fee is forty-five dollars fifty, paid on the day." : "";
  return `${first}${fee} ${options}`;
}

export function breaths(text: string) {
  // Abbreviations and decimals aren't sentence ends.
  return text
    .replace(/\b(Dr|St)\./g, "$1")
    .split(/[.?!](?:\s|$)/)
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    .filter((n) => n > 0);
}
