/**
 * A greeting function that crashes when a customer has no nickname, with three states: as written,
 * with strict null checks switched on (the compiler objects), and with absence handled.
 */

export const CUSTOMERS: { first: string; nickname?: string }[] = [
  { first: "Asha", nickname: "Ash" },
  { first: "Ravi" },
  { first: "Meera", nickname: "Mee" },
  { first: "Sam" },
];

export type Stage = "loose" | "strict" | "fixed";

export function code(stage: Stage): string[] {
  const type =
    stage === "loose"
      ? "type Customer = { first: string; nickname: string };"
      : "type Customer = { first: string; nickname?: string };";
  const body =
    stage === "fixed"
      ? '  return "Hi " + (c.nickname ?? c.first).toUpperCase();'
      : '  return "Hi " + c.nickname.toUpperCase();';
  return [type, "", "function greeting(c: Customer) {", body, "}"];
}

export function run(stage: Stage): { name: string; ok: boolean; out: string }[] {
  return CUSTOMERS.map((c) => {
    if (stage === "fixed")
      return { name: c.first, ok: true, out: `Hi ${(c.nickname ?? c.first).toUpperCase()}` };
    if (!c.nickname)
      return {
        name: c.first,
        ok: false,
        out: "TypeError: Cannot read properties of undefined (reading 'toUpperCase')",
      };
    return { name: c.first, ok: true, out: `Hi ${c.nickname.toUpperCase()}` };
  });
}
