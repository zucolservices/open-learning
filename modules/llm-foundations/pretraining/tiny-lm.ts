/**
 * A real, tiny neural language model trained in the browser: characters in, next character out.
 * Three characters of context → embeddings → one hidden layer (tanh) → softmax over characters
 * (the design of Bengio et al., 2003). Plain gradient descent on cross-entropy loss.
 */

export const TEXT = `the cafe opens at seven in the morning. the cafe serves hot coffee and masala chai. people drink hot coffee in the morning. people drink masala chai in the evening. the barista makes coffee with fresh milk. the barista makes chai with ginger and cardamom. a cup of coffee costs eighty rupees. a cup of chai costs forty rupees. students come to the cafe after class. the cafe sells fresh bread in the morning. the bread is warm and soft. the coffee is strong and hot. the chai is sweet and strong. people meet friends at the cafe in the evening. the cafe closes at ten in the night.`;

export const CHARS = [...new Set(TEXT)].sort();
const V = CHARS.length;
const CTX = 3;
const EMB = 8;
const HID = 64;
const idx = new Map(CHARS.map((c, i) => [c, i]));
const DATA = [...TEXT].map((c) => idx.get(c)!);

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Model {
  E: Float64Array; // V × EMB
  W1: Float64Array; // (CTX·EMB) × HID
  b1: Float64Array;
  W2: Float64Array; // HID × V
  b2: Float64Array;
  step: number;
}

export function init(seed = 1): Model {
  const r = rng(seed);
  const g = (n: number, s: number) => Float64Array.from({ length: n }, () => (r() * 2 - 1) * s);
  return {
    E: g(V * EMB, 1),
    W1: g(CTX * EMB * HID, 0.3),
    b1: new Float64Array(HID),
    W2: g(HID * V, 0.1),
    b2: new Float64Array(V),
    step: 0,
  };
}

export const PARAMS = V * EMB + CTX * EMB * HID + HID + HID * V + V;

function forward(m: Model, ctx: number[]) {
  const x = new Float64Array(CTX * EMB);
  ctx.forEach((c, j) => x.set(m.E.subarray(c * EMB, c * EMB + EMB), j * EMB));
  const h = new Float64Array(HID);
  for (let k = 0; k < HID; k++) {
    let s = m.b1[k];
    for (let i = 0; i < CTX * EMB; i++) s += x[i] * m.W1[i * HID + k];
    h[k] = Math.tanh(s);
  }
  const lg = new Float64Array(V);
  for (let v = 0; v < V; v++) {
    let s = m.b2[v];
    for (let k = 0; k < HID; k++) s += h[k] * m.W2[k * V + v];
    lg[v] = s;
  }
  const mx = Math.max(...lg);
  let z = 0;
  const p = lg.map((l) => {
    const e = Math.exp(l - mx);
    z += e;
    return e;
  });
  for (let v = 0; v < V; v++) p[v] /= z;
  return { x, h, p };
}

const r = rng(7);

/** Run `steps` mini-batch updates; returns the average loss over them. */
export function train(m: Model, steps: number, lr = 0.15, batch = 16): number {
  let total = 0;
  for (let s = 0; s < steps; s++) {
    const gE = new Float64Array(m.E.length);
    const gW1 = new Float64Array(m.W1.length);
    const gb1 = new Float64Array(HID);
    const gW2 = new Float64Array(m.W2.length);
    const gb2 = new Float64Array(V);
    let loss = 0;
    for (let b = 0; b < batch; b++) {
      const i = CTX + Math.floor(r() * (DATA.length - CTX));
      const ctx = DATA.slice(i - CTX, i);
      const y = DATA[i];
      const { x, h, p } = forward(m, ctx);
      loss += -Math.log(p[y] + 1e-12);
      const dl = Float64Array.from(p);
      dl[y] -= 1;
      const dh = new Float64Array(HID);
      for (let k = 0; k < HID; k++)
        for (let v = 0; v < V; v++) {
          gW2[k * V + v] += h[k] * dl[v];
          dh[k] += m.W2[k * V + v] * dl[v];
        }
      for (let v = 0; v < V; v++) gb2[v] += dl[v];
      for (let k = 0; k < HID; k++) dh[k] *= 1 - h[k] * h[k];
      const dx = new Float64Array(CTX * EMB);
      for (let i2 = 0; i2 < CTX * EMB; i2++)
        for (let k = 0; k < HID; k++) {
          gW1[i2 * HID + k] += x[i2] * dh[k];
          dx[i2] += m.W1[i2 * HID + k] * dh[k];
        }
      for (let k = 0; k < HID; k++) gb1[k] += dh[k];
      ctx.forEach((c, j) => {
        for (let e = 0; e < EMB; e++) gE[c * EMB + e] += dx[j * EMB + e];
      });
    }
    const f = lr / batch;
    for (let i = 0; i < m.E.length; i++) m.E[i] -= f * gE[i];
    for (let i = 0; i < m.W1.length; i++) m.W1[i] -= f * gW1[i];
    for (let i = 0; i < HID; i++) m.b1[i] -= f * gb1[i];
    for (let i = 0; i < m.W2.length; i++) m.W2[i] -= f * gW2[i];
    for (let i = 0; i < V; i++) m.b2[i] -= f * gb2[i];
    m.step += 1;
    total += loss / batch;
  }
  return total / steps;
}

/** Generate text from a prompt, sampling at a low temperature. */
export function generate(m: Model, prompt: string, n: number, seed: number): string {
  const rr = rng(seed);
  const out = [...prompt].map((c) => idx.get(c) ?? idx.get(" ")!);
  for (let i = 0; i < n; i++) {
    const { p } = forward(m, out.slice(-CTX));
    const q = p.map((x) => x ** (1 / 0.6));
    const z = q.reduce((a, b) => a + b, 0);
    let u = rr() * z;
    let pick = 0;
    for (let v = 0; v < V; v++) {
      u -= q[v];
      if (u <= 0) {
        pick = v;
        break;
      }
    }
    out.push(pick);
  }
  return out.map((i) => CHARS[i]).join("");
}

/** Loss of always guessing uniformly, for reference. */
export const START_LOSS = Math.log(V);
