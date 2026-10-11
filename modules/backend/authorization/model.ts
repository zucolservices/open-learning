/** Endpoints of a made-up café API, each with a missing (or present) authorization check. Attacks are described in words. */

export type Fix = "owner" | "role" | "filter" | "fields" | "none";

export const FIXES: { id: Fix; label: string }[] = [
  { id: "owner", label: "Check the record belongs to the user" },
  { id: "role", label: "Require a staff or admin role" },
  { id: "filter", label: "Filter results on the server" },
  { id: "fields", label: "Only accept allowed fields" },
  { id: "none", label: "Fine as it is" },
];

export const ENDPOINTS: {
  id: string;
  route: string;
  now: string;
  attack: string;
  answer: Fix;
  why: string;
}[] = [
  {
    id: "order",
    route: "GET /orders/{id}",
    now: "Checks the user is signed in.",
    attack: "A customer changes the order number in the address and sees a stranger's order.",
    answer: "owner",
    why: "Broken object-level authorization, the top API risk: check ownership on every object.",
  },
  {
    id: "patch",
    route: "PATCH /orders/{id}",
    now: "Copies every field from the request onto the order.",
    attack: "A customer adds “status: refunded” to the request body.",
    answer: "fields",
    why: "Accept only fields this user may change (the delivery address); status is staff-only.",
  },
  {
    id: "delete",
    route: "DELETE /menu/{item}",
    now: "Checks the user is signed in.",
    attack: "Any customer deletes items from the menu.",
    answer: "role",
    why: "Function-level authorization: only staff may manage the menu.",
  },
  {
    id: "admin",
    route: "GET /admin/reports",
    now: "Not linked anywhere in the app.",
    attack: "Someone guesses the address and downloads sales reports.",
    answer: "role",
    why: "Hiding a URL isn't protection. Require the admin role.",
  },
  {
    id: "list",
    route: "GET /orders",
    now: "Returns every order; the app shows only the user's own.",
    attack: "Calling the API directly lists everyone's orders.",
    answer: "filter",
    why: "The browser is not a security boundary: filter on the server.",
  },
  {
    id: "menu",
    route: "GET /menu",
    now: "Open to everyone.",
    attack: "Anyone can read the menu.",
    answer: "none",
    why: "Public by design; everything else is denied by default.",
  },
];
