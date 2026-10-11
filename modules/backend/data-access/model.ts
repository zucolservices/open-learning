/** An order-history page loading orders and their items, and a connection-pool calculator. Illustrative numbers. */

export const PER_QUERY_MS = 3;

export function queries(orders: number, eager: boolean) {
  const log = eager
    ? [
        "SELECT * FROM orders WHERE customer_id = $1 LIMIT …",
        `SELECT * FROM order_items WHERE order_id IN ($1 … $${orders})`,
      ]
    : [
        "SELECT * FROM orders WHERE customer_id = $1 LIMIT …",
        ...Array.from(
          { length: orders },
          (_, i) => `SELECT * FROM order_items WHERE order_id = ${4100 + i}`,
        ),
      ];
  return { log, ms: log.length * PER_QUERY_MS };
}

export const MAX_CONNECTIONS = 100;

export const ORMS: [string, string][] = [
  ["Java", "Hibernate 7 (JPA): JOIN FETCH or entity graphs"],
  [".NET", "Entity Framework Core 10 (LTS): Include()"],
  ["Python", "SQLAlchemy 2.1: selectinload() / joinedload()"],
  ["Ruby", "Active Record: includes(:items)"],
  ["Go", 'GORM: Preload("Items"), or plain SQL with sqlc'],
  ["TypeScript", "Prisma 7: include; Drizzle: with"],
];
