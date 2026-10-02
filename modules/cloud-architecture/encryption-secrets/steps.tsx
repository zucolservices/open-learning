"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, FileLock2, HardDrive, Lock, RotateCw, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { envelope, type Envelope as Env } from "./envelope";
import type { CryptoState } from "./state";

/* 1 ─ Boxes, keys and the bank -------------------------------------------------------------------- */

export function LockedBoxes() {
  const rows: [string, string][] = [
    [
      "Every box has its own small key",
      "Thousands of boxes, thousands of keys. Losing one opens one box.",
    ],
    [
      "Each small key is sealed in an envelope",
      "Only the bank's master key can open the envelope, and the envelope is kept next to its box.",
    ],
    [
      "The master key never leaves the vault",
      "To open a box, you hand the envelope to the bank clerk. The clerk checks who you are, opens it inside the vault, and logs it.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Boxes, keys and the bank"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
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
        Cloud storage is already encrypted: S3 has encrypted every new object since January 2023,
        and Azure Storage and Google Cloud encrypt everything at rest with AES-256, with no way to
        turn it off. The interesting questions are who holds the keys and what happens when you
        change them.
      </p>
      <p>
        Clouds use the bank&apos;s trick, called{" "}
        <Term id="envelope-encryption">envelope encryption</Term>. Each piece of data gets its own
        data key; a master key in a <Term id="kms">key management service</Term> (KMS) seals those
        data keys and never leaves it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Encrypt a file like the cloud does ⭐ ---------------------------------------------------------- */

const short = (h: string, n = 40) => (h.length > n ? h.slice(0, n) + "…" : h);

export function Envelope() {
  const [s, set] = useSceneState<CryptoState>();
  const [env, setEnv] = useState<Env | null>(null);
  useEffect(() => {
    let live = true;
    envelope(s.message || " ")
      .then((e) => live && setEnv(e))
      .catch(() => live && setEnv(null));
    return () => {
      live = false;
    };
  }, [s.message]);

  const frames: { title: string; text: string; tone?: "good" }[] = [
    {
      title: "1. Your file",
      text: "Type anything. It stays in your browser; this page really encrypts it with AES-256-GCM.",
    },
    {
      title: "2. Ask the KMS for a data key",
      text: "The KMS returns a fresh data key twice: in plain form, and sealed (encrypted) under the master key. In AWS this call is GenerateDataKey.",
    },
    {
      title: "3. Encrypt the file with the data key",
      text: "Encryption happens right where the data is, fast and in bulk. The KMS never sees your file (AWS KMS won't encrypt more than 4 KB directly anyway).",
    },
    {
      title: "4. Throw away the plain data key",
      text: "Store the ciphertext with the sealed data key beside it. Nothing stored can be read without asking the KMS.",
    },
    {
      title: "5. Reading it back",
      text: "Send the sealed data key to the KMS. It checks your permissions, logs the request, unseals the key, and you decrypt the file.",
      tone: "good",
    },
  ];
  const f = frames[s.frame] ?? frames[0];
  const show = (from: number) => s.frame >= from;

  return (
    <StepLayout
      eyebrow="Step through · real encryption in your browser"
      title="Encrypt a file like the cloud does"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <input
            value={s.message}
            maxLength={80}
            onChange={(e) => set({ message: e.target.value })}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-sm"
            aria-label="File contents"
          />
          <div className="grid gap-1.5 font-mono text-[10px]">
            <Row on={show(1) && s.frame < 4} label="Plain data key" value={env?.dek} tone="bad" />
            <Row on={show(1)} label="Sealed data key" value={env?.wrappedDek} />
            <Row on={show(2)} label="Encrypted file" value={env?.ciphertext} />
            <Row on={show(4)} label="Decrypted" value={env?.decrypted} tone="good" plain />
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={frames.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Step through envelope encryption with a real key. Change the text and watch the ciphertext
        change completely. A plain data key exists only for a moment, in memory.
      </p>
      <p>
        Why not send everything to the KMS? It would be slow, and the master key would need to be
        everywhere. This way the master key stays in tamper-resistant hardware (AWS and Azure use
        FIPS 140-3 Level 3 modules) and every unseal is a permission check and an audit log entry.
      </p>
    </StepLayout>
  );
}

function Row({
  on,
  label,
  value,
  tone,
  plain,
}: {
  on: boolean;
  label: string;
  value?: string;
  tone?: "good" | "bad";
  plain?: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: on ? 1 : 0.15 }}
      className={cn(
        "flex gap-2 rounded-md border px-2 py-1",
        tone === "bad" && on
          ? "border-bad/50 bg-bad/10"
          : tone === "good" && on
            ? "border-good/50 bg-good/10"
            : "border-line bg-surface",
      )}
    >
      <span className="text-muted w-28 shrink-0 font-sans">{label}</span>
      <span className={cn("break-all", plain && "font-sans")}>
        {on ? (plain ? value : short(value ?? "")) : "—"}
      </span>
    </motion.div>
  );
}

/* 3 ─ Rotate, disable, delete ⭐ ------------------------------------------------------------------- */

type KeyState = CryptoState["key"];

const KEY_LABEL: Record<KeyState, string> = {
  enabled: "Enabled",
  disabled: "Disabled",
  pending: "Pending deletion (7–30 days)",
  destroyed: "Deleted",
};

export function RotateRevoke() {
  const [s, set] = useSceneState<CryptoState>();
  const usable = s.key === "enabled";
  const files = [
    { name: "invoice-2024.pdf", version: 1 },
    { name: "contract.docx", version: 1 },
    ...(s.rotations > 0 ? [{ name: "report-new.xlsx", version: s.rotations + 1 }] : []),
  ];
  const volume = usable
    ? { ok: true, text: "Running" }
    : s.restarted
      ? {
          ok: false,
          text:
            s.key === "destroyed"
              ? "Won't start: data is gone for good"
              : "Won't start after restart",
        }
      : { ok: true, text: "Still running: its data key is already unsealed in memory" };

  const btn = "rounded-full border px-3 py-1 text-xs font-medium disabled:opacity-40";
  return (
    <StepLayout
      eyebrow="Simulation · AWS KMS rules"
      title="Rotate, disable, delete"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-sm">
            <Lock className="text-accent size-4" />
            <span className="font-semibold">Master key</span>
            <span className="text-muted">versions v1–v{s.rotations + 1}</span>
            <span
              className={cn(
                "ml-auto rounded-full px-2 py-0.5 text-[11px]",
                s.key === "enabled" ? "bg-good/15 text-good" : "bg-bad/15 text-bad",
              )}
            >
              {KEY_LABEL[s.key]}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              className={cn(btn, "border-line hover:bg-surface-2")}
              disabled={!usable}
              onClick={() => set({ rotations: Math.min(s.rotations + 1, 4) })}
            >
              <RotateCw className="mr-1 inline size-3" />
              Rotate
            </button>
            <button
              type="button"
              className={cn(btn, "border-line hover:bg-surface-2")}
              disabled={s.key === "pending" || s.key === "destroyed"}
              onClick={() =>
                set({ key: s.key === "enabled" ? "disabled" : "enabled", restarted: false })
              }
            >
              {s.key === "disabled" ? "Enable" : "Disable"}
            </button>
            <button
              type="button"
              className={cn(btn, "border-line hover:bg-surface-2")}
              disabled={s.key === "destroyed"}
              onClick={() => set({ key: s.key === "pending" ? "disabled" : "pending" })}
            >
              {s.key === "pending" ? "Cancel deletion" : "Schedule deletion"}
            </button>
            <button
              type="button"
              className={cn(btn, "border-bad text-bad")}
              disabled={s.key !== "pending"}
              onClick={() => set({ key: "destroyed" })}
            >
              Wait out the waiting period
            </button>
            <button
              type="button"
              className={cn(btn, "border-line hover:bg-surface-2")}
              disabled={usable || s.restarted}
              onClick={() => set({ restarted: true })}
            >
              Restart the server
            </button>
            <button
              type="button"
              className={cn(btn, "border-line text-muted")}
              onClick={() => set({ rotations: 0, key: "enabled", restarted: false })}
            >
              Reset
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {files.map((f) => (
              <Item
                key={f.name}
                icon={<FileLock2 className="size-4" />}
                name={f.name}
                sub={`data key sealed with v${f.version}`}
                ok={usable}
                text={usable ? "Opens" : s.key === "destroyed" ? "Gone for good" : "Can't open"}
              />
            ))}
            <Item
              icon={<HardDrive className="size-4" />}
              name="Database disk (attached)"
              sub="encrypted with the same key"
              ok={volume.ok}
              text={volume.text}
            />
          </div>
        </div>
      }
    >
      <p>
        Try each control. <Term id="key-rotation">Rotation</Term> adds a new key version for new
        data and keeps the old ones, so old files still open; it doesn&apos;t re-encrypt anything.
        AWS rotates yearly by default (any period from 90 to 2,560 days).
      </p>
      <p>
        Disabling a key blocks the next unseal, not data already open: an attached disk keeps
        running until it restarts. Deletion waits 7–30 days (Google: 30 days by default, Azure:
        soft-delete for up to 90) because once the key is gone, every file it sealed is unreadable
        forever. That is also a feature: destroying a key is a fast way to erase data you can&apos;t
        find every copy of.
      </p>
    </StepLayout>
  );
}

function Item({
  icon,
  name,
  sub,
  ok,
  text,
}: {
  icon: ReactNode;
  name: string;
  sub: string;
  ok: boolean;
  text: string;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
        ok ? "border-line bg-surface" : "border-bad/50 bg-bad/10",
      )}
    >
      <span className="text-muted">{icon}</span>
      <span className="flex-1">
        <span className="font-medium">{name}</span>
        <span className="text-muted block text-[10px]">{sub}</span>
      </span>
      <span className={cn("flex items-center gap-1 text-right", ok ? "text-good" : "text-bad")}>
        {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
        {text}
      </span>
    </motion.div>
  );
}

/* 4 ─ Who holds the key? ------------------------------------------------------------------------- */

const OWNERS: Record<CryptoState["owner"], { rows: [string, string][]; note: string }> = {
  provider: {
    rows: [
      [
        "What",
        "The cloud creates and manages the master key (S3's SSE-S3, Google's default encryption, Azure's Microsoft-managed keys).",
      ],
      ["Control", "None: you can't disable it, see its use, or set its rotation."],
      ["Cost", "Free."],
      [
        "Good for",
        "Most data. It protects against stolen disks, not against someone with your cloud permissions.",
      ],
    ],
    note: "This is on by default everywhere.",
  },
  customer: {
    rows: [
      [
        "What",
        "A customer-managed key in your KMS (AWS KMS, Azure Key Vault, Google Cloud KMS). The cloud still uses it on your behalf.",
      ],
      [
        "Control",
        "You set who may use it, rotate it, disable it, delete it, and see every use in the audit log.",
      ],
      [
        "Cost",
        "AWS $1 a key per month plus $0.03 per 10,000 requests; Google $0.06 per key version per month (HSM $1); Azure $0.03 per 10,000 operations.",
      ],
      [
        "Good for",
        "Regulated data, separating duties (storage admins can't read without key permission), crypto-erase.",
      ],
    ],
    note: "S3 Bucket Keys cut KMS request costs by up to 99% for busy buckets.",
  },
  external: {
    rows: [
      [
        "What",
        "The key stays outside the cloud: in your own HSM through AWS External Key Store or Google Cloud EKM; Azure's version is in preview. Or you send the key with each request (S3's SSE-C).",
      ],
      ["Control", "Total: unplug it and the cloud can't read your data."],
      ["Cost", "Your own hardware and operations; Google EKM keys $3 per version per month."],
      [
        "Good for",
        "Rare sovereignty requirements. If your key service goes down, so does everything that depends on it.",
      ],
    ],
    note: "From April 2026 S3 disables SSE-C on new buckets by default, after ransomware gangs used it to lock victims' data with keys only they held.",
  },
};

export function WhoHolds() {
  const [s, set] = useSceneState<CryptoState>();
  const o = OWNERS[s.owner];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who holds the key?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.owner}
            options={[
              ["provider", "Cloud-managed"],
              ["customer", "Your KMS key"],
              ["external", "Held outside"],
            ]}
            onChange={(v) => set({ owner: v })}
          />
          <div className="flex flex-col gap-1.5">
            {o.rows.map(([k, v], i) => (
              <motion.div
                key={s.owner + k}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <span className="text-accent w-16 shrink-0 font-semibold">{k}</span>
                <span>{v}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">{o.note}</p>
        </div>
      }
    >
      <p>
        Encryption at rest is only as strong as the control over its keys. More control means more
        work and more ways to lock yourself out.
      </p>
      <p>
        Data moving between systems needs encryption too: <Term id="tls">TLS</Term>. AWS has
        required TLS 1.2 or newer on all its API endpoints since February 2024, and Azure completed
        the same move by early 2026.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where secrets belong ---------------------------------------------------------------------- */

const SECRETS: [string, string, boolean][] = [
  [
    "In the code or a config file",
    "Ends up in git history, builds and screenshots (module 10).",
    false,
  ],
  [
    "In a Kubernetes Secret, as is",
    "Only base64-encoded and stored unencrypted in etcd by default; anyone who can create a pod in the namespace can read it.",
    false,
  ],
  [
    "In a secret manager",
    "Encrypted with a KMS key, access-checked, logged, versioned, and rotated automatically.",
    true,
  ],
];

const MANAGERS: [string, string][] = [
  [
    "AWS Secrets Manager",
    "$0.40 per secret per month, $0.05 per 10,000 calls; managed rotation for databases. Parameter Store standard parameters are free.",
  ],
  [
    "Azure Key Vault",
    "Secrets, keys and certificates; $0.03 per 10,000 operations. Soft-delete on by default.",
  ],
  ["Google Secret Manager", "6 active versions free, then $0.06 per version per month."],
  [
    "HashiCorp Vault / OpenBao",
    "Self-hosted, works across clouds. Vault moved to a source-available licence in 2023 (IBM bought HashiCorp in 2025); OpenBao is the open-source fork under the Linux Foundation.",
  ],
];

export function Secrets() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where secrets belong"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {SECRETS.map(([t, d, ok]) => (
              <div
                key={t}
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-2 text-xs",
                  ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                {ok ? (
                  <Check className="text-good size-4 shrink-0" />
                ) : (
                  <X className="text-bad size-4 shrink-0" />
                )}
                <span>
                  <span className="font-semibold">{t}.</span> {d}
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {MANAGERS.map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Some secrets can&apos;t be replaced by workload identity: a partner&apos;s API key, a
        database password. They belong in a <Term id="secret-manager">secret manager</Term>, which
        the app reads at start-up using its workload identity, so the only thing in code is the
        secret&apos;s name.
      </p>
      <p>
        In India, the DPDP Rules (notified November 2025) name &ldquo;encryption, obfuscation,
        masking or the use of virtual tokens&rdquo; as security safeguards for personal data, with
        the rule taking effect in May 2027. Failing to protect data can cost up to ₹250 crore.
      </p>
    </StepLayout>
  );
}

/* 6 ─ What still opens? ------------------------------------------------------------------------- */

export function WhatOpens() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What still opens?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="what-opens"
            prompt="Can the data be read?"
            categories={[
              { id: "yes", label: "Opens" },
              { id: "no", label: "Doesn't open" },
            ]}
            items={[
              {
                id: "rotated",
                label: "A file written two years ago, after the key has rotated twice",
                category: "yes",
                why: "Rotation keeps old key versions, so old data keys still unseal.",
              },
              {
                id: "disabled",
                label: "A file, right after its master key is disabled",
                category: "no",
                why: "Opening it needs a new unseal, which a disabled key refuses.",
              },
              {
                id: "attached",
                label:
                  "A disk already attached to a running server, right after the key is disabled",
                category: "yes",
                why: "Its data key is already unsealed in memory; it fails on the next restart.",
              },
              {
                id: "cancelled",
                label:
                  "A file whose key deletion was scheduled, then cancelled and the key re-enabled",
                category: "yes",
                why: "The waiting period exists exactly for this.",
              },
              {
                id: "deleted",
                label: "A file whose key was deleted after the waiting period",
                category: "no",
                why: "Gone for good: no one, not even the cloud, can unseal its data key.",
              },
              {
                id: "noperm",
                label:
                  "An encrypted object, read by someone with storage access but no permission to use the key",
                category: "no",
                why: "With a customer-managed key you need both: storage permission and key permission.",
              },
            ]}
            explanation="Keys decide what can be read: rotation is safe, disabling is reversible, deletion is final."
          />
        </div>
      }
    >
      <p>Six situations from the simulator and beyond.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Encrypted by default", "At rest everywhere; TLS 1.2+ in transit."],
  ["Envelopes", "Data keys encrypt data; a KMS master key seals data keys."],
  ["Rotate freely, delete carefully", "Old versions stay; a deleted key is unreadable data."],
  ["Secrets in a manager", "Never in code, config or plain Kubernetes Secrets."],
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
      <p>Next: guardrails that stop anyone, even an admin, from switching these protections off.</p>
    </StepLayout>
  );
}
