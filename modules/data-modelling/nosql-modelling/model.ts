/** One food-delivery dataset shaped for a relational database, a document store and a key-value store. Made up. */

export type Shape = "rel" | "doc" | "kv";
export type Pattern = "order" | "history" | "menu" | "dish";

export const PATTERNS: Record<Pattern, string> = {
  order: "Show one order with its items",
  history: "A customer's orders, newest first",
  menu: "A restaurant's menu",
  dish: "Every order that included paneer tikka (not planned for)",
};

export const RESULTS: Record<
  Shape,
  Record<Pattern, { cost: string; ok: "good" | "ok" | "bad"; how: string }>
> = {
  rel: {
    order: { cost: "1 query, 1 join", ok: "good", how: "orders JOIN order_items ON order_id" },
    history: {
      cost: "1 query",
      ok: "good",
      how: "WHERE customer_id = … ORDER BY placed_at DESC, using an index",
    },
    menu: { cost: "1 query", ok: "good", how: "dishes WHERE restaurant_id = …" },
    dish: { cost: "1 query, 1 join", ok: "good", how: "Any new question is just another query." },
  },
  doc: {
    order: { cost: "1 read", ok: "good", how: "The items are embedded in the order document." },
    history: {
      cost: "1 query",
      ok: "good",
      how: "find({customer_id}) sorted by placed_at, with an index",
    },
    menu: { cost: "1 read", ok: "good", how: "The menu is embedded in the restaurant document." },
    dish: {
      cost: "1 query",
      ok: "ok",
      how: "Works with an index on items.dish; without one, every order is read.",
    },
  },
  kv: {
    order: {
      cost: "1 request",
      ok: "good",
      how: "Query PK = ORDER#O-1: the order and its items share a partition.",
    },
    history: {
      cost: "1 request",
      ok: "good",
      how: "Query PK = CUST#C-17, SK begins_with ORDER#, newest first.",
    },
    menu: { cost: "1 request", ok: "good", how: "Query PK = REST#R-5." },
    dish: {
      cost: "full table scan",
      ok: "bad",
      how: "No key matches this question: add a secondary index or scan everything.",
    },
  },
};

export const REL = `orders(order_id, customer_id, restaurant_id, placed_at)
order_items(order_id, dish_id, qty)
dishes(dish_id, restaurant_id, name, price)
customers(customer_id, name)  restaurants(restaurant_id, name)`;

export const DOC = `// orders collection
{ _id: "O-1", customer_id: "C-17", restaurant_id: "R-5",
  placed_at: "2026-09-02T19:40",
  items: [ { dish: "paneer tikka", qty: 1, price: 280 },
           { dish: "naan", qty: 2, price: 40 } ] }
// restaurants collection
{ _id: "R-5", name: "Tandoor House",
  menu: [ { dish: "paneer tikka", price: 280 }, … ] }`;

export const KV: [string, string, string][] = [
  ["CUST#C-17", "PROFILE", "name: Asha"],
  ["CUST#C-17", "ORDER#2026-09-02#O-1", "total: 360, restaurant: R-5"],
  ["CUST#C-17", "ORDER#2026-08-20#O-0", "total: 220, restaurant: R-2"],
  ["ORDER#O-1", "META", "customer: C-17, placed_at: …"],
  ["ORDER#O-1", "ITEM#1", "paneer tikka × 1"],
  ["ORDER#O-1", "ITEM#2", "naan × 2"],
  ["REST#R-5", "DISH#paneer-tikka", "price: 280"],
];

export const RELS: { id: string; label: string; embed: boolean; why: string }[] = [
  {
    id: "lines",
    label: "Order → its line items",
    embed: true,
    why: "Contained, bounded, always read with the order.",
  },
  {
    id: "addr",
    label: "Customer → a few saved addresses",
    embed: true,
    why: "A small 'has-a' list read with the customer.",
  },
  {
    id: "rest",
    label: "Order → the restaurant",
    embed: false,
    why: "The restaurant exists on its own and is queried by itself; copy just its name if needed.",
  },
  {
    id: "reviews",
    label: "Dish → every review ever written",
    embed: false,
    why: "Grows without bound; documents are capped at 16 MiB.",
  },
  {
    id: "drivers",
    label: "Drivers ↔ delivery zones (many-to-many)",
    embed: false,
    why: "Many-to-many relationships are better referenced.",
  },
];
