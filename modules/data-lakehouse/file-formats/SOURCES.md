# Fact check: Rows vs columns, file formats

Checked 2026-09-24 against primary sources.

| Claim                                                                                                                                            | Source                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| CSV: informational RFC 4180 (Oct 2005), no formal spec; fields with commas, quotes or line breaks should be quoted; quotes doubled; no types     | https://datatracker.ietf.org/doc/html/rfc4180                                                                     |
| JSON Lines: one JSON value per line, UTF-8                                                                                                       | https://jsonlines.org/                                                                                            |
| Avro container file: header (magic, schema JSON, codec, 16-byte sync), blocks separated by sync markers; codecs; schema resolution with defaults | https://avro.apache.org/docs/1.12.0/specification/                                                                |
| Kafka + Schema Registry wire format: magic byte 0 + 4-byte schema ID (Confluent convention)                                                      | https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html                 |
| Parquet: PAR1 at both ends, row groups → column chunks → pages, footer metadata and statistics, per-page compression, Dremel-style nesting       | https://parquet.apache.org/docs/file-format/ ; https://github.com/apache/parquet-format/blob/master/README.md     |
| Parquet encodings: RLE_DICTIONARY, delta encodings, BYTE_STREAM_SPLIT                                                                            | https://parquet.apache.org/docs/file-format/data-pages/encodings/                                                 |
| ORC: stripes, row index (min/max every 10,000 rows), footer + postscript, 64 MB stripe default                                                   | https://orc.apache.org/specification/ORCv1/                                                                       |
| .gz not splittable (one mapper per file); only bzip2 implements splittable compression among text codecs                                         | https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html |
| Delta: Parquet data, JSON log, Parquet (or JSON for V2) checkpoints                                                                              | https://github.com/delta-io/delta/blob/master/PROTOCOL.md                                                         |
| Iceberg: data Parquet/ORC/Avro, Avro manifests, JSON table metadata                                                                              | https://iceberg.apache.org/spec/                                                                                  |
| Hudi: base files usually Parquet; MoR log blocks default to Avro                                                                                 | https://hudi.apache.org/docs/storage_layouts                                                                      |
| Arrow: in-memory columnar format for zero-copy interchange                                                                                       | https://arrow.apache.org/docs/format/Columnar.html                                                                |

## Editorial decisions

- Byte counts in the scroll story are computed from the real strings on screen. Encoding sizes in the compression step are illustrative and labelled as such.
- "Write one new order" contrasts batch-written columnar files with append-friendly row formats; we avoid claiming row formats are faster for point lookups, since that depends on indexes.
- Snappy/LZ4 splittability is not claimed for raw text files; only gzip is shown as non-splittable.
