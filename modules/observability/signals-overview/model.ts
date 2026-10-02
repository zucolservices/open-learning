/** Storage per day for each signal as traffic grows (illustrative except Prometheus' bytes/sample). */

export const BYTES_PER_SAMPLE = 1.5; // "an average of only 1-2 bytes per sample" (Prometheus docs)

export function perDay(rps: number, traceSample: number) {
  const reqPerDay = rps * 86_400;
  // Metrics: 2,000 time series scraped every 15 s, whatever the traffic.
  const metrics = 2000 * (86_400 / 15) * BYTES_PER_SAMPLE;
  // Logs: two lines of about 500 bytes per request.
  const logs = reqPerDay * 2 * 500;
  // Traces: six spans of about 400 bytes per kept request.
  const traces = reqPerDay * traceSample * 6 * 400;
  return { metrics, logs, traces };
}

export function fmtBytes(b: number): string {
  if (b >= 1e12) return `${(b / 1e12).toFixed(1)} TB`;
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`;
  return `${Math.round(b / 1e3)} KB`;
}
