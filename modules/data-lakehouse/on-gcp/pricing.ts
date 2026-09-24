/**
 * Google Cloud list prices (USD) from the official pricing pages, 24 Sept 2026. See SOURCES.md.
 * Region us-central1 unless stated. Illustrative only.
 */
export const PRICE = {
  gcsStandardPerGiB: 0.02,
  bqOnDemandPerTiB: 6.25,
  bqFreeTiB: 1,
  bqStandardSlotHour: 0.04,
  datastreamPerGiB: 2, // CDC, first 2,500 GiB a month
  pubsubBqSubPerTiB: 50,
  sparkServerlessPerDCUh: 0.06,
};

export const INPUTS = {
  storedTB: [0.5, 5, 50, 200],
  scannedTiB: [1, 10, 100, 500, 2000],
  slots: [50, 100, 200, 500],
  cdcGiB: [10, 100, 500, 2000],
  pubsubTiB: [0.1, 1, 5, 20],
  dcu: [10, 50, 200, 1000],
};

export type CostKey = keyof typeof INPUTS;

export function estimate(idx: Record<string, number>, editions: boolean) {
  const v = (k: CostKey) => INPUTS[k][Math.min(idx[k] ?? 0, INPUTS[k].length - 1)];
  const gib = v("storedTB") * 1000 * 0.9313; // TB → GiB
  const storage = gib * PRICE.gcsStandardPerGiB;
  const scanned = v("scannedTiB");
  const slots = v("slots");
  const queries = editions
    ? slots * 10 * 30 * PRICE.bqStandardSlotHour
    : Math.max(0, scanned - PRICE.bqFreeTiB) * PRICE.bqOnDemandPerTiB;
  const cdc = v("cdcGiB") * PRICE.datastreamPerGiB;
  const pubsub = v("pubsubTiB") * PRICE.pubsubBqSubPerTiB;
  const spark = v("dcu") * 30 * PRICE.sparkServerlessPerDCUh;
  return [
    {
      label: "Cloud Storage (Iceberg data)",
      usd: storage,
      note: `${v("storedTB")} TB × $0.020/GiB (us-central1)`,
    },
    editions
      ? {
          label: "BigQuery Editions (Standard)",
          usd: queries,
          note: `${slots} slots × 10 h/day × 30 × $0.04/slot-hour`,
        }
      : {
          label: "BigQuery on-demand",
          usd: queries,
          note: `${scanned.toLocaleString("en-US")} TiB scanned × $6.25 (first TiB free)`,
        },
    {
      label: "Datastream CDC",
      usd: cdc,
      note: `${v("cdcGiB").toLocaleString("en-US")} GiB × $2.00`,
    },
    { label: "Pub/Sub → BigQuery subscription", usd: pubsub, note: `${v("pubsubTiB")} TiB × $50` },
    { label: "Managed Spark (serverless)", usd: spark, note: `${v("dcu")} DCU-hours/day × $0.06` },
  ];
}
