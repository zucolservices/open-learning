/** One query against a 2-million-row customers table, with and without an index, cold or warm (illustrative). */

export interface Run {
  plan: string;
  pages: number;
  fromDisk: number;
  ms: number;
  why: string;
}

export function run(index: boolean, warm: boolean): Run {
  // Table: 2,000,000 rows, about 25,000 pages of 8 kB. 1,800 customers live in Pune.
  if (!index) {
    const pages = 25000;
    const fromDisk = warm ? 0 : pages;
    return {
      plan: "Seq Scan on customers  Filter: (city = 'Pune')",
      pages,
      fromDisk,
      ms: warm ? 180 : 900,
      why: "No index on city, so every page of the table is read and every row checked.",
    };
  }
  const pages = 1810; // ~10 index pages + matching rows spread over ~1,800 heap pages
  const fromDisk = warm ? 0 : pages;
  return {
    plan: "Bitmap Heap Scan on customers\n  ->  Bitmap Index Scan on customers_city_idx\n        Index Cond: (city = 'Pune')",
    pages,
    fromDisk,
    ms: warm ? 6 : 95,
    why: "The index lists exactly which pages hold Pune customers, so only those are read.",
  };
}
