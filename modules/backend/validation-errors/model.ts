/** Bad inputs sent to a made-up POST /orders endpoint, and how each fix changes the response. */

export const FIXES: { id: string; label: string; note: string }[] = [
  {
    id: "schema",
    label: "Validate the request shape at the boundary",
    note: "A schema (Zod, Pydantic, Jakarta Validation, .NET validation) checks types, required fields and ranges before any logic runs.",
  },
  {
    id: "rules",
    label: "Check business rules in the service",
    note: "Rules like “the item must exist” live with the business logic and raise clear errors.",
  },
  {
    id: "limit",
    label: "Limit request body size",
    note: "Huge bodies are rejected before they're read into memory.",
  },
  {
    id: "handler",
    label: "Add a global error handler",
    note: "Unexpected errors become a generic problem response with an ID; details go to the logs.",
  },
];

export interface Case {
  id: string;
  input: string;
  outcome(f: string[]): { ok: boolean; text: string };
}

const crash = (f: string[], where: string) =>
  f.includes("handler")
    ? {
        ok: true,
        text: `500 problem+json: “Something went wrong”, id 7f3a. Details logged, nothing leaked. (Still a bug to fix: ${where}.)`,
      }
    : {
        ok: false,
        text: `500 with a raw stack trace: file paths, line numbers, library versions. (${where})`,
      };

export const CASES: Case[] = [
  {
    id: "missing",
    input: "{ qty: 2 }",
    outcome: (f) =>
      f.includes("schema")
        ? { ok: true, text: "422 problem+json: “item is required”." }
        : crash(f, "reading item of undefined"),
  },
  {
    id: "text",
    input: '{ item: "chai", qty: "two" }',
    outcome: (f) =>
      f.includes("schema")
        ? { ok: true, text: "422: “qty must be a number”." }
        : { ok: false, text: "201 Created with a total of NaN: bad data saved silently." },
  },
  {
    id: "negative",
    input: '{ item: "chai", qty: -3 }',
    outcome: (f) =>
      f.includes("schema")
        ? { ok: true, text: "422: “qty must be at least 1”." }
        : { ok: false, text: "201 Created with a negative total: the customer is owed money." },
  },
  {
    id: "huge",
    input: '{ item: "chai", qty: 1, note: <5 MB of text> }',
    outcome: (f) =>
      f.includes("limit")
        ? { ok: true, text: "413 Content Too Large, rejected before reading it all." }
        : {
            ok: false,
            text: "Read into memory in full; a few of these at once can exhaust the server.",
          },
  },
  {
    id: "unknown",
    input: '{ item: "unicorn-latte", qty: 1 }',
    outcome: (f) =>
      f.includes("rules")
        ? { ok: true, text: "422: “No such item: unicorn-latte”." }
        : crash(f, "price of a missing item"),
  },
];
