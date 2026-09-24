/**
 * AWS list prices, us-east-1, on-demand, from the AWS Price List API (published Sept 2026).
 * See SOURCES.md. Illustrative estimate only: requests, data transfer, BI licences and free
 * tiers beyond the Glue Data Catalog's are ignored.
 */
export const PRICE = {
  s3PerGB: 0.023,
  s3TablesPerGB: 0.0265,
  s3TablesMonitorPer1k: 0.025,
  s3TablesCompactPer1kObj: 0.002,
  s3TablesCompactPerGB: 0.005,
  athenaPerTB: 5,
  gluePerDPUh: 0.308, // Glue 6.0+
  glueLegacyPerDPUh: 0.44, // Glue ≤5, also table optimizers/compaction jobs
  firehoseIcebergPerGB: 0.075, // Direct PUT into Iceberg, first 250 TB
  dmsT3MediumPerHour: 0.0745,
};

export const HOURS_PER_MONTH = 730;
/** Assumed objects per GB stored (data files around 256 MB plus metadata). */
export const OBJECTS_PER_GB = 5;

export const INPUTS = {
  storedGB: [100, 500, 1_000, 5_000, 20_000, 100_000],
  eventsGB: [1, 5, 20, 100, 500],
  queries: [50, 200, 1_000, 5_000],
  scanGB: [0.1, 1, 10, 50],
  etl: [2, 10, 40, 150],
};

export type CostKey = keyof typeof INPUTS;

export function estimate(idx: Record<string, number>, s3tables: boolean) {
  const v = (k: CostKey) => INPUTS[k][Math.min(idx[k] ?? 0, INPUTS[k].length - 1)];
  const stored = v("storedGB");
  const newGBMonth = v("eventsGB") * 30;
  const objects = stored * OBJECTS_PER_GB;

  const storage = s3tables
    ? stored * PRICE.s3TablesPerGB + (objects / 1000) * PRICE.s3TablesMonitorPer1k
    : stored * PRICE.s3PerGB;
  const maintenance = s3tables
    ? newGBMonth * PRICE.s3TablesCompactPerGB +
      ((newGBMonth * 20) / 1000) * PRICE.s3TablesCompactPer1kObj
    : 30 * 2 * PRICE.glueLegacyPerDPUh; // you run a compaction job yourself: ~2 DPU-hours a day
  const firehose = newGBMonth * PRICE.firehoseIcebergPerGB;
  const dms = HOURS_PER_MONTH * PRICE.dmsT3MediumPerHour;
  const etl = v("etl") * 30 * PRICE.gluePerDPUh;
  const athena = ((v("queries") * 30 * Math.max(v("scanGB"), 0.01)) / 1000) * PRICE.athenaPerTB;

  return {
    values: { stored, newGBMonth },
    lines: [
      {
        label: s3tables ? "S3 Tables storage + monitoring" : "S3 storage",
        usd: storage,
        note: s3tables
          ? `${stored.toLocaleString("en-US")} GB × $0.0265 + $0.025 per 1,000 objects`
          : `${stored.toLocaleString("en-US")} GB × $0.023`,
      },
      {
        label: s3tables ? "S3 Tables compaction" : "Your own compaction jobs (Glue)",
        usd: maintenance,
        note: s3tables
          ? "automatic; $0.005/GB + $0.002 per 1,000 small streaming files (~20 per GB) processed"
          : "≈2 DPU-hours a day at $0.44",
      },
      {
        label: "Data Firehose → Iceberg",
        usd: firehose,
        note: `${newGBMonth.toLocaleString("en-US")} GB/month × $0.075`,
      },
      { label: "DMS (CDC)", usd: dms, note: "one dms.t3.medium instance, always on" },
      { label: "Glue ETL", usd: etl, note: `${v("etl")} DPU-hours a day × $0.308 (Glue 6)` },
      {
        label: "Athena",
        usd: athena,
        note: `${v("queries").toLocaleString("en-US")} queries a day × ${v("scanGB")} GB × $5/TB`,
      },
    ],
  };
}
