/** Capstone: design decisions for a made-up food-delivery company, tested against ten questions. */

export type Verdict = "good" | "warn" | "bad";

export const DECISIONS: {
  id: string;
  area: string;
  module: number;
  options: { id: string; label: string; verdict: Verdict; note: string }[];
}[] = [
  {
    id: "grain",
    area: "Grain of the orders fact",
    module: 7,
    options: [
      {
        id: "line",
        label: "One row per dish on an order",
        verdict: "good",
        note: "Atomic: answers dish questions and rolls up to orders.",
      },
      {
        id: "order",
        label: "One row per order",
        verdict: "warn",
        note: "Fine for order totals; you can't see which dishes sold.",
      },
      {
        id: "daily",
        label: "One row per restaurant per day",
        verdict: "bad",
        note: "A summary: hours, dishes and customers are gone.",
      },
    ],
  },
  {
    id: "delivery",
    area: "Tracking deliveries",
    module: 8,
    options: [
      {
        id: "acc",
        label: "Accumulating snapshot: a row per delivery with a timestamp per milestone",
        verdict: "good",
        note: "Placed, accepted, picked up, delivered on one row; lags are a subtraction.",
      },
      {
        id: "events",
        label: "Transaction fact of delivery events",
        verdict: "warn",
        note: "Complete, but every lag needs the events pivoted first.",
      },
      {
        id: "mixed",
        label: "Add delivery times as columns on the dish-level orders fact",
        verdict: "bad",
        note: "Mixed grain: an order's delivery repeats on each dish row.",
      },
    ],
  },
  {
    id: "restaurant",
    area: "Restaurant dimension history",
    module: 11,
    options: [
      {
        id: "scd2",
        label: "Type 2: a new row when commission tier or zone changes",
        verdict: "good",
        note: "Each order keeps the tier in effect when it was placed.",
      },
      {
        id: "scd1",
        label: "Type 1: overwrite",
        verdict: "bad",
        note: "Last year's revenue by tier silently changes.",
      },
    ],
  },
  {
    id: "conformed",
    area: "Dimensions shared by orders and deliveries",
    module: 9,
    options: [
      {
        id: "shared",
        label: "One conformed date, zone and customer dimension for both facts",
        verdict: "good",
        note: "Orders and deliveries line up on the same rows.",
      },
      {
        id: "separate",
        label: "Each fact gets its own copies",
        verdict: "bad",
        note: "“Zone 4” means different things in each; reports won't combine.",
      },
    ],
  },
  {
    id: "metrics",
    area: "Where metrics are defined",
    module: 15,
    options: [
      {
        id: "semantic",
        label: "Once, in a semantic layer",
        verdict: "good",
        note: "Every dashboard gets the same active customers and net revenue.",
      },
      {
        id: "dash",
        label: "In each dashboard",
        verdict: "bad",
        note: "Three tools, three numbers.",
      },
    ],
  },
  {
    id: "refunds",
    area: "Refunds and late corrections",
    module: 19,
    options: [
      {
        id: "adjust",
        label: "Append adjustment rows with their own load dates",
        verdict: "good",
        note: "Net revenue is a sum; last month's original figure can still be rebuilt.",
      },
      {
        id: "bitemporal",
        label: "Full bitemporal history on the orders fact",
        verdict: "warn",
        note: "Answers everything, at a cost in complexity few questions need.",
      },
      {
        id: "overwrite",
        label: "Overwrite the original order amounts",
        verdict: "bad",
        note: "Reports change after the fact and nobody can say why.",
      },
    ],
  },
  {
    id: "contract",
    area: "Protecting consumers",
    module: 20,
    options: [
      {
        id: "yes",
        label: "Enforced contract and a named owner on fct_orders",
        verdict: "good",
        note: "Shape changes fail the build, not the finance dashboard.",
      },
      {
        id: "no",
        label: "No contract; tell people when things change",
        verdict: "bad",
        note: "The first rename breaks someone's month-end.",
      },
    ],
  },
];

export const QUESTIONS: { q: string; needs: Record<string, string[]>; why: string }[] = [
  { q: "Revenue by city last month", needs: {}, why: "Any reasonable model answers this." },
  {
    q: "Best-selling dishes this week",
    needs: { grain: ["line"] },
    why: "Needs dish-level grain.",
  },
  {
    q: "Average delivery time by zone",
    needs: { delivery: ["acc", "events"] },
    why: "Needs delivery milestones, kept at their own grain.",
  },
  {
    q: "Orders that took over 45 minutes",
    needs: { delivery: ["acc"] },
    why: "Easy with milestone timestamps on one row.",
  },
  {
    q: "Revenue by restaurant commission tier at the time of order",
    needs: { restaurant: ["scd2"] },
    why: "Needs type 2 history.",
  },
  {
    q: "Revenue and deliveries side by side by zone",
    needs: { conformed: ["shared"] },
    why: "Drill across on a conformed zone dimension.",
  },
  {
    q: "The same active-customer count on every dashboard",
    needs: { metrics: ["semantic"] },
    why: "One definition.",
  },
  {
    q: "What last month's report said before refunds were corrected",
    needs: { refunds: ["adjust", "bitemporal"] },
    why: "Corrections mustn't overwrite history.",
  },
  {
    q: "Net revenue after refunds",
    needs: { refunds: ["adjust", "bitemporal", "overwrite"] },
    why: "Any approach that records refunds.",
  },
  {
    q: "Finance's dashboard survives a column rename",
    needs: { contract: ["yes"] },
    why: "Contracts and versions.",
  },
];

export const PRECEDENTS: { who: string; when: string; what: string }[] = [
  {
    who: "Airbnb",
    when: "2021",
    what: "Different teams reported different numbers for simple questions, until certified core models and Minerva, a metrics platform defining metrics once (12,000+ metrics and 4,000 dimensions by April 2021).",
  },
  {
    who: "Uber",
    when: "2021",
    what: "Hundreds of thousands of self-service datasets with no clear source of truth led to “data as code”: owners, reviewed schema changes, tiers and shared data models.",
  },
];
