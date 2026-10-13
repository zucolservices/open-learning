"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, INCOME, LANGS, STRINGS, type Fix, type Lang } from "./model";
import type { LangState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Signboard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The railway station board"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
          {["CHENNAI CENTRAL", "சென்னை சென்ட்ரல்", "चेन्नई सेंट्रल"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="bg-viz-compute/15 border-viz-compute/50 w-56 rounded-md border px-3 py-1.5 text-center text-sm font-semibold"
            >
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Station boards in India show the name in the local language, Hindi and English. Nobody
        thinks of it as a luxury: it&apos;s how everyone finds the right train.
      </p>
      <p>
        India&apos;s Constitution lists 22 <Term id="scheduled-languages">scheduled languages</Term>{" "}
        in a dozen scripts. Services reach people only in a language they read, which takes{" "}
        <Term id="unicode">Unicode</Term>, good fonts, careful translation and layouts that adapt.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Localise() {
  const [s, set] = useSceneState<LangState>();
  const lang = s.lang as Lang;
  const f = new Set(s.fixes as Fix[]);
  const t = STRINGS[lang];
  const show = (str: string, isButton = false) => {
    if (lang !== "en" && isButton && !f.has("all")) return STRINGS.en.submit;
    if (lang !== "en" && !f.has("unicode")) return "□".repeat(Math.min(14, [...str].length));
    return str;
  };
  const amount = f.has("numbers") ? new Intl.NumberFormat("en-IN").format(INCOME) : String(INCOME);
  const rtl = lang === "ur" && f.has("rtl");
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Localise the form"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <Segmented<Lang>
            size="sm"
            value={lang}
            onChange={(v) => set({ lang: v })}
            options={LANGS}
          />
          <div
            lang={t.locale.slice(0, 2)}
            dir={rtl ? "rtl" : "ltr"}
            className="border-line-strong bg-surface grid gap-2 rounded-xl border p-3"
          >
            {[t.name, t.income].map((label, i) => (
              <label key={i} className="grid gap-1">
                <span
                  className={cn(
                    "leading-relaxed",
                    !f.has("grow") && "block h-4 w-40 overflow-hidden leading-4 whitespace-nowrap",
                    rtl && "text-right",
                  )}
                >
                  {show(label)}
                </span>
                <span className="border-line bg-surface-2 rounded-md border px-2 py-1 font-mono text-[11px]">
                  {i === 0 ? "·········" : `₹ ${amount}`}
                </span>
              </label>
            ))}
            <span
              className={cn(
                "bg-accent text-accent-fg rounded-full px-3 py-1.5 text-center font-medium",
                rtl ? "justify-self-end" : "justify-self-start",
              )}
            >
              {show(t.submit, true)}
            </span>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {FIXES.map(([k, title, why]) => (
              <label
                key={k}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-2.5 py-1.5",
                  f.has(k) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={f.has(k)}
                  onChange={() =>
                    set({ fixes: f.has(k) ? s.fixes.filter((x) => x !== k) : [...s.fixes, k] })
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{title}</span>
                  <span className="text-muted block text-[11px]">{why}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Translations are illustrative; real ones need review by native speakers.
          </p>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s scholarship form must work in Hindi, Tamil and Urdu as well as English.
        Switch languages and see what breaks, then apply each fix.
      </p>
      <p>
        Try Tamil with labels fixed to the English width, and Urdu before and after switching the
        layout to right to left.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Scripts -------------------------------------------------------------------------------------- */

export function Scripts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Languages, scripts and the law"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "22 scheduled languages",
              "From Assamese to Urdu; the list last grew in 2003 with Bodo, Dogri, Maithili and Santali.",
            ],
            [
              "Many more spoken",
              "Census 2011 counted 121 languages with 10,000+ speakers. New data comes from Census 2027.",
            ],
            [
              "Hindi and English",
              "The Union's official languages. Central forms, notices and websites must be bilingual; states choose their own languages too.",
            ],
            [
              "Script isn't language",
              "Hindi and Marathi share Devanagari; Urdu uses Perso-Arabic script, right to left; Santali uses Ol Chiki.",
            ],
            [
              "Unicode and fonts",
              "Every Indian script has a Unicode block; free Noto fonts cover them all. Indic text needs proper shaping, so never split strings by character.",
            ],
            [
              "Numbers",
              "1 lakh = 1,00,000 and 1 crore = 1,00,00,000; browsers format these with the en-IN locale.",
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
        GIGW requires government sites to be bilingual, in Unicode, with a clear language switcher
        and every version updated at the same time.
      </p>
      <p>Mark each page and passage with its language, so screen readers pronounce it correctly.</p>
    </StepLayout>
  );
}

/* 4 ─ Bhashini ------------------------------------------------------------------------------------- */

export function Bhashini() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Translation at scale"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Bhashini", "India's national language platform, launched in July 2022 under MeitY."],
            [
              "What it offers",
              "Translation, speech recognition, text-to-speech, transliteration and OCR: text in 36 languages and voice in 23 (March 2026).",
            ],
            [
              "How much it's used",
              "Over 15 million requests a day and 500+ government websites (March 2026).",
            ],
            ["Typing", "InScript keyboards and transliteration: type “namaste” and get नमस्ते."],
            [
              "Keep a human in the loop",
              "Machine translation is a start. Legal and benefit wording needs review by people who know the language and the scheme.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
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
        Translating thousands of pages by hand into 22 languages isn&apos;t realistic. Platforms
        like <Term id="bhashini">Bhashini</Term> make a first draft cheap; people make it right.
      </p>
      <p>Voice matters as much as text: many people speak a language they don&apos;t read.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LangCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fine, or will it break?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-languages"
            prompt="Will each practice work across Indian languages, or break?"
            categories={[
              { id: "fine", label: "Works" },
              { id: "break", label: "Will break" },
            ]}
            items={[
              {
                id: "unicode",
                label: "Storing all text as Unicode",
                category: "fine",
                why: "Every script is covered.",
              },
              {
                id: "images",
                label: "Putting Hindi headings in images",
                category: "break",
                why: "Unsearchable, unreadable by screen readers, hard to update.",
              },
              {
                id: "width",
                label: "Fixing every label to the English text's width",
                category: "break",
                why: "Longer strings get cut off.",
              },
              {
                id: "rtl",
                label: "Setting right-to-left direction on Urdu pages",
                category: "fine",
                why: "Urdu reads right to left.",
              },
              {
                id: "split",
                label: "Cutting long names at a fixed number of characters",
                category: "break",
                why: "Indic characters combine; cuts can break letters apart.",
              },
            ]}
            explanation="Use Unicode text, flexible layouts and the right text direction, and handle Indic strings as shaped text, not as lists of characters."
          />
        </div>
      }
    >
      <p>Sort each practice.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Bilingual at least", "Hindi and English centrally; local languages too."],
        ["Unicode everywhere", "Never text in images or legacy fonts."],
        ["Flexible layouts", "Longer strings, right to left."],
        ["Indian formats", "Lakh, crore, ₹."],
        ["Machines draft, people review", "Bhashini plus native speakers."],
      ]}
    >
      <p>Next: where government systems may be hosted.</p>
    </WrapStep>
  );
}
