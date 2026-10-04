/** A small library, modelled at three levels. Made-up example. */

export type Level = "talk" | "conceptual" | "logical" | "physical";

export const TALK = [
  ["Librarian", "We lend books to members. Some popular books we have several copies of."],
  ["Librarian", "A member can have up to five books out at once, for three weeks."],
  ["You", "So a loan is one member borrowing one copy?"],
  ["Librarian", "Yes, and we keep old loans, to see what people read."],
];

export const ENTITIES = ["Member", "Book", "Copy", "Loan"];

export const CONCEPT_LINKS: [string, string, string][] = [
  ["Book", "has", "Copy"],
  ["Member", "makes", "Loan"],
  ["Copy", "is lent in", "Loan"],
];

export const LOGICAL: { name: string; attrs: [string, string][] }[] = [
  {
    name: "Member",
    attrs: [
      ["member_id", "PK"],
      ["name", ""],
      ["email", "unique"],
      ["joined_on", ""],
    ],
  },
  {
    name: "Book",
    attrs: [
      ["book_id", "PK"],
      ["isbn", "unique"],
      ["title", ""],
      ["author", ""],
    ],
  },
  {
    name: "Copy",
    attrs: [
      ["copy_id", "PK"],
      ["book_id", "FK → Book"],
      ["barcode", "unique"],
    ],
  },
  {
    name: "Loan",
    attrs: [
      ["loan_id", "PK"],
      ["member_id", "FK → Member"],
      ["copy_id", "FK → Copy"],
      ["borrowed_on", ""],
      ["due_on", ""],
      ["returned_on", "optional"],
    ],
  },
];

export const PHYSICAL = `CREATE TABLE member (
  member_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  joined_on   DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE TABLE loan (
  loan_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id   BIGINT NOT NULL REFERENCES member,
  copy_id     BIGINT NOT NULL REFERENCES copy,
  borrowed_on DATE NOT NULL,
  due_on      DATE NOT NULL,
  returned_on DATE          -- NULL while the book is out
);
CREATE INDEX loan_open ON loan (member_id) WHERE returned_on IS NULL;`;

export const DECIDES: Record<Exclude<Level, "talk">, { who: string; decides: string[] }> = {
  conceptual: {
    who: "Business people and modellers",
    decides: [
      "What things matter (entities)",
      "How they relate, in plain words",
      "Business rules (five books, three weeks)",
    ],
  },
  logical: {
    who: "Modellers and engineers",
    decides: [
      "Every attribute",
      "Keys: what identifies each row",
      "Exact relationships (one-to-many…)",
      "Still no particular database",
    ],
  },
  physical: {
    who: "Engineers",
    decides: [
      "Tables, column types, NULLs",
      "Constraints and indexes",
      "Features of one database (here PostgreSQL)",
      "Performance choices",
    ],
  },
};

export type Card = "1-1" | "1-n" | "n-n";
export const CARDS: Record<Card, { label: string; example: [string, string]; note: string }> = {
  "1-1": {
    label: "one-to-one",
    example: ["Member", "Library card"],
    note: "Each member has exactly one card; each card belongs to one member.",
  },
  "1-n": {
    label: "one-to-many",
    example: ["Book", "Copy"],
    note: "A book can have many copies; each copy is of one book.",
  },
  "n-n": {
    label: "many-to-many",
    example: ["Member", "Copy"],
    note: "Over time a member borrows many copies, and a copy is borrowed by many members. Relational tables resolve this with a table in between: Loan.",
  },
};
