# Streaming SQL (Streaming Data Systems, module 16)

1. **A scoreboard, not a scorecard** (analogy): a batch answer after the match vs a scoreboard updated after every ball.
2. **A query that never finishes** ⭐ (sandbox, simulated engine): four queries (orders per customer, sales per city, large orders, orders per 5-minute TUMBLE) over an order stream fed one at a time; materialised view and emitted changelog (+I/−U/+U), retract vs upsert; sink notes.
3. **Streaming SQL engines** (explore): Flink SQL, ksqlDB, RisingWave, Materialize, Spark/Databricks, warehouses.
4. **Append or update?** (sort checkpoint).
5. **Wrap**.
