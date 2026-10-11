"use client";

import { useEffect, useState } from "react";
import { blobId, commitId, treeId, type FileEntry } from "./model";

export interface Snapshot {
  files: { name: string; blob: string }[];
  tree: string;
  commit: string;
}

/** Computes real object IDs for a list of files (async, via Web Crypto). */
export function useSnapshot(
  files: FileEntry[],
  parent: string | null,
  msg: string,
): Snapshot | null {
  const key = JSON.stringify([files, parent, msg]);
  const [snap, setSnap] = useState<{ key: string; value: Snapshot } | null>(null);
  useEffect(() => {
    let live = true;
    (async () => {
      const t = await treeId(files);
      const commit = await commitId(t.id, parent, msg);
      if (live) setSnap({ key, value: { files: t.entries, tree: t.id, commit } });
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return snap && snap.key === key ? snap.value : null;
}

export { blobId };
