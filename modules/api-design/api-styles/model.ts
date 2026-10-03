/** The same two tasks in four API styles (illustrative requests). */

export type Style = "rest" | "rpc" | "graphql" | "events";
export type Task = "show" | "notify";

export const STYLES: Record<Style, { name: string; idea: string }> = {
  rest: { name: "REST", idea: "Things with addresses; HTTP methods act on them." },
  rpc: { name: "RPC (gRPC)", idea: "Call a named function on another computer." },
  graphql: {
    name: "GraphQL",
    idea: "One endpoint; the client writes a query for exactly the fields it wants.",
  },
  events: { name: "Events (webhooks)", idea: "The server calls you when something happens." },
};

export const TASKS: Record<Task, string> = {
  show: "Show an order screen: status, restaurant name and dish names",
  notify: "Find out the moment the order is delivered",
};

export const SAMPLES: Record<
  Task,
  Record<Style, { code: string; trips: string; who: string; note: string }>
> = {
  show: {
    rest: {
      code: `GET /orders/ord_9
GET /restaurants/r_7
GET /dishes/dish_42
GET /dishes/dish_51`,
      trips: "4 requests",
      who: "Client asks",
      note: "Clear and cacheable, but one screen needs several round trips (unless you add a combined endpoint).",
    },
    rpc: {
      code: `rpc GetOrderScreen(GetOrderScreenRequest)
    returns (OrderScreen);

GetOrderScreen({ order_id: "ord_9" })`,
      trips: "1 call",
      who: "Client asks",
      note: "Fast and strongly typed, but each new screen tends to need a new function.",
    },
    graphql: {
      code: `query {
  order(id: "ord_9") {
    status
    restaurant { name }
    items { dish { name } }
  }
}`,
      trips: "1 request",
      who: "Client asks",
      note: "Exactly the fields this screen needs, in one trip. The server must guard against expensive queries.",
    },
    events: {
      code: `(not a good fit)

Events tell you something happened;
they don't answer questions.`,
      trips: "—",
      who: "—",
      note: "Use events alongside a query style, not instead of one.",
    },
  },
  notify: {
    rest: {
      code: `GET /orders/ord_9   → "out_for_delivery"
(wait 10 s)
GET /orders/ord_9   → "out_for_delivery"
(wait 10 s)
GET /orders/ord_9   → "delivered"`,
      trips: "many requests",
      who: "Client keeps asking",
      note: "Polling works, but most requests return nothing new, and you learn late.",
    },
    rpc: {
      code: `rpc WatchOrder(WatchOrderRequest)
    returns (stream OrderUpdate);`,
      trips: "1 long stream",
      who: "Server streams",
      note: "gRPC can stream updates over one open connection, between your own services.",
    },
    graphql: {
      code: `subscription {
  orderUpdated(id: "ord_9") { status }
}`,
      trips: "1 subscription",
      who: "Server pushes",
      note: "GraphQL subscriptions push changes, usually over a WebSocket.",
    },
    events: {
      code: `POST https://merchant.example/hooks
{ "type": "order.delivered",
  "order_id": "ord_9" }`,
      trips: "1 call, from the server",
      who: "Server calls you",
      note: "The natural fit: the server calls the client's own URL the moment it happens.",
    },
  },
};
