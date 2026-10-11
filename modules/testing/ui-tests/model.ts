/**
 * A sign-up form whose markup changes with a few redesign switches, and four tests written in two
 * styles. The tests run for real against the rendered form using tiny versions of the queries
 * Testing Library provides (by role and name, by label text) and plain CSS selectors.
 */

export type ChangeId = "classes" | "reorder" | "placeholder" | "text";

export const CHANGES: { id: ChangeId; label: string; userVisible: boolean }[] = [
  { id: "classes", label: "Move to the new design system's CSS classes", userVisible: false },
  { id: "reorder", label: "Put the phone field above email", userVisible: false },
  { id: "placeholder", label: "Replace labels with grey placeholder text", userVisible: true },
  { id: "text", label: "Change the button text to “Sign up”", userVisible: true },
];

export interface Check {
  id: string;
  style: "selector" | "user";
  code: string;
  run(root: HTMLElement): boolean;
}

/** The accessible name of a button: its text content (good enough here). */
function byRole(root: HTMLElement, role: "button", name: string) {
  return [...root.querySelectorAll("button")].find((b) => b.textContent?.trim() === name) ?? null;
}

/** An input whose <label> text matches. */
function byLabel(root: HTMLElement, text: string) {
  const label = [...root.querySelectorAll("label")].find((l) => l.textContent?.trim() === text);
  if (!label) return null;
  const id = label.getAttribute("for");
  return id ? root.querySelector<HTMLInputElement>(`#${id}`) : null;
}

export const CHECKS: Check[] = [
  {
    id: "sel-button",
    style: "selector",
    code: 'container.querySelector(".btn-primary-x7f")',
    run: (r) => r.querySelector(".btn-primary-x7f") !== null,
  },
  {
    id: "sel-email",
    style: "selector",
    code: 'container.querySelector("form > div:nth-child(2) input")?.type === "email"',
    run: (r) =>
      r.querySelector<HTMLInputElement>("form > div:nth-child(2) input")?.type === "email",
  },
  {
    id: "role-button",
    style: "user",
    code: 'getByRole("button", { name: "Create account" })',
    run: (r) => byRole(r, "button", "Create account") !== null,
  },
  {
    id: "label-email",
    style: "user",
    code: 'getByLabelText("Email")',
    run: (r) => byLabel(r, "Email")?.type === "email",
  },
];
