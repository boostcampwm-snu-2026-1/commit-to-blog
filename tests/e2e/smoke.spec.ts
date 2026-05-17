import { expect, test } from "@playwright/test";

test("home page loads with nav and heading", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Commit to Blog" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "My Blog" })).toBeVisible();
});
