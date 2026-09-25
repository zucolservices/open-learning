/** What your code checks before acting on a model's issue_refund call. */

export interface Verdict {
  stage: "json" | "schema" | "business" | "ok";
  errors: string[];
}

/** The app's own records: the model never sees these directly. */
export const ORDERS: Record<string, { charged: number }> = {
  "KX-51102": { charged: 2340 },
  "KX-48213": { charged: 612 },
};

const KEYS = ["order_id", "amount_rupees", "reason"] as const;

export function validateRefund(text: string): Verdict {
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch (e) {
    return { stage: "json", errors: [(e as Error).message] };
  }
  const errors: string[] = [];
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    return { stage: "schema", errors: ["Arguments must be a JSON object"] };
  }
  const o = v as Record<string, unknown>;
  for (const k of KEYS) if (!(k in o)) errors.push(`Missing required field "${k}"`);
  for (const k of Object.keys(o))
    if (!(KEYS as readonly string[]).includes(k)) errors.push(`Unknown field "${k}"`);
  if ("order_id" in o && (typeof o.order_id !== "string" || !/^KX-\d{5}$/.test(o.order_id)))
    errors.push('"order_id" must look like KX-00000');
  if ("amount_rupees" in o && (typeof o.amount_rupees !== "number" || o.amount_rupees <= 0))
    errors.push('"amount_rupees" must be a positive number, not text');
  if ("reason" in o && (typeof o.reason !== "string" || !o.reason.trim()))
    errors.push('"reason" must be a non-empty string');
  if (errors.length) return { stage: "schema", errors };

  const order = ORDERS[o.order_id as string];
  if (!order) return { stage: "business", errors: [`No order ${o.order_id} in our records`] };
  if ((o.amount_rupees as number) > order.charged)
    return {
      stage: "business",
      errors: [`Refund of Rs ${o.amount_rupees} is more than the Rs ${order.charged} charged`],
    };
  return { stage: "ok", errors: [] };
}
