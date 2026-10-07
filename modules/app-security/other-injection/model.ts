/** Three injection bugs in different interpreters, the tempting patches, and the real fixes. */

export interface Fix {
  id: string;
  label: string;
  root: boolean;
  why: string;
}

export interface Bug {
  id: string;
  title: string;
  interpreter: string;
  attack: string;
  before: string;
  after: string;
  fixes: Fix[];
}

export const BUGS: Bug[] = [
  {
    id: "convert",
    title: "The file converter",
    interpreter: "Operating-system shell",
    attack: "A filename containing shell characters runs an extra command on the server.",
    before: `# Python: the filename is pasted into a shell command
subprocess.run(f"convert {filename} out.pdf", shell=True)`,
    after: `# No shell: arguments are passed as a list, so the filename is one argument
subprocess.run(["convert", "--", filename, "out.pdf"], check=True)`,
    fixes: [
      {
        id: "list",
        label: "Pass arguments as a list, with no shell",
        root: true,
        why: "The program receives the filename as a single argument; there's no shell to interpret it.",
      },
      {
        id: "strip",
        label: "Strip semicolons from the filename",
        root: false,
        why: "Shells have many special characters; a deny-list always misses one.",
      },
      {
        id: "errors",
        label: "Hide error messages from users",
        root: false,
        why: "The command still runs; you just see less.",
      },
    ],
  },
  {
    id: "email",
    title: "The email template",
    interpreter: "Template engine",
    attack: "A display name written in template syntax is evaluated on the server.",
    before: `# Jinja2: the user's name becomes part of the template itself
Template("Hello " + user.name + ", your order is ready").render()`,
    after: `# The template is fixed; the name is passed in as data
Template("Hello {{ name }}, your order is ready").render(name=user.name)`,
    fixes: [
      {
        id: "data",
        label: "Keep the template fixed and pass the name in as a variable",
        root: true,
        why: "The engine treats the name as a value to print, never as template code.",
      },
      {
        id: "braces",
        label: "Remove curly braces from names",
        root: false,
        why: "Each template engine has its own syntax; filtering one pattern isn't enough.",
      },
      {
        id: "length",
        label: "Limit names to 20 characters",
        root: false,
        why: "Short inputs can still be dangerous.",
      },
    ],
  },
  {
    id: "search",
    title: "The order search",
    interpreter: "NoSQL database query",
    attack:
      "Instead of a text value, the request sends a query operator, so the filter matches every order.",
    before: `// Node + MongoDB: the request body goes straight into the query
orders.find({ customer: req.body.customer })`,
    after: `// Check the type, and build the query from known fields only
if (typeof req.body.customer !== "string") return res.status(400).end();
orders.find({ customer: req.body.customer })`,
    fixes: [
      {
        id: "type",
        label: "Check the value is a plain string and allow only expected fields",
        root: true,
        why: "An operator object is rejected before it reaches the database.",
      },
      {
        id: "waf",
        label: "Add a firewall rule for suspicious words",
        root: false,
        why: "Useful as a layer, but it doesn't fix the code and is easy to bypass.",
      },
      {
        id: "https",
        label: "Make sure the site uses HTTPS",
        root: false,
        why: "Good practice, but unrelated: the attacker sends the request themselves.",
      },
    ],
  },
];

export const INTERPRETERS: { name: string; mixed: string; safe: string }[] = [
  {
    name: "SQL database",
    mixed: "Input pasted into query text",
    safe: "Parameterised queries (module 5)",
  },
  { name: "Browser HTML", mixed: "Input inserted as HTML", safe: "Output encoding (module 6)" },
  {
    name: "Operating-system shell",
    mixed: "Input inside a command string",
    safe: "A library function, or arguments as a list",
  },
  {
    name: "Template engine",
    mixed: "Input inside the template",
    safe: "Fixed templates; input passed as variables",
  },
  {
    name: "NoSQL query",
    mixed: "Request objects passed straight in",
    safe: "Type checks and allowed fields",
  },
  {
    name: "LDAP directory",
    mixed: "Input inside a search filter",
    safe: "The library's escaping or filter builder",
  },
  {
    name: "Logging library",
    mixed: "Log text treated as lookups",
    safe: "Patched libraries; lookups disabled",
  },
];

export const CASES: [string, string][] = [
  [
    "Shellshock, September 2014",
    "Bash, the common Unix shell, ran code hidden in environment variables. Web servers that passed request headers to scripts made it remotely exploitable.",
  ],
  [
    "Log4Shell, December 2021",
    "Log4j, a hugely popular Java logging library, treated certain text in log messages as a lookup to perform. Simply logging what an attacker typed could make a server load and run remote code. Rated 10.0, the maximum severity.",
  ],
  [
    "Network devices, 2024",
    "Command-injection flaws in Ivanti Connect Secure (January) and Palo Alto PAN-OS (April) were exploited in the wild before many customers could patch.",
  ],
];
