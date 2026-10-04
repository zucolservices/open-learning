/** A backdated price change, stored bitemporally. Days are counted from 1 Jan 2026. Made-up example. */

export const DAY_MAX = 120; // up to 30 April
export const INF = 999;

export const MONTHS: [number, string][] = [
  [0, "1 Jan"],
  [31, "1 Feb"],
  [59, "1 Mar"],
  [90, "1 Apr"],
];

export const CHANGE_VALID = 45; // 15 Feb: price really changed
export const CHANGE_RECORDED = 73; // 15 Mar: we found out
export const INVOICE_DAY = 55; // 25 Feb: invoices were run

export interface Version {
  price: number;
  validFrom: number;
  validTo: number;
  recFrom: number;
  recTo: number;
}

export const VERSIONS: Version[] = [
  { price: 120, validFrom: 0, validTo: INF, recFrom: 0, recTo: CHANGE_RECORDED },
  { price: 120, validFrom: 0, validTo: CHANGE_VALID, recFrom: CHANGE_RECORDED, recTo: INF },
  { price: 130, validFrom: CHANGE_VALID, validTo: INF, recFrom: CHANGE_RECORDED, recTo: INF },
];

export function priceAt(valid: number, known: number) {
  return VERSIONS.find(
    (v) => v.validFrom <= valid && valid < v.validTo && v.recFrom <= known && known < v.recTo,
  )?.price;
}

export function dayLabel(d: number) {
  const date = new Date(Date.UTC(2026, 0, 1 + d));
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export const SQL_SYSTEM = `-- SQL Server 2016+ / MariaDB 10.3+: the database keeps every past version
CREATE TABLE price (
  product_id INT PRIMARY KEY,
  amount     DECIMAL(8,2),
  sys_start  DATETIME2 GENERATED ALWAYS AS ROW START,
  sys_end    DATETIME2 GENERATED ALWAYS AS ROW END,
  PERIOD FOR SYSTEM_TIME (sys_start, sys_end)
) WITH (SYSTEM_VERSIONING = ON);

SELECT amount FROM price FOR SYSTEM_TIME AS OF '2026-02-25';`;

export const SQL_APP = `-- application time: you supply when each fact is true in the world
CREATE TABLE price (
  product_id INT,
  amount     DECIMAL(8,2),
  valid_from DATE,
  valid_to   DATE,
  PERIOD FOR valid_period (valid_from, valid_to)
);
-- PostgreSQL 18: stop overlapping periods for the same product
-- PRIMARY KEY (product_id, valid_period WITHOUT OVERLAPS)`;
