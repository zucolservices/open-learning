/** Made-up payment events for the log simulation: yesterday evening, then this morning. */
export interface Ev {
  key: string;
  value: string;
  day: "yesterday" | "today";
  time: string;
}

export const EVENTS: Ev[] = [
  { key: "asha", value: "paid ₹450 to Chai Point", day: "yesterday", time: "17:42" },
  { key: "ravi", value: "paid ₹1,200 to Metro card", day: "yesterday", time: "18:05" },
  { key: "asha", value: "paid ₹89 to Book shop", day: "yesterday", time: "19:31" },
  { key: "meera", value: "paid ₹15,000 to Landlord", day: "yesterday", time: "21:10" },
  { key: "ravi", value: "paid ₹60 to Auto", day: "today", time: "08:14" },
  { key: "meera", value: "paid ₹230 to Pharmacy", day: "today", time: "08:40" },
  { key: "asha", value: "paid ₹2,999 to Electronics", day: "today", time: "09:02" },
  { key: "ravi", value: "paid ₹540 to Groceries", day: "today", time: "09:18" },
  { key: "meera", value: "paid ₹99 to Music app", day: "today", time: "09:25" },
  { key: "asha", value: "paid ₹320 to Lunch", day: "today", time: "12:47" },
];

/** Offset of the first event at or after yesterday 18:00 (what a time lookup would return). */
export const YESTERDAY_1800 = EVENTS.findIndex((e) => e.day === "today" || e.time >= "18:00");
