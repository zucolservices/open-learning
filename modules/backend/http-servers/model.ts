/** Requests to a made-up café API and the status codes a good server returns. */

export const CODES: { code: number; name: string }[] = [
  { code: 200, name: "OK" },
  { code: 201, name: "Created" },
  { code: 204, name: "No Content" },
  { code: 400, name: "Bad Request" },
  { code: 401, name: "Unauthorized" },
  { code: 403, name: "Forbidden" },
  { code: 404, name: "Not Found" },
  { code: 422, name: "Unprocessable Content" },
  { code: 429, name: "Too Many Requests" },
  { code: 500, name: "Internal Server Error" },
];

export const REQUESTS: { id: string; req: string; situation: string; ok: number[]; why: string }[] =
  [
    {
      id: "menu",
      req: "GET /menu",
      situation: "The menu exists and the caller may read it.",
      ok: [200],
      why: "Success with a body: 200 OK.",
    },
    {
      id: "create",
      req: "POST /orders",
      situation: "A valid order is saved as number 4182.",
      ok: [201],
      why: "Something new was created: 201, plus a Location header pointing at /orders/4182.",
    },
    {
      id: "bad",
      req: "POST /orders",
      situation: "Well-formed JSON, but the quantity is −3.",
      ok: [422, 400],
      why: "The request parses but breaks the rules: 422 Unprocessable Content. Some frameworks, like ASP.NET Core, use 400 for validation.",
    },
    {
      id: "missing",
      req: "GET /orders/999",
      situation: "No such order.",
      ok: [404],
      why: "Not found.",
    },
    {
      id: "anon",
      req: "DELETE /orders/42",
      situation: "The caller hasn't signed in.",
      ok: [401],
      why: "Not authenticated: 401, with a WWW-Authenticate header saying how to sign in.",
    },
    {
      id: "other",
      req: "DELETE /orders/42",
      situation: "Signed in, but order 42 belongs to someone else.",
      ok: [403, 404],
      why: "Authenticated but not allowed: 403. Returning 404 instead hides that the order exists, which is also common.",
    },
    {
      id: "flood",
      req: "GET /menu × 300 in a second",
      situation: "One client far over its limit.",
      ok: [429],
      why: "Too Many Requests, with Retry-After telling them when to try again.",
    },
    {
      id: "bug",
      req: "GET /orders/7",
      situation: "The code crashes on an unexpected null.",
      ok: [500],
      why: "The server failed: 500, with a generic message and no stack trace.",
    },
  ];
