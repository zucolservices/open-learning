"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* Scene ------------------------------------------------------------------------------------------ */

const NODES: { id: string; label: string; x: number; y: number; owner: string }[] = [
  { id: "app", label: "Your app", x: 20, y: 80, owner: "you" },
  { id: "api", label: "Delivery API", x: 130, y: 80, owner: "delivery company" },
  { id: "rest", label: "Restaurant", x: 250, y: 20, owner: "restaurant's system" },
  { id: "maps", label: "Maps", x: 250, y: 62, owner: "maps company" },
  { id: "pay", label: "UPI payment", x: 250, y: 104, owner: "payment app, bank, NPCI" },
  { id: "sms", label: "SMS", x: 250, y: 146, owner: "messaging company" },
];

function Network({ index }: { index: number }) {
  const lit = (id: string) =>
    index === 0
      ? id === "app" || id === "api"
      : index === 3
        ? id === "maps" || id === "app"
        : index >= 1;
  return (
    <svg viewBox="0 0 340 190" className="w-full" fill="none">
      {NODES.slice(2).map((n) => (
        <motion.path
          key={n.id}
          d={`M222 92 L250 ${n.y + 12}`}
          className="stroke-accent"
          strokeWidth={1.2}
          strokeDasharray="3 3"
          animate={{ opacity: index >= 1 ? 1 : 0.15 }}
        />
      ))}
      <motion.path
        d="M102 92 H130"
        className="stroke-accent"
        strokeWidth={1.4}
        strokeDasharray="3 3"
        animate={{ strokeDashoffset: [12, 0] }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      {NODES.map((n) => (
        <motion.g key={n.id} animate={{ opacity: lit(n.id) ? 1 : 0.3 }}>
          <rect
            x={n.x}
            y={n.y}
            width={n.id === "api" ? 92 : 82}
            height={24}
            rx={5}
            className={cn(
              index === 3 && n.id === "maps"
                ? "fill-bad/15 stroke-bad"
                : n.id === "api"
                  ? "fill-accent/15 stroke-accent"
                  : "fill-surface stroke-line-strong",
            )}
            strokeWidth={1.2}
          />
          <text
            x={n.x + (n.id === "api" ? 46 : 41)}
            y={n.y + 15}
            textAnchor="middle"
            className="fill-fg font-mono text-[8px]"
          >
            {n.label}
          </text>
        </motion.g>
      ))}
      {index === 3 && (
        <text x={20} y={130} className="fill-bad font-mono text-[8px]">
          Arriving in undefined min
        </text>
      )}
      {index >= 1 && index !== 3 && (
        <text x={20} y={180} className="fill-muted font-mono text-[7px]">
          one tap, five APIs, four companies
        </text>
      )}
    </svg>
  );
}

function Menu() {
  return (
    <div className="grid h-full content-center gap-3 sm:grid-cols-2">
      <div className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3">
        <p className="text-accent text-xs font-semibold">The menu (the contract)</p>
        {["Masala dosa ₹120", "Idli (2) ₹60", "Filter coffee ₹40"].map((l) => (
          <p key={l} className="mt-1 font-mono text-xs">
            {l}
          </p>
        ))}
      </div>
      <div className="border-line bg-surface rounded-xl border px-4 py-3">
        <p className="text-muted text-xs font-semibold">The kitchen (the implementation)</p>
        <p className="text-muted mt-1 text-xs">
          Recipes, staff, ovens, suppliers. Change any of it; diners never need to know.
        </p>
      </div>
    </div>
  );
}

function Scale() {
  const items: [string, string][] = [
    [
      "~2002",
      "Amazon: teams talk only through service interfaces (as Steve Yegge recalled it in 2011)",
    ],
    ["Jan 2023", "Twitter cuts off third-party apps like Tweetbot, without warning"],
    ["Sept 2026", "UPI handles about 24 billion payments in a month, all through APIs"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {items.map(([y, t], i) => (
        <motion.div
          key={y}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
          className="grid grid-cols-[4.5rem_1fr] items-center gap-2 text-xs"
        >
          <span className="text-accent font-mono">{y}</span>
          <span className="border-line bg-surface rounded border px-2 py-1">{t}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Scene({ index }: { index: number }) {
  if (index === 2) return <Menu />;
  if (index === 4) return <Scale />;
  return <Network index={index} />;
}

/* Story ------------------------------------------------------------------------------------------ */

const SECTIONS: StorySection[] = [
  {
    id: "tap",
    kicker: "19:42",
    title: "One tap",
    body: (
      <>
        <p>
          You tap &ldquo;Place order&rdquo; in a food-delivery app. Your phone doesn&apos;t cook
          anything or know any restaurant. It sends a short message to the delivery company&apos;s
          servers: here&apos;s the order, here&apos;s who I am.
        </p>
        <p>
          That message is a request to an <Term id="api">API</Term>, an application programming
          interface: a set of requests a program accepts, and answers it promises to give.
        </p>
      </>
    ),
  },
  {
    id: "fan",
    kicker: "19:42:01",
    title: "Behind the tap",
    body: (
      <>
        <p>
          The delivery company&apos;s servers call more APIs in turn: the restaurant&apos;s system
          to accept the order, a maps service for the arrival time, your UPI app and bank to collect
          the money, a messaging service for the SMS.
        </p>
        <p>
          Four companies, none of which can see the others&apos; code. They cooperate only because
          each API does what it says.
        </p>
      </>
    ),
  },
  {
    id: "menu",
    kicker: "The idea",
    title: "A menu, not a kitchen",
    body: (
      <>
        <p>
          In a restaurant you order from the menu. You never walk into the kitchen, and you
          don&apos;t care who&apos;s cooking or which stove they use.
        </p>
        <p>
          An API is the menu: the <Term id="api-contract">contract</Term>. The code, databases and
          servers behind it are the kitchen, free to change as long as the menu stays true.
        </p>
      </>
    ),
  },
  {
    id: "change",
    kicker: "A Tuesday",
    title: "A quiet change",
    body: (
      <>
        <p>
          One morning the maps service renames a field in its answer from <code>eta_minutes</code>{" "}
          to <code>eta</code>. Tidier, they think. Thousands of phones now show &ldquo;Arriving in
          undefined min&rdquo;.
        </p>
        <p>
          Hyrum Wright noticed this pattern while working at Google: &ldquo;With a sufficient number
          of users of an API, it does not matter what you promise in the contract: all observable
          behaviors of your system will be depended on by somebody.&rdquo;
        </p>
      </>
    ),
  },
  {
    id: "scale",
    kicker: "At scale",
    title: "Companies run on promises",
    body: (
      <>
        <p>
          Steve Yegge recalled that around 2002 Jeff Bezos ordered every Amazon team to expose its
          data only through service interfaces, &ldquo;designed from the ground up to be
          externalizable&rdquo;. In January 2023 Twitter cut off third-party apps like Tweetbot
          without warning, and businesses built on its API disappeared overnight.
        </p>
        <p>
          In India, UPI, Account Aggregators and ONDC are public infrastructure built as APIs. An
          API isn&apos;t just code; it&apos;s a promise other people build on.
        </p>
      </>
    ),
  },
];

export function OneTap() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">One tap</h2>
          <p className="text-muted mt-3 text-[15px]">
            What happens between your thumb and your dinner, and why it depends on promises.
          </p>
        </div>
      }
    />
  );
}
