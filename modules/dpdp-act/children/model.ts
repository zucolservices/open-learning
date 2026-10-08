/**
 * Children's data under s.9 and Rules 10–12 (from May 2027), for a made-up learning app.
 * The Fourth Schedule exemptions lift only s.9(1) and s.9(3), and only for named classes and
 * purposes; s.9(2) (no harm to well-being) is never exempt. Whether a private ed-tech company is an
 * "educational institution" is untested, so the sim treats it as not one unless it acts for a school.
 */

export type Verify = "checkbox" | "registered" | "token";

export const VERIFY: { id: Verify; label: string; ok: boolean; why: string }[] = [
  {
    id: "checkbox",
    label: "The child ticks “My parent agrees”",
    ok: false,
    why: "Not verifiable. Rule 10 needs the fiduciary to confirm the parent is an identifiable adult.",
  },
  {
    id: "registered",
    label: "The parent already has an account with verified identity and age",
    ok: true,
    why: "Rule 10 cases 1 and 3: check the reliable identity and age details you already hold.",
  },
  {
    id: "token",
    label:
      "The parent shares age details issued by a government-entrusted body, e.g. via DigiLocker",
    ok: true,
    why: "Rule 10 cases 2 and 4: identity and age details, or a virtual token, from an entity entrusted by law or government.",
  },
];

export type Feature = "recs" | "ads" | "progress" | "location" | "streaks" | "filter";

export const FEATURES: {
  id: Feature;
  label: string;
  verdict: (school: boolean) => { ok: boolean; why: string };
}[] = [
  {
    id: "recs",
    label: "Personalised lessons from learning behaviour",
    verdict: (school) =>
      school
        ? {
            ok: true,
            why: "An educational institution may monitor behaviour for its educational activities.",
          }
        : {
            ok: false,
            why: "Likely behavioural monitoring, barred for children even with parental consent.",
          },
  },
  {
    id: "ads",
    label: "Ads targeted at the child",
    verdict: () => ({
      ok: false,
      why: "Targeted advertising directed at children is barred. No exemption.",
    }),
  },
  {
    id: "progress",
    label: "Progress reports to the child's school",
    verdict: (school) =>
      school
        ? { ok: true, why: "Tracking for the school's educational activities is exempt." }
        : { ok: false, why: "Tracking a child is barred unless an exemption applies." },
  },
  {
    id: "location",
    label: "Live location so a parent can see the child is safe",
    verdict: () => ({
      ok: true,
      why: "Real-time location for the child's safety is an exempt purpose.",
    }),
  },
  {
    id: "streaks",
    label: "Streaks that shame a child for missing a day",
    verdict: () => ({
      ok: false,
      why: "Likely harmful to well-being (s.9(2)), which is never exempt.",
    }),
  },
  {
    id: "filter",
    label: "Filtering harmful content and ads",
    verdict: () => ({
      ok: true,
      why: "Protecting a child from harmful content is an exempt purpose.",
    }),
  },
];

export const CASES: { id: string; starts: string; parent: string; check: string }[] = [
  {
    id: "1",
    starts: "The child signs up and names a parent",
    parent: "Parent already registered",
    check: "Confirm you hold reliable identity and age details showing an adult.",
  },
  {
    id: "2",
    starts: "The child signs up and names a parent",
    parent: "Parent not registered",
    check:
      "Check government-entrusted identity and age details or a virtual token (DigiLocker optional).",
  },
  {
    id: "3",
    starts: "The parent creates the child's account",
    parent: "Parent already registered",
    check: "Same as case 1.",
  },
  {
    id: "4",
    starts: "The parent creates the child's account",
    parent: "Parent not registered",
    check: "Same as case 2.",
  },
];
