/** Connecting a new pension app to a mainframe: three data paths, with or without an ACL (illustrative). */

export type Path = "direct" | "api" | "cdc";

export const PATHS: Record<Path, { name: string; how: string }> = {
  direct: {
    name: "Read its tables directly",
    how: "The new app queries the mainframe's database.",
  },
  api: {
    name: "Call an API wrapper",
    how: "A service in front of the mainframe exposes its functions as an API.",
  },
  cdc: {
    name: "Copy changes with CDC",
    how: "Change data capture streams every change into the new app's own store.",
  },
};

type V = "good" | "meh" | "bad";

export function assess(path: Path, acl: boolean): [string, V, string][] {
  const model: [string, V, string] = acl
    ? [
        "Your model",
        "good",
        "The ACL translates POL-STAT-CD 'A7' into PolicyStatus.Active; no legacy codes leak in.",
      ]
    : ["Your model", "bad", "Legacy field names and codes spread through the new code."];
  if (path === "direct")
    return [
      model,
      ["Coupling", "bad", "Any change to the mainframe's tables breaks the new app."],
      ["Mainframe load", "bad", "Every page view runs queries on the mainframe."],
      ["When the mainframe is down", "bad", "The new app is down too."],
    ];
  if (path === "api")
    return [
      model,
      ["Coupling", "good", "Only the API contract is shared."],
      ["Mainframe load", "meh", "Each call still reaches the mainframe."],
      ["When the mainframe is down", "bad", "Reads and writes fail."],
    ];
  return [
    model,
    ["Coupling", "good", "Only the change feed's format is shared."],
    ["Mainframe load", "good", "Reads come from the copy; CDC reads the database log."],
    [
      "When the mainframe is down",
      "meh",
      "Reads keep working from the copy (slightly behind); writes still need the mainframe.",
    ],
  ];
}
