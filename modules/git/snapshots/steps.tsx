"use client";

import { motion } from "motion/react";
import { Camera, FileText, FolderTree, GitCommitHorizontal } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { START, type FileEntry } from "./model";
import { useSnapshot, type Snapshot } from "./use-objects";
import type { SnapState } from "./state";

const short = (id?: string) => (id ? id.slice(0, 7) : "…");

/* 1 ─ Story: the photo album ----------------------------------------------------------------------- */

export function PhotoAlbum() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Photos, not a diary"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex gap-2">
            {["Mon", "Tue", "Wed"].map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, rotate: -4 + i * 4 }}
                animate={{ opacity: 1, rotate: -3 + i * 3 }}
                transition={{ delay: 0.15 * i }}
                className="border-line bg-surface flex w-24 flex-col items-center rounded-lg border p-2 shadow-sm"
              >
                <Camera className="text-accent size-6" />
                <p className="mt-1 font-mono text-[10px]">{d}</p>
                <p className="text-muted text-[10px]">the whole room</p>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle max-w-xs text-center text-[11px]">
            Each photo shows everything. Identical furniture? The album keeps one print and points
            to it.
          </p>
        </div>
      }
    >
      <p>
        You could record a room&apos;s changes in a diary: &ldquo;moved the lamp, added a
        chair&rdquo;. Or you could take a photo of the whole room each day. To see Wednesday, you
        just look at Wednesday&apos;s photo.
      </p>
      <p>
        Git takes photos. Each <Term id="commit">commit</Term> is a{" "}
        <Term id="snapshot">snapshot</Term> of every file. It stays small because anything that
        didn&apos;t change is stored once and simply pointed to again. Every piece is filed under a{" "}
        <Term id="content-hash">hash of its content</Term>.
      </p>
    </StepLayout>
  );
}

/* shared view: files → blobs → tree → commit -------------------------------------------------------- */

function ObjectsView({
  snap,
  reused = new Set<string>(),
}: {
  snap: Snapshot | null;
  reused?: Set<string>;
}) {
  const blobs = [...new Set(snap?.files.map((f) => f.blob) ?? [])];
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <div className="grid content-start gap-1">
        <p className="text-muted flex items-center gap-1 text-[10px] uppercase">
          <FileText className="size-3" /> Blobs · {blobs.length}
        </p>
        {blobs.map((b) => (
          <div
            key={b}
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[10px]",
              reused.has(b) ? "border-line text-subtle" : "border-viz-data/60 bg-viz-data/10",
            )}
          >
            {short(b)} {reused.has(b) && "· reused"}
          </div>
        ))}
      </div>
      <div className="grid content-start gap-1">
        <p className="text-muted flex items-center gap-1 text-[10px] uppercase">
          <FolderTree className="size-3" /> Tree
        </p>
        <div className="border-viz-meta/60 bg-viz-meta/10 rounded-md border px-2 py-1 font-mono text-[10px]">
          <p className="font-semibold">{short(snap?.tree)}</p>
          {snap?.files.map((f) => (
            <p key={f.name} className="text-muted">
              {short(f.blob)} {f.name}
            </p>
          ))}
        </div>
      </div>
      <div className="grid content-start gap-1">
        <p className="text-muted flex items-center gap-1 text-[10px] uppercase">
          <GitCommitHorizontal className="size-3" /> Commit
        </p>
        <div className="border-accent/60 bg-accent-soft rounded-md border px-2 py-1 font-mono text-[10px]">
          <p className="font-semibold">{short(snap?.commit)}</p>
          <p className="text-muted">tree {short(snap?.tree)}</p>
          <p className="text-muted">author Kavya</p>
        </div>
      </div>
    </div>
  );
}

/* 2 ─ Build a commit by hand ⭐ -------------------------------------------------------------------- */

const MENUS = ["<h1>Menu</h1>\n", "<h1>Menu</h1>\n<p>Masala chai</p>\n", "<h1>About us</h1>\n"];

export function BuildCommit() {
  const [s, set] = useSceneState<SnapState>();
  const files: FileEntry[] = [
    START[0],
    { name: "menu.html", content: s.menu },
    { name: "about.html", content: s.copyAbout ? s.menu : START[2].content },
  ];
  const snap = useSnapshot(files, null, "First menu");
  return (
    <StepLayout
      eyebrow="Build"
      title="Build a commit by hand"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {files.map((f) => (
              <div
                key={f.name}
                className="border-line bg-surface grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs"
              >
                <span className="font-mono">{f.name}</span>
                <code className="text-muted truncate text-[10px]">{JSON.stringify(f.content)}</code>
                <span className="text-accent text-right font-mono text-[10px]">
                  {short(snap?.files.find((x) => x.name === f.name)?.blob)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-muted self-center text-[10px] uppercase">menu.html says:</span>
            {MENUS.map((m, i) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.menu === m}
                onClick={() => set({ menu: m })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.menu === m
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {["Original", "Add masala chai", "Same as About"][i]}
              </button>
            ))}
            <label className="flex items-center gap-1.5 text-[11px]">
              <input
                type="checkbox"
                checked={s.copyAbout}
                onChange={(e) => set({ copyAbout: e.target.checked })}
                className="accent-accent"
              />
              Make about.html a copy of menu.html
            </label>
          </div>
          <ObjectsView snap={snap} />
          <p className="text-subtle text-[10px]">
            Real SHA-1 IDs, computed in your browser the way Git computes them (shortened to 7
            characters).
          </p>
        </div>
      }
    >
      <p>
        Each file&apos;s content becomes a <Term id="blob">blob</Term>, named by the SHA-1 hash of
        the bytes <code>blob &lt;size&gt;\0</code> plus the content. A <Term id="tree">tree</Term>{" "}
        lists names and the blobs they point to, and the commit points to the tree.
      </p>
      <p>
        Change menu.html and watch its blob ID change, and with it the tree and the commit. Make two
        files identical and they share one blob: Git stores the content once. Names live in the
        tree, not the blob.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The second snapshot -------------------------------------------------------------------------- */

export function SecondSnapshot() {
  const [s, set] = useSceneState<SnapState>();
  const first = useSnapshot(START, null, "First menu");
  const files2 = s.edited
    ? [START[0], { name: "menu.html", content: "<h1>Menu</h1>\n<p>Masala chai</p>\n" }, START[2]]
    : START;
  const second = useSnapshot(files2, first?.commit ?? null, "Add masala chai");
  const old = new Set(first?.files.map((f) => f.blob) ?? []);
  const reused = new Set((second?.files ?? []).map((f) => f.blob).filter((b) => old.has(b)));
  return (
    <StepLayout
      eyebrow="Explore"
      title="The second snapshot"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.edited}
              onChange={(e) => set({ edited: e.target.checked })}
              className="accent-accent"
            />
            Edit menu.html, then commit again
          </label>
          <ObjectsView snap={second} reused={reused} />
          <p className="text-xs">
            New objects this commit:{" "}
            <strong>{(second ? second.files.length - reused.size : 0) + 2}</strong> (blobs that
            changed, a new tree, a new commit). The commit also records its parent,{" "}
            <code className="font-mono">{short(first?.commit)}</code>.
          </p>
        </div>
      }
    >
      <p>
        The second commit is a full snapshot too, but most of it is pointers to what&apos;s already
        stored. Only the changed file gets a new blob; the others are reused.
      </p>
      <p>
        On disk, Git goes further: it packs objects into packfiles and stores similar ones as
        deltas. So it&apos;s snapshots in the model you work with, and compression underneath.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The hash ------------------------------------------------------------------------------------- */

export function TheHash() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="A fingerprint for every object"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Same content, same ID, anywhere",
              '"hello\\n" is ce013625… on every computer in the world.',
            ],
            [
              "Change one byte, new ID",
              "And because commits include their parent's ID, history can't be quietly edited.",
            ],
            [
              "SHA-1 today, hardened",
              "After a public SHA-1 collision in 2017, Git added collision detection (Git 2.13).",
            ],
            [
              "SHA-256 available",
              "New repositories can use SHA-256, with 64-character IDs. Mixing SHA-1 and SHA-256 repositories isn't possible yet.",
            ],
            [
              "Git 3.0 plans",
              "SHA-256 as the default for new repositories. No release date has been set.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Naming objects by a hash of their content means Git can check its own data: if a file on
        disk doesn&apos;t match its name, something is corrupt. It also means two repositories can
        tell which objects they share just by comparing names.
      </p>
      <p>
        You&apos;ll usually see the first seven or so characters of an ID. Git accepts any unique
        prefix.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SnapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="True or false?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-snapshots"
            prompt="Is each statement about Git's object model true?"
            categories={[
              { id: "true", label: "True" },
              { id: "false", label: "False" },
            ]}
            items={[
              {
                id: "snap",
                label: "A commit stores a snapshot of every file",
                category: "true",
                why: "Through its tree, it points to every blob.",
              },
              {
                id: "diff",
                label: "A commit stores only the lines that changed",
                category: "false",
                why: "Git stores snapshots; deltas are only a storage trick in packfiles.",
              },
              {
                id: "dedupe",
                label: "Two identical files are stored as one blob",
                category: "true",
                why: "Same content, same ID.",
              },
              {
                id: "name",
                label: "A blob knows its file name",
                category: "false",
                why: "Names live in the tree.",
              },
              {
                id: "edit",
                label: "Changing an old commit's message keeps its ID",
                category: "false",
                why: "Any change gives a new ID.",
              },
              {
                id: "256",
                label: "Git can already create SHA-256 repositories",
                category: "true",
                why: "Yes; it's not yet the default.",
              },
            ]}
            explanation="Commits point to trees, trees point to blobs, and every object is named by a hash of its content."
          />
        </div>
      }
    >
      <p>Sort each statement.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Snapshots, not diffs", "Every commit is a whole-project photo."],
        ["Blobs, trees, commits", "Content, folders and history."],
        ["Named by content", "Same content, same ID; any change, new ID."],
        ["Stored once", "Unchanged files are reused, not copied."],
        ["SHA-1 now, SHA-256 coming", "Planned as the default for new repositories in Git 3.0."],
      ]}
    >
      <p>Next: the three places a change passes through on its way into a commit.</p>
    </WrapStep>
  );
}
