/**
 * Four versions of a made-up canRefund function, from deeply nested to flat with named helpers.
 * Scores are worked out by hand: cyclomatic = decisions + 1 (McCabe); cognitive follows the
 * SonarSource rules (+1 per break in flow, plus the current nesting level, +1 per sequence of
 * boolean operators).
 */

export interface Version {
  label: string;
  move: string;
  code: string[];
  cyclomatic: number;
  cognitive: number;
  depth: number;
  why: string;
}

export const VERSIONS: Version[] = [
  {
    label: "Nested",
    move: "",
    cyclomatic: 6,
    cognitive: 15,
    depth: 4,
    why: "Four ifs, each inside the last, plus four elses. To read the return true you must hold four conditions in your head.",
    code: [
      "function canRefund(order, user) {",
      "  if (order) {",
      '    if (order.status === "PAID") {',
      "      if (user.isAdmin || user.id === order.customerId) {",
      "        if (daysSince(order.paidAt) <= 7) {",
      "          return true;",
      "        } else {",
      "          return false;",
      "        }",
      "      } else {",
      "        return false;",
      "      }",
      "    } else {",
      "      return false;",
      "    }",
      "  } else {",
      "    return false;",
      "  }",
      "}",
    ],
  },
  {
    label: "No else after return",
    move: "Drop the elses that follow a return",
    cyclomatic: 5,
    cognitive: 7,
    depth: 3,
    why: "Same logic, half the lines. Every else was saying “otherwise false”, so one return false at the end does the job.",
    code: [
      "function canRefund(order, user) {",
      "  if (order) {",
      '    if (order.status === "PAID") {',
      "      if (user.isAdmin || user.id === order.customerId) {",
      "        return daysSince(order.paidAt) <= 7;",
      "      }",
      "    }",
      "  }",
      "  return false;",
      "}",
    ],
  },
  {
    label: "Guard clauses",
    move: "Turn each condition into an early return",
    cyclomatic: 5,
    cognitive: 4,
    depth: 1,
    why: "Each guard deals with one bad case and gets it out of the way. The happy path sits at the bottom, unindented.",
    code: [
      "function canRefund(order, user) {",
      "  if (!order) return false;",
      '  if (order.status !== "PAID") return false;',
      "  if (!user.isAdmin && user.id !== order.customerId) return false;",
      "  return daysSince(order.paidAt) <= 7;",
      "}",
    ],
  },
  {
    label: "Named conditions",
    move: "Give the conditions names",
    cyclomatic: 4,
    cognitive: 3,
    depth: 1,
    why: "Now the function reads like the rule: a paid order, a person allowed to act on it, inside the refund window.",
    code: [
      "function canRefund(order, user) {",
      '  if (!order || order.status !== "PAID") return false;',
      "  return canActOn(user, order) && withinRefundWindow(order);",
      "}",
      "",
      "const canActOn = (user, order) => user.isAdmin || user.id === order.customerId;",
      "const withinRefundWindow = (order) => daysSince(order.paidAt) <= 7;",
    ],
  },
];
