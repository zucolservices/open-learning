import type { Consumer, Fault, Producer } from "./state";

export interface Result {
  lost: number;
  dup: number;
  why: string;
}

/** What one failure does to a single payment event under the chosen settings. */
export function run(p: Producer, c: Consumer, f: Fault, sms: boolean, dedupe: boolean): Result {
  let r: Result;
  if (f === "lostWrite") {
    r =
      p === "fire"
        ? {
            lost: 1,
            dup: 0,
            why: "The request never reached the broker, and a fire-and-forget producer (acks=0) never retries: the event is gone.",
          }
        : {
            lost: 0,
            dup: 0,
            why: "No acknowledgement came back, so the producer retried and the event arrived once.",
          };
  } else if (f === "lostAck") {
    r =
      p === "fire"
        ? {
            lost: 0,
            dup: 0,
            why: "The broker stored it; acks=0 doesn't wait or retry, so nothing doubled this time (but it would have been lost had the write failed).",
          }
        : p === "retry"
          ? {
              lost: 0,
              dup: 1,
              why: "The broker stored it but the acknowledgement was lost, so the producer sent it again: two copies in the log.",
            }
          : {
              lost: 0,
              dup: 0,
              why: "The retry carried the same producer ID and sequence number, so the broker recognised and dropped the duplicate.",
            };
  } else if (f === "appRestart") {
    if (p === "txn" && c === "txn")
      r = {
        lost: 0,
        dup: 0,
        why: "On restart, the same transactional.id fenced off the old instance and aborted its open transaction. The resent batch committed once, and read_committed consumers never saw the aborted copy.",
      };
    else if (p === "txn")
      r = {
        lost: 0,
        dup: 1,
        why: "The aborted copy is still in the log, and this consumer reads uncommitted data (the default), so it sees both.",
      };
    else
      r = {
        lost: 0,
        dup: 1,
        why: "The restarted app resent its last batch with a brand-new producer ID. The broker can't tell it's a repeat: idempotence only lasts one producer session.",
      };
  } else {
    r =
      c === "before"
        ? {
            lost: 1,
            dup: 0,
            why: "The offset was committed before processing; after the crash the next owner starts after this event. It was never processed: at most once.",
          }
        : c === "after"
          ? {
              lost: 0,
              dup: 1,
              why: "Processing finished but the commit didn't; the next owner processes the event again: at least once.",
            }
          : sms
            ? {
                lost: 0,
                dup: 1,
                why: "The Kafka output and offset were rolled back together, but the SMS had already gone out. Side effects outside Kafka can't be undone by a transaction.",
              }
            : {
                lost: 0,
                dup: 0,
                why: "The output message and the consumed offset were committed in one transaction. The crash aborted both, and the event was processed again exactly once.",
              };
  }
  if (dedupe && r.dup)
    return {
      ...r,
      dup: 0,
      why: `${r.why} The consumer checked the event ID against what it had already handled and skipped the repeat.`,
    };
  return r;
}
