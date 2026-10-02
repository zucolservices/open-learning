/**
 * One release promoted through test, staging and production (illustrative). Staging can be set up
 * like test (fakes, tiny data) or like production (real payment sandbox, signed webhooks).
 */

export type Parity = "test-like" | "prod-like";

export const CONFIG_KEYS = [
  "DATABASE_URL",
  "PAYMENT_GATEWAY",
  "WEBHOOK_SECRET",
  "LOG_LEVEL",
  "Data",
] as const;

export type EnvName = "Test" | "Staging" | "Production";

export function config(env: EnvName, parity: Parity): Record<(typeof CONFIG_KEYS)[number], string> {
  if (env === "Test" || (env === "Staging" && parity === "test-like")) {
    return {
      DATABASE_URL: env === "Test" ? "postgres://test-db" : "postgres://staging-db",
      PAYMENT_GATEWAY: "fake (always says yes)",
      WEBHOOK_SECRET: "(not set: fake sends no webhooks)",
      LOG_LEVEL: "debug",
      Data: "200 made-up orders",
    };
  }
  if (env === "Staging") {
    return {
      DATABASE_URL: "postgres://staging-db",
      PAYMENT_GATEWAY: "provider sandbox (real API)",
      WEBHOOK_SECRET: "from the secrets manager",
      LOG_LEVEL: "info",
      Data: "2 million masked orders",
    };
  }
  return {
    DATABASE_URL: "postgres://prod-db",
    PAYMENT_GATEWAY: "provider live",
    WEBHOOK_SECRET: "from the secrets manager",
    LOG_LEVEL: "info",
    Data: "real customers",
  };
}

export interface Frame {
  title: string;
  text: string;
  /** Which environment is active, and what it shows. */
  env: EnvName;
  status: Record<EnvName, "idle" | "running" | "pass" | "fail" | "waiting">;
  tone?: "good" | "bad";
}

export function frames(parity: Parity): Frame[] {
  const start: Frame[] = [
    {
      title: "payments-api 2.4.1 reaches test",
      text: "The pipeline deploys the artifact to test. Unit, integration and end-to-end tests run against a fake payment gateway that always approves. Everything passes.",
      env: "Test",
      status: { Test: "pass", Staging: "idle", Production: "idle" },
    },
    {
      title: "Promote to staging",
      text:
        parity === "prod-like"
          ? "The same 2.4.1 goes to staging, which talks to the payment provider's real sandbox. The sandbox sends signed webhooks to say a payment succeeded."
          : "The same 2.4.1 goes to staging, which, to save effort, uses the same fake gateway as test.",
      env: "Staging",
      status: { Test: "pass", Staging: "running", Production: "idle" },
    },
  ];
  if (parity === "prod-like") {
    return [
      ...start,
      {
        title: "Staging catches it",
        text: "Every webhook is rejected: the new signature check reads WEBHOOK_SECRET under a renamed key, and test never sent a webhook to notice. Orders stay 'pending' forever. Found on a Tuesday afternoon by the team, not by customers.",
        env: "Staging",
        status: { Test: "pass", Staging: "fail", Production: "idle" },
        tone: "bad",
      },
      {
        title: "Fix, and the new build goes round again",
        text: "The fix is one line, released as 2.4.2. It goes through test and staging like any change; staging's webhooks now pass.",
        env: "Staging",
        status: { Test: "pass", Staging: "pass", Production: "idle" },
      },
      {
        title: "A gate before production",
        text: "Production is a protected environment: a named reviewer must approve, and a wait timer gives staging an hour of real-looking traffic first. Approved.",
        env: "Production",
        status: { Test: "pass", Staging: "pass", Production: "waiting" },
      },
      {
        title: "2.4.2 in production",
        text: "The exact artifact that passed staging now runs in production, with production's settings. Payments confirm normally.",
        env: "Production",
        status: { Test: "pass", Staging: "pass", Production: "pass" },
        tone: "good",
      },
    ];
  }
  return [
    ...start,
    {
      title: "Staging passes too",
      text: "With the same fakes as test, staging can only repeat what test already proved. Green again.",
      env: "Staging",
      status: { Test: "pass", Staging: "pass", Production: "idle" },
    },
    {
      title: "A gate before production",
      text: "The reviewer sees two green environments and approves.",
      env: "Production",
      status: { Test: "pass", Staging: "pass", Production: "waiting" },
    },
    {
      title: "Production finds it, with real customers",
      text: "The live provider sends signed webhooks; every one is rejected because of the renamed WEBHOOK_SECRET key. Thousands of paid orders sit 'pending' and support phones ring.",
      env: "Production",
      status: { Test: "pass", Staging: "pass", Production: "fail" },
      tone: "bad",
    },
  ];
}
