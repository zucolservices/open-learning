import type { GlossaryEntry } from "./types";

/** Backend track glossary. `module` slugs refer to this track. */
export const backendTrack = {
  backend: {
    term: "Backend",
    definition:
      "The part of an application that runs on servers: it receives requests, applies business rules, stores data and sends responses.",
    module: "what-a-backend-does",
  },
  handler: {
    term: "Handler",
    definition:
      "The function a server runs for a particular method and path, such as GET /orders/{id}. It reads the request and produces the response.",
    module: "http-servers",
  },
} satisfies Record<string, GlossaryEntry>;
