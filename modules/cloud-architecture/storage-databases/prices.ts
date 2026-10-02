/** AWS Mumbai (ap-south-1) on-demand prices, USD, October 2026. */
export const PER_GB_MONTH = {
  std: 0.025, // S3 Standard
  ia: 0.0138, // S3 Standard-IA
  gir: 0.005, // S3 Glacier Instant Retrieval
  deep: 0.002, // S3 Glacier Deep Archive
  block: 0.0912, // EBS gp3
  file: 0.33, // EFS Standard
} as const;

export const RDS = {
  single: 0.084, // db.t4g.medium PostgreSQL, Single-AZ, per hour
  multi: 0.167, // Multi-AZ
  storageSingle: 0.131, // gp3 per GB-month
  storageMulti: 0.262,
  extended: 0.114, // Extended Support per vCPU-hour, years 1–2
  vcpus: 2,
};

export const HOURS = 730;
export const INR = 96;

export const usd = (n: number) =>
  `$${n < 10 ? n.toFixed(2) : Math.round(n).toLocaleString("en-US")}`;
export const inr = (n: number) => `₹${Math.round(n * INR).toLocaleString("en-IN")}`;
