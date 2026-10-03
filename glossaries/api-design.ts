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
  resource: {
    term: "Resource",
    definition:
      "In REST, any thing the API lets you work with that can be named, such as a book, a member or a loan. Each resource has its own URL.",
    module: "resources-urls",
  },
  url: {
    term: "URL",
    definition:
      "Uniform Resource Locator: the address of a resource, such as https://api.library.example/books/42. Its parts are the scheme, the host, the path, an optional query (after ?) and fragment (after #).",
    module: "resources-urls",
  },
  collection: {
    term: "Collection",
    definition:
      "A resource that holds many resources of one kind, named with a plural noun, such as /books. GET lists them; POST adds one.",
    module: "resources-urls",
  },
  hateoas: {
    term: "Hypermedia (HATEOAS)",
    definition:
      "Short for 'hypermedia as the engine of application state': responses include links to related resources and to the actions allowed next, so clients can follow them instead of building URLs themselves.",
    module: "resources-urls",
  },
  "problem-details": {
    term: "Problem Details",
    definition:
      "A standard JSON format for HTTP API errors (RFC 9457), with fields such as type (a URL naming the kind of problem), title, status, detail and instance, served as application/problem+json.",
    module: "methods-errors",
  },
  enum: {
    term: "Enum",
    definition:
      "A field that may only hold one of a fixed list of values, such as a payment status of pending, succeeded or failed. New values may be added later, so clients should handle ones they don't recognise.",
    module: "payload-design",
  },
  pagination: {
    term: "Pagination",
    definition:
      "Splitting a long list of results into pages, so a client fetches a manageable number at a time and asks for the next page when it needs it.",
    module: "pagination",
  },
  cursor: {
    term: "Cursor",
    definition:
      "In pagination, a token that marks where the last page ended, like a bookmark. The client passes it back to get the next page, which stays correct even if items are added or removed.",
    module: "pagination",
  },
  "idempotency-key": {
    term: "Idempotency key",
    definition:
      "A unique value a client generates for one operation, such as a payment, and sends with every retry. The server remembers the result for that key and replays it instead of doing the operation again.",
    module: "idempotency",
  },
  openapi: {
    term: "OpenAPI",
    definition:
      "A standard, machine-readable format (YAML or JSON) for describing an HTTP API: its paths, operations, parameters, data schemas and errors. Tools turn it into documentation, mock servers, tests and client code. Formerly called Swagger.",
    module: "openapi",
  },
  "breaking-change": {
    term: "Breaking change",
    definition:
      "A change to an API that makes some existing client stop working, such as renaming or removing a field, changing its type, adding a required input or tightening validation.",
    module: "versioning",
  },
  "api-versioning": {
    term: "API versioning",
    definition:
      "Labelling an API's contract with a version (in the path, a header or a parameter) so a new, incompatible version can run alongside the old one while clients move over.",
    module: "versioning",
  },
  deprecation: {
    term: "Deprecation",
    definition:
      "Announcing that part of an API is going away and clients should move off it. A deprecated feature still works; it stops only at the sunset date.",
    module: "deprecation",
  },
  sunset: {
    term: "Sunset",
    definition:
      "The date a deprecated API or version stops working. The Sunset HTTP header (RFC 8594) tells clients when it will happen.",
    module: "deprecation",
  },
  grpc: {
    term: "gRPC",
    definition:
      "An open-source RPC framework, started at Google, in which one service calls functions on another over HTTP/2, usually with messages in Protocol Buffers. It supports streaming in either or both directions.",
    module: "grpc",
  },
  protobuf: {
    term: "Protocol Buffers",
    definition:
      "Google's compact binary format for structured data. Messages are defined in .proto files, each field with a number; only the numbers and values are sent, which makes messages small and fast to parse.",
    module: "grpc",
  },
  resolver: {
    term: "Resolver",
    definition:
      "In GraphQL, the server function that fetches the data for one field. A query is answered by running the resolvers for every field it asks for, which can add up to many database calls.",
    module: "graphql",
  },
} satisfies Record<string, GlossaryEntry>;
