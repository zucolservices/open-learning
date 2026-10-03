/** Eight requests to an orders API: which status code should each get? (illustrative) */

export const CASES: {
  id: string;
  req: string;
  what: string;
  options: number[];
  right: number[];
  why: string;
}[] = [
  {
    id: "create",
    req: "POST /orders",
    what: "The order is saved.",
    options: [200, 201, 204],
    right: [201],
    why: "201 Created: something new exists. Point to it with a Location header.",
  },
  {
    id: "json",
    req: "POST /orders",
    what: "The body isn't valid JSON: a comma is missing.",
    options: [400, 422, 500],
    right: [400],
    why: "400 Bad Request: the server couldn't even read it.",
  },
  {
    id: "qty",
    req: "POST /orders",
    what: "Valid JSON, but the quantity is −3.",
    options: [400, 409, 422],
    right: [422, 400],
    why: "422 Unprocessable Content: understood, but the content makes no sense. Many APIs use 400 for this too; be consistent.",
  },
  {
    id: "token",
    req: "GET /orders/ord_9",
    what: "No sign-in token was sent.",
    options: [401, 403, 404],
    right: [401],
    why: "401: we don't know who you are. It must come with a WWW-Authenticate header saying how to sign in.",
  },
  {
    id: "other",
    req: "GET /orders/ord_8",
    what: "Signed in, but the order belongs to someone else.",
    options: [401, 403, 404],
    right: [403, 404],
    why: "403 Forbidden is honest. 404 hides that the order exists at all, which RFC 9110 allows and GitHub does for private repositories.",
  },
  {
    id: "cancel",
    req: "POST /orders/ord_9:cancel",
    what: "The order was already delivered.",
    options: [400, 409, 410],
    right: [409],
    why: "409 Conflict: the request clashes with the resource's current state.",
  },
  {
    id: "db",
    req: "GET /orders",
    what: "The database is down for a few minutes.",
    options: [500, 503, 504],
    right: [503],
    why: "503 Service Unavailable: temporary. It may add Retry-After to say when to come back.",
  },
  {
    id: "bank",
    req: "POST /payments",
    what: "The bank didn't answer before the server gave up waiting.",
    options: [502, 503, 504],
    right: [504],
    why: "504 Gateway Timeout: a server further along didn't reply in time. (502 means it replied with nonsense.)",
  },
];

export const BEFORE = `HTTP/1.1 200 OK
Content-Type: application/json

{ "success": false,
  "error": "Something went wrong" }`;

export const AFTER = `HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.example.in/problems/insufficient-funds",
  "title": "Insufficient funds",
  "status": 422,
  "detail": "Balance is ₹300; the transfer needs ₹500.",
  "instance": "/transfers/tr_81",
  "balance_paise": 30000
}`;

export const MEMBERS: [string, string][] = [
  ["type", "A URL naming the kind of problem; clients branch on this."],
  ["title", "A short, human summary of that kind of problem."],
  ["status", "The HTTP status code, repeated for convenience."],
  ["detail", "What went wrong this time, for a human."],
  ["instance", "Which occurrence: useful when someone writes to support."],
  ["balance_paise", "An extension member: extra facts for this problem type."],
];
