import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GlossaryList } from "@/components/glossary-list";
import { getTrack, tracks } from "@/catalogue";
import { sharedTerms, trackGlossaries, trackTerms } from "@/glossaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return tracks.filter((t) => trackGlossaries[t.slug]).map((t) => ({ track: t.slug }));
}

export async function generateMetadata(props: PageProps<"/tracks/[track]/glossary">) {
  const { track } = await props.params;
  return { title: `${getTrack(track)?.title} glossary` };
}

export default async function TrackGlossary(props: PageProps<"/tracks/[track]/glossary">) {
  const { track: slug } = await props.params;
  const track = getTrack(slug);
  if (!track) notFound();
  const own = trackTerms(slug);
  const general = sharedTerms();

  return (
    <div data-track={track.accent} className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="page-glow flex-1">
        <div className="mx-auto max-w-3xl px-4 pt-12 pb-24 sm:px-6">
          <Link
            href={`/tracks/${track.slug}`}
            className="text-muted hover:text-fg inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" /> {track.title}
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Glossary</h1>
          <p className="text-muted mt-3 text-lg text-pretty">
            Every {track.title} term in plain words, with the module that teaches it. Inside
            modules, any word with a dotted underline explains itself.
          </p>

          <section className="mt-10">
            <h2 className="text-sm font-medium">
              {track.title} <span className="text-subtle">· {own.length} terms</span>
            </h2>
            <div className="mt-4">
              <GlossaryList entries={own} track={track.slug} />
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-sm font-medium">
              General terms <span className="text-subtle">· shared by every track</span>
            </h2>
            <div className="mt-4">
              <GlossaryList entries={general} idPrefix="general-" />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
