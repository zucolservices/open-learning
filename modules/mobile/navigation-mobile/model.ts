/** A three-tab café app: navigation stacks, Back and a deep link, with two fixable bugs. */

export type Tab = "menu" | "orders" | "account";

export const TABS: [Tab, string][] = [
  ["menu", "Menu"],
  ["orders", "Orders"],
  ["account", "Account"],
];

/** Each tab's screens, in the order you drill into them. */
export const CHAIN: Record<Tab, string[]> = {
  menu: ["Menu", "Masala dosa", "Customise"],
  orders: ["Orders", "Order #482"],
  account: ["Account", "Addresses"],
};

const name = (t: Tab) => TABS.find(([k]) => k === t)![1];

export interface Entry {
  tab: Tab;
  screen: string;
}

export interface Nav {
  tab: Tab;
  /** Per-tab stacks (used when each tab keeps its own stack). */
  stacks: Record<Tab, string[]>;
  /** One shared history (used when it doesn't). */
  history: Entry[];
  closed: boolean;
  log: string;
}

export interface Fixes {
  perTab: boolean;
  synth: boolean;
}

export const START: Nav = {
  tab: "menu",
  stacks: { menu: ["Menu"], orders: ["Orders"], account: ["Account"] },
  history: [{ tab: "menu", screen: "Menu" }],
  closed: false,
  log: "The app opens on the Menu tab.",
};

export function current(n: Nav, f: Fixes): Entry {
  if (f.perTab) return { tab: n.tab, screen: n.stacks[n.tab].at(-1)! };
  return n.history.at(-1)!;
}

export function nextScreen(n: Nav, f: Fixes) {
  const c = current(n, f);
  const chain = CHAIN[c.tab];
  return chain[chain.indexOf(c.screen) + 1];
}

export function open(n: Nav, f: Fixes): Nav {
  const c = current(n, f);
  const s = nextScreen(n, f);
  if (!s) return n;
  return {
    ...n,
    stacks: { ...n.stacks, [c.tab]: [...n.stacks[c.tab], s] },
    history: [...n.history, { tab: c.tab, screen: s }],
    log: `Opened ${s}.`,
  };
}

export function switchTab(n: Nav, f: Fixes, t: Tab): Nav {
  const top = f.perTab ? n.stacks[t].at(-1)! : CHAIN[t][0];
  return {
    ...n,
    tab: t,
    history: [...n.history, { tab: t, screen: top }],
    log: f.perTab
      ? `Switched to ${name(t)}; it remembers ${top}.`
      : `Switched to ${name(t)}; it starts again at ${top}.`,
  };
}

export function back(n: Nav, f: Fixes): Nav {
  if (f.perTab) {
    const st = n.stacks[n.tab];
    if (st.length > 1) {
      const next = st.slice(0, -1);
      return { ...n, stacks: { ...n.stacks, [n.tab]: next }, log: `Back to ${next.at(-1)}.` };
    }
    if (n.tab !== "menu")
      return { ...n, tab: "menu", log: "Back from a tab's first screen goes to the start tab." };
    return { ...n, closed: true, log: "Back from the start tab leaves the app. That's expected." };
  }
  if (n.history.length > 1) {
    const h = n.history.slice(0, -1);
    const to = h.at(-1)!;
    const surprise = to.tab !== n.history.at(-1)!.tab;
    return {
      ...n,
      history: h,
      tab: to.tab,
      log: surprise
        ? `Back jumped across to the ${name(to.tab)} tab: not what anyone expected.`
        : `Back to ${to.screen}.`,
    };
  }
  return {
    ...n,
    closed: true,
    log:
      n.history[0].screen === "Order #482"
        ? "Back left the app. There was no Orders list underneath to go back to."
        : "Back from the start tab leaves the app.",
  };
}

/** Tapping "Your order #482 is ready" in an email, with the app not running. */
export function deepLink(f: Fixes): Nav {
  const stack = f.synth ? ["Orders", "Order #482"] : ["Order #482"];
  return {
    tab: "orders",
    stacks: { menu: ["Menu"], orders: stack, account: ["Account"] },
    history: stack.map((screen) => ({ tab: "orders" as Tab, screen })),
    closed: false,
    log: f.synth
      ? "The link opened Order #482, with the Orders list placed underneath it."
      : "The link opened Order #482 on its own.",
  };
}
