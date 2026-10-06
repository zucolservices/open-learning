/** Polynomial fits of growing degree, with optional ridge regularisation, on made-up noisy data. */

const truth = (x: number) => 0.8 * Math.sin(Math.PI * x) + 0.3 * x;

function noise(i: number) {
  const a = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  const b = Math.sin(i * 78.233 + 1.7) * 43758.5453;
  return (a - Math.floor(a) + (b - Math.floor(b)) - 1) * 0.45;
}

export const TRAIN: [number, number][] = Array.from({ length: 14 }, (_, i) => {
  const x = -1 + (2 * i) / 13 + noise(i + 50) * 0.06;
  return [x, truth(x) + noise(i)];
});
export const VALID: [number, number][] = Array.from({ length: 40 }, (_, i) => {
  const x = -1 + (2 * (i + 0.5)) / 40;
  return [x, truth(x) + noise(i + 200)];
});

function solve(A: number[][], b: number[]) {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c] || 1e-12;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / d;
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / (r[i] || 1e-12));
}

/** Ridge-regularised polynomial least squares. */
export function fit(degree: number, lambda: number) {
  const d = degree + 1;
  const A = Array.from({ length: d }, () => new Array<number>(d).fill(0));
  const b = new Array<number>(d).fill(0);
  TRAIN.forEach(([x, y]) => {
    const pw = Array.from({ length: d }, (_, k) => x ** k);
    for (let i = 0; i < d; i++) {
      b[i] += pw[i] * y;
      for (let j = 0; j < d; j++) A[i][j] += pw[i] * pw[j];
    }
  });
  for (let i = 1; i < d; i++) A[i][i] += lambda + 1e-9;
  return solve(A, b);
}

export const evalPoly = (w: number[], x: number) => w.reduce((s, c, k) => s + c * x ** k, 0);

export function errors(degree: number, lambda: number) {
  const w = fit(degree, lambda);
  const mse = (pts: [number, number][]) =>
    pts.reduce((s, [x, y]) => s + (evalPoly(w, x) - y) ** 2, 0) / pts.length;
  return { w, train: mse(TRAIN), valid: mse(VALID) };
}
