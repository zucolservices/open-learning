import type { GlossaryEntry } from "./types";

/** API Design track glossary. `module` slugs refer to this track. */
export const apiDesign = {
  api: {
    term: "API",
    definition:
      "Application programming interface: the set of requests one program accepts from others, and the answers it promises to give back. A web API is usually called over HTTP.",
    analogy: "A restaurant menu: you order from it without walking into the kitchen.",
    module: "what-is-an-api",
  },
  "api-contract": {
    term: "API contract",
    definition:
      "Everything callers of an API can rely on: its addresses, the fields and types it sends and accepts, what its errors mean and how it behaves. Changing any of it can break them.",
    module: "what-is-an-api",
  },
  "api-consumer": {
    term: "API consumer",
    definition:
      "A program (and the team behind it) that calls an API, also called a client. The team that builds and runs the API is the provider.",
    module: "what-is-an-api",
  },
  "api-first": {
    term: "API-first",
    definition:
      "Designing and agreeing an API's contract before building the code behind it, so the teams that use it and the team that builds it can work at the same time.",
    module: "what-is-an-api",
  },
} satisfies Record<string, GlossaryEntry>;
