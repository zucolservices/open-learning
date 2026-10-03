/** A small B+tree-style index (at most 3 keys per page) built by inserting keys one at a time. */

export const MAX = 3;
export const KEYS = [10, 20, 5, 30, 25, 40, 15, 35, 50, 45, 60, 12, 55, 8, 70, 65];

export interface Node {
  keys: number[];
  children?: Node[];
}

function insertRec(node: Node, key: number): { split?: { key: number; right: Node } } {
  if (!node.children) {
    node.keys = [...node.keys, key].sort((a, b) => a - b);
    if (node.keys.length <= MAX) return {};
    const mid = Math.ceil(node.keys.length / 2);
    const right: Node = { keys: node.keys.slice(mid) };
    node.keys = node.keys.slice(0, mid);
    return { split: { key: right.keys[0], right } };
  }
  let i = node.keys.findIndex((k) => key < k);
  if (i === -1) i = node.keys.length;
  const r = insertRec(node.children[i], key);
  if (!r.split) return {};
  node.keys = [...node.keys.slice(0, i), r.split.key, ...node.keys.slice(i)];
  node.children = [...node.children.slice(0, i + 1), r.split.right, ...node.children.slice(i + 1)];
  if (node.keys.length <= MAX) return {};
  const mid = Math.floor(node.keys.length / 2);
  const up = node.keys[mid];
  const right: Node = { keys: node.keys.slice(mid + 1), children: node.children.slice(mid + 1) };
  node.keys = node.keys.slice(0, mid);
  node.children = node.children.slice(0, mid + 1);
  return { split: { key: up, right } };
}

export function build(n: number): { root: Node; events: string[] } {
  let root: Node = { keys: [] };
  const events: string[] = [];
  for (const key of KEYS.slice(0, n)) {
    const before = depth(root);
    const r = insertRec(root, key);
    if (r.split) {
      root = { keys: [r.split.key], children: [root, r.split.right] };
    }
    const after = depth(root);
    events.push(
      after > before && before > 0
        ? `${key}: the root split, so the tree grew a level`
        : r.split || after > before
          ? `${key}: a full page split in two`
          : `${key}: fitted into a leaf`,
    );
  }
  return { root, events };
}

export function depth(n: Node): number {
  return n.children ? 1 + depth(n.children[0]) : 1;
}

export function levels(root: Node): Node[][] {
  const out: Node[][] = [];
  let row: Node[] = [root];
  while (row.length) {
    out.push(row);
    row = row.flatMap((n) => n.children ?? []);
  }
  return out;
}

/** The pages visited to find a key, top to bottom. */
export function path(root: Node, key: number): Node[] {
  const out: Node[] = [root];
  let n = root;
  while (n.children) {
    let i = n.keys.findIndex((k) => key < k);
    if (i === -1) i = n.keys.length;
    n = n.children[i];
    out.push(n);
  }
  return out;
}
