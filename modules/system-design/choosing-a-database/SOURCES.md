# Sources: Choosing a database

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-data2/`).

| Claim in the module                                                                                                                     | Verdict                           | Source                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------- |
| Families and product names current; Redis / Valkey split                                                                                | Verified                          | vendor docs; Redis AGPL announcement                     |
| Cosmos DB Gremlin legacy-leaning (Fabric graph suggested); Spanner Graph GA 30 Jan 2025                                                 | Verified (nuanced)                | learn.microsoft.com cosmos-db gremlin; Google Cloud blog |
| Timescale → Tiger Data (extension still TimescaleDB); InfluxDB 3 GA Apr 2025; Timestream LiveAnalytics closed to new customers Jun 2025 | Verified                          | tigerdata.com; influxdata.com; AWS Timestream docs       |
| Elastic AGPL option (Aug 2024); OpenSearch Software Foundation (Sep 2024); S3 Vectors GA Dec 2025                                       | Verified                          | elastic.co; linuxfoundation.org; AWS What's New          |
| DynamoDB single-digit ms; 400 KB items incl. names; transactions ≤100 items/4 MB within one Region                                      | Verified                          | DynamoDB developer guide                                 |
| MongoDB 16 MiB documents (GridFS for more); Cassandra LSM write path                                                                    | Verified                          | MongoDB limits; Cassandra storage engine docs            |
| Polyglot persistence: Leberknight (2008) coined, Fowler popularised                                                                     | Verified                          | martinfowler.com/bliki/PolyglotPersistence.html          |
| Azure Cosmos DB for PostgreSQL retires 31 Mar 2029 → Azure Database for PostgreSQL elastic clusters                                     | Verified (web search, 2026-09-24) | learn.microsoft.com Q&A; Azure retirement notice         |
| Aurora DSQL GA 27 May 2025                                                                                                              | Verified (web search)             | aws.amazon.com What's New 2025/05                        |
