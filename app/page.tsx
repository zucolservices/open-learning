import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Ban,
  BookOpen,
  Code,
  Compass,
  Flag,
  Globe,
  Laptop,
  Lightbulb,
  MousePointerClick,
  Play,
  Sprout,
} from "lucide-react";
import { SiteHeader, REPO_URL } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContinueCard } from "@/components/progress-bits";
import { ExperienceDemos } from "@/components/home/experience-demos";
import { HeroDemo } from "@/components/home/hero-demo";
import { Catalogue } from "@/components/home/catalogue";
import { categories, trackMinutes, trackModules, visibleTracks } from "@/catalogue";
import { shared, trackGlossaries } from "@/glossaries";

export default function Home() {
  const liveTracks = visibleTracks.filter((t) => trackModules(t).some((m) => m.status === "live"));
  const moduleCount = liveTracks.reduce(
    (n, t) => n + trackModules(t).filter((m) => m.status === "live").length,
    0,
  );
  const hours = Math.round(liveTracks.reduce((n, t) => n + trackMinutes(t), 0) / 60);
  const terms =
    Object.keys(shared).length +
    Object.values(trackGlossaries).reduce((n, g) => n + Object.keys(g).length, 0);
  const plannedTracks = categories.reduce((n, c) => n + c.tracks.length, 0);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section data-track="blueprint" className="page-glow relative">
          <div
            aria-hidden
            className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-40"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:pt-20">
            <div>
              <p className="border-line bg-surface/70 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur">
                <span className="bg-accent size-1.5 animate-pulse rounded-full" />
                Free and open source · {liveTracks.length} tracks live
              </p>
              <h1 className="mt-5 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
                See how technology{" "}
                <span className="from-accent via-viz-data to-viz-meta bg-gradient-to-r bg-clip-text text-transparent">
                  actually works.
                </span>
              </h1>
              <p className="text-muted mt-5 max-w-lg text-lg text-pretty">
                Don&apos;t just read about systems. Take them apart, run them, break them and fix
                them. Every module is a short, hands-on experience built around one idea, starting
                from zero.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#categories"
                  className="bg-accent text-accent-fg inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:brightness-110"
                >
                  Browse the tracks <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/tracks/playground/rows-vs-columns"
                  className="border-line-strong hover:bg-surface inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition"
                >
                  <Play className="size-3.5" /> Try a 5-minute sample
                </Link>
              </div>
              <dl className="border-line mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t pt-6 sm:grid-cols-4">
                {[
                  [String(liveTracks.length), "tracks"],
                  [String(moduleCount), "modules"],
                  [`~${hours}`, "hours of learning"],
                  [terms.toLocaleString("en-IN"), "glossary terms"],
                ].map(([n, label]) => (
                  <div key={label}>
                    <dt className="text-3xl font-semibold tracking-tight tabular-nums">{n}</dt>
                    <dd className="text-muted mt-0.5 text-xs">{label}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 max-w-lg empty:hidden">
                <ContinueCard />
              </div>
            </div>
            <HeroDemo />
          </div>
        </section>

        {/* Anatomy of a module */}
        <section className="border-line bg-surface/40 border-y">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionHeading
              eyebrow="Inside every module"
              title="One idea, six steps, about 25 minutes."
              body="Each module follows the same rhythm, so you always know where you are. Jargon is underlined: tap a word for a plain-English definition."
            />
            <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s, n) => (
                <li
                  key={s.title}
                  className="border-line bg-surface relative rounded-2xl border p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-accent-soft text-accent grid size-8 place-items-center rounded-lg">
                      <s.Icon className="size-4" />
                    </span>
                    <span className="text-subtle text-xs tabular-nums">{s.n ?? n + 1}</span>
                  </div>
                  <p className="mt-3 font-semibold tracking-tight">{s.title}</p>
                  <p className="text-muted mt-1 text-sm text-pretty">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Catalogue */}
        <section id="categories" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 pb-8 sm:px-6">
          <SectionHeading
            eyebrow="The catalogue"
            title={`${liveTracks.length} tracks you can start today.`}
            body={`${plannedTracks} tracks are planned across ${categories.length} categories. Take a track in order, or dip into any module that looks useful.`}
          />
          <div className="mt-8">
            <Catalogue />
          </div>
        </section>

        {/* Experience types */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6">
          <SectionHeading
            eyebrow="How you'll learn"
            title="The format fits the idea."
            body="A 3D model when structure matters. A simulation when trade-offs matter. A broken system when judgement matters. Short explanations sit right next to them."
          />
          <div className="mt-8">
            <ExperienceDemos />
          </div>
        </section>

        {/* Principles */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <SectionHeading eyebrow="What we believe" title="Built for understanding, not points." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Principle Icon={Ban} title="No scores, no exams">
              Checkpoints explain why an answer is right or wrong, and you can always try again.
              Nothing is graded.
            </Principle>
            <Principle Icon={Sprout} title="Starts from zero">
              Every module opens with an everyday story and assumes nothing beyond its listed
              prerequisites.
            </Principle>
            <Principle Icon={Globe} title="Vendor-neutral">
              Open standards first, then how AWS, Google Cloud, Azure and open-source tools each do
              it.
            </Principle>
            <Principle Icon={Laptop} title="No account needed">
              Everything runs in your browser. Progress is saved on your device, and nowhere else.
            </Principle>
          </div>
        </section>

        {/* Open source CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div
            data-track="blueprint"
            className="border-line bg-surface page-glow relative overflow-hidden rounded-[var(--radius-card)] border px-6 py-12 text-center sm:px-12"
          >
            <div
              aria-hidden
              className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-30"
            />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Open source, and open to ideas.
              </h2>
              <p className="text-muted mx-auto mt-3 max-w-xl text-pretty">
                OpenLearning is a static site you can read, run and learn from. Found a mistake or
                want a topic covered? Open an issue.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a
                  href={REPO_URL}
                  className="bg-accent text-accent-fg inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:brightness-110"
                >
                  <Code className="size-4" /> View on GitHub
                </a>
                <Link
                  href="/glossary"
                  className="border-line-strong hover:bg-surface-2 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition"
                >
                  <BookOpen className="size-4" /> Browse the glossary
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

const STEPS = [
  {
    Icon: BookOpen,
    title: "The story",
    body: "An everyday analogy that gives you the big idea before any mechanics.",
  },
  {
    Icon: MousePointerClick,
    title: "The centrepiece",
    body: "One interactive you drive yourself: a simulation, a 3D model or a sandbox.",
  },
  {
    Icon: Compass,
    title: "Two explorations",
    body: "Variations and edge cases that show where the idea bends and breaks.",
    n: "3–4",
  },
  {
    Icon: Lightbulb,
    title: "A checkpoint",
    body: "Predict or explain. Every answer comes with the reasoning, right or wrong.",
    n: 5,
  },
  {
    Icon: Flag,
    title: "The wrap-up",
    body: "What to remember, which terms you met and where to go next.",
    n: 6,
  },
];

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-accent text-sm font-medium">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {body && <p className="text-muted mt-3 text-pretty">{body}</p>}
    </div>
  );
}

function Principle({
  Icon,
  title,
  children,
}: {
  Icon: typeof Ban;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-5">
      <Icon className="text-accent size-5" />
      <p className="mt-3 font-semibold tracking-tight">{title}</p>
      <p className="text-muted mt-1 text-sm text-pretty">{children}</p>
    </div>
  );
}
