/** A week in the life of an orders table: the job always succeeds; the data doesn't. */

export type Signal = "job" | "freshness" | "volume" | "schema" | "distribution";

export const SIGNALS: { id: Signal; label: string; plain: string }[] = [
  { id: "job", label: "Job status", plain: "Did the load run?" },
  { id: "freshness", label: "Freshness", plain: "Is it up to date?" },
  { id: "volume", label: "Volume", plain: "Did the usual amount arrive?" },
  { id: "schema", label: "Schema", plain: "Did the structure change?" },
  { id: "distribution", label: "Distribution", plain: "Do the values look normal?" },
];

export interface Day {
  day: string;
  values: Record<Signal, string>;
  bad: Signal | null;
  story: string;
}

export const DAYS: Day[] = [
  {
    day: "Mon",
    values: {
      job: "✓",
      freshness: "1 h",
      volume: "48.1k",
      schema: "12 cols",
      distribution: "0.4% null",
    },
    bad: null,
    story: "A normal day.",
  },
  {
    day: "Tue",
    values: {
      job: "✓",
      freshness: "1 h",
      volume: "47.6k",
      schema: "12 cols",
      distribution: "0.5% null",
    },
    bad: null,
    story: "A normal day.",
  },
  {
    day: "Wed",
    values: {
      job: "✓",
      freshness: "1 h",
      volume: "23.9k",
      schema: "12 cols",
      distribution: "0.4% null",
    },
    bad: "volume",
    story: "One region's export failed upstream; the load happily copied half the orders.",
  },
  {
    day: "Thu",
    values: {
      job: "✓",
      freshness: "1 h",
      volume: "48.4k",
      schema: "12 cols",
      distribution: "0.5% null",
    },
    bad: null,
    story: "Region fixed; back to normal.",
  },
  {
    day: "Fri",
    values: {
      job: "✓",
      freshness: "1 h",
      volume: "49.0k",
      schema: "12 cols",
      distribution: "31% null",
    },
    bad: "distribution",
    story: "A mobile app release stopped sending country; nearly a third of rows have none.",
  },
  {
    day: "Sat",
    values: {
      job: "✓",
      freshness: "1 h",
      volume: "51.2k",
      schema: "11 cols",
      distribution: "0.4% null",
    },
    bad: "schema",
    story: "Upstream renamed discount to promo_amount; the column vanished from the copy.",
  },
  {
    day: "Sun",
    values: {
      job: "✓",
      freshness: "26 h",
      volume: "51.2k",
      schema: "11 cols",
      distribution: "0.4% null",
    },
    bad: "freshness",
    story: "The source stopped updating; the job 'succeeded' at copying yesterday's data again.",
  },
];

export const DOWNSTREAM: Record<Exclude<Signal, "job">, string[]> = {
  volume: ["Daily revenue dashboard", "Regional sales report"],
  distribution: ["Revenue by country", "Tax report"],
  schema: ["Margin model", "Promotions report"],
  freshness: ["Daily revenue dashboard", "Stock reorder job"],
};
