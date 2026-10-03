/** Build a small OpenAPI description piece by piece; docs, a mock and a client follow from it (illustrative). */

export type Piece = "get" | "schema" | "post" | "error" | "example";

export const PIECES: { id: Piece; label: string; needs?: Piece }[] = [
  { id: "get", label: "GET /books/{id}" },
  { id: "schema", label: "A Book schema" },
  { id: "example", label: "An example book", needs: "schema" },
  { id: "post", label: "POST /books" },
  { id: "error", label: "A 404 Problem response" },
];

export function yaml(on: Piece[]): string {
  const has = (p: Piece) => on.includes(p);
  const L: string[] = ["openapi: 3.2.0", "info: { title: Library API, version: 1.0.0 }", "paths:"];
  if (!has("get") && !has("post")) L.push("  {}");
  if (has("post")) {
    L.push("  /books:", "    post:", "      operationId: createBook");
    if (has("schema"))
      L.push(
        "      requestBody:",
        "        content:",
        "          application/json:",
        "            schema: { $ref: '#/components/schemas/Book' }",
      );
    L.push("      responses:", "        '201': { description: Created }");
  }
  if (has("get")) {
    L.push(
      "  /books/{id}:",
      "    get:",
      "      operationId: getBook",
      "      parameters:",
      "        - { name: id, in: path, required: true, schema: { type: string } }",
      "      responses:",
      "        '200':",
      "          description: The book",
    );
    if (has("schema"))
      L.push(
        "          content:",
        "            application/json:",
        "              schema: { $ref: '#/components/schemas/Book' }",
      );
    if (has("error"))
      L.push(
        "        '404':",
        "          description: No such book",
        "          content: { application/problem+json: {} }",
      );
  }
  if (has("schema")) {
    L.push(
      "components:",
      "  schemas:",
      "    Book:",
      "      type: object",
      "      required: [id, title]",
      "      properties:",
      "        id: { type: string }",
      "        title: { type: string }",
      "        price_paise: { type: integer }",
    );
    if (has("example"))
      L.push("      example: { id: bk_42, title: Malgudi Days, price_paise: 29900 }");
  }
  return L.join("\n");
}

export function docs(on: Piece[]): { method: string; path: string; lines: string[] }[] {
  const has = (p: Piece) => on.includes(p);
  const out: { method: string; path: string; lines: string[] }[] = [];
  if (has("get"))
    out.push({
      method: "GET",
      path: "/books/{id}",
      lines: [
        "id (path, string, required)",
        has("schema") ? "200 → Book { id, title, price_paise }" : "200 → (shape not described)",
        ...(has("error") ? ["404 → Problem Details"] : []),
      ],
    });
  if (has("post"))
    out.push({
      method: "POST",
      path: "/books",
      lines: [has("schema") ? "body: Book" : "body: (not described)", "201 → Created"],
    });
  return out;
}

export function mock(on: Piece[]): string {
  if (!on.includes("get")) return "No operations to mock yet.";
  if (!on.includes("schema"))
    return "GET /books/bk_42\n→ 200 (empty: the response shape isn't described)";
  if (!on.includes("example"))
    return 'GET /books/bk_42\n→ 200 { "id": "string", "title": "string", "price_paise": 0 }';
  return 'GET /books/bk_42\n→ 200 { "id": "bk_42", "title": "Malgudi Days", "price_paise": 29900 }';
}

export function client(on: Piece[]): string {
  const has = (p: Piece) => on.includes(p);
  const L: string[] = [];
  if (has("schema"))
    L.push("interface Book {\n  id: string;\n  title: string;\n  price_paise?: number;\n}\n");
  const t = has("schema") ? "Book" : "unknown";
  if (has("get"))
    L.push(`getBook(id: string): Promise<${t}>${has("error") ? "   // throws NotFound" : ""}`);
  if (has("post")) L.push(`createBook(body: ${t}): Promise<void>`);
  return L.length ? L.join("\n") : "// nothing to generate yet";
}
