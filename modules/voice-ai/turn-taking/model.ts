/** A caller's turns with thinking pauses, judged by a silence timer or a semantic detector. Illustrative. */

export interface Seg {
  text: string;
  pauseAfter?: number;
  looksComplete?: boolean;
}

export const TURNS: Seg[][] = [
  [{ text: "Hi, I'd like to change my booking." }],
  [{ text: "The booking number is", pauseAfter: 900, looksComplete: false }, { text: "B-2291." }],
  [
    { text: "Could you move it to", pauseAfter: 1300, looksComplete: false },
    { text: "um,", pauseAfter: 600, looksComplete: false },
    { text: "Saturday?" },
  ],
  [
    { text: "Actually, wait.", pauseAfter: 800, looksComplete: true },
    { text: "Make it Sunday morning." },
  ],
  [{ text: "Yes, that's right." }],
];

export function judge(timeout: number, semantic: boolean) {
  let cuts = 0;
  let waits = 0;
  const marks: { turn: number; seg: number; cut: boolean }[] = [];
  TURNS.forEach((segs, ti) => {
    segs.forEach((s, si) => {
      if (s.pauseAfter === undefined) return;
      const limit = semantic ? (s.looksComplete ? 300 : Math.max(timeout, 2000)) : timeout;
      const cut = s.pauseAfter >= limit;
      if (cut) cuts++;
      marks.push({ turn: ti, seg: si, cut });
    });
    waits += semantic ? 300 : timeout;
  });
  return { cuts, avgWait: Math.round(waits / TURNS.length), marks };
}
