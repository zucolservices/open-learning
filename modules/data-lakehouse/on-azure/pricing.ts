/**
 * Azure list prices, East US, pay-as-you-go, from the Azure Retail Prices API (24 Sept 2026).
 * See SOURCES.md. Illustrative only.
 */
export const PRICE = {
  fabricPerCUh: 0.18,
  fabricReservedPerCUh: 938 / (365 * 24), // $938 per CU per year ≈ $0.107
  oneLakeHotPerGB: 0.026,
  dbxServerlessJobsPerDBU: 0.45,
  ehPerTUh: 0.03,
  ehPerMillionEvents: 0.028,
  adfPer1kRuns: 1,
  adfPerDIUh: 0.25,
};

export const HOURS_PER_MONTH = 730;

export const INPUTS = {
  sku: [2, 4, 8, 16, 32, 64],
  hours: [4, 8, 12, 24],
  storedTB: [1, 10, 50, 200],
  dbu: [0, 20, 100, 500],
  tus: [1, 2, 5, 10],
};

export type CostKey = keyof typeof INPUTS;

export function estimate(idx: Record<string, number>, reserved: boolean) {
  const v = (k: CostKey) => INPUTS[k][Math.min(idx[k] ?? 0, INPUTS[k].length - 1)];
  const cu = v("sku");
  const hours = v("hours");
  // A reservation is paid for every hour, paused or not.
  const capacity = reserved
    ? cu * PRICE.fabricReservedPerCUh * HOURS_PER_MONTH
    : cu * PRICE.fabricPerCUh * hours * 30;
  const storage = v("storedTB") * 1000 * PRICE.oneLakeHotPerGB;
  const dbx = v("dbu") * 30 * PRICE.dbxServerlessJobsPerDBU;
  const tus = v("tus");
  const monthlyEventsM = tus * 50 * 30; // ~50 million events per TU per day
  const eventHubs =
    tus * PRICE.ehPerTUh * HOURS_PER_MONTH + monthlyEventsM * PRICE.ehPerMillionEvents;
  const adf = (3_000 / 1000) * PRICE.adfPer1kRuns + 100 * PRICE.adfPerDIUh; // 100 runs/day, 100 DIU-hours/month
  return [
    {
      label: `Fabric capacity F${cu}`,
      usd: capacity,
      note: reserved
        ? `${cu} CU × $0.107/h × 730 h (1-year reservation, always billed)`
        : `${cu} CU × $0.18/h × ${hours} h/day × 30${hours < 24 ? " (paused the rest)" : " (always on)"}`,
    },
    { label: "OneLake storage", usd: storage, note: `${v("storedTB")} TB × $0.026/GB (hot)` },
    {
      label: "Azure Databricks serverless jobs",
      usd: dbx,
      note: `${v("dbu")} DBU/day × $0.45 (Premium)`,
    },
    {
      label: "Event Hubs Standard",
      usd: eventHubs,
      note: `${tus} TU × $0.03/h + ~${(monthlyEventsM / 1000).toFixed(1)}bn events × $0.028/M`,
    },
    { label: "Data Factory", usd: adf, note: "~3,000 activity runs + 100 DIU-hours a month" },
  ];
}
