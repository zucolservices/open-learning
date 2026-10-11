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
  concurrency: {
    term: "Concurrency",
    definition:
      "Making progress on many tasks over the same period by switching between them while each waits. Different from parallelism, which runs tasks at the same instant on several cores.",
    module: "concurrency",
  },
  thread: {
    term: "Thread",
    definition:
      "A sequence of work the operating system schedules on a CPU core. Classic servers give each request its own thread from a pool.",
    module: "concurrency",
  },
  "event-loop-server": {
    term: "Event loop",
    definition:
      "A single thread that runs short pieces of code as events arrive, starting slow operations and continuing when they finish, so it can juggle thousands of waiting requests.",
    module: "concurrency",
  },
} satisfies Record<string, GlossaryEntry>;
