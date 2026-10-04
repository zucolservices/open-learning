/** A 200-step task against a 200k-token context window. All numbers illustrative. */

export const CAP = 200;
export const STEPS = 200;

export interface Opts {
  compact: boolean;
  threshold: number;
  notes: boolean;
  subagents: boolean;
}

export function simulate(o: Opts) {
  let fill = 8;
  const series: number[] = [];
  let compactions = 0;
  let lost = 0;
  let qualitySum = 0;
  let read = 0;
  let failedAt: number | null = null;
  for (let i = 0; i < STEPS; i++) {
    const heavy = i % 5 === 4;
    fill += heavy ? (o.subagents ? 1.5 : 14) : o.subagents ? 1.6 : 2.6;
    if (o.compact && fill > (o.threshold / 100) * CAP) {
      fill = 14 + (o.notes ? 4 : 0);
      compactions++;
      if (!o.notes) lost += 3;
    }
    if (fill > CAP) {
      failedAt = i;
      series.push(CAP);
      break;
    }
    series.push(fill);
    read += fill;
    qualitySum += 1 - 0.45 * Math.pow(fill / CAP, 2);
  }
  const done = series.length;
  return {
    series,
    compactions,
    lost,
    quality: qualitySum / Math.max(1, done),
    read,
    failedAt,
    done,
  };
}
