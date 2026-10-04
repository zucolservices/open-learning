/** Six datasets, three ways to own them, four incidents to route. */

export type Model = "nobody" | "central" | "domain";
export const MODELS: { id: Model; label: string }[] = [
  { id: "nobody", label: "Nobody" },
  { id: "central", label: "Central data team" },
  { id: "domain", label: "Team closest to it" },
];

export const DATASETS: { id: string; name: string; closest: string }[] = [
  { id: "orders", name: "orders", closest: "Checkout team" },
  { id: "payments", name: "payments", closest: "Payments team" },
  { id: "campaigns", name: "campaigns", closest: "Marketing ops" },
  { id: "customers", name: "customers", closest: "Customer team" },
  { id: "revenue", name: "revenue_daily", closest: "Finance analytics" },
  { id: "web", name: "web_events", closest: "Web team" },
];

export const INCIDENTS: {
  id: string;
  dataset: string;
  text: string;
  domain: string;
  central: string;
}[] = [
  {
    id: "i1",
    dataset: "orders",
    text: "A new status, 'cancelled', appears in orders overnight.",
    domain:
      "Checkout shipped it yesterday; they add it to the contract and tell consumers within the hour.",
    central: "The data team spends a day finding out which service changed, then asks Checkout.",
  },
  {
    id: "i2",
    dataset: "campaigns",
    text: "campaigns hasn't updated for two days.",
    domain: "Marketing ops spot their expired API key and renew it the same morning.",
    central:
      "The data team can see the load failing but can't renew Marketing's key; it takes a ticket and a day.",
  },
  {
    id: "i3",
    dataset: "customers",
    text: "12% of customer emails fail validation.",
    domain: "The Customer team traces it to a sign-up form change and fixes the form.",
    central: "The data team filters bad emails downstream; the form keeps producing them.",
  },
  {
    id: "i4",
    dataset: "revenue",
    text: "The CFO asks: does revenue_daily include refunds?",
    domain: "Finance analytics answer from the definition they own and wrote down.",
    central:
      "The data team knows how it's built, not what finance meant; they forward the question.",
  },
];

export function route(
  inc: (typeof INCIDENTS)[number],
  owners: Record<string, Model>,
  personLeft: boolean,
) {
  const m = owners[inc.dataset] ?? "nobody";
  if (m === "nobody")
    return {
      tone: "bad" as const,
      who: "#data-help channel",
      text: "Everyone sees it; nobody picks it up. It's still open a week later.",
    };
  if (personLeft && inc.id === "i4")
    return {
      tone: "bad" as const,
      who: "a named person who left in March",
      text: "The question bounces between teams until someone remembers who used to know.",
    };
  const ds = DATASETS.find((d) => d.id === inc.dataset)!;
  if (m === "central")
    return { tone: "warn" as const, who: "Central data team", text: inc.central };
  return { tone: "good" as const, who: ds.closest, text: inc.domain };
}
