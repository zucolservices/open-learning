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
  polling: {
    term: "Polling",
    definition:
      "A client asking an API again and again, on a schedule, whether anything has changed. Simple, but most requests return nothing new and changes are noticed late.",
    module: "webhooks",
  },
  hmac: {
    term: "HMAC signature",
    definition:
      "A code computed from a message and a shared secret key. The receiver recomputes it to check the message came from someone holding the secret and wasn't altered on the way.",
    module: "webhooks",
  },
  sse: {
    term: "Server-sent events",
    definition:
      "A way for a server to push a stream of events to a client over one long-lived HTTP response (content type text/event-stream). One-way, with automatic reconnection in browsers.",
    module: "realtime",
  },
  websocket: {
    term: "WebSocket",
    definition:
      "A protocol that upgrades an HTTP connection into a long-lived, two-way channel, so client and server can each send messages at any time. Used for chat, games and live collaboration.",
    module: "realtime",
  },
  authentication: {
    term: "Authentication",
    definition:
      "Proving who is making a request, with something like an API key, a token or a certificate. Authorisation is the separate question of what that caller is allowed to do.",
    module: "authentication",
  },
  oauth: {
    term: "OAuth 2.0",
    definition:
      "A standard (RFC 6749) that lets a user give an app limited, revocable access to their data on another service, via access tokens, without sharing their password.",
    analogy: "A valet key: enough to park the car, not to open the boot.",
    module: "authentication",
  },
  "access-token": {
    term: "Access token",
    definition:
      "A short-lived credential an app sends with each API request (often as 'Authorization: Bearer …') showing what it has been allowed to do, and for whom.",
    module: "authentication",
  },
  pkce: {
    term: "PKCE",
    definition:
      "Proof Key for Code Exchange (RFC 7636): the app creates a secret, sends only its hash when the user signs in, and reveals the secret when swapping the code for a token, so an intercepted code is useless.",
    module: "authentication",
  },
  jwt: {
    term: "JWT",
    definition:
      "JSON Web Token (RFC 7519): a compact token of base64url-encoded JSON claims, such as issuer, subject, audience and expiry, usually signed. Anyone can read a signed JWT; the signature only stops changes.",
    module: "authentication",
  },
  bola: {
    term: "Broken object level authorisation",
    definition:
      "An API flaw where a signed-in caller can read or change records that aren't theirs, usually just by changing an ID in the request, because the API doesn't check ownership on every request. First on the OWASP API Top 10.",
    module: "api-security",
  },
  "mass-assignment": {
    term: "Mass assignment",
    definition:
      "Copying every field a client sends straight onto a stored object, so a caller can set fields they shouldn't, such as role or balance. Prevented by accepting only an allow-list of editable fields.",
    module: "api-security",
  },
  "rate-limit": {
    term: "Rate limit",
    definition:
      "A cap on how many requests a client may make in a period, such as 5,000 an hour. Requests over the limit are refused, usually with 429 Too Many Requests and a Retry-After header.",
    module: "rate-limits",
  },
  "token-bucket": {
    term: "Token bucket",
    definition:
      "A rate-limiting method: each client has a bucket of tokens that refills at a steady rate; each request spends one, and requests are refused when it's empty. Short bursts are allowed up to the bucket's size.",
    analogy:
      "A water tank filling slowly from the mains: you can run a bath fast, but not all day.",
    module: "rate-limits",
  },
  quota: {
    term: "Quota",
    definition:
      "A limit on how much of a service a client may use over a longer period or hold at once, such as calls per day or number of servers, often tied to a pricing plan.",
    module: "rate-limits",
  },
  etag: {
    term: "ETag",
    definition:
      "A version tag a server attaches to a response. Clients send it back with If-None-Match to ask 'has it changed?' (a 304 means no), or with If-Match to update only if nobody else changed it first.",
    module: "api-performance",
  },
  "cache-control": {
    term: "Cache-Control",
    definition:
      "The HTTP header that tells browsers, apps and CDNs whether and how long they may reuse a response, with directives such as max-age, no-cache, no-store and private.",
    module: "api-performance",
  },
  "api-gateway": {
    term: "API gateway",
    definition:
      "A server that sits in front of your APIs and handles shared concerns in one place, such as HTTPS, checking keys and tokens, rate limits, routing and logging, before passing requests to the right service.",
    module: "gateways-dx",
  },
  "developer-experience": {
    term: "Developer experience",
    definition:
      "How easy and pleasant an API is for developers to learn and use: documentation, examples, sandboxes, SDKs, clear errors and how quickly a newcomer can make a first successful call.",
    module: "gateways-dx",
  },
} satisfies Record<string, GlossaryEntry>;
