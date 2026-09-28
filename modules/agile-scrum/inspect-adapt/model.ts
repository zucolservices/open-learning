/**
 * Steer to a moving target: over 26 weeks, what users need drifts. The team moves towards what it
 * believes they need, and updates that belief only when it inspects. Inspecting takes time away
 * from building, and without transparency an inspection sees stale, rosier information.
 * Illustrative numbers, not data.
 */

export const WEEKS = 26;
const SPEED = 7; // how far the team can move its product in a week
const INSPECT_COST = 0.3; // share of a week's capacity an inspection takes
const STALE = 5; // weeks behind reality that status reports are, without transparency

export function need(t: number) {
  return 50 + 24 * Math.sin(t / 4.2) + 10 * Math.sin(t / 1.9 + 1);
}

export interface Run {
  team: number[];
  target: number[];
  inspections: number[];
  misfit: number;
  lostWeeks: number;
}

export function steer(every: number, transparent: boolean): Run {
  const target: number[] = [];
  const team: number[] = [];
  const inspections: number[] = [];
  let pos = need(0);
  let belief = need(0);
  for (let t = 0; t <= WEEKS; t++) {
    const tgt = need(t);
    target.push(tgt);
    let speed = SPEED;
    if (t > 0 && t % every === 0) {
      inspections.push(t);
      belief = transparent ? tgt : need(Math.max(0, t - STALE));
      speed *= 1 - INSPECT_COST;
    }
    if (t > 0) {
      const d = belief - pos;
      pos += Math.sign(d) * Math.min(Math.abs(d), speed);
    }
    team.push(pos);
  }
  const misfit = target.reduce((a, x, i) => a + Math.abs(x - team[i]), 0) / target.length;
  return { team, target, inspections, misfit, lostWeeks: inspections.length * INSPECT_COST };
}
