/** Brewline's bucket. Keys are the only structure there is. */

export const BUCKET = "brewline-lake";

export interface S3Object {
  key: string;
  size: number; // bytes
}

export const OBJECTS: S3Object[] = [
  { key: "sales/2026/09/part-0000.parquet", size: 118_000_000 },
  { key: "sales/2026/09/part-0001.parquet", size: 124_000_000 },
  { key: "sales/2026/10/part-0000.parquet", size: 96_000_000 },
  { key: "events/2026-09-24/app.json", size: 42_000_000 },
  { key: "events/2026-09-24/web.json", size: 38_000_000 },
  { key: "images/store-12.jpg", size: 2_400_000 },
  { key: "README.txt", size: 1_200 },
];

/** The zero-byte object the console creates when you click "Create folder". */
export const FOLDER_MARKER: S3Object = { key: "reports/", size: 0 };

export function bucketObjects(folderCreated: boolean): S3Object[] {
  return folderCreated ? [...OBJECTS, FOLDER_MARKER] : OBJECTS;
}

export function formatBytes(n: number): string {
  if (n === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log10(n) / 3));
  const v = n / 1000 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "")} ${units[i]}`;
}

/** ListObjectsV2 semantics for a prefix and optional "/" delimiter. */
export function listObjects(objects: S3Object[], prefix: string, delimiter: boolean) {
  const contents: S3Object[] = [];
  const common = new Set<string>();
  for (const o of objects) {
    if (!o.key.startsWith(prefix)) continue;
    const rest = o.key.slice(prefix.length);
    const slash = rest.indexOf("/");
    if (delimiter && slash >= 0) common.add(prefix + rest.slice(0, slash + 1));
    else contents.push(o);
  }
  return { contents, commonPrefixes: [...common].sort() };
}

/**
 * Prices used for illustrations: S3 Standard, us-east-1.
 * Set from the fact check in SOURCES.md. Update both together.
 */
export const PRICE = {
  putPer1000: 0.005,
  getPer1000: 0.0004,
  standardGbMonth: 0.023,
};

export const LIST_PAGE = 1000;
