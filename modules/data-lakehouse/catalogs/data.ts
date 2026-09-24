/** Connection snippets shown in the "three engines" lab (to be verified against engine docs). */
export const ENGINE_CONFIG: Record<
  "spark" | "trino" | "duckdb",
  { catalog: string; path: string }
> = {
  spark: {
    catalog:
      "spark.sql.catalog.lake = org.apache.iceberg.spark.SparkCatalog\nspark.sql.catalog.lake.type = rest\nspark.sql.catalog.lake.uri = https://catalog.brewline.in",
    path: "",
  },
  trino: {
    catalog: "iceberg.catalog.type=rest\niceberg.rest-catalog.uri=https://catalog.brewline.in",
    path: "-- a separate Hive Metastore registration,\n-- last updated at version 7",
  },
  duckdb: {
    catalog:
      "ATTACH 'warehouse' AS lake (\n  TYPE iceberg, ENDPOINT 'https://catalog.brewline.in');",
    path: "SELECT * FROM iceberg_scan(\n  's3://lake/orders/metadata/00007-….metadata.json');",
  },
};
