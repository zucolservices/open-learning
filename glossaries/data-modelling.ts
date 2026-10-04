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
  "conceptual-model": {
    term: "Conceptual model",
    definition:
      "The highest-level model: the things a business cares about and how they relate, in its own words, with no technical detail.",
    module: "model-levels",
  },
  "logical-model": {
    term: "Logical model",
    definition:
      "A detailed model listing every entity, attribute, key and relationship, without tying it to a particular database product.",
    module: "model-levels",
  },
  "physical-model": {
    term: "Physical model",
    definition:
      "The model as built in one database: tables, column types, constraints, indexes and other product-specific choices.",
    module: "model-levels",
  },
  "er-diagram": {
    term: "Entity-relationship diagram",
    definition:
      "A drawing of a data model with entities as boxes and relationships as lines between them. Introduced by Peter Chen in 1976.",
    module: "model-levels",
  },
  cardinality: {
    term: "Cardinality",
    definition:
      "How many of one thing can relate to another: one-to-one, one-to-many or many-to-many.",
    module: "model-levels",
  },
  "crows-foot": {
    term: "Crow's foot notation",
    definition:
      "A style of ER diagram where a three-pronged 'foot' at the end of a line means 'many' and a bar means 'one'.",
    module: "model-levels",
  },
  "primary-key": {
    term: "Primary key",
    definition:
      "The column or columns that uniquely identify each row of a table. Values must be unique and never empty; a table has at most one.",
    module: "keys-relationships",
  },
  "foreign-key": {
    term: "Foreign key",
    definition:
      "A column whose values must match a key in another table, linking each row to the row it refers to.",
    module: "keys-relationships",
  },
  "referential-integrity": {
    term: "Referential integrity",
    definition:
      "The guarantee that every foreign key points to a row that actually exists, so there are no orphaned references.",
    module: "keys-relationships",
  },
  "candidate-key": {
    term: "Candidate key",
    definition:
      "Any smallest set of columns that uniquely identifies each row. One is chosen as the primary key.",
    module: "keys-relationships",
  },
  "natural-key": {
    term: "Natural key",
    definition:
      "A key that comes from the real world and means something, such as an ISBN, an email address or a product code.",
    module: "keys-relationships",
  },
  "surrogate-key": {
    term: "Surrogate key",
    definition:
      "A meaningless generated identifier, usually an increasing integer, used instead of a natural key.",
    module: "keys-relationships",
  },
  "junction-table": {
    term: "Junction table",
    definition:
      "A table that resolves a many-to-many relationship, holding a foreign key to each side. Also called an associative, link or bridge table.",
    module: "keys-relationships",
  },
  "composite-key": {
    term: "Composite key",
    definition: "A key made of more than one column, such as (order_id, product_no).",
    module: "keys-relationships",
  },
} satisfies Record<string, GlossaryEntry>;
