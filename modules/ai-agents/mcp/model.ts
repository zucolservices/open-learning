/** One request traced through an MCP host, its clients and three servers. Illustrative. */

export type Part =
  | "user"
  | "host"
  | "model"
  | "client-cal"
  | "server-cal"
  | "client-docs"
  | "server-docs"
  | "client-gh"
  | "server-gh";

export interface Frame {
  title: string;
  caption: string;
  lit: Part[];
  msg?: string;
}

export const FRAMES: Frame[] = [
  {
    title: "Three servers, one host",
    caption:
      "The assistant app (the host) runs one MCP client per server: a calendar server on your laptop, a documents server and a code-hosting server on the internet.",
    lit: [
      "host",
      "client-cal",
      "client-docs",
      "client-gh",
      "server-cal",
      "server-docs",
      "server-gh",
    ],
  },
  {
    title: "Each client asks what its server offers",
    caption:
      "The client asks for the server's tools. The answer, names, descriptions and input schemas, is what the model will see.",
    lit: ["client-docs", "server-docs"],
    msg: `→ {"jsonrpc":"2.0","id":1,"method":"tools/list"}
← {"result":{"tools":[{"name":"docs_search",
     "description":"Search project documents by keyword",
     "inputSchema":{...}}]}}`,
  },
  {
    title: "The user asks; the model chooses a tool",
    caption:
      "“Read the launch plan and book an hour with Priya after Friday's review.” The host gives the model every server's tools; the model asks for docs_search.",
    lit: ["user", "host", "model"],
  },
  {
    title: "The client calls the server",
    caption:
      "The host routes the call to the right client, which sends a JSON-RPC request over HTTP to the documents server.",
    lit: ["host", "client-docs", "server-docs"],
    msg: `→ {"jsonrpc":"2.0","id":2,"method":"tools/call",
   "params":{"name":"docs_search",
             "arguments":{"q":"launch plan"}}}
← {"result":{"content":[{"type":"text",
     "text":"Launch plan: review Fri 14:00..."}]}}`,
  },
  {
    title: "Next tool, different server",
    caption:
      "The model reads the result and asks for calendar_create_event. This one goes to the local calendar server over stdio, a direct pipe to a process on the same machine.",
    lit: ["host", "model", "client-cal", "server-cal"],
    msg: `→ {"jsonrpc":"2.0","id":3,"method":"tools/call",
   "params":{"name":"calendar_create_event",
             "arguments":{"with":"priya","start":"Fri 15:00"}}}`,
  },
  {
    title: "Ask before acting",
    caption:
      "Creating an event changes something, so the host asks you to approve it. The code-hosting server was never needed; its client stayed idle.",
    lit: ["user", "host"],
  },
];

export const BOXES: {
  id: Part;
  label: string;
  x: number;
  y: number;
  w: number;
  kind: "app" | "client" | "server" | "person";
}[] = [
  { id: "user", label: "You", x: 10, y: 80, w: 50, kind: "person" },
  { id: "host", label: "Host: assistant app", x: 80, y: 20, w: 150, kind: "app" },
  { id: "model", label: "model", x: 95, y: 140, w: 60, kind: "app" },
  { id: "client-cal", label: "client", x: 175, y: 60, w: 50, kind: "client" },
  { id: "client-docs", label: "client", x: 175, y: 100, w: 50, kind: "client" },
  { id: "client-gh", label: "client", x: 175, y: 140, w: 50, kind: "client" },
  { id: "server-cal", label: "calendar (stdio, local)", x: 270, y: 60, w: 130, kind: "server" },
  { id: "server-docs", label: "documents (HTTP)", x: 270, y: 100, w: 130, kind: "server" },
  { id: "server-gh", label: "code hosting (HTTP)", x: 270, y: 140, w: 130, kind: "server" },
];
