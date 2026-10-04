/** Capstone: a fictional retailer's September revenue is reported 18% too high. Everything here is made up. */

export const ACTIONS: { id: string; label: string; clue: string; useful: boolean }[] = [
  {
    id: "recon",
    label: "Reconcile revenue against the payment provider's settlement report",
    clue: "Every day matches until 12 September. From then on, the warehouse is 25–30% above settlements, every day.",
    useful: true,
  },
  {
    id: "dupes",
    label: "Test fct_revenue for duplicate order_ids",
    clue: "No duplicates. Row counts per day match the checkout database exactly.",
    useful: false,
  },
  {
    id: "fresh",
    label: "Check the freshness of every table feeding the report",
    clue: "All fresh: loaded before 06:00 every day.",
    useful: false,
  },
  {
    id: "profile",
    label: "Profile the status column by day",
    clue: "A new value, refund_pending, appears on 12 September. Before that, refunds went straight to refunded.",
    useful: true,
  },
  {
    id: "lineage",
    label: "Walk lineage upstream from the board report",
    clue: "Board deck ← fct_revenue ← stg_orders ← checkout database. fct_revenue keeps orders where status not in ('refunded', 'cancelled').",
    useful: true,
  },
];

export const HYPOTHESES: { id: string; label: string; correct?: boolean; why: string }[] = [
  {
    id: "dupes",
    label: "Orders were loaded twice",
    why: "Counts match the source and there are no duplicate ids.",
  },
  {
    id: "late",
    label: "Data arrived late and was double-counted",
    why: "Every table is fresh and counts match day by day.",
  },
  {
    id: "status",
    label: "A new refund status slipped past the revenue filter",
    correct: true,
    why: "Checkout added refund_pending on 12 September; the revenue model only excludes refunded and cancelled, so pending refunds count as sales.",
  },
  {
    id: "fx",
    label: "Currency conversion used stale rates",
    why: "All sales are in euros, and the gap starts on one exact day.",
  },
];

export interface Choice {
  id: string;
  label: string;
  good: boolean;
  outcome: string;
}

export const REPAIR: { prompt: string; choices: Choice[] }[] = [
  {
    prompt: "The board meets on Thursday. First move?",
    choices: [
      {
        id: "tell",
        label:
          "Tell the CFO now: September revenue is overstated, roughly how much, and when a corrected figure will be ready",
        good: true,
        outcome:
          "The CFO holds the slide and thanks you for the warning. No decision is made on the bad number.",
      },
      {
        id: "quiet",
        label: "Fix it quietly and send a corrected deck later",
        good: false,
        outcome:
          "Sales bonuses were already calculated from the inflated number. Now that has to be unwound too.",
      },
    ],
  },
  {
    prompt: "How do you fix the data?",
    choices: [
      {
        id: "model",
        label:
          "Exclude refund_pending in fct_revenue, rebuild from 12 September with an idempotent backfill, then reconcile again",
        good: true,
        outcome:
          "Revenue now matches settlements to the cent for every day. The rebuild can be re-run safely.",
      },
      {
        id: "slide",
        label: "Edit the slide by hand to subtract 18%",
        good: false,
        outcome: "The dashboard, the finance export and next month's report are all still wrong.",
      },
    ],
  },
  {
    prompt: "Who else needs to know?",
    choices: [
      {
        id: "lineage",
        label: "Use lineage to find every consumer of fct_revenue and tell their owners",
        good: true,
        outcome:
          "The marketing ROI model and the sales commission job were also affected; their owners re-run them.",
      },
      {
        id: "board",
        label: "Just the board; nobody else complained",
        good: false,
        outcome: "Commission payments go out wrong at month end.",
      },
    ],
  },
];

export const DEFENCES: {
  id: string;
  label: string;
  when: string;
  day: number | null;
  layer: string;
}[] = [
  {
    id: "contract",
    label: "A data contract on orders listing allowed status values",
    when: "Before checkout shipped: the change would fail their CI and start a conversation.",
    day: 0,
    layer: "Prevent",
  },
  {
    id: "accepted",
    label: "An accepted_values test on status, set to error",
    when: "12 Sep, 06:00: the build stops before the report refreshes.",
    day: 1,
    layer: "Detect early",
  },
  {
    id: "recon",
    label: "A daily reconciliation against settlements",
    when: "13 Sep: revenue and settlements differ by more than 1%.",
    day: 2,
    layer: "Detect",
  },
  {
    id: "monitor",
    label: "An anomaly monitor on daily revenue",
    when: "About 15 Sep, once the higher level stands out from the baseline.",
    day: 4,
    layer: "Detect",
  },
  {
    id: "owner",
    label: "A named owner for fct_revenue with an incident process",
    when: "Doesn't detect it, but makes every alert reach someone who acts.",
    day: null,
    layer: "Respond",
  },
  {
    id: "unique",
    label: "A unique test on order_id",
    when: "Never: there were no duplicates.",
    day: -1,
    layer: "None here",
  },
  {
    id: "fresh",
    label: "A freshness check on fct_revenue",
    when: "Never: the data was on time.",
    day: -1,
    layer: "None here",
  },
  {
    id: "charts",
    label: "More charts on the board dashboard",
    when: "Only if someone happens to look closely.",
    day: -1,
    layer: "None here",
  },
];
