import type { Acks, Health } from "./state";

/**
 * One partition, replication factor 3: B1 leads, B2 and B3 follow. Followers that keep up are in the ISR.
 * A producer writes message m5; the leader then crashes before any follower fetches it, unless acks=all
 * made the producer wait for every in-sync replica first.
 */
export interface Outcome {
  isr: string[];
  accepted: boolean;
  ack: "none" | "sent" | "acked";
  holders: string[];
  newLeader: string | null;
  result: "safe" | "lost" | "offline" | "rejected" | "unconfirmed-lost";
  text: string;
}

export function run(
  acks: Acks,
  minIsr: number,
  unclean: boolean,
  health: Health,
  crashed: boolean,
): Outcome {
  const followers = health === "both" ? ["B2", "B3"] : health === "one" ? ["B2"] : [];
  const isr = ["B1", ...followers];
  if (acks === "all" && isr.length < minIsr) {
    return {
      isr,
      accepted: false,
      ack: "none",
      holders: [],
      newLeader: null,
      result: "rejected",
      text: `Only ${isr.length} replica${isr.length > 1 ? "s are" : " is"} in sync, below min.insync.replicas=${minIsr}. The producer gets a NotEnoughReplicas error and can retry: nothing is acknowledged, so nothing is lost. Consumers also stop seeing new data until the ISR recovers.`,
    };
  }
  const holders = acks === "all" ? isr : ["B1"];
  const ack = acks === "0" ? "sent" : "acked";
  if (!crashed) {
    return {
      isr,
      accepted: true,
      ack,
      holders,
      newLeader: "B1",
      result: "safe",
      text:
        acks === "0"
          ? "Sent without waiting for any reply. Fast, but the producer never learns whether it arrived."
          : acks === "1"
            ? "Acknowledged as soon as the leader wrote it. The followers haven't copied it yet."
            : `Acknowledged once every in-sync replica (${isr.join(", ")}) had it.`,
    };
  }
  const candidates = followers;
  if (candidates.length) {
    const nl = candidates[0];
    const has = holders.includes(nl);
    return {
      isr,
      accepted: true,
      ack,
      holders,
      newLeader: nl,
      result: has ? "safe" : acks === "0" ? "unconfirmed-lost" : "lost",
      text: has
        ? `${nl} was in sync and already had m5, so it becomes leader with nothing lost.`
        : acks === "0"
          ? `${nl} becomes leader without m5. The producer never had a confirmation, so it doesn't even know.`
          : `${nl} becomes leader without m5. The producer was told the write succeeded, but it's gone: an acknowledged write lost.`,
    };
  }
  if (!unclean) {
    return {
      isr,
      accepted: true,
      ack,
      holders,
      newLeader: null,
      result: "offline",
      text: "The only in-sync replica died. With unclean election off, Kafka waits for B1 to come back: the partition is offline, but no acknowledged data is lost.",
    };
  }
  return {
    isr,
    accepted: true,
    ack,
    holders,
    newLeader: "B3",
    result: acks === "0" ? "unconfirmed-lost" : "lost",
    text: "Unclean election: B3, which had fallen behind, becomes leader. The partition is back online, but everything B3 never copied, including m5, is gone.",
  };
}
