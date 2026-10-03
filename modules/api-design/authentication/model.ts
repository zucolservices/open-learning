/** An OAuth 2.0 sign-in with PKCE, frame by frame, and four tokens to inspect (illustrative). */

export type Actor = "user" | "app" | "auth" | "api";

export const FRAMES: { from: Actor; to: Actor; title: string; detail: string; code?: string }[] = [
  {
    from: "app",
    to: "app",
    title: "The app makes a secret",
    detail:
      "A random code_verifier stays on the phone. Only its SHA-256 hash, the code_challenge, will leave.",
    code: "code_verifier  = dBjftJeZ4CVP…  (random, kept)\ncode_challenge = BASE64URL(SHA256(code_verifier))",
  },
  {
    from: "app",
    to: "auth",
    title: "Send the user to sign in",
    detail: "The app opens the authorisation server's page, asking for permission to read orders.",
    code: "GET /authorize?response_type=code&client_id=shop-app\n  &scope=orders.read&code_challenge=E9Melhoa…\n  &code_challenge_method=S256",
  },
  {
    from: "user",
    to: "auth",
    title: "The user signs in and agrees",
    detail:
      "Password and one-time code go to the authorisation server only. The app never sees them.",
    code: "✓ Signed in as asha@example.in\n✓ Allow Shop App to read your orders?",
  },
  {
    from: "auth",
    to: "app",
    title: "A one-time code comes back",
    detail:
      "The browser returns to the app with a short-lived code. On its own, the code is useless.",
    code: "https://shop.example/callback?code=SplxlOBeZQQYbYS6",
  },
  {
    from: "app",
    to: "auth",
    title: "Swap the code, proving it's the same app",
    detail:
      "The app sends the code with the original verifier. The server hashes it and checks it matches the challenge.",
    code: "POST /token\ngrant_type=authorization_code&code=SplxlOBeZQQYbYS6\n  &code_verifier=dBjftJeZ4CVP…",
  },
  {
    from: "auth",
    to: "app",
    title: "Tokens issued",
    detail:
      "A short-lived access token for the API, and a refresh token to get new ones without signing in again.",
    code: '{ "access_token": "eyJhbGciOiJSUzI1NiIs…",\n  "expires_in": 900, "refresh_token": "…" }',
  },
  {
    from: "app",
    to: "api",
    title: "Call the API",
    detail:
      "Every request carries the token. The API checks its signature, expiry, audience and scope.",
    code: "GET /orders\nAuthorization: Bearer eyJhbGciOiJSUzI1NiIs…",
  },
];

function b64url(obj: object): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const NOW = 1791100000; // a fixed "now" for the exercise

export const TOKENS: {
  id: string;
  label: string;
  header: object;
  payload: object;
  ok: boolean;
  verdict: string;
}[] = [
  {
    id: "good",
    label: "Token A",
    header: { alg: "RS256", typ: "JWT", kid: "2026-09" },
    payload: {
      iss: "https://auth.shop.example",
      sub: "user_481",
      aud: "orders-api",
      scope: "orders.read",
      iat: NOW - 120,
      exp: NOW + 780,
    },
    ok: true,
    verdict:
      "Accept: signed with an algorithm we allow, from our issuer, for this API, not expired, and the scope covers reading orders.",
  },
  {
    id: "none",
    label: "Token B",
    header: { alg: "none", typ: "JWT" },
    payload: {
      iss: "https://auth.shop.example",
      sub: "user_1",
      aud: "orders-api",
      scope: "orders.admin",
      iat: NOW - 60,
      exp: NOW + 3600,
    },
    ok: false,
    verdict:
      'Reject: alg is "none", so there\'s no signature at all. Anyone could have written this. Accept only the algorithms you expect.',
  },
  {
    id: "expired",
    label: "Token C",
    header: { alg: "RS256", typ: "JWT", kid: "2026-09" },
    payload: {
      iss: "https://auth.shop.example",
      sub: "user_481",
      aud: "orders-api",
      scope: "orders.read",
      iat: NOW - 7200,
      exp: NOW - 6300,
    },
    ok: false,
    verdict:
      "Reject: it expired 1 h 45 min ago. The app should use its refresh token to get a new one.",
  },
  {
    id: "aud",
    label: "Token D",
    header: { alg: "RS256", typ: "JWT", kid: "2026-09" },
    payload: {
      iss: "https://auth.shop.example",
      sub: "user_481",
      aud: "loyalty-api",
      scope: "points.read",
      iat: NOW - 60,
      exp: NOW + 840,
    },
    ok: false,
    verdict:
      "Reject: a genuine token, but issued for the loyalty API. Accepting it would let any service replay its tokens at yours.",
  },
];

export function encoded(t: (typeof TOKENS)[number]): string {
  return `${b64url(t.header)}.${b64url(t.payload)}.${t.id === "none" ? "" : "kTq3…signature"}`;
}
