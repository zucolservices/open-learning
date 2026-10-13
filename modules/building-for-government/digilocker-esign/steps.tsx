"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STEPS } from "./model";
import type { DocState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Seal() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The notary's stamp"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A copy of a copy</p>
            <p className="text-muted">
              A photocopy, stamped by an officer who never saw the original records. It proves only
              that two papers looked alike.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Straight from the source</p>
            <p className="text-muted">
              The school board sends the marksheet itself, signed with its key. Nobody needs to
              vouch for it.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        For decades, Indian applications ran on attested photocopies: a stamp to say a copy matched
        an original. It costs people time and money, and proves surprisingly little.
      </p>
      <p>
        <Term id="digilocker">DigiLocker</Term> lets departments fetch documents straight from the
        office that issued them, and <Term id="esign">eSign</Term> lets people sign electronically
        with an OTP. Both are legally valid.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------ */

export function Application() {
  const [s, set] = useSceneState<DocState>();
  const st = STEPS[s.step];
  const last = s.step === STEPS.length - 1;
  return (
    <StepLayout
      eyebrow="Step through"
      title="One application, two ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <Segmented<"paper" | "digital">
            size="sm"
            value={s.digital ? "digital" : "paper"}
            onChange={(v) => set({ digital: v === "digital" })}
            options={[
              ["paper", "Photocopies"],
              ["digital", "From the issuer"],
            ]}
          />
          <div className="flex gap-1">
            {STEPS.map((x, i) => (
              <button
                key={x.title}
                type="button"
                aria-label={`Step ${i + 1}`}
                onClick={() => set({ step: i })}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i <= s.step ? "bg-accent" : "bg-line-strong",
                )}
              />
            ))}
          </div>
          <motion.div
            key={`${s.step}-${s.digital}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border p-3",
              s.digital ? "border-good/50 bg-good/10" : "border-line bg-surface",
            )}
          >
            <p className="text-muted text-[10px]">
              Step {s.step + 1} of {STEPS.length}
            </p>
            <p className="font-semibold">{st.title}</p>
            <p className="mt-1">{s.digital ? st.digital : st.paper}</p>
            <p className={cn("mt-1", s.digital ? "text-good" : "text-bad")}>
              {s.digital ? st.digitalCost : st.paperCost}
            </p>
          </motion.div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={s.step === 0}
              onClick={() => set({ step: s.step - 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Step back
            </button>
            <button
              type="button"
              disabled={last}
              onClick={() => set({ step: s.step + 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Next step
            </button>
          </div>
        </div>
      }
    >
      <p>
        A student in Kalpanagar applies for a state scholarship. Step through the application with
        photocopies, then switch to documents fetched from the issuer and compare each step.
      </p>
      <p>
        The biggest saving isn&apos;t for the student: it&apos;s the time departments spend
        verifying papers that the issuer could simply have confirmed.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Locker --------------------------------------------------------------------------------------- */

export function Locker() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How DigiLocker works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Issuer", "School board, transport office, revenue department"],
              ["Citizen", "Holds a link to each document, and consents to share"],
              ["Requester", "The department or company that needs it"],
            ].map(([t, b], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface rounded-lg border p-2"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-[10px]">{b}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {[
              [
                "Issued, not uploaded",
                "Only documents pulled from the issuer are at par with originals; a user's own scans have no special status.",
              ],
              [
                "Scale, mid-2026",
                "Over 72 crore users, 900+ crore issued documents, and about 5,400 document types.",
              ],
              [
                "Entity Locker",
                "Launched in January 2025 for businesses: records from company, GST and trade registries.",
              ],
              [
                "What's next",
                "Features such as sharing only part of a document, the idea behind verifiable credentials.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        DigiLocker&apos;s legal basis is a 2016 set of IT rules; a 2017 amendment put issued
        documents at par with physical ones, and MeitY has asked departments to accept them.
      </p>
      <p>
        Requesters should fetch from the issuer every time, not ask people to download and
        re-upload.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Signatures ----------------------------------------------------------------------------------- */

export function Signatures() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="eSign and digital signatures"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "eSign",
              "Confirm identity with an OTP or biometric (Aadhaar or, since 2019, other eKYC); a one-time certificate signs the document, and its key is destroyed after use.",
            ],
            [
              "Digital Signature Certificate",
              "A long-lived certificate on a USB token, from a licensed certifying authority. Since 2021 only Class 3 is issued.",
            ],
            [
              "Only a fingerprint of the file",
              "The app sends a hash, not the document itself, to the eSign service.",
            ],
            [
              "Who's in charge",
              "The Controller of Certifying Authorities (under MeitY) licenses providers and runs India's root of trust.",
            ],
            [
              "Not everything",
              "Wills, powers of attorney, trusts and property sale contracts can't be signed electronically under the IT Act.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        eSign suits citizens signing occasionally; departments that sign thousands of certificates
        use organisational document-signer certificates.
      </p>
      <p>Either way, the record shows who signed and that nothing changed afterwards.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DocCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Can it be e-signed?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-esign"
            prompt="Can each document be signed electronically under India's IT Act?"
            categories={[
              { id: "yes", label: "Can be e-signed" },
              { id: "no", label: "Can't be" },
            ]}
            items={[
              {
                id: "decl",
                label: "A scholarship application declaration",
                category: "yes",
                why: "An ordinary electronic record.",
              },
              {
                id: "will",
                label: "A will",
                category: "no",
                why: "Excluded by the IT Act's First Schedule.",
              },
              {
                id: "job",
                label: "An employment contract",
                category: "yes",
                why: "Ordinary contracts can be e-signed.",
              },
              { id: "poa", label: "A power of attorney", category: "no", why: "Excluded." },
              {
                id: "flat",
                label: "A contract to sell a flat",
                category: "no",
                why: "Sale of immovable property is excluded.",
              },
            ]}
            explanation="Electronic signatures are valid for most documents, but the IT Act excludes a few: negotiable instruments other than cheques, powers of attorney, trusts, wills and contracts for selling immovable property."
          />
        </div>
      }
    >
      <p>Sort each document.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Fetch, don't upload", "Documents straight from the issuer."],
        ["At par with originals", "Issued documents only."],
        ["No more attestation", "No forgeries to hunt for."],
        ["eSign with an OTP", "A one-time certificate."],
        ["Know the exceptions", "Wills, property sales and a few more."],
      ]}
    >
      <p>Next: sharing data between departments, with consent.</p>
    </WrapStep>
  );
}
