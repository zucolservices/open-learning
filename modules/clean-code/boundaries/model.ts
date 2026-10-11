/**
 * A made-up café checkout that talks to a payment provider directly, or through a port it owns.
 * The providers "AcmePay" and "ZetaPay" are fictional. Counts come from the snippets shown.
 */

export type Provider = "acme" | "zeta";

export function coreCode(port: boolean, provider: Provider): string[] {
  if (!port) {
    const sdk = provider === "acme" ? "AcmePay" : "ZetaPay";
    const call =
      provider === "acme"
        ? "acme.charge({ amountPaise: order.total * 100 })"
        : 'zeta.payments.create({ value: order.total, currency: "INR" })';
    const ok = provider === "acme" ? 'res.status === "OK"' : "res.result.approved";
    return [
      `import { ${sdk} } from "${provider}-pay-sdk";`,
      "",
      "function checkout(order) {",
      "  if (order.total > 5000) requireManagerApproval(order);",
      `  const res = ${call};`,
      `  if (!(${ok})) throw new PaymentDeclined();`,
      "  markPaid(order);",
      "}",
    ];
  }
  return [
    "// the core owns this port: it describes what it needs, in its own words",
    'interface PaymentGateway { charge(order): Promise<"approved" | "declined"> }',
    "",
    "function checkout(order, payments: PaymentGateway) {",
    "  if (order.total > 5000) requireManagerApproval(order);",
    '  if (await payments.charge(order) === "declined") throw new PaymentDeclined();',
    "  markPaid(order);",
    "}",
  ];
}

export function adapterCode(provider: Provider): string[] {
  return provider === "acme"
    ? [
        "class AcmePayGateway implements PaymentGateway {",
        "  async charge(order) {",
        "    const res = await acme.charge({ amountPaise: order.total * 100 });",
        '    return res.status === "OK" ? "approved" : "declined";',
        "  }",
        "}",
      ]
    : [
        "class ZetaPayGateway implements PaymentGateway {",
        "  async charge(order) {",
        '    const res = await zeta.payments.create({ value: order.total, currency: "INR" });',
        '    return res.result.approved ? "approved" : "declined";',
        "  }",
        "}",
      ];
}

/** Places in business code that use the SDK directly (checkout, refunds, tips, deposits, reports, tests). */
export const DIRECT_USES = 6;
