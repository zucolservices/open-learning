/**
 * Clone strategies for a made-up large repository. All sizes and times are ILLUSTRATIVE, to show
 * proportions; real numbers depend on the repository and network.
 */

export type Way = "full" | "shallow" | "partial" | "sparse";

export const WAYS: {
  id: Way;
  label: string;
  cmd: string;
  gb: number;
  minutes: number;
  history: string;
  files: string;
  note: string;
}[] = [
  {
    id: "full",
    label: "Full clone",
    cmd: "git clone <url>",
    gb: 40,
    minutes: 45,
    history: "All 20 years, offline",
    files: "All 2 million",
    note: "Everything, everywhere. Simple, but slow and huge.",
  },
  {
    id: "shallow",
    label: "Shallow",
    cmd: "git clone --depth 1 <url>",
    gb: 4,
    minutes: 5,
    history: "Only the latest commit",
    files: "All 2 million",
    note: "Great for CI builds that just need today's code. Log, blame and bisect don't work until you --unshallow.",
  },
  {
    id: "partial",
    label: "Partial (blobless)",
    cmd: "git clone --filter=blob:none <url>",
    gb: 3,
    minutes: 4,
    history: "All commits and trees; file contents fetched when needed",
    files: "Current files downloaded",
    note: "Full history for log, but old file versions are downloaded on demand. Needs the server to support it.",
  },
  {
    id: "sparse",
    label: "Partial + sparse checkout",
    cmd: "git clone --filter=blob:none --sparse <url>\ngit sparse-checkout set apps/menu",
    gb: 0.4,
    minutes: 1,
    history: "All commits; contents on demand",
    files: "Only apps/menu (cone mode)",
    note: "You see only the folders you work on. This is roughly what Scalar sets up for you.",
  },
];

export const MAX_GB = 40;
