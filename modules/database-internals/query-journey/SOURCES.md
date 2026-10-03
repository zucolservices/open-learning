# Sources: What happens when you run a query (fact-checked 2026-10-04)

- PostgreSQL 18 docs, "Overview of PostgreSQL Internals" (§51.1–51.6): connection, parser, rewrite system ("a form of macro expansion"), planner/optimizer, executor ("a demand-pull pipeline mechanism"); "process per user" model: https://www.postgresql.org/docs/current/overview.html
- Page sizes: PostgreSQL "usually 8 kB"; InnoDB default 16 KB; SQLite 4096 bytes since 3.12.0.
- MySQL docs: connection manager threads, one dedicated thread per client connection by default.
- E. F. Codd, "A Relational Model of Data for Large Shared Data Banks", CACM 13(6):377–387, June 1970.
- Selinger et al., "Access Path Selection in a Relational Database Management System", SIGMOD 1979; IBM System R history (from 1973).
- SQLite, "Most Widely Deployed and Used Database Engine" (over one trillion databases, developers' estimate): https://www.sqlite.org/mostdeployed.html
- DB-Engines Ranking, October 2026 (popularity score).
- Stack Overflow Developer Survey 2025: PostgreSQL 55.6% of all respondents.

The customers table, plans and timings are illustrative.
