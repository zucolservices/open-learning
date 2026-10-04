"use client";

import { motion } from "motion/react";
import { HardDrive, MemoryStick } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

function Scene({ index }: { index: number }) {
  // 0: one counter. 1: many counters. 2: combine. 3: MapReduce disk. 4: iterative pain. 5: Spark memory.
  const many = index >= 1;
  const disk = index === 3 || index === 4;
  const mem = index >= 5;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: many ? 6 : 1 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            className="border-viz-compute bg-viz-compute/15 grid size-14 place-items-center rounded-lg border text-[10px]"
          >
            {many ? `worker ${i + 1}` : "one machine"}
          </motion.div>
        ))}
      </div>
      {index >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-accent bg-accent-soft rounded-lg border px-4 py-2 text-xs"
        >
          combine the partial results
        </motion.div>
      )}
      {(disk || mem) && (
        <motion.div
          key={mem ? "mem" : "disk"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2 text-xs",
            mem ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
          )}
        >
          {mem ? <MemoryStick className="size-4" /> : <HardDrive className="size-4" />}
          {mem
            ? "between steps, data stays in memory"
            : index === 4
              ? "every pass: read from disk, write to disk, again"
              : "between steps, write everything to disk"}
        </motion.div>
      )}
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "idea",
    kicker: "The idea",
    title: "Too much for one person",
    body: (
      <p>
        Counting every ballot in a national election by yourself would take years. So the work is
        split: thousands of counting centres each count their share, and the totals are added up at
        the end. Nobody needs to see every ballot.
      </p>
    ),
  },
  {
    id: "split",
    kicker: "Split",
    title: "Many machines, each with a share",
    body: (
      <p>
        Data that won&apos;t fit on one computer works the same way. Spread it across a{" "}
        <Term id="cluster">cluster</Term> of machines, have each process its own part, then combine
        the results. The hard part is coordinating all those machines, and surviving when some fail.
      </p>
    ),
  },
  {
    id: "combine",
    kicker: "Combine",
    title: "MapReduce",
    body: (
      <p>
        In 2004 Google described <Term id="mapreduce">MapReduce</Term>: a &ldquo;map&rdquo; step
        processes each piece, a &ldquo;reduce&rdquo; step combines results by key, and the framework
        handles distribution and failures. Its open-source copy, Hadoop, became the standard way to
        process big data.
      </p>
    ),
  },
  {
    id: "disk",
    kicker: "The catch",
    title: "Disk, disk, disk",
    body: (
      <p>
        Between jobs, MapReduce writes everything to a distributed file system and reads it back.
        The 2012 Spark paper put it plainly: the only way to reuse data between two MapReduce jobs
        is to write it to storage, which &ldquo;incurs substantial overheads due to data
        replication, disk I/O, and serialization&rdquo;.
      </p>
    ),
  },
  {
    id: "iterative",
    kicker: "Worse still",
    title: "Jobs that loop",
    body: (
      <p>
        Machine-learning algorithms pass over the same data again and again. With Hadoop, as the
        first Spark paper noted in 2010, &ldquo;each job must reload the data from disk, incurring a
        significant performance penalty.&rdquo; Interactive questions waited tens of seconds each.
      </p>
    ),
  },
  {
    id: "spark",
    kicker: "Spark",
    title: "Keep it in memory",
    body: (
      <p>
        Spark, started at UC Berkeley&apos;s AMPLab in 2009, keeps data in memory between steps and
        rebuilds lost pieces from a record of how they were made. Its 2012 paper, which won a best
        paper award, reported it &ldquo;up to 20× faster than Hadoop for iterative
        applications&rdquo;. This is <Term id="in-memory-processing">in-memory processing</Term>.
      </p>
    ),
  },
];

export function ManyHands() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Many hands</h2>
          <p className="text-muted mt-3 text-[15px]">
            Why processing big data means many machines, and why Spark keeps data in memory.
          </p>
        </div>
      }
    />
  );
}
