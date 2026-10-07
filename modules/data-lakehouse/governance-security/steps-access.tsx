"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookUser, Database, KeyRound, ShieldCheck, User } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { GovernanceState } from "./state";

/* 1 ─ One table, four people ------------------------------------------------------------------- */

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  region: "South" | "West";
  spend: number;
}

const CUSTOMERS: Customer[] = [
  {
    id: "C-1001",
    name: "Priya Nair",
    phone: "98450 12345",
    email: "priya.n@mail.example",
    city: "Bengaluru",
    region: "South",
    spend: 18400,
  },
  {
    id: "C-1002",
    name: "Arjun Mehta",
    phone: "98200 55501",
    email: "arjun.m@mail.example",
    city: "Mumbai",
    region: "West",
    spend: 9200,
  },
  {
    id: "C-1003",
    name: "Lakshmi Iyer",
    phone: "94440 77812",
    email: "lakshmi.i@mail.example",
    city: "Chennai",
    region: "South",
    spend: 26100,
  },
  {
    id: "C-1004",
    name: "Rahul Shah",
    phone: "98250 33019",
    email: "rahul.s@mail.example",
    city: "Ahmedabad",
    region: "West",
    spend: 4700,
  },
];

type Role = GovernanceState["role"];

const ROLES: Record<
  Role,
  {
    label: string;
    who: string;
    rows: (c: Customer) => boolean;
    cols: (keyof Customer)[];
    mask: Partial<Record<keyof Customer, (v: string) => string>>;
    rule: string;
  }
> = {
  analyst: {
    label: "Analyst",
    who: "Needs spending patterns, not identities.",
    rows: () => true,
    cols: ["id", "city", "region", "spend"],
    mask: {},
    rule: "Column-level: names, phones and emails are not granted at all.",
  },
  support: {
    label: "Support agent (South)",
    who: "Helps customers in the South region on the phone.",
    rows: (c) => c.region === "South",
    cols: ["id", "name", "phone", "email", "city", "region"],
    mask: {
      email: (v) => v.replace(/^(.).*(@.*)$/, "$1•••$2"),
      phone: (v) => "•••• " + v.slice(-4),
    },
    rule: "Row filter: only their region. Column masks: phone and email partly hidden.",
  },
  scientist: {
    label: "Data scientist",
    who: "Trains a churn model.",
    rows: () => true,
    cols: ["id", "city", "spend"],
    mask: { id: (v) => "u_" + (parseInt(v.slice(2), 10) * 7919).toString(16) },
    rule: "Pseudonymised IDs: a stable token instead of the customer ID; no contact details.",
  },
  admin: {
    label: "Data steward",
    who: "Responsible for the data; every query is audited.",
    rows: () => true,
    cols: ["id", "name", "phone", "email", "city", "region", "spend"],
    mask: {},
    rule: "Full access, and every query they run is logged.",
  },
};

const ALL_COLS: (keyof Customer)[] = ["id", "name", "phone", "email", "city", "region", "spend"];

export function FourPeople() {
  const [s, set] = useSceneState<GovernanceState>();
  const r = ROLES[s.role];
  return (
    <StepLayout
      eyebrow="The big idea first"
      title="One table, four people"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.role}
            options={(Object.keys(ROLES) as Role[]).map(
              (k) => [k, ROLES[k].label] as [string, string],
            )}
            onChange={(v) => set({ role: v as Role })}
          />
          <div className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3">
            <User className="text-accent mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">{r.label}</p>
              <p className="text-muted text-xs">{r.who}</p>
            </div>
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border">
            <table className="w-full font-mono text-[11px]">
              <thead className="bg-surface-2/60 text-muted">
                <tr>
                  {ALL_COLS.map((c) => (
                    <th
                      key={c}
                      className={cn(
                        "px-2 py-1.5 text-left font-medium",
                        !r.cols.includes(c) && "text-subtle line-through",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {CUSTOMERS.filter(r.rows).map((c) => (
                    <motion.tr
                      key={c.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-line border-t"
                    >
                      {ALL_COLS.map((col) => {
                        const visible = r.cols.includes(col);
                        const raw = String(c[col]);
                        const masked = r.mask[col];
                        return (
                          <td key={col} className="px-2 py-1 whitespace-nowrap">
                            {visible ? (
                              <span className={cn(masked && "text-viz-compute")}>
                                {masked ? masked(raw) : raw}
                              </span>
                            ) : (
                              <span className="text-subtle">–</span>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.role}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-2.5 text-sm"
            >
              <ShieldCheck className="text-accent mr-1.5 inline size-4" />
              {r.rule}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Think of a hospital&apos;s records. The receptionist sees names and appointment times, the
        doctor sees the full history, billing sees amounts. Everyone uses the same records; each
        sees only what their job needs.
      </p>
      <p>
        A lakehouse does the same with one <code>customers</code> table. Switch roles and watch the
        same query return different rows and columns: <Term id="row-filter">row filters</Term> and{" "}
        <Term id="column-mask">column masks</Term> applied by the engine, based on who&apos;s
        asking.
      </p>
      <p className="text-subtle text-xs">
        Nobody gets a separate copy. One table, one set of rules, enforced at query time.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The side door: storage access ---------------------------------------------------------------- */

export function SideDoor() {
  const [s, set] = useSceneState<GovernanceState>();
  const direct = s.access === "direct";
  return (
    <StepLayout
      eyebrow="Storage security"
      title="The side door"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.access}
            options={[
              ["direct", "Analysts also have bucket keys"],
              ["vended", "Only the catalog hands out access"],
            ]}
            onChange={(v) => set({ access: v as GovernanceState["access"] })}
          />
          <div className="border-line bg-bg/40 grid gap-3 rounded-2xl border p-4 sm:grid-cols-3">
            <Node
              icon={<User className="size-5" />}
              title="Support agent (South)"
              body="runs a query"
            />
            <Node
              icon={<BookUser className="size-5" />}
              title="Catalog"
              body={
                direct
                  ? "applies row filter + masks, but only on this path"
                  : "checks policy, hands the engine short-lived, scoped credentials"
              }
              accent
            />
            <Node
              icon={<Database className="size-5" />}
              title="Object storage"
              body="customers/*.parquet: every row, every column"
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.access}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3",
                direct ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              {direct ? (
                <>
                  <p className="text-sm font-semibold">The same agent opens the files directly</p>
                  <Code className="mt-2 text-[10px] whitespace-pre-wrap">
                    {
                      "SELECT name, phone, email\nFROM read_parquet('s3://lake/customers/*.parquet');\n-- 4 rows, every region, nothing masked"
                    }
                  </Code>
                  <p className="text-muted mt-2 text-sm">
                    Row filters and masks live in the catalog and are applied by engines that ask
                    it. Anyone who can read the files themselves walks straight past them.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold">
                    <KeyRound className="mr-1 inline size-4" /> No standing access to the bucket
                  </p>
                  <p className="text-muted mt-1 text-sm">
                    People hold no long-lived storage keys. The catalog vends short-lived, scoped
                    credentials to engines, and for tables with row filters or masks it doesn&apos;t
                    hand out file access at all: those tables can only be read through engines that
                    enforce the rules. AWS similarly advises a bucket policy that denies direct S3
                    access.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Fine-grained rules are only as strong as the path around them. The catalog enforces them on
        queries that go through it, but the data itself is ordinary files in a bucket.
      </p>
      <p>
        That&apos;s why well-governed lakehouses lock storage down and use{" "}
        <Term id="credential-vending">credential vending</Term>: the catalog gives engines
        short-lived, narrowly scoped credentials per request, as in the Iceberg REST commit you saw
        last module. Vended credentials open whole files, so catalogs such as Unity Catalog refuse
        them for tables that have row filters or column masks.
      </p>
    </StepLayout>
  );
}

function Node({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 text-center",
        accent ? "border-accent/50 bg-accent-soft" : "border-line bg-surface",
      )}
    >
      <div
        className={cn(
          "mx-auto grid size-9 place-items-center rounded-full",
          accent ? "text-accent" : "text-muted",
        )}
      >
        {icon}
      </div>
      <p className="mt-1 text-sm font-semibold">{title}</p>
      <p className="text-muted mt-0.5 text-[11px]">{body}</p>
    </div>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function SideDoorCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where do the rules apply?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="side-door"
            prompt="A catalog applies a row filter so analysts see only Indian customers. One analyst also has read access to the storage bucket and queries the Parquet files with DuckDB. What do they see?"
            options={[
              {
                id: "filtered",
                label: "Only Indian customers: the row filter is stored with the table",
                feedback:
                  "The filter lives in the catalog, not in the files. DuckDB reading raw files never consults it.",
              },
              {
                id: "all",
                label: "Every customer: reading the files directly bypasses the catalog's policies",
                correct: true,
                feedback:
                  "Right. Fine-grained policies protect only access paths that go through the catalog and a trusted engine.",
              },
              {
                id: "error",
                label: "An error: DuckDB can't read governed tables",
                feedback:
                  "If it has the storage credentials, it can read the files like any other Parquet.",
              },
              {
                id: "encrypted",
                label: "Encrypted gibberish, because the data is encrypted at rest",
                feedback:
                  "Encryption at rest protects disks, not authorised readers: storage decrypts transparently for anyone with read access.",
              },
            ]}
            explanation="Remove direct bucket access for people, and let the catalog vend scoped credentials to engines that enforce its rules."
          />
        </div>
      }
    >
      <p>Think about which component actually applies the rule.</p>
    </StepLayout>
  );
}
