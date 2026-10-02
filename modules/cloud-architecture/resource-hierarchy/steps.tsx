"use client";

import { motion } from "motion/react";
import { Building2, Check, Folder, Home, Wallet, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACCOUNTS, OUS, path, rollup, rupees } from "./tree";
import type { TreeState } from "./state";

type Cloud = TreeState["cloud"];

const CLOUDS: [Cloud, string][] = [
  ["aws", "AWS"],
  ["azure", "Azure"],
  ["gcp", "Google Cloud"],
];

/* 1 ─ One big house, or flats? ------------------------------------------------------------------ */

export function Flats() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="One big house, or flats?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border px-4 py-3"
          >
            <Home className="text-bad size-6" />
            <p className="mt-2 font-semibold">One big house</p>
            <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-sm">
              <li>One front-door key for everyone</li>
              <li>One electricity bill: who used what?</li>
              <li>A fire in the kitchen reaches every room</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border px-4 py-3"
          >
            <Building2 className="text-good size-6" />
            <p className="mt-2 font-semibold">Flats in a society</p>
            <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-sm">
              <li>Each flat has its own lock and meter</li>
              <li>Society rules apply to every flat</li>
              <li>Fire doors stop trouble spreading</li>
            </ul>
          </motion.div>
        </div>
      }
    >
      <p>
        Many organisations start the cloud in one account: production, testing, experiments and
        security logs side by side. It works, until one leaked password or one wrong command reaches
        everything.
      </p>
      <p>
        Clouds let you split work into many separate <Term id="cloud-account">accounts</Term> (AWS),
        subscriptions (Azure) or projects (Google), grouped in a{" "}
        <Term id="resource-hierarchy">resource hierarchy</Term>: a tree. Each one is a flat with its
        own lock, meter and fire doors; the society rules (module 12&apos;s guardrails) attach to
        the tree and flow down to every flat.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build the tree ⭐ --------------------------------------------------------------------------- */

const SLOTS = ["security", "infra", "prod", "sdlc", "sandbox"];
const ouName = (id: string) => OUS.find((o) => o.id === id)?.name ?? id;

export function BuildTree() {
  const [s, set] = useSceneState<TreeState>();
  const placed = s.placed ?? {};
  const done = ACCOUNTS.filter((a) => placed[a.id] === a.ou).length;
  return (
    <StepLayout
      eyebrow="Build"
      title="Build the tree"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-1.5">
            {ACCOUNTS.map((a) => {
              const at = placed[a.id];
              const right = at === a.ou;
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5",
                    !at
                      ? "border-line bg-surface"
                      : right
                        ? "border-good/50 bg-good/10"
                        : "border-bad/50 bg-bad/10",
                  )}
                >
                  <p className="text-xs font-semibold">{a.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {SLOTS.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => set({ placed: { ...placed, [a.id]: o } })}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px]",
                          at === o
                            ? "border-accent bg-accent-soft"
                            : "border-line hover:bg-surface-2",
                        )}
                      >
                        {ouName(o).replace(" (dev and test)", "")}
                      </button>
                    ))}
                  </div>
                  {at && (
                    <p className="text-muted mt-1 text-[10px]">
                      {right ? a.why : "Not quite: think about who must be kept apart from whom."}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-line bg-surface flex flex-col gap-0.5 self-start rounded-xl border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted mb-1 font-sans text-[10px]">
              {done} of {ACCOUNTS.length} in the recommended place
            </p>
            {OUS.map((o) => {
              const depth = path(o.id).length - 1;
              const kids = ACCOUNTS.filter((a) => placed[a.id] === o.id);
              return (
                <div key={o.id} style={{ paddingLeft: depth * 14 }}>
                  <p className="flex items-center gap-1">
                    <Folder className="text-accent size-3" /> {o.name}
                  </p>
                  {kids.map((a) => (
                    <motion.p
                      key={a.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn("pl-4 text-[10px]", a.ou === o.id ? "text-good" : "text-bad")}
                    >
                      └ {a.name}
                    </motion.p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        A state department is moving to the cloud. Put each workload in its own account and place it
        in the tree. The folders follow AWS&apos;s published recommendation, which Azure and Google
        echo with their own names.
      </p>
      <p>
        The idea is to group by the rules things need, not by the org chart: everything in Prod gets
        production rules, everything in Sandbox gets loose rules and a budget cap. Security and
        shared infrastructure sit apart from the workloads they serve. In India, Kotak Mahindra Bank
        has described running exactly this kind of multi-account setup on AWS.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What flows down ⭐ -------------------------------------------------------------------------- */

const OVERRIDE: Record<Cloud, { ok: boolean; text: string }> = {
  aws: {
    ok: false,
    text: "The Sandbox can attach its own policy allowing every region, but it doesn't help: the root's Deny still applies. An action must be allowed at every level, and a Deny anywhere wins.",
  },
  azure: {
    ok: false,
    text: "Azure Policy assignments add up down the tree. A child can't remove a parent's Deny; only an exemption granted at the parent's level can.",
  },
  gcp: {
    ok: true,
    text: "In Google Cloud, an organization policy set on a folder replaces the parent's unless it's set to inherit. The Sandbox folder's own rule wins: any region is now allowed there.",
  },
};

export function FlowDown() {
  const [s, set] = useSceneState<TreeState>();
  const acct = ACCOUNTS.find((a) => a.id === s.selected) ?? ACCOUNTS[0];
  const chain = path(acct.ou);
  const loosened = s.override && s.cloud === "gcp" && acct.ou === "sandbox";
  const policies = chain.flatMap((o) =>
    o.policies.map((p) => ({
      p:
        loosened && p === "Only India regions"
          ? "Any region (replaced by the folder's own policy)"
          : p,
      from: o.name,
      bad: loosened && p === "Only India regions",
    })),
  );
  return (
    <StepLayout
      eyebrow="Simulation · illustrative bills"
      title="What flows down"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-0.5 self-start rounded-xl border px-3 py-2 text-[11px]">
            {OUS.map((o) => {
              const depth = path(o.id).length - 1;
              const onPath = chain.some((c) => c.id === o.id);
              return (
                <div key={o.id} style={{ paddingLeft: depth * 12 }}>
                  <p
                    className={cn("flex items-center gap-1", onPath && "text-accent font-semibold")}
                  >
                    <Folder className="size-3" /> {o.name}
                    <span className="text-muted ml-auto font-mono text-[10px] font-normal">
                      {rupees(rollup(o.id))}
                    </span>
                  </p>
                  {ACCOUNTS.filter((a) => a.ou === o.id).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => set({ selected: a.id })}
                      className={cn(
                        "flex w-full items-center rounded px-1 py-0.5 pl-4 text-left text-[10px]",
                        a.id === acct.id ? "bg-accent-soft" : "hover:bg-surface-2",
                      )}
                    >
                      {a.name}
                      <span className="text-muted ml-auto font-mono">{rupees(a.cost)}</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">{acct.name}</p>
            <div className="flex flex-col gap-1">
              {policies.map((x) => (
                <motion.div
                  key={x.p + x.from}
                  layout
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md border px-2 py-1 text-xs",
                    x.bad ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                  )}
                >
                  <span>{x.p}</span>
                  <span className="text-muted text-[10px]">from {x.from}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-muted flex items-center gap-1 text-[11px]">
              <Wallet className="size-3.5" /> Its bill rolls up to{" "}
              {[...chain]
                .reverse()
                .map((o) => o.name)
                .join(" → ") || "the organisation"}
              : one invoice, split by account.
            </p>
            <div className="border-line mt-1 flex flex-col gap-2 rounded-lg border px-3 py-2">
              <p className="text-xs font-semibold">Can a lower level loosen a rule?</p>
              <Segmented
                size="sm"
                value={s.cloud}
                options={CLOUDS}
                onChange={(v) => set({ cloud: v })}
              />
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={s.override}
                  onChange={(e) =>
                    set({
                      override: e.target.checked,
                      selected: e.target.checked ? "sandbox" : s.selected,
                    })
                  }
                  className="accent-accent"
                />
                The Sandbox folder sets its own rule: any region allowed
              </label>
              {s.override && (
                <p
                  className={cn(
                    "flex gap-1.5 text-[11px]",
                    OVERRIDE[s.cloud].ok ? "text-bad" : "text-good",
                  )}
                >
                  {OVERRIDE[s.cloud].ok ? (
                    <X className="size-3.5 shrink-0" />
                  ) : (
                    <Check className="size-3.5 shrink-0" />
                  )}
                  <span>{OVERRIDE[s.cloud].text}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Click any account to see the rules it inherits from every level above it, and watch the bill
        roll up the tree. Rules attached once at the top reach every account, including ones created
        next year.
      </p>
      <p>
        Bills flow up too: on AWS the organisation&apos;s management account pays for every member
        account, and volume discounts and Savings Plans are shared. On Azure and Google, billing is
        a separate structure linked to subscriptions or projects. Then try loosening a rule from
        below: the clouds don&apos;t all agree.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Three clouds, three trees ------------------------------------------------------------------- */

const LEVELS: Record<Cloud, [string, string][]> = {
  aws: [
    [
      "Organisation (root)",
      "One per company; its management account pays the bills. AWS Organizations is free.",
    ],
    ["Organizational units", "Folders for accounts, nested up to 5 levels."],
    [
      "Accounts",
      "The unit of isolation: its own users, resources, quotas and bill line. 10 per organisation by default, raisable to thousands.",
    ],
  ],
  azure: [
    ["Microsoft Entra tenant + root management group", "Identity and the top of the tree."],
    [
      "Management groups",
      "Up to 6 levels below the root. Microsoft advises keeping the tree to 3–4 levels and not making separate groups for prod, test and dev.",
    ],
    [
      "Subscriptions",
      "The unit of isolation, billing and quotas: separate subscriptions per environment.",
    ],
    ["Resource groups", "Folders for resources inside a subscription (up to 980)."],
  ],
  gcp: [
    ["Organization", "Tied to your company's Cloud Identity or Workspace domain."],
    [
      "Folders",
      "Nested up to 10 levels; Google's blueprint uses bootstrap, common, networking, production, nonproduction and development.",
    ],
    [
      "Projects",
      "The unit of isolation. Project IDs are permanent and can never be reused, even after deletion. Billing accounts link to projects.",
    ],
  ],
};

export function ThreeTrees() {
  const [s, set] = useSceneState<TreeState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three clouds, three trees"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.names}
            options={CLOUDS}
            onChange={(v) => set({ names: v })}
          />
          <div className="flex flex-col gap-1.5">
            {LEVELS[s.names].map(([t, d], i) => (
              <motion.div
                key={s.names + t}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                style={{ marginLeft: i * 16 }}
                className="border-line bg-surface rounded-lg border px-3 py-2"
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Same idea, different names. The level that matters most is the unit of isolation: the AWS
        account, Azure subscription or Google project. That is where the{" "}
        <Term id="blast-radius">blast radius</Term> stops, quotas are counted and costs are split.
      </p>
      <p>
        Why it matters: in 2014 an attacker who got into Code Spaces&apos; AWS console deleted its
        servers, data and backups, and the company shut down within about 12 hours. In 2024 a Google
        Cloud mistake deleted Australian pension fund UniSuper&apos;s private cloud; backups kept
        with another provider saved it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Same account or separate? ----------------------------------------------------------------- */

export function SameOrSeparate() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Same account or separate?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="same-or-separate"
            prompt="Should these share an account (or subscription, or project), or be separated?"
            categories={[
              { id: "separate", label: "Separate" },
              { id: "same", label: "Share" },
            ]}
            items={[
              {
                id: "prodtest",
                label: "The production and test versions of the same app",
                category: "separate",
                why: "A test mistake must not reach production.",
              },
              {
                id: "logs",
                label: "An app and the audit logs that record what its admins did",
                category: "separate",
                why: "Admins shouldn't be able to delete the evidence.",
              },
              {
                id: "micro",
                label: "Two small services of one app, same team, same environment",
                category: "same",
                why: "Same owner, same rules: separate resource groups or tags are enough.",
              },
              {
                id: "sandbox",
                label: "A data scientist's experiments and the live customer database",
                category: "separate",
                why: "Sandboxes have loose rules; production data stays out.",
              },
              {
                id: "teams",
                label: "Two departments' production systems, each with its own budget",
                category: "separate",
                why: "Separate accounts give separate access, quotas and bills.",
              },
              {
                id: "dbapp",
                label: "A web app and its own database, in production",
                category: "same",
                why: "They're one workload with one owner and one set of rules.",
              },
            ]}
            explanation="Separate when the rules, owners or risks differ; share when they're one workload."
          />
        </div>
      }
    >
      <p>The test is always the same: if one is compromised or broken, should the other suffer?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Many small flats", "Separate accounts, subscriptions or projects contain mistakes."],
  ["Group by rules", "Prod, dev/test, sandbox, security, shared infrastructure."],
  ["Rules flow down, bills flow up", "Attach guardrails high; split costs by account."],
  ["Know your cloud", "Google lets a child replace an org policy; AWS denies always win."],
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
        Setting all this up by hand for every new team is slow. Next: landing zones, the ready-made
        foundation that creates accounts with the tree, guardrails, logging and network already in
        place.
      </p>
    </StepLayout>
  );
}
