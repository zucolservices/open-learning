/**
 * SQL injection as structure, not strings: an input is either plain data or "crafted" input that a
 * string-built query would read as code. No real attack strings appear anywhere in this module.
 */

export type InputKind = "normal" | "always-true" | "stack";

export const INPUTS: { id: InputKind; label: string; shown: string; meaning: string }[] = [
  { id: "normal", label: "A normal username", shown: "asha", meaning: "Just a name." },
  {
    id: "always-true",
    label: "Crafted: ends the text early and adds an always-true condition",
    shown: "⟨crafted input: closes the quote, then adds “or true”⟩",
    meaning: "The WHERE clause now matches every row.",
  },
  {
    id: "stack",
    label: "Crafted: ends the text early and adds a second command",
    shown: "⟨crafted input: closes the quote, then adds “delete the table”⟩",
    meaning: "A second statement the developer never wrote.",
  },
];

export type Mode = "concat" | "param";

export interface Outcome {
  parsedAs: "data" | "code";
  result: string;
  bad: boolean;
}

export function run(kind: InputKind, mode: Mode): Outcome {
  if (mode === "param" || kind === "normal") {
    return {
      parsedAs: "data",
      result:
        kind === "normal"
          ? "1 row: asha's account (if the password matches)"
          : "0 rows: no user is literally called that",
      bad: false,
    };
  }
  return kind === "always-true"
    ? {
        parsedAs: "code",
        result: "Logged in as the first user in the table, often an administrator",
        bad: true,
      }
    : {
        parsedAs: "code",
        result: "The users table is deleted (if the database allows several statements)",
        bad: true,
      };
}

export const CASES: [string, string][] = [
  [
    "Heartland Payment Systems, 2007–08",
    "SQL injection was the way in; more than 130 million card numbers were stolen.",
  ],
  [
    "TalkTalk, 2015",
    "Old web pages inherited from another company; 156,959 customers' details accessed. The UK regulator fined it a then-record £400,000, noting that “known defences exist”.",
  ],
  [
    "MOVEit Transfer, 2023",
    "A previously unknown SQL injection flaw let a criminal gang steal files from about 2,770 organisations, affecting about 96 million people (Emsisoft's count).",
  ],
];
