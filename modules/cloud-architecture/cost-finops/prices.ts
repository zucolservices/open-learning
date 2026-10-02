/** AWS Mumbai (ap-south-1) list prices, USD, from the AWS Price List API on 2 Oct 2026. */
export const HOURS = 730;

/** m7g.large Linux, per hour. */
export const RATE = {
  od: 0.0583, // on-demand
  sp1: 0.043, // Compute Savings Plan, 1 year, no upfront
  sp3: 0.0293, // Compute Savings Plan, 3 years, no upfront
  spot: 0.0202, // spot price on 2 Oct 2026 (varies)
} as const;

export const INR = 96;
export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const inr = (n: number) => `₹${Math.round(n * INR).toLocaleString("en-IN")}`;
