"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MILESTONES } from "./model";

/** How many milestones each story section has reached. */
const REACHED = [0, 1, 4, 5, 6, 9];

const ROWS = [
  ["Kiran S.", "98xxxxxx12", "JEE 2027", "Shared"],
  ["Farah K.", "97xxxxxx40", "NEET 2027", "Shared"],
  ["Dev R.", "99xxxxxx08", "JEE 2027", "Shared"],
];

function Scene({ index }: { index: number }) {
  const reached = REACHED[index] ?? 0;
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      <motion.div
        animate={{ opacity: index === 0 ? 1 : 0.3, scale: index === 0 ? 1 : 0.96 }}
        className="border-line bg-surface overflow-hidden rounded-lg border text-[10px]"
      >
        <p className="border-line bg-surface-2 border-b px-2 py-1 font-mono">
          enquiries_2026.xlsx · made-up example
        </p>
        {ROWS.map((r) => (
          <div
            key={r[0]}
            className="border-line grid grid-cols-4 gap-1 border-b px-2 py-1 font-mono"
          >
            {r.map((c, i) => (
              <span key={c} className={cn(i === 3 && "text-bad")}>
                {c}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
      <div className="flex flex-col gap-1">
        {MILESTONES.map((ms, i) => {
          const on = i < reached;
          return (
            <motion.div
              key={ms.id}
              animate={{ opacity: on ? 1 : 0.18, x: on ? 0 : -6 }}
              className="grid grid-cols-[4.75rem_1fr] items-center gap-2 text-[11px]"
            >
              <span className="text-accent font-mono">{ms.date}</span>
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5",
                  ms.proposed ? "border-line-strong border-dashed" : "border-line bg-surface",
                )}
              >
                {ms.title}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "list",
    kicker: "Picture this",
    title: "A phone number on someone else's list",
    body: (
      <p>
        Kiran fills in an enquiry form at a coaching centre in Kalpanagar, a made-up town. A week
        later, loan apps and rival coaching classes start calling. The centre had shared its enquiry
        spreadsheet with a &ldquo;marketing partner&rdquo;. Kiran never agreed to that, and had no
        clear way to ask who had their number or to make it stop. That spreadsheet is{" "}
        <Term id="personal-data">personal data</Term>: data about a person who can be identified
        from it.
      </p>
    ),
  },
  {
    id: "right",
    kicker: "2017",
    title: "Privacy becomes a fundamental right",
    body: (
      <p>
        On 24 August 2017, nine judges of the Supreme Court decided, unanimously, in{" "}
        <em>Justice K.S. Puttaswamy v. Union of India</em> that privacy is a{" "}
        <Term id="fundamental-right">fundamental right</Term>, part of the right to life and liberty
        in Article 21 and the freedoms in Part III of the Constitution. The judges also urged the
        government to write a data protection law.
      </p>
    ),
  },
  {
    id: "drafts",
    kicker: "2018–2022",
    title: "Five years of drafts",
    body: (
      <p>
        A committee led by Justice B.N. Srikrishna wrote the first draft bill in July 2018. A longer
        bill reached Parliament in December 2019 and went to a joint committee, which proposed 81
        changes. In August 2022 the government withdrew it and published a much shorter draft for
        public comment that November.
      </p>
    ),
  },
  {
    id: "act",
    kicker: "August 2023",
    title: "The DPDP Act",
    body: (
      <p>
        Parliament passed the <Term id="dpdp-act">Digital Personal Data Protection Act</Term> in
        August 2023, and it received the President&apos;s assent on 11 August. It is short: 44
        sections and one schedule. It sets out who must protect personal data, what people can ask
        for, and the penalties for getting it wrong.
      </p>
    ),
  },
  {
    id: "rules",
    kicker: "November 2025",
    title: "The Rules, and a timetable",
    body: (
      <p>
        An Act needs detailed rules before it can work. The{" "}
        <Term id="dpdp-rules">DPDP Rules 2025</Term> were published in the Gazette dated 13 November
        2025, alongside a notice setting up the{" "}
        <Term id="data-protection-board">Data Protection Board of India</Term> and a timetable
        saying when each part starts.
      </p>
    ),
  },
  {
    id: "runway",
    kicker: "2026–2027",
    title: "An 18-month runway",
    body: (
      <p>
        The provisions on consent managers start in November 2026. The core duties start in May
        2027, 18 months after the Rules. In January 2026 the government proposed shortening that
        runway, but as of October 2026 no change has been made. Until May 2027 the older IT Act
        rules still apply. In this track you&apos;ll learn what the law asks of the systems you
        build. It explains the law for engineers; it isn&apos;t legal advice.
      </p>
    ),
  },
];

export function LeakedList() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            A phone number on someone else&apos;s list
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            One shared spreadsheet, and the eight-year road to India&apos;s data protection law.
          </p>
        </div>
      }
    />
  );
}
