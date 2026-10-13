"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const CHANNELS = ["Website", "Phone", "Service centre", "Office"];
const FRAMES: { channel: number; status: string; tone: "good" | "bad" | "plain" }[] = [
  { channel: 0, status: "Form in English only", tone: "bad" },
  { channel: 1, status: "OTP sent to an old number", tone: "bad" },
  { channel: 2, status: "Applied with fingerprint · ref. KP-2026-48213", tone: "good" },
  { channel: 1, status: "SMS: under verification", tone: "plain" },
  { channel: 3, status: "Delay: grievance filed", tone: "bad" },
  { channel: 1, status: "SMS: card approved", tone: "good" },
];

function Scene({ index }: { index: number }) {
  const f = FRAMES[Math.min(index, FRAMES.length - 1)];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-5">
      <div className="grid grid-cols-2 gap-2">
        {CHANNELS.map((c, i) => (
          <motion.div
            key={c}
            animate={{ scale: i === f.channel ? 1.06 : 1, opacity: i === f.channel ? 1 : 0.45 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-center text-xs",
              i === f.channel ? "border-accent bg-accent-soft" : "border-line bg-surface",
            )}
          >
            {c}
          </motion.div>
        ))}
      </div>
      <motion.p
        key={f.status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "max-w-56 rounded-lg border px-3 py-2 text-center text-[11px]",
          f.tone === "good"
            ? "border-good/50 bg-good/10"
            : f.tone === "bad"
              ? "border-bad/40 bg-bad/5"
              : "border-line bg-surface-2",
        )}
      >
        {f.status}
      </motion.p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "online",
    kicker: "1 · Online",
    title: "A form they can't read",
    body: (
      <p>
        The Shinde family has moved to Kalpanagar and needs a new ration card. One of them tries the
        state portal on a shared phone, but the form is only in English, and they read Marathi.
      </p>
    ),
  },
  {
    id: "otp",
    kicker: "2 · Identity",
    title: "The code goes to the wrong phone",
    body: (
      <p>
        The portal sends a one-time password to the phone number linked to their Aadhaar: a number
        they gave up years ago. A shop would lose this customer. A government can&apos;t: the family
        is entitled to the card.
      </p>
    ),
  },
  {
    id: "csc",
    kicker: "3 · Assisted",
    title: "The service centre down the road",
    body: (
      <p>
        At a <Term id="common-services-centre">Common Services Centre</Term>, an operator fills in
        the form with them, confirms identity with a fingerprint and prints a receipt with a
        reference number. This is <Term id="assisted-access">assisted access</Term>.
      </p>
    ),
  },
  {
    id: "sms",
    kicker: "4 · Status",
    title: "News without logging in",
    body: (
      <p>
        An SMS confirms the application is being checked. They didn&apos;t need an app, a password
        or a smartphone to know what&apos;s happening.
      </p>
    ),
  },
  {
    id: "grievance",
    kicker: "5 · Accountability",
    title: "When it's late",
    body: (
      <p>
        Weeks pass. They file a grievance at the taluka office, quoting the reference number.
        Government services answer to laws, auditors, courts and elected representatives, not just
        to customers.
      </p>
    ),
  },
  {
    id: "done",
    kicker: "6 · Every route counts",
    title: "Approved",
    body: (
      <p>
        The card is approved. It took four channels, two languages and a fallback for identity.
        That&apos;s the job: a service every eligible person can complete, whoever and wherever they
        are.
      </p>
    ),
  },
];

export function OneFamily() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One family, one ration card
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            A family applies for a government service through every channel it has. The family and
            Kalpanagar are made up.
          </p>
        </div>
      }
    />
  );
}
