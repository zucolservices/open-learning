# Sources: gRPC and Protocol Buffers (fact-checked 2026-10-04)

- protobuf.dev, Language Guide (proto 3): field numbers "cannot be changed once your message type is in use"; "Field numbers should never be reused"; 1–15 one byte (tag); unknown fields preserved: https://protobuf.dev/programming-guides/proto3/
- protobuf.dev, Proto Best Practices and Editions overview (Edition 2024 latest released): https://protobuf.dev/editions/overview/
- grpc.io Core concepts (four kinds of service method), Deadlines guide, status codes (17): https://grpc.io/docs/
- grpc.io blog, "The state of gRPC in the browser"; grpc/doc/PROTOCOL-WEB.md.
- Buf docs, buf breaking: https://buf.build/docs/breaking/
- CNCF: Connect RPC accepted at Sandbox, 13 Apr 2024.

The Order message, changes and clients are illustrative; the wire bytes are a correct encoding of the example.
