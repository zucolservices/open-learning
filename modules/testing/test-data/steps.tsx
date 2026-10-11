"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUILDER, EVENTS, TESTS, broken } from "./model";
import type { DataState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function SharedKitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The shared fridge"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">One fridge for six cooks</p>
            <p className="text-muted">
              Your cream was for tonight&apos;s dessert. Someone used it for soup at lunch.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Each cook gets their own tray</p>
            <p className="text-muted">Labelled, prepared fresh, and nobody else touches it.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A shared fridge works until two cooks need the same ingredient for different dishes. Then
        dinner fails for reasons that have nothing to do with the recipe.
      </p>
      <p>
        Tests often share one big <Term id="fixture">fixture</Term> file of sample customers and
        orders. As it grows, tests quietly depend on details of it, and changing one record for one
        test breaks others. <Term id="test-data-builder">Builders</Term> give each test its own
        fresh data, with only the details that matter spelled out.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Convert to builders ⭐ ------------------------------------------------------------------------ */

export function Convert() {
  const [s, set] = useSceneState<DataState>();
  const br = broken(s.converted, s.events);
  const n = Object.keys(br).length;
  const toggleC = (id: string) =>
    set({
      converted: s.converted.includes(id)
        ? s.converted.filter((x) => x !== id)
        : [...s.converted, id],
    });
  const toggleE = (id: string) =>
    set({ events: s.events.includes(id) ? s.events.filter((x) => x !== id) : [...s.events, id] });
  return (
    <StepLayout
      eyebrow="Build"
      title="Swap the shared fixture for builders"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 lg:grid-cols-2">
            {TESTS.map((t) => {
              const conv = s.converted.includes(t.id);
              const bad = br[t.id];
              return (
                <div
                  key={t.id}
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    bad ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                  )}
                >
                  <div className="flex items-center gap-2 text-xs">
                    {bad ? (
                      <X className="text-bad size-3.5" />
                    ) : (
                      <Check className="text-good size-3.5" />
                    )}
                    <span className="flex-1 font-medium">{t.name}</span>
                    <button
                      type="button"
                      aria-pressed={conv}
                      onClick={() => toggleC(t.id)}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        conv ? "border-accent bg-accent text-accent-fg" : "border-line-strong",
                      )}
                    >
                      {conv ? "Builder" : "Use builder"}
                    </button>
                  </div>
                  {bad && <p className="text-bad mt-0.5 text-[10px]">{bad}</p>}
                  <div className="mt-1 font-mono text-[10px]">
                    {(conv ? t.builder : t.fixture).map((l) => (
                      <pre key={l} className="break-all whitespace-pre-wrap">
                        {l}
                      </pre>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted mb-1 text-[10px] font-medium">
              Things that happen to a shared fixture
            </p>
            {EVENTS.map((e) => (
              <label key={e.id} className="flex items-start gap-1.5 py-0.5">
                <input
                  type="checkbox"
                  checked={s.events.includes(e.id)}
                  onChange={() => toggleE(e.id)}
                  className="accent-accent mt-0.5"
                />
                {e.label}
              </label>
            ))}
          </div>
          <p className={cn("text-xs", n ? "text-bad" : "text-good")}>
            {n
              ? `${n} test${n > 1 ? "s" : ""} broken, though the code is fine.`
              : "All tests pass."}
          </p>
        </div>
      }
    >
      <p>
        Four tests lean on a shared file of customers and orders. Tick the everyday events below
        them and watch tests break with no bug in the code. Then switch each test to a builder.
      </p>
      <p>
        Builder tests survive every event, and they&apos;re easier to read: &ldquo;a student
        customer&rdquo; says why the data matters, where <code>customers[7]</code> says nothing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Builders, factories, mothers ------------------------------------------------------------------ */

export function Patterns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Mothers, builders and factories"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10px]">
            {BUILDER.map((l, i) => (
              <pre key={i} className="whitespace-pre">
                {l}
              </pre>
            ))}
          </div>
          {[
            [
              "Object Mother",
              "Named, ready-made examples: aStudent(), aBlockedCustomer(). Simple, but the list of mothers grows.",
            ],
            [
              "Test Data Builder",
              "Sensible defaults, change only what matters, as above. Nat Pryce, 2007.",
            ],
            [
              "Factory libraries",
              "factory_bot (Ruby), Factory Boy (Python), AutoFixture (.NET) and similar build objects, often saving them to a test database.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs">
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        The key trick is <strong>defaults</strong>. Every customer gets a valid name, birthday and
        so on, so a test only states the one or two values it cares about. When a new required field
        appears, you add one default instead of editing every test.
      </p>
      <p>
        Object Mother was described at XP Universe in 2001; the builder style became widely known
        through the book <em>Growing Object-Oriented Software, Guided by Tests</em> (2009).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Personal data --------------------------------------------------------------------------------- */

export function Privacy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keep real people out of your tests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Copying production data into test environments</p>
            <p className="text-muted">
              Real names, phone numbers and orders end up on laptops and CI machines with weaker
              protection. Under data protection laws that&apos;s still processing personal data.
            </p>
          </div>
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Synthetic data</p>
            <p className="text-muted">
              Builders with made-up values, plus generators such as the Faker libraries for
              realistic names and addresses.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">“Anonymised” copies</p>
            <p className="text-muted">
              Pseudonymised data, with names swapped for codes, usually still counts as personal
              data under the EU&apos;s GDPR. Truly anonymous data is hard to achieve.
            </p>
          </div>
        </div>
      }
    >
      <p>
        India&apos;s Digital Personal Data Protection Act applies its main duties from May 2027, and
        Europe&apos;s GDPR already does. Neither makes an exception because data is &ldquo;only for
        testing&rdquo;.
      </p>
      <p>
        A small story about dependencies: in January 2022 the original faker.js package was deleted
        by its author. The community now maintains it as <code>@faker-js/faker</code>.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DataCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good habit or trap?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-data"
            prompt="Sort each test data habit."
            categories={[
              { id: "good", label: "Good habit" },
              { id: "trap", label: "Trap" },
            ]}
            items={[
              {
                id: "defaults",
                label: "A builder with valid defaults for every field",
                category: "good",
                why: "Tests state only what matters.",
              },
              {
                id: "index",
                label: "fixtures.customers[7] in a test",
                category: "trap",
                why: "Hidden meaning, shared and fragile.",
              },
              {
                id: "mutate",
                label: "Changing a shared fixture object inside a test",
                category: "trap",
                why: "Breaks other tests depending on order.",
              },
              {
                id: "prod",
                label: "Copying last month's real orders into the test database",
                category: "trap",
                why: "Personal data in a weaker environment.",
              },
              {
                id: "fresh",
                label: "Each test creates the records it needs",
                category: "good",
                why: "Independent and parallel-safe.",
              },
            ]}
            explanation="Give each test its own fresh, made-up data with sensible defaults, and spell out only what the test is about."
          />
        </div>
      }
    >
      <p>Sort each habit.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Shared fixtures rot", "Tests come to depend on hidden details."],
        ["Builders with defaults", "State only what matters."],
        ["Fresh data per test", "Independent, order-proof, parallel-safe."],
        ["Names that explain", "aCustomer().student() beats customers[7]."],
        ["No real people", "Synthetic data; production copies are still personal data."],
      ]}
    >
      <p>
        That&apos;s the chapter on test quality. Next: techniques that find bugs you didn&apos;t
        think of.
      </p>
    </WrapStep>
  );
}
