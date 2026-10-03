# Sources: Pages and rows (fact-checked 2026-10-04)

- PostgreSQL 18 docs, Database Page Layout (§66.6): 24-byte header; 4-byte item identifiers; items "stored in space allocated backwards from the end of unallocated space"; tuple header "23 bytes on most machines": https://www.postgresql.org/docs/current/storage-page-layout.html
- PostgreSQL docs: ctid (page number, item index; changes on UPDATE / VACUUM FULL); Free Space Map (one byte per page); TOAST ("does not allow tuples to span multiple pages"; threshold normally 2 kB); pg_type typalign.
- MySQL 8.4 Reference Manual, Clustered and Secondary Indexes.
- SQLite Database File Format (page size a power of two between 512 and 65536).

The page simulation is simplified, with illustrative row sizes; the padding example follows PostgreSQL's alignment rules.
