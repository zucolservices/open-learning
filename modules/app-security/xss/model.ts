/**
 * Cross-site scripting as a rules-based simulation. Comments are described, never real markup;
 * nothing in this module is ever inserted into the page as HTML.
 */

export type Comment = "plain" | "bold" | "crafted";
export type Render = "raw" | "encode" | "sanitise";

export const COMMENTS: { id: Comment; label: string; shown: string }[] = [
  { id: "plain", label: "A normal comment", shown: "Great biryani, fast delivery!" },
  {
    id: "bold",
    label: "A comment with bold formatting",
    shown: "⟨bold⟩Best⟨/bold⟩ biryani in town",
  },
  {
    id: "crafted",
    label: "Crafted: a comment containing a hidden script",
    shown: "Nice place ⟨script that reads the visitor's session and sends it away⟩",
  },
];

export const RENDERS: { id: Render; label: string; code: string }[] = [
  { id: "raw", label: "Insert as HTML", code: "div.innerHTML = comment" },
  { id: "encode", label: "Encode as text", code: "div.textContent = comment" },
  {
    id: "sanitise",
    label: "Sanitise, then insert",
    code: "div.innerHTML = DOMPurify.sanitize(comment)",
  },
];

export interface View {
  text: string;
  bold: boolean;
  ran: boolean;
  note: string;
}

export function render(c: Comment, r: Render, csp: boolean): View {
  if (c === "plain")
    return {
      text: "Great biryani, fast delivery!",
      bold: false,
      ran: false,
      note: "Shown as written.",
    };
  if (c === "bold") {
    if (r === "encode")
      return {
        text: "<b>Best</b> biryani in town",
        bold: false,
        ran: false,
        note: "Safe, but the tags show up as text.",
      };
    return { text: "Best biryani in town", bold: true, ran: false, note: "Formatting kept." };
  }
  if (r === "encode")
    return {
      text: "Nice place ⟨script …⟩ (shown as harmless text)",
      bold: false,
      ran: false,
      note: "The browser displays the characters instead of running them.",
    };
  if (r === "sanitise")
    return {
      text: "Nice place",
      bold: false,
      ran: false,
      note: "The sanitiser removed the script and kept the safe text.",
    };
  if (csp)
    return {
      text: "Nice place",
      bold: false,
      ran: false,
      note: "The script was injected, but the content security policy refused to run it. The bug is still there.",
    };
  return {
    text: "Nice place",
    bold: false,
    ran: true,
    note: "The script ran in every visitor's browser, with this site's powers.",
  };
}

export type Kind = "stored" | "reflected" | "dom";

export const KINDS: { id: Kind; name: string; steps: string[]; eg: string }[] = [
  {
    id: "stored",
    name: "Stored",
    steps: [
      "Attacker posts a comment",
      "Server saves it",
      "Every visitor's page includes it",
      "Script runs for each visitor",
    ],
    eg: "The Samy worm on MySpace, 2005.",
  },
  {
    id: "reflected",
    name: "Reflected",
    steps: [
      "Attacker sends a crafted link",
      "Victim clicks it",
      "Server echoes part of the link into the page",
      "Script runs for that victim",
    ],
    eg: "A search page that repeats “You searched for …” without encoding.",
  },
  {
    id: "dom",
    name: "DOM-based",
    steps: [
      "Victim opens a crafted link",
      "The page's own JavaScript reads part of the URL",
      "It writes that into the page unsafely",
      "Script runs; the server may never see it",
    ],
    eg: "Described by Amit Klein in 2005.",
  },
];
