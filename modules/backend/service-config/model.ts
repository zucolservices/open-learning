/** Settings in a made-up café service and where each should live. Placeholder values only. */

export type Place = "code" | "env" | "secret";

export const PLACES: { id: Place; label: string }[] = [
  { id: "code", label: "In the code" },
  { id: "env", label: "Environment config" },
  { id: "secret", label: "Secret manager" },
];

export const SETTINGS: {
  id: string;
  name: string;
  value: string;
  answer: Place;
  why: string;
  secret: boolean;
  varies: boolean;
}[] = [
  {
    id: "dbpass",
    name: "DATABASE_PASSWORD",
    value: "•••••••• (placeholder)",
    answer: "secret",
    why: "A credential: needs access control, auditing and rotation.",
    secret: true,
    varies: true,
  },
  {
    id: "paykey",
    name: "PAYMENT_API_KEY",
    value: "•••••••• (placeholder)",
    answer: "secret",
    why: "Anyone with it can move money.",
    secret: true,
    varies: true,
  },
  {
    id: "sign",
    name: "SESSION_SIGNING_KEY",
    value: "•••••••• (placeholder)",
    answer: "secret",
    why: "Leaking it lets anyone forge sessions.",
    secret: true,
    varies: true,
  },
  {
    id: "dbhost",
    name: "DATABASE_HOST",
    value: "db.internal",
    answer: "env",
    why: "Differs between development, staging and production, but isn't secret.",
    secret: false,
    varies: true,
  },
  {
    id: "port",
    name: "PORT",
    value: "8080",
    answer: "env",
    why: "The platform decides it; read it from the environment.",
    secret: false,
    varies: true,
  },
  {
    id: "log",
    name: "LOG_LEVEL",
    value: "info",
    answer: "env",
    why: "Debug locally, info in production, no redeploy needed to change.",
    secret: false,
    varies: true,
  },
  {
    id: "rule",
    name: "MAX_ITEMS_PER_ORDER",
    value: "10",
    answer: "code",
    why: "A business rule that's the same everywhere: keep it in code, reviewed and tested.",
    secret: false,
    varies: false,
  },
];
