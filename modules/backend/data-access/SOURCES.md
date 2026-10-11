# Sources: Talking to a database (fact-checked 2026-10-12)

- Spring Boot 4.1 docs (HikariCP preferred; default maximumPoolSize 10). HikariCP wiki "About Pool Sizing" (formula credited to PostgreSQL project). PostgreSQL 18 docs (max_connections typically 100; 3 superuser-reserved). PgBouncer 1.26.
- ORM docs: Hibernate 7, EF Core 10 (LTS to Nov 2028), SQLAlchemy 2.1 (Sep 2026), Active Record 8.1, GORM, Prisma 7 (Rust-free, Nov 2025; Prisma 8 in RC), Drizzle 0.45 (1.0 RC).
- OWASP SQL Injection Prevention Cheat Sheet (parameterised queries).

Timings are illustrative. Notes: scratchpad `sd/backend/m08-facts.md`.
