/** Made-up clicks (minutes into the hour) for three users, and the four window types over them. */
export const USERS = ["asha", "ravi", "meera"] as const;
export type User = (typeof USERS)[number];

export const CLICKS: Record<User, number[]> = {
  asha: [2, 3, 4, 12, 13, 31, 33],
  ravi: [7, 8, 20, 41, 42, 43, 44],
  meera: [15, 16, 17, 50, 58],
};

export const SIZE = 10;
export const ADVANCE = 5;
export const GAP = 5;

export interface Win {
  user: User;
  start: number;
  end: number;
  count: number;
}

const all = (u: User) => CLICKS[u];

/** Epoch-aligned windows of `size` every `advance` minutes; empty windows are never created. */
function aligned(size: number, advance: number): Win[] {
  const out: Win[] = [];
  for (const u of USERS) {
    for (let start = -size + advance; start < 60; start += advance) {
      const end = start + size;
      const count = all(u).filter((t) => t >= start && t < end).length;
      if (count) out.push({ user: u, start, end, count });
    }
  }
  return out;
}

/** Sessions: clicks closer than GAP minutes belong to the same session. */
function sessions(): Win[] {
  const out: Win[] = [];
  for (const u of USERS) {
    let cur: Win | null = null;
    for (const t of all(u)) {
      if (cur && t - cur.end < GAP) {
        cur.end = t;
        cur.count++;
      } else {
        if (cur) out.push(cur);
        cur = { user: u, start: t, end: t, count: 1 };
      }
    }
    if (cur) out.push(cur);
  }
  return out;
}

/** Kafka Streams-style sliding windows: one 10-minute window ending at each click (both ends inclusive). */
function sliding(): Win[] {
  const out: Win[] = [];
  for (const u of USERS) {
    for (const t of all(u)) {
      out.push({
        user: u,
        start: t - SIZE,
        end: t,
        count: all(u).filter((x) => x >= t - SIZE && x <= t).length,
      });
    }
  }
  return out;
}

export function windowsFor(kind: "tumbling" | "hopping" | "sliding" | "session"): Win[] {
  if (kind === "tumbling")
    return aligned(SIZE, SIZE).map((w) => ({ ...w, start: Math.max(0, w.start) }));
  if (kind === "hopping") return aligned(SIZE, ADVANCE).filter((w) => w.start >= 0 || w.end > 0);
  if (kind === "session") return sessions();
  return sliding();
}
