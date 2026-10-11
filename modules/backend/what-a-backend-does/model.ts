/** One made-up order request, hop by hop, and the time each part can take. Times are illustrative. */

export const HOPS: { id: string; label: string; normal: number; slow: number; slowWhat: string }[] =
  [
    {
      id: "dns",
      label: "DNS lookup",
      normal: 5,
      slow: 120,
      slowWhat: "Nothing cached: ask the DNS servers from scratch",
    },
    {
      id: "tls",
      label: "Connect and TLS handshake",
      normal: 40,
      slow: 260,
      slowWhat: "The server is on another continent",
    },
    { id: "lb", label: "Load balancer", normal: 2, slow: 2, slowWhat: "" },
    { id: "app", label: "Your code: rules and checks", normal: 15, slow: 15, slowWhat: "" },
    {
      id: "db",
      label: "Database queries",
      normal: 20,
      slow: 900,
      slowWhat: "One query per item instead of one for all",
    },
    {
      id: "pay",
      label: "Payment provider call",
      normal: 180,
      slow: 2400,
      slowWhat: "The provider is having a bad day",
    },
    { id: "back", label: "Response back to the phone", normal: 40, slow: 40, slowWhat: "" },
  ];

export const RUNTIMES: [string, string][] = [
  ["JavaScript / TypeScript", "Node.js 24 LTS (26 current), Deno 2, Bun 1"],
  ["Python", "3.15; FastAPI, Django, Flask"],
  ["Java and Kotlin", "Java 25 LTS; Spring Boot 4, Ktor 3"],
  ["Go", "1.27, with its built-in net/http"],
  ["C#", ".NET 10 LTS with ASP.NET Core"],
  ["Ruby and PHP", "Ruby 4 with Rails 8.1; PHP 8.5 with Laravel 13"],
];
