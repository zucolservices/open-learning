/**
 * A five-node Raft group, much simplified: crash and restart nodes, send writes, and see when an
 * entry commits (on a majority) and when the group elects a new leader. The candidate with the most
 * complete log wins, as Raft's voting rule requires; ties go to the lowest-numbered node, standing in
 * for whichever randomised timeout fires first.
 */

export const N = 5;
export const MAJORITY = Math.floor(N / 2) + 1;

export type Action = `crash:${number}` | `restart:${number}` | "write";

export interface Cluster {
  up: boolean[];
  leader: number | null;
  term: number;
  logs: string[][];
  /** Number of leader log entries known to be committed. */
  committed: number;
  events: { text: string; tone?: "good" | "bad" }[];
}

const upCount = (c: Cluster) => c.up.filter(Boolean).length;

function elect(c: Cluster) {
  if (upCount(c) < MAJORITY) {
    c.leader = null;
    c.events.push({
      text: `No majority (${upCount(c)} of ${N} up): no leader can be elected`,
      tone: "bad",
    });
    return;
  }
  let best = -1;
  for (let i = 0; i < N; i++)
    if (c.up[i] && (best < 0 || c.logs[i].length > c.logs[best].length)) best = i;
  c.term++;
  c.leader = best;
  // Followers that are up adopt the new leader's log (entries it lacks are discarded).
  for (let i = 0; i < N; i++) if (c.up[i]) c.logs[i] = [...c.logs[best]];
  c.committed = c.logs[best].length;
  c.events.push({
    text: `Term ${c.term}: node ${best + 1} wins the election with ${upCount(c)} votes`,
    tone: "good",
  });
}

export function replay(actions: Action[]): Cluster {
  const c: Cluster = {
    up: Array(N).fill(true),
    leader: 0,
    term: 1,
    logs: Array.from({ length: N }, () => []),
    committed: 0,
    events: [{ text: "Term 1: node 1 is the leader" }],
  };
  let n = 0;
  for (const a of actions) {
    if (a === "write") {
      n++;
      const e = `x=${n}`;
      if (c.leader === null) {
        c.events.push({ text: `Write ${e} refused: no leader`, tone: "bad" });
        continue;
      }
      const next = [...c.logs[c.leader], e];
      for (let i = 0; i < N; i++) if (c.up[i]) c.logs[i] = [...next];
      if (upCount(c) >= MAJORITY) {
        c.committed = c.logs[c.leader].length;
        c.events.push({
          text: `Write ${e}: ${upCount(c)} of ${N} have it, a majority: committed`,
          tone: "good",
        });
      } else {
        c.events.push({
          text: `Write ${e}: only ${upCount(c)} of ${N} have it. Not committed; the client waits`,
          tone: "bad",
        });
      }
      continue;
    }
    const [kind, idx] = a.split(":");
    const i = Number(idx);
    if (kind === "crash" && c.up[i]) {
      c.up[i] = false;
      c.events.push({ text: `Node ${i + 1} crashes` });
      if (c.leader === i) {
        c.leader = null;
        c.events.push({ text: "Followers stop hearing heartbeats; an election timeout fires" });
        elect(c);
      }
    } else if (kind === "restart" && !c.up[i]) {
      c.up[i] = true;
      c.events.push({ text: `Node ${i + 1} restarts` });
      if (c.leader === null) elect(c);
      else {
        c.logs[i] = [...c.logs[c.leader]];
        if (upCount(c) >= MAJORITY && c.committed < c.logs[c.leader].length) {
          c.committed = c.logs[c.leader].length;
          c.events.push({
            text: "It catches up; waiting entries now reach a majority: committed",
            tone: "good",
          });
        } else
          c.events.push({ text: `It copies the leader's log and follows node ${c.leader + 1}` });
      }
    }
  }
  return c;
}

/** TrueTime commit wait, step by step (Spanner). Times in ms, illustrative (ε ≈ 4 ms). */
export const TT_FRAMES = [
  {
    title: "No clock is exact",
    text: "Each Spanner server's clock is disciplined by GPS receivers and atomic clocks, but there's still uncertainty. TT.now() returns an interval [earliest, latest] guaranteed to contain the true time.",
    now: 10,
    s: null as number | null,
    visible: false,
  },
  {
    title: "Pick a commit timestamp",
    text: "Transaction T1 is ready to commit. Its timestamp s is the latest edge of the current interval, so it's certainly not in the past.",
    now: 10,
    s: 14,
    visible: false,
  },
  {
    title: "Commit wait",
    text: "T1's changes stay invisible until TT.after(s) is true: the earliest edge has passed s, so s is definitely in the past everywhere. The wait is about twice the uncertainty, and overlaps the Paxos round trip.",
    now: 15,
    s: 14,
    visible: false,
  },
  {
    title: "Now it's visible",
    text: "Any transaction that starts after this gets a later timestamp, on any server in the world. Timestamps match real-time order, without a central clock.",
    now: 19,
    s: 14,
    visible: true,
  },
];
export const EPS = 4;
