# Sources: B-trees (fact-checked 2026-10-04)

- R. Bayer and E. McCreight, Boeing report (July 1970); "Organization and maintenance of large ordered indexes", Acta Informatica 1(3):173–189, 1972.
- D. Comer, "The Ubiquitous B-Tree", ACM Computing Surveys 11(2), June 1979.
- PostgreSQL docs, B-Tree Indexes (implementation: Lehman & Yao; every level doubly linked; page splits cascade upwards, root split adds a level; deduplication) and CREATE INDEX ("By default, the CREATE INDEX command creates B-tree indexes"); src/backend/access/nbtree/README.
- PostgreSQL 13 release notes (B-tree deduplication).
- MySQL 8.4 manual: InnoDB clustered and secondary indexes; B-tree indexes.
- SQLite file format (table b-trees, index b-trees).
- Markus Winand, Use The Index, Luke: "Real world indexes with millions of records have a tree depth of four or five. A tree depth of six is hardly ever seen."

The tree in the simulation uses 3 keys per page for visibility; the levels table assumes an illustrative 300 keys per page.
