import type { GlossaryEntry } from "./types";

/** Database Internals track glossary. `module` slugs refer to this track. */
export const databaseInternals = {
  parser: {
    term: "Parser",
    definition:
      "The part of a database that checks a SQL statement's syntax and turns the text into a tree structure the rest of the system can work with.",
    module: "query-journey",
  },
  "query-planner": {
    term: "Query planner",
    definition:
      "The part of a database that works out how to run a query: it considers different ways (which indexes, which join order), estimates the cost of each and picks the cheapest. Also called the optimiser.",
    analogy: "A satnav comparing routes before you set off.",
    module: "query-planning",
  },
  page: {
    term: "Page",
    definition:
      "The fixed-size block a database reads and writes as a unit, usually 8 kB in PostgreSQL, 16 KB in MySQL's InnoDB and 4 KB in SQLite. Tables and indexes are stored as files of pages.",
    module: "pages-rows",
  },
  "buffer-pool": {
    term: "Buffer pool",
    definition:
      "The area of memory where a database keeps copies of recently used pages, so most reads don't have to go to disk. PostgreSQL calls it shared buffers.",
    module: "buffer-pool",
  },
  index: {
    term: "Index",
    definition:
      "A separate structure that lets a database find rows by a column's value without reading the whole table, like the index at the back of a book. It speeds up reads but adds work to every write.",
    module: "btrees",
  },
} satisfies Record<string, GlossaryEntry>;
