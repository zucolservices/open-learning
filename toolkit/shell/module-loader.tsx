"use client";

import { useEffect, useState } from "react";
import type { ModuleDef } from "@/lib/module-sdk";
import { moduleLoaders } from "@/modules/registry";
import { ModuleShell, type ModuleShellProps } from "./module-shell";

/** Fetches the module's own bundle only when its page is opened. */
export function ModuleLoader(props: Omit<ModuleShellProps, "def">) {
  const [def, setDef] = useState<ModuleDef>();
  const [error, setError] = useState(false);
  const load = moduleLoaders[`${props.track}/${props.module}`];

  useEffect(() => {
    load?.()
      .then((m) => setDef(m.default))
      .catch(() => setError(true));
  }, [load]);

  if (!load || error) {
    return (
      <div className="text-muted grid flex-1 place-items-center p-8 text-center">
        This module could not be loaded. Check your connection and refresh the page.
      </div>
    );
  }
  if (!def) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="border-line-strong border-t-accent size-8 animate-spin rounded-full border-2" />
      </div>
    );
  }
  return <ModuleShell {...props} def={def} />;
}
