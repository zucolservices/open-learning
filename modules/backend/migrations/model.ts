/** Renaming customers.phone to customers.mobile on a live made-up service, two ways. */

export interface Frame {
  title: string;
  columns: string[];
  apps: string[];
  errors: number;
  note: string;
}

export const ONE_STEP: Frame[] = [
  {
    title: "Before",
    columns: ["id", "name", "phone"],
    apps: ["v1 reads phone", "v1 reads phone", "v1 reads phone"],
    errors: 0,
    note: "Three copies of v1 serve traffic.",
  },
  {
    title: "Run: RENAME COLUMN phone TO mobile",
    columns: ["id", "name", "mobile"],
    apps: ["v1 reads phone", "v1 reads phone", "v1 reads phone"],
    errors: 412,
    note: "The schema changed instantly; every running copy still asks for phone. Errors for every customer page.",
  },
  {
    title: "Rolling deploy of v2 (reads mobile)",
    columns: ["id", "name", "mobile"],
    apps: ["v2 reads mobile", "v1 reads phone", "v1 reads phone"],
    errors: 274,
    note: "Copies are replaced one by one over several minutes. Until the last one is done, some requests still fail.",
  },
  {
    title: "Deploy finished",
    columns: ["id", "name", "mobile"],
    apps: ["v2 reads mobile", "v2 reads mobile", "v2 reads mobile"],
    errors: 0,
    note: "Working again, after minutes of errors. And rolling back v2 would break it all over again.",
  },
];

export const EXPAND_CONTRACT: Frame[] = [
  {
    title: "Before",
    columns: ["id", "name", "phone"],
    apps: ["v1: phone", "v1: phone", "v1: phone"],
    errors: 0,
    note: "Three copies of v1 serve traffic.",
  },
  {
    title: "1 · Expand: add mobile (nullable)",
    columns: ["id", "name", "phone", "mobile"],
    apps: ["v1: phone", "v1: phone", "v1: phone"],
    errors: 0,
    note: "Adding a nullable column is instant. v1 doesn't know it exists, and doesn't care.",
  },
  {
    title: "2 · Deploy v2: write both, read phone",
    columns: ["id", "name", "phone", "mobile"],
    apps: ["v2: write both", "v2: write both", "v1: phone"],
    errors: 0,
    note: "Old and new versions both work during the rollout.",
  },
  {
    title: "3 · Backfill mobile in batches",
    columns: ["id", "name", "phone", "mobile"],
    apps: ["v2: write both", "v2: write both", "v2: write both"],
    errors: 0,
    note: "Copy old rows a few thousand at a time, so no long locks.",
  },
  {
    title: "4 · Deploy v3: read mobile, still write both",
    columns: ["id", "name", "phone", "mobile"],
    apps: ["v3: read mobile", "v3: read mobile", "v2: write both"],
    errors: 0,
    note: "Rolling back to v2 is still safe: phone is kept up to date.",
  },
  {
    title: "5 · Deploy v4: stop writing phone",
    columns: ["id", "name", "phone", "mobile"],
    apps: ["v4: mobile only", "v4: mobile only", "v4: mobile only"],
    errors: 0,
    note: "Nothing uses phone any more.",
  },
  {
    title: "6 · Contract: drop phone",
    columns: ["id", "name", "mobile"],
    apps: ["v4: mobile only", "v4: mobile only", "v4: mobile only"],
    errors: 0,
    note: "Done, with zero errors at every step.",
  },
];

export const TOOLS: [string, string][] = [
  ["Flyway (Redgate)", "SQL scripts in order; open-source edition plus paid tiers"],
  ["Liquibase", "Changelogs; Community moved to a source-available licence (FSL) in 2025"],
  ["Alembic", "SQLAlchemy's tool for Python"],
  ["Rails, Django, EF Core", "Migrations built into the framework"],
  ["Prisma Migrate", "In Prisma 7; changing in the upcoming Prisma 8"],
  ["Atlas", "Declarative or versioned; default binaries under a commercial licence"],
];
