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
  http: {
    term: "HTTP",
    definition:
      "Hypertext Transfer Protocol: the request-and-response protocol browsers and most web APIs use. A client sends a request (method, path, headers, maybe a body); the server answers with a status code, headers and usually a body.",
    module: "http-basics",
  },
  "http-method": {
    term: "HTTP method",
    definition:
      "The verb at the start of a request saying what the client wants done, such as GET (read), POST (create or act), PUT (replace), PATCH (change part) or DELETE (remove).",
    module: "http-basics",
  },
  "http-header": {
    term: "HTTP header",
    definition:
      "A name-and-value line attached to a request or response, carrying information about it, such as Content-Type (the body's format) or Authorization (who is calling).",
    module: "http-basics",
  },
  "status-code": {
    term: "Status code",
    definition:
      "The three-digit number at the top of an HTTP response saying how the request went: 2xx success, 3xx redirection, 4xx a problem with the request, 5xx a problem on the server.",
    module: "http-basics",
  },
  "safe-method": {
    term: "Safe method",
    definition:
      "An HTTP method that only asks to read, not to change anything, such as GET or HEAD. Clients, caches and crawlers can send safe requests freely.",
    module: "http-basics",
  },
  idempotent: {
    term: "Idempotent",
    definition:
      "Having the same effect whether a request is made once or many times. PUT and DELETE are idempotent; POST is not, which is why retrying a POST can create duplicates.",
    module: "idempotency",
  },
  rest: {
    term: "REST",
    definition:
      "Representational State Transfer: an API style organised around resources, each with its own URL, acted on with standard HTTP methods. Described by Roy Fielding in 2000; in everyday use it means resources, URLs and HTTP methods.",
    module: "api-styles",
  },
  rpc: {
    term: "RPC",
    definition:
      "Remote procedure call: an API style where the client calls a named function on another computer, with arguments, as if it were local. gRPC and JSON-RPC are examples.",
    module: "api-styles",
  },
  graphql: {
    term: "GraphQL",
    definition:
      "A query language for APIs, created at Facebook: the client sends a query naming exactly the fields it wants, usually to a single endpoint, and gets back just those.",
    module: "graphql",
  },
  webhook: {
    term: "Webhook",
    definition:
      "An HTTP request an API sends to a URL the client chose, to tell it something happened, such as a payment succeeding. The client doesn't have to keep asking.",
    module: "webhooks",
  },
} satisfies Record<string, GlossaryEntry>;
