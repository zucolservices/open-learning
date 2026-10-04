/** CRM shares customer data with Billing four ways; four situations test each (illustrative). */

export type Style = "file" | "db" | "rpc" | "msg";

export const STYLES: Record<Style, { name: string; how: string }> = {
  file: { name: "File transfer", how: "CRM writes a customer file every night; Billing reads it." },
  db: { name: "Shared database", how: "Both systems read and write the same customer tables." },
  rpc: { name: "Remote call", how: "CRM calls Billing's API the moment a customer changes." },
  msg: {
    name: "Messaging",
    how: "CRM sends a CustomerChanged message to a queue; Billing reads it.",
  },
};

export type Verdict = "good" | "meh" | "bad";

export const SITUATIONS = [
  "Address changed at 10:00; bills print at 14:00",
  "CRM restructures its own tables",
  "Billing is offline for an hour",
  "Effort to build, test and debug",
];

export const OUTCOMES: Record<Style, [Verdict, string][]> = {
  file: [
    ["bad", "The file goes tonight. Today's bill goes to the old address."],
    ["good", "Billing never sees CRM's tables; the file format is the contract."],
    ["good", "The file waits in the folder until Billing is back."],
    ["meh", "Simple, but both sides must agree names, folders and locking."],
  ],
  db: [
    ["good", "Billing reads the new address straight away."],
    ["bad", "Billing's queries break: it depended on CRM's columns."],
    ["good", "The data sits in the database until Billing returns."],
    [
      "meh",
      "Easy to start; one schema for everyone gets hard, and a busy database becomes a bottleneck.",
    ],
  ],
  rpc: [
    ["good", "Billing hears about it immediately."],
    ["good", "Each system's tables stay hidden behind its own API."],
    ["bad", "CRM's call fails. Unless CRM retries, the change is lost."],
    ["meh", "Familiar, but remote calls are slower and less reliable than local ones."],
  ],
  msg: [
    ["good", "The message arrives within seconds (some small lag)."],
    ["good", "Only the message format is shared."],
    ["good", "The message waits in the queue and is delivered when Billing returns."],
    ["meh", "Asynchronous design has a learning curve; testing and debugging are harder."],
  ],
};
