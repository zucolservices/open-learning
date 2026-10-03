/** A tiny food-delivery API: build a request, get the response a real server would send (illustrative). */

export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type Path = "/menu/dish_42" | "/orders" | "/orders/ord_9" | "/orders/ord_404";

export interface Req {
  method: Method;
  path: Path;
  auth: boolean;
  json: boolean;
  body: boolean;
}

export interface Res {
  status: number;
  reason: string;
  headers: string[];
  body?: string;
  why: string;
}

const problem = (title: string, status: number, detail: string) =>
  JSON.stringify({ type: "about:blank", title, status, detail }, null, 2);

export function respond(r: Req): Res {
  const allowed: Record<Path, Method[]> = {
    "/menu/dish_42": ["GET"],
    "/orders": ["GET", "POST"],
    "/orders/ord_9": ["GET", "PUT", "DELETE"],
    "/orders/ord_404": ["GET", "PUT", "DELETE"],
  };
  if (!allowed[r.path].includes(r.method))
    return {
      status: 405,
      reason: "Method Not Allowed",
      headers: [`Allow: ${allowed[r.path].join(", ")}`],
      why: "This address exists, but not for that method. The Allow header says which ones work.",
    };
  if (r.path === "/menu/dish_42")
    return {
      status: 200,
      reason: "OK",
      headers: ["Content-Type: application/json", "Cache-Control: max-age=300"],
      body: JSON.stringify({ id: "dish_42", name: "Masala dosa", price: 120 }, null, 2),
      why: "The menu is public: no sign-in needed. GET only reads, so it's safe to repeat.",
    };
  if (!r.auth)
    return {
      status: 401,
      reason: "Unauthorized",
      headers: ['WWW-Authenticate: Bearer realm="orders"'],
      why: "Orders are private. 401 means 'we don't know who you are': send credentials and try again.",
    };
  if ((r.method === "POST" || r.method === "PUT") && !r.body)
    return {
      status: 400,
      reason: "Bad Request",
      headers: ["Content-Type: application/problem+json"],
      body: problem("Bad Request", 400, "The request body is missing."),
      why: "Your mistake, so a 4xx code. The body explains what to fix.",
    };
  if ((r.method === "POST" || r.method === "PUT") && !r.json)
    return {
      status: 415,
      reason: "Unsupported Media Type",
      headers: ["Content-Type: application/problem+json"],
      body: problem("Unsupported Media Type", 415, "Send the order as application/json."),
      why: "Without Content-Type, the server can't tell how to read the body.",
    };
  if (r.path === "/orders/ord_404")
    return {
      status: 404,
      reason: "Not Found",
      headers: ["Content-Type: application/problem+json"],
      body: problem("Not Found", 404, "No order ord_404."),
      why: "Nothing at that address.",
    };
  if (r.method === "POST")
    return {
      status: 201,
      reason: "Created",
      headers: ["Location: /orders/ord_10", "Content-Type: application/json"],
      body: JSON.stringify({ id: "ord_10", status: "placed" }, null, 2),
      why: "Something new was made. Location tells you its address.",
    };
  if (r.method === "DELETE")
    return {
      status: 204,
      reason: "No Content",
      headers: [],
      why: "Done, and there's nothing to send back.",
    };
  if (r.method === "PUT")
    return {
      status: 200,
      reason: "OK",
      headers: ["Content-Type: application/json"],
      body: JSON.stringify({ id: "ord_9", status: "placed", address: "updated" }, null, 2),
      why: "Replaced the order with what you sent. Sending it again changes nothing more: PUT is idempotent.",
    };
  if (r.path === "/orders")
    return {
      status: 200,
      reason: "OK",
      headers: ["Content-Type: application/json"],
      body: JSON.stringify({ data: [{ id: "ord_9" }], next: null }, null, 2),
      why: "Your orders, as a list.",
    };
  return {
    status: 200,
    reason: "OK",
    headers: ["Content-Type: application/json"],
    body: JSON.stringify({ id: "ord_9", status: "out_for_delivery" }, null, 2),
    why: "Here's the order.",
  };
}

export function rawRequest(r: Req): string {
  const lines = [`${r.method} ${r.path} HTTP/1.1`, "Host: api.example.in"];
  if (r.auth) lines.push("Authorization: Bearer eyJhbGciOi…");
  lines.push("Accept: application/json");
  const sends = r.method === "POST" || r.method === "PUT";
  if (sends && r.json) lines.push("Content-Type: application/json");
  if (sends && r.body) {
    lines.push("");
    lines.push(
      r.method === "POST"
        ? '{ "dish": "dish_42", "quantity": 2 }'
        : '{ "dish": "dish_42", "quantity": 2, "address": "updated" }',
    );
  }
  return lines.join("\n");
}

export function rawResponse(res: Res): string {
  return [
    `HTTP/1.1 ${res.status} ${res.reason}`,
    ...res.headers,
    ...(res.body ? ["", res.body] : []),
  ].join("\n");
}
