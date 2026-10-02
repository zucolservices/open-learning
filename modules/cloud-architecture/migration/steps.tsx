"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { MigState, R } from "./state";

/* 1 ─ Moving house -------------------------------------------------------------------------------- */

const HOUSE: [string, string][] = [
  ["The sofa goes as it is", "Rehost"],
  ["The bed gets new legs to fit the room", "Replatform"],
  ["The kitchen is redesigned for the new space", "Refactor"],
  ["The old fridge is replaced with a new one", "Repurchase"],
  ["The whole cupboard moves in one container, contents untouched", "Relocate"],
  ["Grandmother's piano stays behind for now", "Retain"],
  ["The broken exercise bike goes to the scrap dealer", "Retire"],
];

export function MovingHouse() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Moving house"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {HOUSE.map(([t, r], i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <span>{t}</span>
              <span className="text-accent shrink-0 text-xs font-semibold">{r}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Nobody moves house by treating every item the same. Some things travel as they are, some get
        adapted, some are replaced, and some are thrown out.
      </p>
      <p>
        Moving applications to the cloud works the same way. AWS&apos;s version of the list is the
        &ldquo;7 Rs&rdquo; of <Term id="migration-strategy">migration strategy</Term>; Azure and
        Google use nearly the same words. A real migration is a portfolio of hundreds of these small
        decisions.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The 7 Rs ------------------------------------------------------------------------------------ */

const RS: { id: R; name: string; nick: string; what: string; effort: string }[] = [
  {
    id: "retire",
    name: "Retire",
    nick: "switch it off",
    what: "Nobody needs it any more: archive what matters and switch it off.",
    effort: "Least effort",
  },
  {
    id: "retain",
    name: "Retain",
    nick: "keep it for now",
    what: "Not ready to move, or can't: special hardware, a recent upgrade, rules.",
    effort: "None for now",
  },
  {
    id: "rehost",
    name: "Rehost",
    nick: "lift and shift",
    what: "Move the servers as they are onto cloud VMs.",
    effort: "Low · weeks",
  },
  {
    id: "relocate",
    name: "Relocate",
    nick: "move the platform",
    what: "Move a whole VMware estate to the same platform in the cloud (Azure VMware Solution, Google Cloud VMware Engine, Amazon EVS).",
    effort: "Lowest per server · days",
  },
  {
    id: "repurchase",
    name: "Repurchase",
    nick: "drop and shop",
    what: "Replace with a SaaS product. Azure calls it Replace.",
    effort: "Medium: data and training",
  },
  {
    id: "replatform",
    name: "Replatform",
    nick: "lift and reshape",
    what: "A few changes to use managed services, such as a managed database.",
    effort: "Medium",
  },
  {
    id: "refactor",
    name: "Refactor / re-architect",
    nick: "move and improve",
    what: "Rebuild parts to be cloud-native: containers, serverless, managed data. Azure separates Refactor and Rearchitect.",
    effort: "High · months",
  },
];

export function SevenRs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The 7 Rs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {RS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">
                  {r.name} <span className="text-muted text-xs font-normal">· {r.nick}</span>
                </p>
                <span className="text-muted shrink-0 text-[10px]">{r.effort}</span>
              </div>
              <p className="text-muted text-xs">{r.what}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The list began with Gartner&apos;s five Rs in 2011; AWS grew it to six in 2016 and seven in
        2017, adding Relocate for VMware. Azure&apos;s Cloud Adoption Framework lists eight, and
        Google uses nicknames such as &ldquo;lift and optimize&rdquo; and &ldquo;remove and
        replace&rdquo;.
      </p>
      <p>
        AWS&apos;s advice for large migrations: move first, modernise after. Azure&apos;s caveat:
        only rehost something you won&apos;t need to modernise within two years.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Decide the fate of ten apps ⭐ -------------------------------------------------------------- */

const APPS: { id: string; name: string; desc: string; best: R[]; ok: R[]; why: string }[] = [
  {
    id: "payroll",
    name: "Payroll package",
    desc: "A bought product, three versions behind; the vendor now sells it as SaaS.",
    best: ["repurchase"],
    ok: ["rehost"],
    why: "The vendor's SaaS ends the upgrade treadmill.",
  },
  {
    id: "mainframe",
    name: "Mainframe batch job",
    desc: "Nightly COBOL pension run, 30 years old, works perfectly.",
    best: ["retain"],
    ok: ["refactor"],
    why: "High risk, little gain right now. Plan its modernisation separately.",
  },
  {
    id: "intranet",
    name: "Old intranet",
    desc: "12 visits last month, all from the IT team.",
    best: ["retire"],
    ok: [],
    why: "Archive the content and switch it off.",
  },
  {
    id: "grievance",
    name: "Citizen grievance portal",
    desc: "Java on two VMs, stable, no changes planned.",
    best: ["rehost"],
    ok: ["replatform"],
    why: "Quick, low-risk move; modernise later if needed.",
  },
  {
    id: "mysql",
    name: "Licensing app on its own MySQL server",
    desc: "The team spends a day a month patching the database.",
    best: ["replatform"],
    ok: ["rehost"],
    why: "A managed database removes the patching chore with few code changes.",
  },
  {
    id: "vmware",
    name: "40 small VMware VMs",
    desc: "The data-centre lease ends in three months; VMware licences got pricier in 2024.",
    best: ["relocate"],
    ok: ["rehost"],
    why: "Moving the VMware platform as-is is fastest against a deadline.",
  },
  {
    id: "results",
    name: "Exam results site",
    desc: "A monolith that falls over every results day.",
    best: ["refactor"],
    ok: ["replatform"],
    why: "Re-architect for autoscaling (module 4): rehosting moves the problem too.",
  },
  {
    id: "mail",
    name: "On-premises email server",
    desc: "Ageing hardware; one person knows how it works.",
    best: ["repurchase"],
    ok: [],
    why: "Email is a commodity: buy it as a service.",
  },
  {
    id: "lab",
    name: "Lab instrument software",
    desc: "Needs a USB licence dongle and a cable to the machine.",
    best: ["retain"],
    ok: [],
    why: "Tied to physical hardware: it stays.",
  },
  {
    id: "archive",
    name: "50 TB scanned-document archive",
    desc: "On an old file server, read a few times a day.",
    best: ["replatform"],
    ok: ["rehost"],
    why: "Object storage with lifecycle rules (module 16) is far cheaper than a file server.",
  },
];

export function Portfolio() {
  const [s, set] = useSceneState<MigState>();
  const picks = s.picks ?? {};
  const tally = RS.map((r) => ({ r, n: APPS.filter((a) => picks[a.id] === r.id).length })).filter(
    (x) => x.n > 0,
  );
  return (
    <StepLayout
      eyebrow="Decide"
      title="Decide the fate of ten apps"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {APPS.map((a) => {
            const p = picks[a.id];
            const tone = !p
              ? "none"
              : a.best.includes(p)
                ? "good"
                : a.ok.includes(p)
                  ? "ok"
                  : "bad";
            return (
              <div
                key={a.id}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5",
                  tone === "good"
                    ? "border-good/50 bg-good/10"
                    : tone === "bad"
                      ? "border-bad/50 bg-bad/10"
                      : "border-line bg-surface",
                )}
              >
                <p className="text-xs font-semibold">
                  {a.name} <span className="text-muted font-normal">· {a.desc}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {RS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => set({ picks: { ...picks, [a.id]: r.id } })}
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 text-[10px]",
                        p === r.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      {r.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
                {p && (
                  <p
                    className={cn(
                      "mt-0.5 text-[10px]",
                      tone === "good" ? "text-good" : tone === "bad" ? "text-bad" : "text-muted",
                    )}
                  >
                    {tone === "good"
                      ? a.why
                      : tone === "ok"
                        ? `Workable. A better fit: ${RS.find((r) => r.id === a.best[0])!.name}. ${a.why}`
                        : `Risky choice. Consider ${RS.find((r) => r.id === a.best[0])!.name}: ${a.why}`}
                  </p>
                )}
              </div>
            );
          })}
          {tally.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
              {tally.map(({ r, n }) => (
                <span key={r.id} className="bg-surface-2 rounded-full px-2 py-0.5">
                  {r.name.split(" ")[0]} × {n}
                </span>
              ))}
            </div>
          )}
        </div>
      }
    >
      <p>
        A state department&apos;s IT estate has ten applications. Decide what happens to each. There
        is often more than one reasonable answer; the feedback explains the trade-off.
      </p>
      <p>
        In real projects this is the assess phase: tools such as Azure Migrate, AWS Transform (with
        its migration engine, AWS Transform MGN) and Google&apos;s Migrate to Virtual Machines
        discover servers and dependencies first, so no app is moved without the database it quietly
        relies on.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Moving the data ⭐ -------------------------------------------------------------------------- */

const SIZES = [1, 10, 50, 100, 250, 500, 1000];
const LINKS: [number, string][] = [
  [100, "100 Mbps"],
  [1000, "1 Gbps"],
  [10000, "10 Gbps"],
];

function days(tb: number, mbps: number, util = 0.8) {
  return (tb * 1e12 * 8) / (mbps * 1e6 * util) / 86400;
}

function fmtDays(d: number) {
  if (d < 1) return `${Math.max(1, Math.round(d * 24))} hours`;
  return `${d < 10 ? d.toFixed(1) : Math.round(d)} days`;
}

export function MoveData() {
  const [s, set] = useSceneState<MigState>();
  const d = days(s.tb, s.mbps);
  const ship = s.tb > 40 && d > 14;
  return (
    <StepLayout
      eyebrow="Calculator · 80% link use"
      title="Moving the data"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <p className="text-muted mb-1 text-xs">How much data?</p>
            <div className="flex flex-wrap gap-1">
              {SIZES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set({ tb: t })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                    s.tb === t ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {t >= 1000 ? `${t / 1000} PB` : `${t} TB`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted mb-1 text-xs">Network link to the cloud</p>
            <div className="flex flex-wrap gap-1">
              {LINKS.map(([m, n]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set({ mbps: m })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                    s.mbps === m ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <motion.div
            key={s.tb + "-" + s.mbps}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              ship ? "border-bad/50 bg-bad/10" : "border-good/50 bg-good/10",
            )}
          >
            <p className="text-sm">
              Over the network: <span className="font-mono font-semibold">{fmtDays(d)}</span>
            </p>
            <p className="text-muted mt-1 text-xs">
              {ship
                ? "Too slow for most projects: consider a transfer appliance (Azure Data Box up to 525 TB, Google Transfer Appliance, available in India) or a faster link."
                : "Fine over the network, with a tool such as AWS DataSync, AzCopy or Storage Transfer Service, while the old system keeps running."}
            </p>
          </motion.div>
          <p className="text-muted text-[10px]">
            100 TB over 1 Gbps takes 9.3 days at full speed. AWS Snowball devices are no longer
            offered to new customers; AWS now points to DataSync, its Data Transfer Terminal, or
            partner devices.
          </p>
        </div>
      }
    >
      <p>
        Servers can be copied in hours; data is the slow part. Pick a size and a link to see how
        long the copy takes, assuming you can use 80% of the link.
      </p>
      <p>
        Delhivery copied more than 500 TB from a US region to Mumbai on AWS in 45 days to meet
        data-residency rules, without disrupting its 800 data pipelines: copy history and live data
        in parallel, verify, then switch.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Waves and cut-over ⭐ ----------------------------------------------------------------------- */

const CUT: { title: string; text: string; tone?: "good" | "bad" }[] = [
  {
    title: "1. Waves, not one big move",
    text: "Group apps that depend on each other into waves of a few weeks each. Early waves are simple apps, to learn on. Air India moved hundreds of servers to Azure in about 85 cut-overs in 2023.",
  },
  {
    title: "2. Copy the history",
    text: "Copy the existing data to the cloud while the old system keeps serving users.",
  },
  {
    title: "3. Keep changes flowing",
    text: "Replicate every new change continuously (change data capture), so the copy stays seconds behind.",
  },
  {
    title: "4. Go / no-go",
    text: "A short freeze, a final sync, checks that both sides match, and a formal decision. Never during a financial close or a peak season.",
  },
  {
    title: "5. Switch traffic",
    text: "Point users at the new system (DNS, module 8). Keep the old one ready, with rollback triggers agreed in advance.",
    tone: "good",
  },
  {
    title: "6. Switch off the old",
    text: "Only after a settling period, decommission the source. Azure calls this the last step of every migration.",
  },
  {
    title: "What big bang looks like",
    text: "In April 2018 UK bank TSB moved 5.2 million customers to a new banking platform over one weekend. Many customers couldn’t use their accounts properly for weeks; it cost about £330 million, and regulators fined it £48.65 million in 2022.",
    tone: "bad",
  },
];

export function Cutover() {
  const [s, set] = useSceneState<MigState>();
  const f = CUT[s.frame] ?? CUT[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Waves and cut-over"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {CUT.map((c, i) => (
              <div
                key={c.title}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i === s.frame
                    ? c.tone === "bad"
                      ? "bg-bad"
                      : "bg-accent"
                    : i < s.frame
                      ? "bg-accent/40"
                      : "bg-line",
                )}
              />
            ))}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={CUT.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Moving one app is easy. Moving three hundred without anyone noticing is a programme: assess,
        prepare (AWS calls it mobilise), then migrate in waves.
      </p>
      <p>
        The <Term id="cutover">cut-over</Term> is the moment users switch to the new system. Done
        well, it&apos;s minutes of read-only time with a tested way back.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Which R? ------------------------------------------------------------------------------------ */

export function WhichR() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which R?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-r"
            prompt="Name the strategy each team chose."
            categories={[
              { id: "retire", label: "Retire" },
              { id: "rehost", label: "Rehost" },
              { id: "replatform", label: "Replatform" },
              { id: "repurchase", label: "Repurchase" },
              { id: "refactor", label: "Refactor" },
            ]}
            items={[
              {
                id: "a",
                label: "Copied the VMs unchanged onto cloud VMs",
                category: "rehost",
                why: "Lift and shift.",
              },
              {
                id: "b",
                label: "Kept the app but moved its database to a managed service",
                category: "replatform",
                why: "A small change to use a managed service.",
              },
              {
                id: "c",
                label: "Switched from their own CRM to a SaaS CRM",
                category: "repurchase",
                why: "Drop and shop (Azure: Replace).",
              },
              {
                id: "d",
                label: "Split the monolith into containers and serverless functions",
                category: "refactor",
                why: "Re-architected to be cloud-native.",
              },
              {
                id: "e",
                label: "Archived a reporting tool nobody had opened in a year",
                category: "retire",
                why: "Switched off.",
              },
            ]}
            explanation="The cheapest migration is the one you don't have to do: always look for things to retire first."
          />
        </div>
      }
    >
      <p>Five teams, five strategies.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["A portfolio, not a move", "Each app gets its own R, starting with what to retire."],
  ["Discover first", "Dependencies decide the waves."],
  ["Data is the slow part", "Do the maths; ship a device when the network can't keep up."],
  ["Cut over gently", "Sync, go/no-go, switch, keep a way back; avoid big bang."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        McKinsey estimated in 2021 that companies would waste about $100 billion of migration
        spending over three years through inefficient migrations. Last: put the whole track together
        and design a landing zone yourself.
      </p>
    </StepLayout>
  );
}
