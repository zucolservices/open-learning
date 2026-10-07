/** How long one GPU takes to crack a leaked password table, by how the passwords were stored. */

export type Storage = "plain" | "fast" | "salted" | "slow";

/** Guesses per second on one RTX 5090 (hashcat benchmarks); bcrypt cost 10 scaled from cost 5. */
export const RATE = { md5: 220.6e9, bcrypt10: 304.8e3 / 32 };

export const STORAGES: { id: Storage; name: string; how: string }[] = [
  { id: "plain", name: "Plain text", how: "The password itself, as typed." },
  {
    id: "fast",
    name: "Fast hash, no salt",
    how: "MD5 of the password: the same password always gives the same hash.",
  },
  {
    id: "salted",
    name: "Fast hash with salt",
    how: "MD5 of a random per-user salt plus the password.",
  },
  {
    id: "slow",
    name: "Slow hash with salt (bcrypt, cost 10)",
    how: "Deliberately slow, salted password hashing.",
  },
];

export const USERS = 1_000_000;
export const LIST = 1_000_000_000; // the billion most likely passwords

/** Seconds for an attacker to test the whole guess list against every user. */
export function crackSeconds(s: Storage): number {
  if (s === "plain") return 0;
  if (s === "fast") return LIST / RATE.md5; // one pass covers everyone
  if (s === "salted") return (LIST / RATE.md5) * USERS; // each salt needs its own pass
  return (LIST / RATE.bcrypt10) * USERS;
}

export function perUserSeconds(s: Storage): number {
  if (s === "plain") return 0;
  if (s === "slow") return LIST / RATE.bcrypt10;
  return LIST / RATE.md5;
}

export function human(sec: number): string {
  if (sec === 0) return "instantly (nothing to crack)";
  if (sec < 1) return "under a second";
  if (sec < 120) return `${Math.round(sec)} seconds`;
  if (sec < 7200) return `${Math.round(sec / 60)} minutes`;
  if (sec < 172800) return `${Math.round(sec / 3600)} hours`;
  if (sec < 3.15e7 * 2) return `${Math.round(sec / 86400)} days`;
  return `about ${Math.round(sec / 3.15e7).toLocaleString("en-IN")} years`;
}

export type Policy = "old" | "nist";

export const CANDIDATES: { pw: string; old: [boolean, string]; nist: [boolean, string] }[] = [
  {
    pw: "Password1!",
    old: [true, "Has a capital, a digit and a symbol."],
    nist: [false, "On every breached-password list."],
  },
  {
    pw: "mango monsoon bicycle chai",
    old: [false, "No capital, digit or symbol."],
    nist: [true, "26 characters, not on a breached list."],
  },
  {
    pw: "Summer2026",
    old: [false, "No symbol."],
    nist: [false, "Under 15 characters, and a common pattern."],
  },
  {
    pw: "my first scooter was a blue Chetak",
    old: [false, "No digit or symbol."],
    nist: [true, "Long and memorable."],
  },
];
