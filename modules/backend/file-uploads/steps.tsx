"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, SCENARIOS } from "./model";
import type { UpState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Parcels() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The parcel room"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Don't carry parcels through reception", "Couriers drop them at the loading bay."],
            ["Label them yourself", "Don't trust the sender's label for where it goes."],
            ["Check what's inside", "Not just what the label says."],
            ["Hold it until it's checked", "Then deliver it to the right desk."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        An office doesn&apos;t let couriers haul heavy, unknown parcels through reception, and
        doesn&apos;t trust the label on the box to say what&apos;s inside.
      </p>
      <p>
        Uploaded files deserve the same care: they&apos;re big and untrusted. Send them straight to{" "}
        <Term id="object-storage">object storage</Term>, name them yourself, check them, and hold
        them until they pass.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix ⭐ --------------------------------------------------------------------------------------- */

export function FixUploads() {
  const [s, set] = useSceneState<UpState>();
  const on = (id: string) => s.fixed.includes(id);
  const toggle = (id: string) =>
    set({ fixed: on(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  const results = SCENARIOS.map((sc) => ({ ...sc, ok: sc.needs.every(on) }));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Harden a photo upload"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid content-start gap-1">
            {FIXES.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={on(f.id)}
                onClick={() => toggle(f.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  on(f.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                {on(f.id) ? f.fix : f.problem}
              </button>
            ))}
          </div>
          <div className="grid content-start gap-1">
            {results.map((r) => (
              <motion.div
                key={r.id}
                layout
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  r.ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="flex items-center gap-1 font-medium">
                  {r.ok ? (
                    <Check className="text-good size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad size-3.5 shrink-0" />
                  )}
                  {r.label}
                </p>
                <p className="text-muted text-[10.5px]">{r.ok ? r.pass : r.fail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Customers can upload photos of their café visits. The feature has six weaknesses. Fix them
        and test four scenarios, described in words.
      </p>
      <p>
        Some scenarios need more than one fix: defences overlap so that one gap doesn&apos;t sink
        the whole thing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The flow ------------------------------------------------------------------------------------- */

export function Flow() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Uploading straight to storage"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            "App asks your API for an upload link",
            "API checks who it is, picks a random key, returns a short-lived pre-signed link with a size limit",
            "App uploads directly to the bucket",
            "The bucket announces the new file; a worker scans and checks it",
            "Only then is the photo marked ready",
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="text-muted mr-2 font-mono">{i + 1}</span>
              {t}
            </motion.div>
          ))}
          <p className="text-subtle mt-1 text-[10px]">
            Amazon S3: objects up to 50 TB since December 2025; one PUT up to 5 GB, larger files in
            up to 10,000 parts. Pre-signed links last at most 7 days (on Google Cloud and Azure
            too).
          </p>
        </div>
      }
    >
      <p>
        A <Term id="presigned-url">pre-signed URL</Term> is a time-limited link that lets one client
        upload one object, without your servers handling the bytes or sharing your credentials.
      </p>
      <p>
        A pre-signed POST policy can enforce a size range and content type; a plain pre-signed PUT
        can&apos;t limit size.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Scan and serve ------------------------------------------------------------------------------- */

export function Serve() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Scanning, serving and cleaning up"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Malware scanning",
              "Amazon GuardDuty Malware Protection for S3, Microsoft Defender for Storage, or ClamAV in a worker.",
            ],
            [
              "Re-encode images",
              "Decoding and re-saving an image strips hidden content and odd metadata.",
            ],
            [
              "Serve safely",
              "From a separate domain, with Content-Disposition: attachment and X-Content-Type-Options: nosniff.",
            ],
            [
              "Clean up",
              "Abandoned multipart uploads are still billed; a lifecycle rule can remove them.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        OWASP&apos;s file upload guidance stacks defences: an extension allowlist, file signature
        checks, server-chosen names, size limits, storage away from the web root, scanning, and
        re-encoding where possible.
      </p>
      <p>
        No single check is enough on its own; together they make uploads boring, which is the goal.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function UpCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What is this file, really?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="backend-uploads"
            prompt="What's the safest way to decide whether an upload really is a JPEG photo?"
            options={[
              {
                id: "header",
                label: "Trust the Content-Type the browser sends",
                feedback: "The client chooses that header; anyone can set it to anything.",
              },
              {
                id: "ext",
                label: "Check the file name ends in .jpg",
                feedback: "Names are chosen by the uploader too.",
              },
              {
                id: "layers",
                label:
                  "Allowlist the extension, check the file's first bytes, then scan or re-encode it",
                correct: true,
                feedback:
                  "Right: several independent checks, and re-encoding removes anything hidden.",
              },
            ]}
            explanation="Never trust what the client says about a file. Check the content itself, and stack defences."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Bypass your servers", "Pre-signed uploads to object storage."],
        ["Name files yourself", "Never use the user's name as a path."],
        ["Check the content", "Signatures and allowlists, not headers."],
        ["Limit and quarantine", "Size limits, scan before use."],
        ["Serve safely", "Separate domain, download not display."],
      ]}
    >
      <p>That ends the chapter. Next: running in production, starting with rate limits.</p>
    </WrapStep>
  );
}
