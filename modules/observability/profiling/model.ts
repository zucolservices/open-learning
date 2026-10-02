/**
 * A CPU profile of a slow receipt service, as a flame graph (illustrative). Each frame's `w` is
 * the share of CPU samples in which it appeared on the stack; children sit on top of parents.
 */

export interface Frame {
  id: string;
  name: string;
  w: number;
  children?: Frame[];
}

export const ROOT: Frame = {
  id: "root",
  name: "all",
  w: 100,
  children: [
    {
      id: "gc",
      name: "runtime.gcBgMarkWorker",
      w: 9,
    },
    {
      id: "http",
      name: "net/http.(*conn).serve",
      w: 91,
      children: [
        {
          id: "handler",
          name: "main.receiptHandler",
          w: 88,
          children: [
            {
              id: "build",
              name: "main.buildReceipt",
              w: 22,
              children: [
                { id: "json", name: "encoding/json.Marshal", w: 14 },
                { id: "tmpl", name: "text/template.(*Template).Execute", w: 7 },
              ],
            },
            {
              id: "db",
              name: "database/sql.(*DB).QueryContext",
              w: 12,
              children: [{ id: "pq", name: "lib/pq.(*conn).query", w: 10 }],
            },
            {
              id: "validate",
              name: "main.validateEmail",
              w: 52,
              children: [
                {
                  id: "compile",
                  name: "regexp.MustCompile",
                  w: 47,
                  children: [{ id: "parse", name: "regexp/syntax.Parse", w: 30 }],
                },
                { id: "match", name: "regexp.(*Regexp).MatchString", w: 4 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const CULPRITS = new Set(["compile", "parse"]);

/** Flatten into positioned rectangles: x and width in %, depth from the bottom. */
export function layout(
  f: Frame,
  x = 0,
  depth = 0,
  out: { f: Frame; x: number; depth: number }[] = [],
) {
  out.push({ f, x, depth });
  let cx = x;
  for (const c of [...(f.children ?? [])].sort((a, b) => a.name.localeCompare(b.name))) {
    layout(c, cx, depth + 1, out);
    cx += c.w;
  }
  return out;
}
