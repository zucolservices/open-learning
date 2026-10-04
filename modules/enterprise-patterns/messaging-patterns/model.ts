/**
 * Six messages through a channel, point-to-point (three competing workers) or publish-subscribe
 * (three subscribers). Optional trouble: one malformed message, one duplicate delivery. Illustrative.
 */

export type Channel = "p2p" | "pubsub";

export const RECEIVERS: Record<Channel, string[]> = {
  p2p: ["Worker 1", "Worker 2", "Worker 3"],
  pubsub: ["Stock", "Invoicing", "Email"],
};

export interface Delivery {
  msg: number;
  note?: string;
  tone?: "good" | "bad" | "muted";
}

export interface Result {
  columns: Delivery[][];
  dead: number[];
  log: string[];
}

const N = 6;
const POISON = 3;
const DUP = 2;
export const MAX_TRIES = 3;

export function run(ch: Channel, poison: boolean, dup: boolean, idem: boolean): Result {
  const cols: Delivery[][] = [[], [], []];
  const dead: number[] = [];
  const log: string[] = [];
  let rr = 0;
  for (let m = 1; m <= N; m++) {
    const targets = ch === "p2p" ? [rr++ % 3] : [0, 1, 2];
    for (const t of targets) {
      if (poison && m === POISON) {
        for (let k = 1; k <= MAX_TRIES; k++)
          cols[ch === "p2p" ? (t + k - 1) % 3 : t].push({ msg: m, note: `fail ${k}`, tone: "bad" });
        if (!dead.includes(m)) dead.push(m);
        continue;
      }
      cols[t].push({ msg: m });
      if (dup && m === DUP) {
        cols[t].push({
          msg: m,
          note: idem ? "duplicate, ignored" : "duplicate, done twice",
          tone: idem ? "muted" : "bad",
        });
      }
    }
  }
  if (ch === "p2p") log.push("Each message went to exactly one worker: the work is shared.");
  else log.push("Each subscriber got its own copy of every message.");
  if (poison)
    log.push(
      `Message ${POISON} can't be processed. After ${MAX_TRIES} tries it's moved aside to the dead-letter queue instead of blocking everything.`,
    );
  if (dup)
    log.push(
      idem
        ? `Message ${DUP} arrived twice; the receiver recognised its ID and ignored the copy.`
        : `Message ${DUP} arrived twice and was processed twice: a customer may be charged twice.`,
    );
  return { columns: cols, dead, log };
}
