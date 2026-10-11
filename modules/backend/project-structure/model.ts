/** Chunks of one tangled "place order" handler in a made-up café service, and where each belongs. */

export type Layer = "handler" | "service" | "repo" | "adapter";

export const LAYERS: { id: Layer; label: string; desc: string }[] = [
  { id: "handler", label: "Handler", desc: "HTTP in and out" },
  { id: "service", label: "Service", desc: "Business rules" },
  { id: "repo", label: "Repository", desc: "Database access" },
  { id: "adapter", label: "Adapter", desc: "Other outside systems" },
];

export const CHUNKS: { id: string; code: string; answer: Layer; why: string }[] = [
  {
    id: "parse",
    code: "const { item, qty } = await req.json()",
    answer: "handler",
    why: "Reading the HTTP request is the handler's job.",
  },
  {
    id: "shape",
    code: "if (!item || typeof qty !== 'number') return 400",
    answer: "handler",
    why: "Checking the request's shape happens at the HTTP boundary.",
  },
  {
    id: "limit",
    code: "if (qty > 10) throw new TooManyError()",
    answer: "service",
    why: "“At most 10 per order” is a business rule, whatever the caller.",
  },
  {
    id: "price",
    code: "SELECT price, stock FROM items WHERE id = $1",
    answer: "repo",
    why: "Talking to the database belongs in one place.",
  },
  {
    id: "discount",
    code: "if (member) total *= 0.9",
    answer: "service",
    why: "Pricing rules are the heart of the business.",
  },
  {
    id: "stock",
    code: "if (stock < qty) throw new OutOfStockError()",
    answer: "service",
    why: "Deciding what out of stock means is a rule.",
  },
  {
    id: "insert",
    code: "INSERT INTO orders (item, qty, total) VALUES …",
    answer: "repo",
    why: "Saving data is the repository's job.",
  },
  {
    id: "email",
    code: "smtp.send({ to, subject: 'Order confirmed' })",
    answer: "adapter",
    why: "Email is an outside system behind an adapter, so it can be swapped or faked in tests.",
  },
  {
    id: "reply",
    code: "return Response.json(order, { status: 201 })",
    answer: "handler",
    why: "Turning the result into HTTP is the handler's job.",
  },
];

export const CHANGES: { text: string; touches: Layer[] }[] = [
  { text: "Move from PostgreSQL to another database", touches: ["repo"] },
  { text: "Let staff place orders from a command-line tool", touches: ["handler"] },
  { text: "Change the member discount to 15%", touches: ["service"] },
  { text: "Test the pricing rules without a database or email server", touches: ["service"] },
  { text: "Switch email provider", touches: ["adapter"] },
];
