/** Attribution for quotations from (and adaptations of) the 2020 Scrum Guide, as CC BY-SA 4.0 requires. */
export function ScrumGuideCredit({ adapted = false }: { adapted?: boolean }) {
  return (
    <p className="text-subtle text-[10px] leading-snug">
      {adapted ? "Quotes from, and material adapted from," : "Quotes from"}{" "}
      <a
        href="https://scrumguides.org/scrum-guide.html"
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        The Scrum Guide
      </a>{" "}
      (November 2020) © 2020 Ken Schwaber and Jeff Sutherland, licensed under{" "}
      <a
        href="https://creativecommons.org/licenses/by-sa/4.0/"
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        CC BY-SA 4.0
      </a>
      . Quotations unchanged{adapted ? "; adapted parts are shared under the same licence" : ""}.
      Provided as-is, without warranties.
    </p>
  );
}
