/** Rebuild-per-environment vs build-once-and-promote, frame by frame (illustrative). */

export type Mode = "rebuild" | "promote";

export interface Env {
  name: string;
  /** Short content hash of what runs there, or null if nothing deployed yet. */
  hash: string | null;
  tested: boolean;
}

export interface Frame {
  title: string;
  text: string;
  envs: [Env, Env, Env];
  /** Builds made so far: hash and when. */
  builds: { hash: string; note: string }[];
  bad?: boolean;
}

const E = (name: string, hash: string | null, tested = false): Env => ({ name, hash, tested });

export const FRAMES: Record<Mode, Frame[]> = {
  rebuild: [
    {
      title: "Monday: build for test",
      text: "The pipeline builds commit a1b2c3 for the test environment. The dependency resolver picks image-lib 3.2.0.",
      envs: [E("Test", "7f3e"), E("Staging", null), E("Production", null)],
      builds: [{ hash: "7f3e", note: "Mon · image-lib 3.2.0" }],
    },
    {
      title: "Tests pass",
      text: "Every test passes on build 7f3e. Everyone relaxes: commit a1b2c3 is good.",
      envs: [E("Test", "7f3e", true), E("Staging", null), E("Production", null)],
      builds: [{ hash: "7f3e", note: "Mon · image-lib 3.2.0" }],
    },
    {
      title: "Wednesday: rebuild for staging",
      text: "The staging job builds the same commit again. Overnight image-lib 3.3.0 came out, so this build is different: hash c91d.",
      envs: [E("Test", "7f3e", true), E("Staging", "c91d"), E("Production", null)],
      builds: [
        { hash: "7f3e", note: "Mon · image-lib 3.2.0" },
        { hash: "c91d", note: "Wed · image-lib 3.3.0" },
      ],
    },
    {
      title: "Friday: rebuild for production",
      text: 'Production gets a third build, e05a, with yet another set of versions. Nobody ever tested e05a. When it breaks uploads, "but a1b2c3 passed!" is true and useless.',
      envs: [E("Test", "7f3e", true), E("Staging", "c91d"), E("Production", "e05a")],
      builds: [
        { hash: "7f3e", note: "Mon · image-lib 3.2.0" },
        { hash: "c91d", note: "Wed · image-lib 3.3.0" },
        { hash: "e05a", note: "Fri · image-lib 3.3.1" },
      ],
      bad: true,
    },
  ],
  promote: [
    {
      title: "Monday: build once",
      text: "The pipeline builds commit a1b2c3 once, names it payments-api 2.4.1 and pushes it to the artifact registry. Its content hash is 7f3e.",
      envs: [E("Test", null), E("Staging", null), E("Production", null)],
      builds: [{ hash: "7f3e", note: "Mon · 2.4.1 · image-lib 3.2.0" }],
    },
    {
      title: "Deploy to test",
      text: "Test pulls 2.4.1 from the registry and every test passes.",
      envs: [E("Test", "7f3e", true), E("Staging", null), E("Production", null)],
      builds: [{ hash: "7f3e", note: "Mon · 2.4.1 · image-lib 3.2.0" }],
    },
    {
      title: "Promote to staging",
      text: "Staging pulls the very same 2.4.1. Only its settings differ: staging's database address, staging's payment sandbox.",
      envs: [E("Test", "7f3e", true), E("Staging", "7f3e", true), E("Production", null)],
      builds: [{ hash: "7f3e", note: "Mon · 2.4.1 · image-lib 3.2.0" }],
    },
    {
      title: "Promote to production",
      text: "Production runs the exact bytes that passed test and staging. If it misbehaves, the difference is the environment, not the code: a much smaller place to look.",
      envs: [E("Test", "7f3e", true), E("Staging", "7f3e", true), E("Production", "7f3e", true)],
      builds: [{ hash: "7f3e", note: "Mon · 2.4.1 · image-lib 3.2.0" }],
    },
  ],
};

/** Semantic versioning: the next version for each kind of change. */
export type Bump = "patch" | "minor" | "major";

export function bump(v: [number, number, number], kind: Bump): [number, number, number] {
  const [M, m, p] = v;
  if (kind === "major") return [M + 1, 0, 0];
  if (kind === "minor") return [M, m + 1, 0];
  return [M, m, p + 1];
}

export const BUMPS: { id: Bump; label: string; commit: string; meaning: string }[] = [
  {
    id: "patch",
    label: "Fix a bug",
    commit: "fix: round fees half-up",
    meaning: 'PATCH: "backward compatible bug fixes"',
  },
  {
    id: "minor",
    label: "Add a feature",
    commit: "feat: refunds endpoint",
    meaning: 'MINOR: "functionality in a backward compatible manner"',
  },
  {
    id: "major",
    label: "Break the API",
    commit: "feat!: amounts are now in paise",
    meaning: 'MAJOR: "incompatible API changes"',
  },
];

/** Registries and how each keeps a published version from changing. */
export const REGISTRIES: { name: string; holds: string; immutable: string }[] = [
  {
    name: "Amazon ECR",
    holds: "container images",
    immutable: "Tag immutability (exceptions allowed since July 2025)",
  },
  {
    name: "Google Artifact Registry",
    holds: "images and packages",
    immutable: "Immutable tags option",
  },
  {
    name: "Azure Container Registry",
    holds: "container images",
    immutable: "Lock an image or tag (write-enabled false)",
  },
  {
    name: "Docker Hub · GitLab registry",
    holds: "container images",
    immutable: "Immutable tags (Docker Hub in beta; GitLab since 18.10)",
  },
  {
    name: "JFrog Artifactory · Sonatype Nexus",
    holds: "almost any format",
    immutable: "Repository settings; build promotion",
  },
  {
    name: "npm · PyPI · Maven Central",
    holds: "public packages",
    immutable: "A published version can never be replaced",
  },
];
