/** Cross-site requests from a malicious page to a bank, and which defences stop each. */

export type Def = "samesite" | "token" | "fetchmeta" | "noget" | "corsReflect";
export type Attack = "form" | "link" | "read";

export const DEFENCES: { id: Def; name: string; detail: string; mistake?: boolean }[] = [
  {
    id: "token",
    name: "CSRF token in every form",
    detail: "A secret value the attacker's page can't know.",
  },
  {
    id: "fetchmeta",
    name: "Reject cross-site POSTs",
    detail: "Check the browser's Sec-Fetch-Site header.",
  },
  {
    id: "samesite",
    name: "SameSite=Lax session cookie",
    detail: "Not sent on other sites' background requests.",
  },
  { id: "noget", name: "Never change data on GET", detail: "Transfers only by POST." },
  {
    id: "corsReflect",
    name: "Mistake: CORS trusts any origin, with cookies",
    detail: "Copies whatever Origin arrives into the allow header.",
    mistake: true,
  },
];

export const ATTACKS: { id: Attack; name: string; how: string }[] = [
  {
    id: "form",
    name: "Hidden form, auto-submitted",
    how: "cheap-flights.example quietly posts a transfer form to yourbank.example.",
  },
  {
    id: "link",
    name: "A link that transfers on GET",
    how: "The victim clicks a link to yourbank.example/transfer?to=…",
  },
  {
    id: "read",
    name: "A script that reads the balance",
    how: "The page's script fetches yourbank.example/balance and tries to read the reply.",
  },
];

export function outcome(a: Attack, on: Def[]): { ok: boolean; text: string } {
  if (a === "form") {
    if (on.includes("token"))
      return { ok: true, text: "Rejected: the form has no valid CSRF token." };
    if (on.includes("fetchmeta"))
      return { ok: true, text: "Rejected: Sec-Fetch-Site says cross-site." };
    if (on.includes("samesite"))
      return { ok: true, text: "The cookie wasn't sent, so the bank sees no logged-in user." };
    return {
      ok: false,
      text: "₹50,000 transferred. The browser attached the victim's cookie automatically.",
    };
  }
  if (a === "link") {
    if (on.includes("noget"))
      return { ok: true, text: "Nothing happens: GET only shows a confirmation page." };
    return {
      ok: false,
      text: "Transferred. SameSite=Lax still sends cookies when the user follows a link, and the bank changed data on GET.",
    };
  }
  if (on.includes("corsReflect") && !on.includes("samesite"))
    return {
      ok: false,
      text: "Balance read: the server told the browser this origin may read responses with cookies.",
    };
  return {
    ok: true,
    text: "The request may be sent, but the same-origin policy stops the script reading the reply.",
  };
}

export const PAIRS: { a: string; b: string; same: boolean; why: string }[] = [
  {
    a: "https://shop.example/cart",
    b: "https://shop.example/account",
    same: true,
    why: "Same scheme, host and port; only the path differs.",
  },
  {
    a: "https://shop.example",
    b: "http://shop.example",
    same: false,
    why: "Different scheme (https vs http).",
  },
  {
    a: "https://shop.example",
    b: "https://pay.shop.example",
    same: false,
    why: "Different host, even though it's a subdomain.",
  },
  {
    a: "https://shop.example",
    b: "https://shop.example:8443",
    same: false,
    why: "Different port (443 vs 8443).",
  },
];
