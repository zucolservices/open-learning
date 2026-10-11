import type { GlossaryEntry } from "./types";

/** Backend track glossary. `module` slugs refer to this track. */
export const backendTrack = {
  backend: {
    term: "Backend",
    definition:
      "The part of an application that runs on servers: it receives requests, applies business rules, stores data and sends responses.",
    module: "what-a-backend-does",
  },
} satisfies Record<string, GlossaryEntry>;
