/** Four tool-design problems, each with a fix, and a (made-up) success rate for a support agent. */

export interface Problem {
  id: string;
  label: string;
  bad: string;
  good: string;
  failure: string;
  success: string;
  gain: number;
}

export const PROBLEMS: Problem[] = [
  {
    id: "name",
    label: "Vague name and description",
    bad: `{ "name": "get",
  "description": "Gets data.",
  "input_schema": { "properties": { "id": { "type": "string" } } } }`,
    good: `{ "name": "orders_get_status",
  "description": "Look up an order's delivery status and estimated
    arrival. Use when a customer asks where their order is.
    order_id looks like 'A-4417'.",
  "input_schema": { "properties": { "order_id": { "type": "string" } },
                    "required": ["order_id"] } }`,
    failure: 'The model calls get(id="Asha Rao"): it guessed the id meant a customer name.',
    success: 'The model calls orders_get_status(order_id="A-4417") first time.',
    gain: 18,
  },
  {
    id: "output",
    label: "Huge, cryptic output",
    bad: `[{"cid":"8f3a2c...","ts":1727999123,"st":3,"z":"14"},
 {"cid":"91be44...","ts":1727999310,"st":1,"z":"09"},
 ... 498 more rows ...]`,
    good: `{ "results": [
    { "name": "Asha Rao", "email": "asha@example.com",
      "last_order": "2 Oct", "status": "delivered" } ],
  "showing": "1 of 1 match" }`,
    failure: "500 rows of codes fill the context; the model can't tell which customer is which.",
    success: "One readable match; the model knows exactly who it found.",
    gain: 14,
  },
  {
    id: "errors",
    label: "Unhelpful errors",
    bad: `Error 400`,
    good: `Error: date must be YYYY-MM-DD (for example 2026-10-12).
You sent "12/10". Ask the customer if they meant 12 October.`,
    failure: "The model retries the same call three times, then gives up.",
    success: "The model corrects the date and asks the customer to confirm.",
    gain: 12,
  },
  {
    id: "count",
    label: "Sixty thin wrappers",
    bad: `list_orders, get_order, get_order_items, get_order_events,
list_customers, get_customer, get_customer_addresses,
... 53 more, one per API endpoint ...`,
    good: `orders_get_status, orders_search, customers_search,
refunds_request, tickets_escalate   (5 tools, one per job)`,
    failure: "With 60 similar tools the model picks list_orders and pages through everything.",
    success: "Five tools, one per job: the right one is obvious.",
    gain: 10,
  },
];

export const BASE = 41;
