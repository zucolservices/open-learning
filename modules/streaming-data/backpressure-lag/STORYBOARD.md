# Backpressure and lag (Streaming Data Systems, module 17)

1. **A tank between two pipes** (analogy): inflow, tank, outflow; without a tank, the supplier must slow down.
2. **Survive the sale** ⭐ (simulation): 90 minutes, 7× spike at minute 30–50; partitions 6/12/24, consumers slider, autoscale on lag (3-min reaction), pre-warm; arriving vs handled, lag chart, peak lag, worst delay, catch-up time.
3. **Falling behind, or slowing down** (step-through): Kafka pull vs Flink credit-based flow control; lag appears at the source; find the bottleneck.
4. **Scaling knobs and alarms** (explore): KEDA, Flink autoscaler, Kafka Streams/Spark, AWS, Azure/Google, time-based alerts and Burrow; Flipkart and JioHotstar scale.
5. **What would you do?** (sort checkpoint).
6. **Wrap**.
