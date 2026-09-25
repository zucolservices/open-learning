import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategoryIcon } from "@/components/category/category-icon";
import { FeaturedTrack } from "@/components/track/featured-track";
import { categories, categoryTracks, getCategory, trackModules } from "@/catalogue";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/categories/[category]">) {
  const { category } = await props.params;
  const c = getCategory(category);
  return { title: c?.title, description: c?.summary };
}

export default async function CategoryPage(props: PageProps<"/categories/[category]">) {
  const { category: slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();

  const built = categoryTracks(category);
  const planned = category.tracks.filter((t) => !built.some((b) => b.slug === t.slug));
  const liveModules = built.reduce(
    (n, t) => n + trackModules(t).filter((m) => m.status === "live").length,
    0,
  );
  const others = categories.filter((c) => c.slug !== category.slug);

  return (
    <div data-track={category.accent} className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">
        <section className="page-glow">
          <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6">
            <Link
              href="/#categories"
              className="text-muted hover:text-fg inline-flex items-center gap-1.5 text-sm"
            >
              <ArrowLeft className="size-3.5" /> All categories
            </Link>
            <div className="mt-6 flex flex-wrap items-start gap-5">
              <span className="bg-accent-soft border-accent/40 text-accent grid size-14 shrink-0 place-items-center rounded-2xl border">
                <CategoryIcon slug={category.slug} className="size-7" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  {category.title}
                </h1>
                <p className="text-accent mt-2 text-lg">{category.summary}</p>
                <p className="text-muted mt-3 max-w-2xl text-pretty">{category.description}</p>
              </div>
            </div>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
              {[
                [category.tracks.length, "tracks planned"],
                [built.length, built.length === 1 ? "track live" : "tracks live"],
                [liveModules, "modules to explore"],
              ].map(([n, label]) => (
                <div key={label as string}>
                  <dt className="text-3xl font-semibold tracking-tight tabular-nums">{n}</dt>
                  <dd className="text-muted mt-0.5 text-xs">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-16 px-4 pt-8 pb-24 sm:px-6">
          {built.length > 0 ? (
            <section>
              <SectionTitle eyebrow="Live now" title="Start here" />
              <div className="mt-6 grid gap-6">
                {built.map((t) => (
                  <FeaturedTrack key={t.slug} track={t} />
                ))}
              </div>
            </section>
          ) : (
            <section className="border-line bg-surface/60 rounded-[var(--radius-card)] border border-dashed p-8 text-center">
              <p className="font-semibold tracking-tight">Nothing live here yet</p>
              <p className="text-muted mx-auto mt-2 max-w-md text-sm text-pretty">
                Tracks are built one at a time, each fully before the next. The ones below are
                planned for this category.
              </p>
            </section>
          )}

          {planned.length > 0 && (
            <section>
              <SectionTitle
                eyebrow="Coming next"
                title={built.length ? "More in this category" : "Planned tracks"}
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {planned.map((t) => (
                  <div
                    key={t.title}
                    className="border-line bg-surface/70 flex flex-col rounded-2xl border p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold tracking-tight">{t.title}</h3>
                      <span className="bg-surface-2 text-subtle shrink-0 rounded-full px-2 py-0.5 text-[11px]">
                        Planned
                      </span>
                    </div>
                    <p className="text-muted mt-1.5 text-sm">{t.blurb}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionTitle eyebrow="Keep exploring" title="Other categories" />
            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((c) => {
                const n = categoryTracks(c).length;
                return (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    data-track={c.accent}
                    className="group border-line bg-surface hover:border-accent/60 flex items-center gap-3 rounded-xl border px-4 py-3 transition"
                  >
                    <CategoryIcon slug={c.slug} className="text-accent size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.title}</span>
                    <span className="text-subtle text-xs">
                      {n ? `${n} live` : `${c.tracks.length} planned`}
                    </span>
                    <ArrowRight className="text-subtle group-hover:text-accent size-3.5 transition" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-muted text-sm font-medium">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}
