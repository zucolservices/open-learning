/**
 * Real Git object IDs, computed in the browser with SHA-1 over Git's exact object format:
 * "<type> <size>\0<content>". Trees and commits are built the way Git builds them, so the IDs shown
 * match what `git hash-object` and `git commit` would produce for the same content, author and time.
 */

const enc = new TextEncoder();

async function sha1(bytes: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", bytes as BufferSource);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function object(type: string, body: Uint8Array): Promise<string> {
  return sha1(concat([enc.encode(`${type} ${body.length}\0`), body]));
}

export const blobId = (content: string) => object("blob", enc.encode(content));

export interface FileEntry {
  name: string;
  content: string;
}

export async function treeId(
  files: FileEntry[],
): Promise<{ id: string; entries: { name: string; blob: string }[] }> {
  const entries = await Promise.all(
    files.map(async (f) => ({ name: f.name, blob: await blobId(f.content) })),
  );
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const body = concat(
    entries.flatMap((e) => [enc.encode(`100644 ${e.name}\0`), hexToBytes(e.blob)]),
  );
  return { id: await object("tree", body), entries };
}

export const AUTHOR = "Kavya <kavya@cafe.example> 1760000000 +0530";

export async function commitId(tree: string, parent: string | null, msg: string): Promise<string> {
  const text = `tree ${tree}\n${parent ? `parent ${parent}\n` : ""}author ${AUTHOR}\ncommitter ${AUTHOR}\n\n${msg}\n`;
  return object("commit", enc.encode(text));
}

export const START: FileEntry[] = [
  { name: "README.md", content: "Cafe website\n" },
  { name: "menu.html", content: "<h1>Menu</h1>\n" },
  { name: "about.html", content: "<h1>About us</h1>\n" },
];
