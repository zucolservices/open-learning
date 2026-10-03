/** A city library's messy endpoints and their resource-oriented rewrites (illustrative). */

export const FIXES: { id: string; bad: string; good: string; why: string }[] = [
  {
    id: "get",
    bad: "POST /getBook?id=42",
    good: "GET /books/42",
    why: "The method already says 'get'. The URL names the thing.",
  },
  {
    id: "create",
    bad: "POST /createNewMember",
    good: "POST /members",
    why: "POST to a collection means 'add one to it'.",
  },
  {
    id: "delete",
    bad: "POST /deleteLoan/77",
    good: "DELETE /loans/77",
    why: "HTTP has a method for removing; use it, so caches and tools understand.",
  },
  {
    id: "plural",
    bad: "GET /book/42/loan/all",
    good: "GET /books/42/loans",
    why: "Collections are plural nouns; the collection itself means 'all'.",
  },
  {
    id: "case",
    bad: "GET /Books/42/ReviewList",
    good: "GET /books/42/reviews",
    why: "Paths are case-sensitive: pick one style and stick to it.",
  },
  {
    id: "search",
    bad: "GET /searchBooksByTitle?t=gita",
    good: "GET /books?title=gita",
    why: "A search is a filtered view of the collection: use query parameters.",
  },
  {
    id: "deep",
    bad: "GET /members/9/loans/77/book/author",
    good: "GET /authors/a_3",
    why: "Once a thing has its own ID, give it its own top-level address. Zalando suggests at most three levels.",
  },
  {
    id: "renew",
    bad: "POST /renewLoan?loan=77",
    good: "POST /loans/77:renew",
    why: "Some actions aren't CRUD. Google and Azure use a colon verb; Zalando would model it as POST /loans/77/renewals.",
  },
];

export const PARTS: [string, string, string][] = [
  ["https", "scheme", "How to talk to it"],
  ["api.library.example", "authority", "Which server"],
  ["/v1/branches/central/books/42", "path", "Which resource: collection, ID, collection, ID…"],
  ["?lang=hi", "query", "Options: filter, sort, page"],
  ["#reviews", "fragment", "A part of the page, never sent to the server"],
];
