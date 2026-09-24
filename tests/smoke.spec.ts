import { expect, test } from "@playwright/test";
import { tracks, trackModules } from "../catalogue";

// Every page in the catalogue must render without errors.
for (const track of tracks) {
  test(`track page: ${track.slug}`, async ({ page }) => {
    await page.goto(`/tracks/${track.slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(track.title);
  });

  for (const m of trackModules(track)) {
    test(`module: ${track.slug}/${m.slug}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/tracks/${track.slug}/${m.slug}/`);
      await expect(page.getByText(m.title).first()).toBeVisible();
      if (m.status === "live") {
        await expect(page.getByRole("button", { name: /continue/i })).toBeVisible();
      }
      expect(errors).toEqual([]);
    });
  }
}

test("progress survives a reload", async ({ page }) => {
  await page.goto("/tracks/playground/rows-vs-columns/");
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /columnar layout/i }).click();
  await page.waitForTimeout(400); // progress saves are debounced
  await page.reload();
  await expect(page.getByText("Same data, two layouts").first()).toBeVisible();
  const saved = await page.evaluate(() => localStorage.getItem("zucol-learn:v1"));
  expect(JSON.parse(saved!).state.tracks.playground["rows-vs-columns"].state.layout).toBe("column");
});
