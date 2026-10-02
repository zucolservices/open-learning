# Schemas and evolution (Streaming Data Systems, module 9)

1. **Changing a printed form** (analogy): adding an optional box, removing one, renaming one that clerks rely on.
2. **Break a consumer, then fix it** ⭐ (fix the problem): Payment v1 in Avro; seven proposed changes; backward and forward verdicts by Avro resolution; registry mode NONE / BACKWARD / FORWARD / FULL accepts or rejects; deployment order.
3. **How a registry works** (step-through): register → schema ID 42 → magic byte + ID on the wire → consumer fetches and caches → v2 gets ID 43; header GUID option.
4. **Formats and registries** (explore): Avro, Protobuf, JSON Schema rules (STRICT surprise); Confluent, Apicurio/Karapace, Glue, Azure, Pub/Sub, Redpanda; data contracts.
5. **Allowed under BACKWARD?** (sort checkpoint).
6. **Wrap**.
