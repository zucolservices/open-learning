/** Brewline orders, shared by every step in this module. */

export interface Order {
  order_id: number;
  customer: string;
  city: string;
  item: string;
  qty: number;
  amount: number;
  status: "paid" | "open" | "refund";
  ordered_at: string;
}

export const ORDERS: Order[] = [
  {
    order_id: 88213,
    customer: "Asha Rao",
    city: "Pune",
    item: "Masala chai",
    qty: 2,
    amount: 240,
    status: "paid",
    ordered_at: "2026-09-24 09:15",
  },
  {
    order_id: 88214,
    customer: "Rao, Vikram",
    city: "Mumbai",
    item: "Samosa",
    qty: 3,
    amount: 150,
    status: "paid",
    ordered_at: "2026-09-24 09:16",
  },
  {
    order_id: 88215,
    customer: "Chen Li",
    city: "Pune",
    item: "Filter coffee",
    qty: 1,
    amount: 90,
    status: "open",
    ordered_at: "2026-09-24 09:18",
  },
  {
    order_id: 88216,
    customer: "Dev Shah",
    city: "Delhi",
    item: "Masala chai",
    qty: 4,
    amount: 480,
    status: "paid",
    ordered_at: "2026-09-24 09:21",
  },
  {
    order_id: 88217,
    customer: "Elif Kaya",
    city: "Mumbai",
    item: "Kulfi",
    qty: 2,
    amount: 160,
    status: "refund",
    ordered_at: "2026-09-24 09:24",
  },
  {
    order_id: 88218,
    customer: "Farah Ali",
    city: "Delhi",
    item: "Samosa",
    qty: 5,
    amount: 250,
    status: "paid",
    ordered_at: "2026-09-24 09:30",
  },
];

export const COLUMNS = [
  "order_id",
  "customer",
  "city",
  "item",
  "qty",
  "amount",
  "status",
  "ordered_at",
] as const;
export type Column = (typeof COLUMNS)[number];

/** Illustrative on-disk width of each column, in bytes. */
export const WIDTH: Record<Column, number> = {
  order_id: 8,
  customer: 16,
  city: 10,
  item: 14,
  qty: 4,
  amount: 8,
  status: 6,
  ordered_at: 12,
};

export const ROW_BYTES = COLUMNS.reduce((n, c) => n + WIDTH[c], 0);

/* The same first order in each format, exactly as it would be written. */

export const JSON_TEXT = `{
  "order_id": 88213,
  "customer": "Asha Rao",
  "city": "Pune",
  "items": [
    { "sku": "CHAI-M", "name": "Masala chai", "qty": 2 }
  ],
  "amount": 240,
  "status": "paid",
  "ordered_at": "2026-09-24T09:15:02+05:30"
}`;

export const CSV_TEXT = `order_id,customer,city,item,qty,amount,status
88213,Asha Rao,Pune,Masala chai,2,240,paid
88214,"Rao, Vikram",Mumbai,Samosa,3,150,paid
88215,Chen Li,Pune,Filter coffee,1,90,open`;

export const AVRO_SCHEMA = `{
  "type": "record",
  "name": "Order",
  "fields": [
    { "name": "order_id",  "type": "long" },
    { "name": "customer",  "type": "string" },
    { "name": "city",      "type": "string" },
    { "name": "amount",    "type": "int" },
    { "name": "status",    "type": "string" },
    { "name": "loyalty",   "type": ["null", "string"],
      "default": null }
  ]
}`;
