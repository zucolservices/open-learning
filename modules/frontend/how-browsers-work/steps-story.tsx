"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const TREE = [
  ["html", 0],
  ["body", 1],
  ["h1 Masala chai", 2],
  ["p ₹40 a cup", 2],
  ["div.ad (hidden)", 2],
  ["button Add", 2],
] as const;

function Scene({ index }: { index: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      {index === 0 && (
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[11px]"
        >
          {`<h1>Masala chai</h1>\n<p>₹40 a cup</p>\n<div class="ad">…</div>\n<button>Add</button>`}
        </motion.pre>
      )}
      {index >= 1 && index <= 3 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="border-line bg-surface rounded-lg border p-2 font-mono text-[10.5px]">
            <p className="text-muted mb-1 font-sans text-[10px]">DOM</p>
            {TREE.map(([t, d]) => (
              <p
                key={t}
                style={{ paddingLeft: d * 10 }}
                className={cn(index === 3 && t.includes("hidden") && "text-subtle line-through")}
              >
                {t}
              </p>
            ))}
          </div>
          <motion.div
            animate={{ opacity: index >= 2 ? 1 : 0.15 }}
            className="border-line bg-surface rounded-lg border p-2 font-mono text-[10.5px]"
          >
            <p className="text-muted mb-1 font-sans text-[10px]">CSSOM</p>
            <p>h1 {"{ font-size: 24px }"}</p>
            <p>p {"{ color: grey }"}</p>
            <p>.ad {"{ display: none }"}</p>
            <p>button {"{ background: violet }"}</p>
          </motion.div>
        </div>
      )}
      {index >= 4 && (
        <div className="border-line bg-surface relative h-40 rounded-lg border">
          {[
            [8, 8, 160, 24, "Masala chai", "text-base font-semibold"],
            [8, 40, 100, 16, "₹40 a cup", "text-muted text-xs"],
            [8, 66, 64, 26, "Add", "text-xs"],
          ].map(([x, y, w, h, t, c], i) => (
            <motion.div
              key={t as string}
              initial={false}
              animate={{ opacity: 1 }}
              style={{
                left: x as number,
                top: y as number,
                width: w as number,
                height: h as number,
              }}
              className={cn(
                "absolute flex items-center rounded px-1",
                index === 4 ? "border-viz-data border border-dashed" : "",
                index >= 5 && i === 2 ? "bg-viz-meta/40" : "",
              )}
            >
              <span className={cn(index >= 5 ? "opacity-100" : "opacity-0", c as string)}>{t}</span>
            </motion.div>
          ))}
          {index >= 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-viz-compute bg-viz-compute/15 absolute top-3 right-3 rounded border px-2 py-1 text-[10px]"
            >
              its own layer
            </motion.div>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-1 text-[10px]">
        {["HTML", "DOM", "CSSOM", "Render tree", "Layout", "Paint", "Composite"].map((s, i) => (
          <span
            key={s}
            className={cn(
              "rounded-full border px-2 py-0.5",
              i === index
                ? "border-accent bg-accent-soft"
                : i < index
                  ? "border-line-strong"
                  : "border-line text-subtle",
            )}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "html",
    kicker: "1 · The text arrives",
    title: "A page is just text at first",
    body: (
      <p>
        You type a café&apos;s address. The server sends back HTML: plain text with tags. The
        browser has to turn it into a picture, like an editor turning a pile of articles into a
        printed newspaper page.
      </p>
    ),
  },
  {
    id: "dom",
    kicker: "2 · Read the structure",
    title: "HTML becomes the DOM",
    body: (
      <p>
        The browser reads the tags and builds a tree of elements called the{" "}
        <Term id="dom">DOM</Term>. It does this bit by bit as the text streams in, which is why it
        can start work before the whole file arrives.
      </p>
    ),
  },
  {
    id: "cssom",
    kicker: "3 · Read the house style",
    title: "CSS becomes the CSSOM",
    body: (
      <p>
        The CSS is read into its own tree, the <Term id="cssom">CSSOM</Term>. Unlike the DOM, it
        can&apos;t be used half-finished, so CSS is{" "}
        <Term id="render-blocking">render-blocking</Term>: nothing is drawn until it&apos;s all in.
      </p>
    ),
  },
  {
    id: "render",
    kicker: "4 · Combine",
    title: "The render tree keeps what's visible",
    body: (
      <p>
        DOM and CSSOM are combined into a render tree of things that will actually be shown. The
        advert has display: none, so it&apos;s dropped entirely.
      </p>
    ),
  },
  {
    id: "layout",
    kicker: "5 · Measure",
    title: "Layout works out where everything goes",
    body: (
      <p>
        <Term id="layout">Layout</Term> calculates each box&apos;s size and position for this screen
        width. Change the width of one box and others may move, so layout can be expensive.
      </p>
    ),
  },
  {
    id: "paint",
    kicker: "6 · Fill in",
    title: "Paint draws the pixels",
    body: (
      <p>
        Paint fills in text, colours, borders and images, like ink on the page. This is the first
        moment anything visible appears.
      </p>
    ),
  },
  {
    id: "composite",
    kicker: "7 · Stack",
    title: "Composite stacks the layers",
    body: (
      <p>
        Some parts are painted on separate layers, like sheets of transparent film.{" "}
        <Term id="compositing">Compositing</Term> stacks them into the final picture, often on a
        separate thread, so scrolling can stay smooth even when the page is busy.
      </p>
    ),
  },
];

export function UrlToPixels() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            From a URL to pixels
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Seven steps every browser takes to draw a page. The café is made up.
          </p>
        </div>
      }
    />
  );
}
