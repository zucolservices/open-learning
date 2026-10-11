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
  "layered-architecture": {
    term: "Layered architecture",
    definition:
      "Splitting a service into layers with one job each, typically HTTP handlers, business services and data repositories.",
    module: "project-structure",
  },
  "dependency-rule": {
    term: "Dependency rule",
    definition:
      "In hexagonal and clean architectures, code may depend only on code closer to the centre: business rules never depend on frameworks, databases or HTTP.",
    module: "project-structure",
  },
  middleware: {
    term: "Middleware",
    definition:
      "Code that wraps every request on its way to the handler and every response on the way back, used for logging, authentication, CORS, compression and similar shared concerns.",
    module: "middleware",
  },
  config: {
    term: "Configuration",
    definition:
      "Settings that change between environments, such as database hosts, ports and log levels, kept outside the code so the same build runs everywhere.",
    module: "service-config",
  },
  secret: {
    term: "Secret",
    definition:
      "A credential such as a password, API key or signing key. It needs access control, auditing and rotation, so it belongs in a secret manager, never in code.",
    module: "service-config",
  },
  "n-plus-one": {
    term: "N+1 query problem",
    definition:
      "Running one query to load a list and then one more for every item in it, instead of fetching the related data together. Slow pages are often caused by it.",
    module: "data-access",
  },
  "connection-pool": {
    term: "Connection pool",
    definition:
      "A small set of open database connections that a service reuses for many requests, because opening a new connection each time is slow.",
    module: "data-access",
  },
  orm: {
    term: "ORM",
    definition:
      "Object-relational mapper: a library that maps database rows to objects in your language and writes much of the SQL for you, such as Hibernate, Entity Framework, SQLAlchemy or Prisma.",
    module: "data-access",
  },
  migration: {
    term: "Migration",
    definition:
      "A versioned script that changes a database schema or its data, applied in order and recorded so every environment ends up the same.",
    module: "migrations",
  },
  "expand-contract": {
    term: "Expand and contract",
    definition:
      "Changing a live schema in safe steps: add the new structure, move code and data across while both work, then remove the old structure. Also called parallel change.",
    module: "migrations",
  },
  "cache-stampede": {
    term: "Cache stampede",
    definition:
      "When a popular cache entry expires and many requests all try to rebuild it at once, flooding the database. Also called a thundering herd.",
    module: "caching-backend",
  },
  authorization: {
    term: "Authorization",
    definition:
      "Deciding what a signed-in user may do, and to which specific records. Checked on the server for every request, denying anything not explicitly allowed.",
    module: "authorization",
  },
  "background-job": {
    term: "Background job",
    definition:
      "Work taken off the request path and run later by a worker process, such as sending email or resizing images, usually with retries.",
    module: "background-jobs",
  },
  "message-queue": {
    term: "Message queue",
    definition:
      "A durable list of tasks or messages that producers add to and workers take from, so work survives crashes and can be retried. Examples: SQS, RabbitMQ, Redis-based queues.",
    module: "background-jobs",
  },
  "transactional-outbox": {
    term: "Transactional outbox",
    definition:
      "Saving an event in an outbox table in the same database transaction as the change it describes, then publishing it separately, so events are never lost or sent for changes that rolled back.",
    module: "webhooks-events",
  },
  "presigned-url": {
    term: "Pre-signed URL",
    definition:
      "A time-limited link, signed by your server, that lets a client upload or download one object in cloud storage directly, without your credentials.",
    module: "file-uploads",
  },
} satisfies Record<string, GlossaryEntry>;
