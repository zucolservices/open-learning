/**
 * Twenty simulated runs of an end-to-end checkout test. Each step waits on a network response
 * whose delay varies; the test either sleeps a fixed time or waits for the expected element.
 * A shared test account sometimes has its basket changed by another test running at the same
 * time. Delays and rates are illustrative and seeded, so every learner sees the same runs.
 */

export const STEPS = [
  "Open the menu",
  "Add a masala dosa",
  "Open the basket",
  "Pay",
  "See “Order confirmed”",
];

export type Wait = "sleep500" | "sleep3000" | "auto";

export const WAITS: { id: Wait; label: string; code: string }[] = [
  {
    id: "sleep500",
    label: "sleep(500) after each click",
    code: "await page.click(…); await sleep(500);",
  },
  {
    id: "sleep3000",
    label: "sleep(3000) after each click",
    code: "await page.click(…); await sleep(3000);",
  },
  {
    id: "auto",
    label: "Wait for what the user would see",
    code: 'await expect(page.getByText("Order confirmed")).toBeVisible();',
  },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export interface Run {
  ok: boolean;
  ms: number;
  reason?: string;
}

export function simulate(wait: Wait, freshAccount: boolean): Run[] {
  const r = rng(42);
  return Array.from({ length: 20 }, () => {
    const delays = STEPS.map(() => (r() < 0.15 ? 800 + r() * 1200 : 150 + r() * 400));
    const clash = r() < 0.12;
    let ms = 0;
    for (let i = 0; i < delays.length; i++) {
      const d = delays[i];
      if (wait === "sleep500") {
        ms += 500;
        if (d > 500)
          return { ok: false, ms, reason: `“${STEPS[i]}”: page still loading after 500 ms` };
      } else if (wait === "sleep3000") ms += 3000;
      else ms += d;
    }
    if (clash && !freshAccount)
      return { ok: false, ms, reason: "Basket had 2 items: another test used the same account" };
    return { ok: true, ms };
  });
}
