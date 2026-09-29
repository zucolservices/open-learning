"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code, FrameCaption } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import { TOOLS, type ToolGroup } from "./tools";
import type { ParsingState } from "./state";

/* eslint-disable @next/next/no-img-element -- static export: plain images from /public */

/* 1 ─ Ink on paper -------------------------------------------------------------------------------- */

export function InkOnPaper() {
  const [s, set] = useSceneState<ParsingState>();
  const across = s.read === "across";
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Ink on paper"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={across ? "across" : "down"}
            options={[
              ["across", "Read straight across the page"],
              ["down", "Read down each column"],
            ]}
            onChange={(v) => set({ read: v })}
          />
          <div className="border-line relative mx-auto w-full max-w-lg overflow-hidden rounded-lg border bg-white">
            <img
              src="/rag/parsing/two-column.png"
              alt="A two-column circular"
              className="block w-full"
            />
            {across ? (
              <motion.div
                key="across"
                className="bg-accent/25 border-accent absolute inset-x-0 h-[7%] border-y"
                initial={{ top: "22%" }}
                animate={{ top: ["22%", "90%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <motion.div
                key="down"
                className="bg-accent/25 border-accent absolute h-[7%] w-[46%] border-y"
                initial={{ top: "22%", left: "3%" }}
                animate={{ top: ["22%", "90%", "22%", "90%"], left: ["3%", "3%", "51%", "51%"] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.49, 0.5, 1],
                }}
              />
            )}
          </div>
          <FrameCaption
            frameKey={across ? "a" : "d"}
            title={across ? "Two topics, braided together" : "What a person does"}
            tone={across ? "bad" : "good"}
          >
            {across
              ? "Line 1 of the left column, then line 1 of the right, then line 2 of the left… The sentences about drains and water supply end up interleaved."
              : "Finish the left column, then start the right. The file doesn't say which order is right: the reader has to work it out from the layout."}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A PDF isn&apos;t a list of paragraphs. It&apos;s closer to instructions for a printer:
        &ldquo;put these letters at this spot on the page&rdquo;. Unless the file was saved with
        extra structure tags (most aren&apos;t), nothing says which column comes first or where a
        table cell ends.
      </p>
      <p>
        So getting text out, called <Term id="parsing">parsing</Term>, is guesswork on anything but
        the simplest layouts. And a RAG system can never be better than what it read: if the text is
        scrambled here, every later stage inherits the mess.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three documents ⭐ (fix the problem, real extraction output) ----------------------------- */

type DocId = ParsingState["doc"];

const DOCS: Record<
  DocId,
  {
    tab: string;
    img: string;
    alt: string;
    naive: string;
    naiveHow: string;
    options: [string, string, boolean][];
    fixLabel: string;
    impact: string;
  }
> = {
  two: {
    tab: "Two columns",
    img: "/rag/parsing/two-column.png",
    alt: "A two-column circular about drains and water supply",
    naive: data.two_naive,
    naiveHow: "Sort every word top to bottom, then left to right",
    options: [
      ["across", "It read straight across both columns, line by line", true],
      ["image", "The PDF has no text, only a picture", false],
      ["font", "The font doesn't encode the letters properly", false],
    ],
    fixLabel:
      "Column-aware extraction (Poppler's pdftotext, default mode). The order is right, but look: one justified line split into single words, and “low-lying” lost its hyphen. Even good tools leave debris to clean up.",
    impact:
      "A chunk from the naive text braids drains and water together, so a question about tankers retrieves a passage that's half about garbage fines.",
  },
  table: {
    tab: "Table",
    img: "/rag/parsing/table.png",
    alt: "A property tax table with four zones",
    naive: data.table_naive,
    naiveHow: "Plain text in content order (pdftotext -raw)",
    options: [
      ["across", "It read across two columns of prose", false],
      ["headers", "The numbers were separated from their column headers", true],
      ["ocr", "The characters were misread by OCR", false],
    ],
    fixLabel: "Table extraction (pdfplumber), each row written with its headers",
    impact:
      "Ask “What is the penalty in zone C?”: the naive chunk has “1.5% per month” with no label next to it. Written row by row with headers, each chunk carries its own meaning.",
  },
  scan: {
    tab: "Scanned notice",
    img: "/rag/parsing/scan.png",
    alt: "A slightly tilted scan of a Hindi and English notice about dry waste",
    naive: data.scan_text_layer.trim() || "(nothing: the file contains no text)",
    naiveHow: "Read the PDF's text layer (pdftotext)",
    options: [
      ["headers", "The table headers were lost", false],
      ["image", "There's no text in the file, only a picture of the page", true],
      ["hindi", "PDFs can't hold Hindi text", false],
    ],
    fixLabel: "Optical character recognition (Tesseract 5.5)",
    impact:
      "Without OCR this notice is invisible to search. With OCR, check the numbers: in the English line of both runs, “₹200” came out as “2200”.",
  },
};

function tableAsSentences(rows: string[][]) {
  const [head, ...body] = rows.map((r) => r.map((c) => c.replace(/\n/g, " ")));
  return body
    .map(
      (r) =>
        `Zone ${r[0]}: ${head[1].toLowerCase()} ${r[1]}; ${head[2].toLowerCase()} ${r[2]}; ${head[3].toLowerCase()} ${r[3]}.`,
    )
    .join("\n");
}

function Mark({ text, bad }: { text: string; bad: string[] }) {
  if (!bad.length) return <>{text}</>;
  const re = new RegExp(
    `(${bad.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  return (
    <>
      {text.split(re).map((p, i) =>
        bad.includes(p) ? (
          <mark key={i} className="bg-bad/25 text-fg rounded px-0.5">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function ThreeDocs() {
  const [s, set] = useSceneState<ParsingState>();
  const d = DOCS[s.doc];
  const picked = s.diag[s.doc];
  const pickedOpt = d.options.find((o) => o[0] === picked);
  const fixed = s.fixed[s.doc];
  const fixedText =
    s.doc === "two"
      ? data.two_layout.trim()
      : s.doc === "table"
        ? tableAsSentences(data.table_rows as string[][])
        : s.ocr === "eng"
          ? data.ocr_eng.trim()
          : data.ocr_hin_eng.trim();
  return (
    <StepLayout
      eyebrow="Fix the problem · real output"
      title="Three documents, three failures"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.doc}
            options={(Object.keys(DOCS) as DocId[]).map((k) => [k, DOCS[k].tab] as [DocId, string])}
            onChange={(v) => set({ doc: v })}
          />
          <motion.div
            key={s.doc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3"
          >
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="border-line overflow-hidden rounded-lg border bg-white">
                <img src={d.img} alt={d.alt} className="block w-full" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-muted text-[11px]">What a naive extractor got · {d.naiveHow}</p>
                <Code className="max-h-56 overflow-y-auto whitespace-pre-wrap">{d.naive}</Code>
              </div>
            </div>
            <div>
              <p className="text-muted mb-1 text-xs">What went wrong?</p>
              <div className="flex flex-col gap-1.5">
                {d.options.map(([id, label, ok]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={picked === id}
                    onClick={() => set({ diag: { ...s.diag, [s.doc]: id } })}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                      picked === id
                        ? ok
                          ? "border-good bg-good/10"
                          : "border-bad bg-bad/10"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {picked === id &&
                      (ok ? (
                        <Check className="size-3.5 shrink-0" />
                      ) : (
                        <X className="size-3.5 shrink-0" />
                      ))}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {pickedOpt && !fixed && (
              <button
                type="button"
                onClick={() =>
                  set({
                    fixed: { ...s.fixed, [s.doc]: true },
                    ocr: s.doc === "scan" ? "eng" : s.ocr,
                  })
                }
                className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
              >
                Apply the fix
              </button>
            )}
            {fixed && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-muted text-[11px]">{d.fixLabel}</p>
                {s.doc === "scan" && (
                  <Segmented
                    size="sm"
                    value={s.ocr === "none" ? "eng" : s.ocr}
                    options={[
                      ["eng", "OCR in English only"],
                      ["hin", "OCR in Hindi + English"],
                    ]}
                    onChange={(v) => set({ ocr: v })}
                  />
                )}
                <Code className="max-h-56 overflow-y-auto whitespace-pre-wrap">
                  <Mark text={fixedText} bad={s.doc === "scan" ? ["2200"] : []} />
                </Code>
                <p className="border-accent border-l-2 pl-3 text-xs">{d.impact}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Three documents from Kalpanagar, each run through a simple extractor and then a better one.
        Every output here is real, produced by real tools on these pages.
      </p>
      <p>For each one: read what came out, decide what went wrong, then apply the fix.</p>
      <p className="text-muted text-sm">
        The scan has no <Term id="text-layer">text layer</Term>, so it needs{" "}
        <Term id="ocr">OCR</Term>: reading letters from the picture. Look at what English-only OCR
        does to Hindi, and what both runs do to the rupee sign.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The parsing toolbox ------------------------------------------------------------------------ */

const GROUPS: [ToolGroup, string, string][] = [
  ["library", "Open-source libraries", "Run them yourself; free, but you tune them"],
  ["managed", "Managed cloud services", "Pay per page; strong on forms, tables and scans"],
  ["vision", "Vision-language models", "A model reads the page image directly"],
];

export function Toolbox() {
  const [s, set] = useSceneState<ParsingState>();
  const tool = TOOLS.find((t) => t.name === s.tool);
  return (
    <StepLayout
      eyebrow="Explore"
      title="The parsing toolbox"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          {GROUPS.map(([g, title, sub]) => (
            <div key={g} className="border-line bg-surface rounded-xl border p-3">
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-muted text-[11px]">{sub}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TOOLS.filter((t) => t.group === g).map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    aria-pressed={s.tool === t.name}
                    onClick={() => set({ tool: t.name })}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs",
                      s.tool === t.name
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface-2 hover:bg-surface",
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <FrameCaption
            frameKey={tool?.name ?? "none"}
            title={tool ? `${tool.name} · ${tool.by}` : "Tap a tool"}
          >
            {tool ? tool.note : "Each group trades control, cost and quality differently."}
          </FrameCaption>
        </div>
      }
    >
      <p>
        You rarely write a parser yourself. The choice is usually between an open-source library, a
        managed cloud service, or a vision-language model that reads page images.
      </p>
      <p>
        Test candidates on <em>your</em> documents: your scans, your tables, your languages. A tool
        that is excellent on English research papers can struggle with a stamped Hindi circular.
      </p>
      <p className="text-muted text-sm">
        Hindi has two traps. Old office files typed in <Term id="legacy-font">legacy fonts</Term>{" "}
        such as Kruti Dev store Latin letters that merely look like Devanagari, so they extract as
        gibberish and need a converter. Even Unicode Hindi can come out with vowel signs in the
        wrong place. When the text layer can&apos;t be trusted, OCR the page image instead.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which fix? ------------------------------------------------------------------------------------ */

export function WhichFix() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which fix?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="parse-fix"
            prompt="Match each symptom to the fix it needs."
            categories={[
              { id: "order", label: "Reading order" },
              { id: "table", label: "Table extraction" },
              { id: "ocr", label: "OCR" },
              { id: "font", label: "Font conversion" },
            ]}
            items={[
              {
                id: "braid",
                label: "Search results contain half-sentences about two unrelated topics",
                category: "order",
                why: "Classic multi-column interleaving: extract in column order.",
              },
              {
                id: "labels",
                label: "Retrieved passages contain numbers with nothing saying what they are",
                category: "table",
                why: "Table cells lost their headers: extract the table and keep headers with each row.",
              },
              {
                id: "invisible",
                label: "A signed circular never shows up in search at all",
                category: "ocr",
                why: "It's probably a scan with no text layer: run OCR, and check the numbers.",
              },
              {
                id: "gibberish",
                label: "Hindi text from an old office PDF comes out as Latin gibberish",
                category: "font",
                why: "Typed in a legacy non-Unicode font: the file stores Latin letters drawn as Devanagari. Convert to Unicode.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Four symptoms you&apos;ll meet in real projects. Which fix does each one need?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Garbage in, garbage out", "Retrieval can't find what parsing scrambled or missed."],
  ["Layout is information", "Columns, tables and headings carry meaning; keep it."],
  ["Scans need OCR", "And OCR needs checking, especially numbers and currency."],
  ["Test on your documents", "Your scans, tables and languages decide the right tool."],
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
        Look at your extracted text before building anything else. Ten minutes reading raw output
        often saves weeks of tuning retrieval.
      </p>
      <p>Next: cutting the clean text into chunks.</p>
    </StepLayout>
  );
}
