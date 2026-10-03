/** Six holes in a parcel API, as the OWASP API Top 10 describes them, each with a fix (illustrative). */

export const HOLES: {
  id: string;
  owasp: string;
  title: string;
  request: string;
  vulnerable: string;
  fixed: string;
  fix: string;
}[] = [
  {
    id: "bola",
    owasp: "API1 Broken Object Level Authorization",
    title: "Read someone else's parcel",
    request: "GET /parcels/pcl_1002\nAuthorization: Bearer <Asha's token>",
    vulnerable:
      '200 OK\n{ "id": "pcl_1002", "recipient": "Ravi K.",\n  "address": "14 MG Road, Pune", "phone": "98…" }',
    fixed: "404 Not Found",
    fix: "Check the parcel belongs to the caller, in the handler, on every request.",
  },
  {
    id: "mass",
    owasp: "API3 Broken Object Property Level Authorization",
    title: "Make yourself an admin",
    request: 'PATCH /users/me\n{ "name": "Asha", "role": "admin" }',
    vulnerable: '200 OK\n{ "name": "Asha", "role": "admin" }',
    fixed:
      '422 Unprocessable Content\n{ "title": "Field not allowed", "detail": "role cannot be changed" }',
    fix: "Bind only an allow-list of editable fields (a DTO), never the whole body.",
  },
  {
    id: "exposure",
    owasp: "API3 Broken Object Property Level Authorization",
    title: "Harvest phone numbers from reviews",
    request: "GET /depots/dp_7/reviews",
    vulnerable:
      '200 OK\n[{ "text": "Fast!", "author": "Meera",\n   "author_phone": "97…", "author_email": "meera@…" }]',
    fixed: '200 OK\n[{ "text": "Fast!", "author": "Meera" }]',
    fix: "Return only the fields this caller needs; don't rely on the app to hide the rest.",
  },
  {
    id: "bfla",
    owasp: "API5 Broken Function Level Authorization",
    title: "Call an admin function",
    request: "DELETE /admin/users/user_9\nAuthorization: Bearer <Asha's token>",
    vulnerable: "204 No Content",
    fixed: "403 Forbidden",
    fix: "Check the caller's role for every admin operation, not just in the admin app's menu.",
  },
  {
    id: "resource",
    owasp: "API4 Unrestricted Resource Consumption",
    title: "Ask for a million rows",
    request: "GET /parcels?limit=1000000",
    vulnerable: "200 OK (after 48 s, 1.2 GB; the database slows for everyone)",
    fixed: '400 Bad Request\n{ "detail": "limit must be between 1 and 100" }',
    fix: "Cap page sizes, request sizes and rates.",
  },
  {
    id: "inventory",
    owasp: "API9 Improper Inventory Management",
    title: "Find the forgotten old version",
    request: "GET /v0/parcels/pcl_1002   (no token)",
    vulnerable: '200 OK\n{ "id": "pcl_1002", "recipient": "Ravi K.", … }',
    fixed: "410 Gone",
    fix: "Keep an inventory of every API and version; retire old ones for real.",
  },
];

export const TOP10: [string, string][] = [
  ["API1", "Broken Object Level Authorization"],
  ["API2", "Broken Authentication"],
  ["API3", "Broken Object Property Level Authorization"],
  ["API4", "Unrestricted Resource Consumption"],
  ["API5", "Broken Function Level Authorization"],
  ["API6", "Unrestricted Access to Sensitive Business Flows"],
  ["API7", "Server Side Request Forgery"],
  ["API8", "Security Misconfiguration"],
  ["API9", "Improper Inventory Management"],
  ["API10", "Unsafe Consumption of APIs"],
];
