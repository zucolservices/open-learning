import { notFound } from "next/navigation";
import { getModule, trackModules, tracks } from "@/catalogue";
import { ModuleLoader } from "@/toolkit/shell/module-loader";
import { PlannedModule } from "@/components/planned-module";

export const dynamicParams = false;

export function generateStaticParams() {
  return tracks.flatMap((t) => trackModules(t).map((m) => ({ track: t.slug, module: m.slug })));
}

export async function generateMetadata(props: PageProps<"/tracks/[track]/[module]">) {
  const { track, module } = await props.params;
  return { title: getModule(track, module)?.module.title };
}

export default async function ModulePage(props: PageProps<"/tracks/[track]/[module]">) {
  const params = await props.params;
  const found = getModule(params.track, params.module);
  if (!found) notFound();
  const { track, module, index } = found;
  const next = trackModules(track)[index + 1];

  return (
    <div data-track={track.accent} className="flex flex-1 flex-col">
      {module.status === "live" ? (
        <ModuleLoader
          track={track.slug}
          trackTitle={track.title}
          module={module.slug}
          title={module.title}
          next={next ? { slug: next.slug, title: next.title } : undefined}
        />
      ) : (
        <PlannedModule track={track} module={module} number={index + 1} />
      )}
    </div>
  );
}
