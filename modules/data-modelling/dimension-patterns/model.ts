/** Five awkward dimension designs and the patterns that fix them. Made-up schemas. */

export type Pattern = "role" | "junk" | "degenerate" | "flatten" | "outrigger";

export const PATTERNS: Record<Pattern, string> = {
  role: "Role-playing dimension",
  junk: "Junk dimension",
  degenerate: "Degenerate dimension",
  flatten: "Flatten the snowflake",
  outrigger: "Outrigger",
};

export const CASES: {
  id: string;
  title: string;
  before: string;
  answer: Pattern;
  after: string;
  why: string;
  wrong: Partial<Record<Pattern, string>>;
}[] = [
  {
    id: "dates",
    title: "Three dates, one confusing join",
    before: `fact_orders(order_date_key, ship_date_key, due_date_key, …)
-- all three join to dim_date; every report has columns
-- called "month" and nobody knows which date they mean`,
    answer: "role",
    after: `CREATE VIEW dim_order_date AS SELECT date_key AS order_date_key, month AS order_month, … FROM dim_date;
CREATE VIEW dim_ship_date  AS SELECT date_key AS ship_date_key,  month AS ship_month,  … FROM dim_date;`,
    why: "One physical date dimension plays several roles through separate views with distinct column names.",
    wrong: {
      outrigger:
        "Outriggers link a dimension to another dimension, not a fact to the same dimension three times.",
    },
  },
  {
    id: "flags",
    title: "Six tiny tables of flags",
    before: `fact_orders(…, gift_wrap_key, channel_key, payment_key, rush_key, …)
dim_gift_wrap(yes/no)  dim_channel(web/app/phone)
dim_payment(card/UPI/cash)  dim_rush(yes/no)`,
    answer: "junk",
    after: `dim_order_profile(profile_key, gift_wrap, channel, payment, rush)
-- only the 9 combinations that actually occur, not all 36`,
    why: "Low-cardinality flags go together in one transaction-profile dimension.",
    wrong: {
      degenerate:
        "Degenerate dimensions are single identifiers like an invoice number, not bundles of flags.",
    },
  },
  {
    id: "invoice",
    title: "A dimension with nothing in it",
    before: `dim_invoice(invoice_key, invoice_number)
-- no other columns; every invoice detail already sits
-- on the line-item facts`,
    answer: "degenerate",
    after: `fact_invoice_line(…, invoice_number, …)  -- no dim_invoice table`,
    why: "The invoice number stays on the fact row as a dimension key with no table of its own.",
    wrong: { junk: "A junk dimension bundles several flags; here there's a single identifier." },
  },
  {
    id: "snow",
    title: "A product hierarchy five tables deep",
    before: `dim_product → dim_brand → dim_category → dim_department → dim_division
-- users need four joins to filter by department`,
    answer: "flatten",
    after: `dim_product(product_key, name, brand, category, department, division)`,
    why: "Kimball: a flattened dimension holds exactly the same information, and is easier to use.",
    wrong: {
      outrigger:
        "An outrigger is a sparing exception for one secondary reference, not a whole normalised hierarchy.",
    },
  },
  {
    id: "joined",
    title: "A customer's join date, with full calendar detail",
    before: `dim_customer(customer_key, name, …, joined_on DATE)
-- analysts want fiscal quarter, weekday, holiday flag
-- of the join date, all of which live in dim_date`,
    answer: "outrigger",
    after: `dim_customer(customer_key, name, …, joined_date_key → dim_date)`,
    why: "A dimension may reference another dimension. Allowed, but used sparingly; often the relationship belongs in a fact table.",
    wrong: { role: "Roles are about one fact table using a dimension several times." },
  },
];

export const FLAGS = {
  gift: ["yes", "no"],
  channel: ["web", "app", "phone"],
  payment: ["card", "UPI", "cash"],
  rush: ["yes", "no"],
};
export const OCCURRING: [string, string, string, string][] = [
  ["no", "web", "card", "no"],
  ["no", "web", "UPI", "no"],
  ["no", "app", "UPI", "no"],
  ["yes", "web", "card", "no"],
  ["no", "app", "UPI", "yes"],
  ["no", "phone", "cash", "no"],
  ["yes", "app", "card", "no"],
  ["no", "web", "card", "yes"],
  ["no", "phone", "card", "no"],
];
