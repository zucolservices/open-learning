import type { GlossaryEntry } from "./types";

/** Data Modelling track glossary. `module` slugs refer to this track. */
export const dataModelling = {
  "data-model": {
    term: "Data model",
    definition:
      "An agreed description of what data a system holds: the things it records, what is known about each, how they connect, and the rules they follow.",
    module: "why-model",
  },
  entity: {
    term: "Entity",
    definition:
      "A kind of thing a model records information about, such as a customer, product or order.",
    module: "why-model",
  },
  attribute: {
    term: "Attribute",
    definition:
      "A single fact recorded about an entity, such as a customer's name or an order's date. Usually a column.",
    module: "why-model",
  },
  "operational-data": {
    term: "Operational data",
    definition:
      "Data used to run the business day to day: recording and changing individual orders, payments or bookings as they happen.",
    module: "why-model",
  },
  "analytical-data": {
    term: "Analytical data",
    definition:
      "Data organised to understand the business: summarising lots of history to spot trends, compare periods and answer questions.",
    module: "why-model",
  },
} satisfies Record<string, GlossaryEntry>;
