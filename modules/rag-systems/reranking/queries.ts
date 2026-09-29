/** Questions for the reranking module; `gold` lists the passages that actually answer each one. */
export const QUERIES: { q: string; gold: string[] }[] = [
  { q: "Do senior citizens have to pay to get their water reconnected?", gold: ["rules-7"] },
  { q: "How long does the KMC take to fix a leaking pipe on a main road?", gold: ["rules-8"] },
  { q: "Will my water be cut if I don't pay for three months?", gold: ["rules-6"] },
  { q: "How often are water meters read?", gold: ["rules-4"] },
  { q: "Can I pay property tax with UPI?", gold: ["property-tax-3"] },
  { q: "सूखा कचरा किन दिनों में उठाया जाता है?", gold: ["waste-1"] },
];
