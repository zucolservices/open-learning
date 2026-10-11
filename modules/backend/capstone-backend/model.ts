/** Building and launching a made-up café chain's order service: decisions, incidents and a flash sale. */

export interface Choice {
  id: string;
  title: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}

export const DESIGN: Choice[] = [
  {
    id: "structure",
    title: "How to organise the code",
    options: [
      {
        id: "one",
        label: "One big handler per endpoint",
        ok: false,
        outcome: "Fast to start; every later change touches HTTP, rules and SQL at once.",
      },
      {
        id: "layers",
        label: "Feature folders, with handler, service and repository inside each",
        ok: true,
        outcome: "Rules stay testable and changes stay local.",
      },
    ],
  },
  {
    id: "secrets",
    title: "Where the payment API key lives",
    options: [
      {
        id: "code",
        label: "In a config file in the repository",
        ok: false,
        outcome: "Anyone with repo access, now or in future, has it.",
      },
      {
        id: "vault",
        label: "In a secret manager, read at start-up",
        ok: true,
        outcome: "Access controlled, audited and rotatable.",
      },
    ],
  },
  {
    id: "email",
    title: "Sending the confirmation email",
    options: [
      {
        id: "inline",
        label: "During the order request",
        ok: false,
        outcome: "Every order waits on the email provider.",
      },
      {
        id: "queue",
        label: "A background job, recorded with the order (outbox)",
        ok: true,
        outcome: "Orders are fast; emails retry and are never lost.",
      },
    ],
  },
];

export const TOOLS: { id: string; label: string }[] = [
  { id: "tx", label: "Conditional update in a transaction" },
  { id: "timeout", label: "Timeouts and a circuit breaker" },
  { id: "idem", label: "Idempotency key" },
  { id: "authz", label: "Ownership check on every record" },
  { id: "graceful", label: "Graceful shutdown and readiness" },
  { id: "n1", label: "Load related data in one query" },
  { id: "cache", label: "Add a cache" },
];

export const INCIDENTS: { id: string; text: string; answer: string; why: string }[] = [
  {
    id: "oversold",
    text: "Two customers both bought the last box of mithai.",
    answer: "tx",
    why: "Check and decrement stock in one statement, inside the order's transaction.",
  },
  {
    id: "slow",
    text: "The payment provider slowed down and the whole app froze.",
    answer: "timeout",
    why: "Bound every call and fail fast while the provider is down.",
  },
  {
    id: "double",
    text: "A customer on a train was charged twice after the app retried.",
    answer: "idem",
    why: "The server recognises the retry by its key and replays the first result.",
  },
  {
    id: "leak",
    text: "Changing the number in /orders/4182 showed someone else's order.",
    answer: "authz",
    why: "Broken object-level authorization: check ownership on every request.",
  },
  {
    id: "deploy",
    text: "Orders failed for a minute during every deploy.",
    answer: "graceful",
    why: "Drain in-flight requests and stop traffic before the old pods exit.",
  },
  {
    id: "history",
    text: "The order-history page takes 4 seconds for regular customers.",
    answer: "n1",
    why: "One query per order: fetch items for all orders together.",
  },
];

export const SALE: Choice[] = [
  {
    id: "menu",
    title: "The menu is requested 5,000 times a second",
    options: [
      {
        id: "db",
        label: "Keep querying the database",
        ok: false,
        outcome: "The database saturates and orders slow down too.",
      },
      {
        id: "cache",
        label: "Cache it for a minute, delete on change, one rebuild at a time",
        ok: true,
        outcome: "Almost every request is served from memory.",
      },
    ],
  },
  {
    id: "bot",
    title: "A reseller's script is grabbing every discounted item",
    options: [
      {
        id: "none",
        label: "Let it be: it's still sales",
        ok: false,
        outcome: "Regular customers find everything gone in seconds.",
      },
      {
        id: "limit",
        label: "A per-customer rate limit, with 429 and Retry-After",
        ok: true,
        outcome: "Everyone gets a fair chance.",
      },
    ],
  },
  {
    id: "scale",
    title: "Autoscaling to 20 instances",
    options: [
      {
        id: "pool",
        label: "Keep a 20-connection pool per instance",
        ok: false,
        outcome: "400 connections: the database refuses new ones.",
      },
      {
        id: "proxy",
        label: "Smaller pools behind a connection pooler",
        ok: true,
        outcome: "Plenty of instances, a manageable number of database connections.",
      },
    ],
  },
];
