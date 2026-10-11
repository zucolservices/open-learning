/** Six middleware for a made-up café API, and what goes wrong when they're in the wrong order. */

export const MW: { id: string; label: string }[] = [
  { id: "error", label: "Error handler" },
  { id: "log", label: "Request logging" },
  { id: "cors", label: "CORS" },
  { id: "rate", label: "Rate limiter" },
  { id: "authn", label: "Authentication" },
  { id: "authz", label: "Authorization" },
];

export const START = ["authz", "log", "authn", "cors", "error", "rate"];

export const TESTS: { id: string; label: string }[] = [
  { id: "crash", label: "A request where the logger itself throws" },
  { id: "preflight", label: "A browser's CORS preflight (no credentials)" },
  { id: "flood", label: "300 requests a second from one client" },
  { id: "anon", label: "GET /orders without signing in" },
  { id: "ok", label: "A signed-in customer's normal request" },
];

export function evaluate(order: string[]) {
  const i = (id: string) => order.indexOf(id);
  const res: Record<string, { ok: boolean; text: string }> = {};
  res.crash =
    i("error") === 0
      ? { ok: true, text: "Caught: a clean 500 problem response." }
      : {
          ok: false,
          text: "Not caught: middleware outside the error handler crashed, so the client may see a raw stack trace.",
        };
  res.preflight =
    i("cors") < i("authn")
      ? { ok: true, text: "CORS answers the preflight before authentication runs." }
      : {
          ok: false,
          text: "Authentication rejects the preflight with 401; the browser blocks the real request.",
        };
  res.flood =
    i("rate") < i("authn")
      ? i("log") < i("rate")
        ? { ok: true, text: "Refused cheaply with 429, and every refusal is logged." }
        : { ok: false, text: "Refused with 429, but the logger never sees the refused requests." }
      : { ok: false, text: "Each flood request costs a token check before being refused." };
  res.anon =
    i("authn") < i("authz")
      ? i("log") < i("authn")
        ? { ok: true, text: "401, logged with a request ID." }
        : { ok: false, text: "401, but the failed attempt isn't logged." }
      : {
          ok: false,
          text: "Authorization runs before anyone is identified, so it can't make a real decision.",
        };
  res.ok =
    i("authn") < i("authz")
      ? { ok: true, text: "Identified, then allowed, then handled." }
      : { ok: false, text: "Denied: authorization couldn't see who the customer was yet." };
  return res;
}
