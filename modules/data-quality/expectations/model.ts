/** Five rules, expressed in five tools, run against a clean or a bad batch. Data made up; syntax simplified. */

export type Tool = "dbt" | "gx" | "soda" | "deequ" | "pandera";

export const RULES = [
  "at least one row",
  "order_id is unique",
  "customer_id is never missing",
  "status is placed or shipped",
  "amount is never negative",
];

/** Which rules fail on the bad batch. */
export const BAD_FAILS = [false, true, true, false, true];

export const CODE: Record<Tool, { name: string; lang: string; code: string }> = {
  dbt: {
    name: "dbt data tests",
    lang: "YAML in a dbt project",
    code: `models:
  - name: orders
    data_tests:
      - dbt_utils.expression_is_true:
          arguments: { expression: "(select count(*) from orders) > 0" }
    columns:
      - name: order_id
        data_tests: [unique]
      - name: customer_id
        data_tests: [not_null]
      - name: status
        data_tests:
          - accepted_values:
              arguments: { values: ['placed', 'shipped'] }
      - name: amount
        data_tests:
          - dbt_utils.accepted_range:
              arguments: { min_value: 0 }`,
  },
  gx: {
    name: "Great Expectations (GX Core)",
    lang: "Python",
    code: `import great_expectations as gx
suite = gx.ExpectationSuite(name="orders")
suite.add_expectation(gx.expectations.ExpectTableRowCountToBeBetween(min_value=1))
suite.add_expectation(gx.expectations.ExpectColumnValuesToBeUnique(column="order_id"))
suite.add_expectation(gx.expectations.ExpectColumnValuesToNotBeNull(column="customer_id"))
suite.add_expectation(gx.expectations.ExpectColumnValuesToBeInSet(
    column="status", value_set=["placed", "shipped"]))
suite.add_expectation(gx.expectations.ExpectColumnValuesToBeBetween(
    column="amount", min_value=0))`,
  },
  soda: {
    name: "Soda Core 4 (data contract)",
    lang: "YAML contract",
    code: `dataset: warehouse/shop/orders
checks:
  - row_count:
columns:
  - name: order_id
    checks:
      - duplicate:
  - name: customer_id
    checks:
      - missing:
  - name: status
    checks:
      - invalid:
          valid_values: ['placed', 'shipped']
  - name: amount
    checks:
      - invalid:
          valid_min: 0`,
  },
  deequ: {
    name: "Deequ",
    lang: "Scala on Spark",
    code: `VerificationSuite()
  .onData(orders)
  .addCheck(
    Check(CheckLevel.Error, "orders")
      .hasSize(_ > 0)
      .isUnique("order_id")
      .isComplete("customer_id")
      .isContainedIn("status", Array("placed", "shipped"))
      .isNonNegative("amount"))
  .run()`,
  },
  pandera: {
    name: "pandera",
    lang: "Python, on a dataframe",
    code: `import pandera.pandas as pa
schema = pa.DataFrameSchema(
    {
        "order_id": pa.Column(int, unique=True),
        "customer_id": pa.Column(int, nullable=False),
        "status": pa.Column(str, pa.Check.isin(["placed", "shipped"])),
        "amount": pa.Column(float, pa.Check.ge(0)),
    },
    checks=pa.Check(lambda df: len(df) > 0),
)
schema.validate(orders, lazy=True)`,
  },
};

export function report(tool: Tool, bad: boolean): string {
  const fails = RULES.map((_, i) => bad && BAD_FAILS[i]);
  switch (tool) {
    case "dbt":
      return [
        "expression_is_true_orders",
        "unique_orders_order_id",
        "not_null_orders_customer_id",
        "accepted_values_orders_status",
        "accepted_range_orders_amount",
      ]
        .map((n, i) => `${fails[i] ? "FAIL 1" : "PASS  "} ${n}`)
        .join("\n");
    case "gx":
      return `{\n  "success": ${!fails.some(Boolean)},\n  "statistics": { "evaluated_expectations": 5, "successful_expectations": ${fails.filter((f) => !f).length} }\n}`;
    case "soda":
      return (
        RULES.map((r, i) => `${fails[i] ? "FAILED" : "PASSED"}  ${r}`).join("\n") +
        `\nContract ${fails.some(Boolean) ? "FAILED" : "PASSED"}`
      );
    case "deequ":
      return [
        "SizeConstraint",
        "UniquenessConstraint(order_id)",
        "CompletenessConstraint(customer_id)",
        "ComplianceConstraint(status)",
        "ComplianceConstraint(amount)",
      ]
        .map((n, i) => `${n}: ${fails[i] ? "Failure" : "Success"}`)
        .join("\n");
    case "pandera":
      return fails.some(Boolean)
        ? `SchemaErrors: ${fails.filter(Boolean).length} schema errors\n` +
            RULES.map((r, i) => (fails[i] ? `  - ${r}` : ""))
              .filter(Boolean)
              .join("\n")
        : "validated dataframe returned (no errors)";
  }
}

export const GX_FLOW: [string, string][] = [
  ["Expectation", "One assertion about the data, such as 'values are not null'."],
  ["Expectation Suite", "A named group of expectations for a dataset."],
  ["Batch Definition", "Which data to check: a table, a file, a slice."],
  ["Validation Definition", "Pairs a batch with a suite."],
  ["Checkpoint", "Runs validations in production and triggers actions, such as an alert."],
  ["Data Docs", "Human-readable reports of every result."],
];
