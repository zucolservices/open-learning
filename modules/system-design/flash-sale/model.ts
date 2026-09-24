/**
 * Flash-sale outcomes for five approaches (illustrative numbers): 1,000 tickets, a million people
 * pressing "Book" within about ten seconds of 10:00.
 */

export const TICKETS = 1000;
export const USERS = 1_000_000;
export const ARRIVAL_S = 10;

export type Approach = "naive" | "lock" | "conditional" | "counter" | "room";

export interface SaleResult {
  sold: number;
  oversold: number;
  soldOutS: number | null; // seconds after 10:00
  dbPeak: number; // requests/s the main database sees
  errors: number; // users who got an error or timeout instead of an answer
  otherPagesOk: boolean; // does the rest of the site keep working
  fairness: string;
  verdict: string;
}

const DB_CAP = 20000; // queries/s the database can take
const POOL = 500; // database connections

export function sale(a: Approach): SaleResult {
  const arrivalRate = USERS / ARRIVAL_S; // 100k/s
  if (a === "naive") {
    // Read stock, then write stock - 1: requests in flight together read the same value.
    const inFlight = 40; // reads within the same ~2 ms read→write gap at the DB's throughput
    const sold = TICKETS * inFlight;
    return {
      sold,
      oversold: sold - TICKETS,
      soldOutS: 2,
      dbPeak: arrivalRate * 2,
      errors: USERS - DB_CAP * ARRIVAL_S,
      otherPagesOk: false,
      fairness: "whoever's request lands first",
      verdict: `Sold ${sold.toLocaleString("en-IN")} tickets for ${TICKETS.toLocaleString("en-IN")} seats. Many requests read "1 left" at the same moment and all went ahead: lost updates.`,
    };
  }
  if (a === "lock") {
    const perS = 1 / 0.004; // one transaction at a time on the row, holding the lock ~4 ms
    return {
      sold: TICKETS,
      oversold: 0,
      soldOutS: TICKETS / perS,
      dbPeak: arrivalRate,
      errors: USERS - POOL - TICKETS,
      otherPagesOk: false,
      fairness: "whoever gets a database connection",
      verdict: `Never oversells, but buyers queue for one row, ${Math.round(perS)} per second. The ${POOL} database connections fill with waiting buyers, so every other page on the site fails too.`,
    };
  }
  if (a === "conditional") {
    const perS = 1 / 0.001;
    return {
      sold: TICKETS,
      oversold: 0,
      soldOutS: TICKETS / perS,
      dbPeak: arrivalRate,
      errors: USERS - DB_CAP * ARRIVAL_S,
      otherPagesOk: false,
      fairness: "whoever's request lands first",
      verdict: `"UPDATE … SET stock = stock − 1 WHERE stock > 0" checks and changes in one step, so it never oversells and is quicker than holding a lock. But a million requests still hit the database: most time out.`,
    };
  }
  if (a === "counter") {
    return {
      sold: TICKETS,
      oversold: 0,
      soldOutS: 0.02,
      dbPeak: TICKETS,
      errors: 0,
      otherPagesOk: true,
      fairness: "fastest connection wins (bots love it)",
      verdict:
        "An in-memory store decrements the count atomically (a small script checks it's above zero first), at hundreds of thousands per second. Winners' orders go onto a queue; the database only sees about a thousand orders.",
    };
  }
  return {
    sold: TICKETS,
    oversold: 0,
    soldOutS: 60,
    dbPeak: 2000,
    errors: 0,
    otherPagesOk: true,
    fairness: "random among early arrivals, then first come",
    verdict:
      "A waiting room holds everyone on a lightweight page and admits a steady trickle into checkout. Those who arrived before 10:00 are shuffled randomly, so refreshing early or scripting doesn't help. Slower, but calm and fair.",
  };
}
