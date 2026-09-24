# Sources (fact-checked 2026-09)

- M. Fowler, "What do you mean by 'Event-Driven'?", 7 Feb 2017: event notification, event-carried state transfer, event sourcing, CQRS.
- Confluent Schema Registry docs: default compatibility BACKWARD (upgrade consumers first); FORWARD, FULL and _TRANSITIVE variants; NONE.
- AWS Glue Schema Registry (Avro, JSON Schema, Protobuf; BACKWARD recommended); Azure Event Hubs schema registry (Standard tier and above); Amazon EventBridge schema registry and discovery.
- Amazon EventBridge docs: event buses and rules for many-to-many routing; Pipes for point-to-point (source → filter → enrichment → target). Amazon SNS docs: fan-out to SQS.
- Azure Event Grid docs: push and pull delivery, CloudEvents 1.0, MQTT. Google Eventarc docs: Standard and Advanced, events delivered in CloudEvents format.
- CloudEvents spec v1.0.2; required attributes id, source, specversion, type; CNCF graduation 25 Jan 2024.
- AsyncAPI specification 3.1.0 (Jan 2026).
