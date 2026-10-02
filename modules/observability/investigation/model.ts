/** An investigation, stage by stage: pick the next move (illustrative incident). */

export interface Option {
  id: string;
  label: string;
  good: boolean;
  minutes: number;
  result: string;
  /** Name of the anti-method, if this move is one. */
  anti?: string;
}

export const STAGES: { title: string; prompt: string; options: Option[] }[] = [
  {
    title: "21:02 · The page",
    prompt:
      "Checkout's error budget is burning at 14.4×. You've just opened your laptop. First move?",
    options: [
      {
        id: "impact",
        label: "Open the checkout dashboard: how many users, which signals?",
        good: true,
        minutes: 2,
        result:
          "Errors at 6% of checkouts since 20:55; latency normal; traffic normal. It's real and it's errors, not slowness.",
      },
      {
        id: "restart",
        label: "Restart all the checkout pods and see if it helps",
        good: false,
        minutes: 8,
        anti: "Random Change Anti-Method",
        result:
          "Eight minutes later the errors are back. You've learned nothing and dropped some in-flight payments.",
      },
      {
        id: "cpu",
        label: "Check CPU and memory on every node",
        good: false,
        minutes: 6,
        anti: "Streetlight Anti-Method",
        result: "All normal. You looked where the tools were familiar, not where the problem is.",
      },
    ],
  },
  {
    title: "21:04 · Where?",
    prompt: "6% of checkouts are failing. How do you narrow it down?",
    options: [
      {
        id: "slice",
        label: "Break the errors down by attribute: version, bank, region, device",
        good: true,
        minutes: 3,
        result:
          "Every failing request comes from pods running version 7.4, deployed at 20:53. Older pods are clean.",
      },
      {
        id: "blame",
        label: "Tell the database team their database is broken",
        good: false,
        minutes: 15,
        anti: "Blame-Someone-Else Anti-Method",
        result:
          "The database team shows you a healthy database fifteen minutes later. Customers kept failing.",
      },
      {
        id: "grep",
        label: "Scroll through all the logs looking for 'error'",
        good: false,
        minutes: 10,
        result: "Thousands of lines, most of them noise you see every day. Nothing stands out yet.",
      },
    ],
  },
  {
    title: "21:07 · Stop the bleeding",
    prompt: "Version 7.4 correlates with every failure. Now what?",
    options: [
      {
        id: "rollback",
        label: "Roll back to 7.3 (or turn off its new feature flag), then keep investigating",
        good: true,
        minutes: 4,
        result:
          "By 21:11 errors are back to normal. Users are fine; now you can find the cause calmly.",
      },
      {
        id: "fixlive",
        label: "Keep debugging 7.4 live until you understand it",
        good: false,
        minutes: 25,
        result:
          "You find it eventually, while customers fail for another 25 minutes. Mitigate first.",
      },
    ],
  },
  {
    title: "21:12 · Why?",
    prompt: "Service restored. How do you find the cause?",
    options: [
      {
        id: "trace",
        label: "Open a failing trace from 7.4, then the logs for that trace ID",
        good: true,
        minutes: 6,
        result:
          "The trace shows the call to the fraud service failing instantly; its log line says FRAUD_API_URL is not set. 7.4 renamed the setting and production's configuration wasn't updated.",
      },
      {
        id: "guess",
        label: "Change the fraud timeout and redeploy 7.4 to see what happens",
        good: false,
        minutes: 20,
        anti: "Drunk Man Anti-Method",
        result:
          "Errors return the moment 7.4 goes out again. Never test guesses on production users.",
      },
    ],
  },
];
