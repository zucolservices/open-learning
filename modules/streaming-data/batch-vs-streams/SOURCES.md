# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m01-facts.md`.

- Tyler Akidau, "Streaming 101" (O'Reilly, 5 Aug 2015): streaming system = "a type of data processing engine that is designed with infinite data sets in mind"; bounded vs unbounded data. Dataflow Model paper (VLDB 2015); MillWheel (VLDB 2013).
- Kafka: open-sourced Jan 2011, Apache top-level 23 Oct 2012; Kafka 4.0 (18 Mar 2025) runs without ZooKeeper; kafka.apache.org: "More than 80% of all Fortune 100 companies trust, and use Apache Kafka." Jay Kreps, "The Log" (Dec 2013); "Questioning the Lambda Architecture" (2 Jul 2014, "Maybe we could call this the Kappa Architecture"). Nathan Marz, "How to beat the CAP theorem" (13 Oct 2011) — batch + realtime layers (name "Lambda" came later).
- Flink top-level 12 Jan 2015 (Stratosphere, TU Berlin). Structured Streaming (Spark 2.0, 2016; stable 2.2, 2017); Spark 4.1.0 Real-Time Mode (16 Dec 2025, sub-second). Spark docs: micro-batch "as low as 100 milliseconds". Apache Beam top-level 10 Jan 2017.
- IBM completed its acquisition of Confluent on 17 Mar 2026 (~$11 bn, announced 8 Dec 2025).
- UPI: September 2026, 24.07 bn transactions, ~802 m a day (press citing NPCI); ≈9,300/s average (derived). UPI response-time limits cut to 15 s (payments) from 16 Jun 2025. UPI frauds FY25: 12.64 lakh incidents, ₹981 crore (Finance Ministry in Lok Sabha, as reported). NPCI provides banks an AI/ML fraud monitoring tool that raises alerts and declines transactions (government statements).
- Visa: VisaNet handles up to 83,000 transaction messages per second; transactions "authorized or declined in milliseconds".
- Google Cloud Dataflow (us-central1): batch $0.056 vs streaming $0.069 per vCPU-hour; FlexRS $0.0336 (≈40% less than batch).
- The 11:42 pm attack (20 × ₹4,999, rule "3 payments to a new payee within 2 minutes") is illustrative.
