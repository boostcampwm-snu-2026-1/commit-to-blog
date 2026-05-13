import { expect, test } from "@playwright/test";

test("creates, saves, and publishes a generated blog post", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Commit to Blog")).toBeVisible();
  await page.getByRole("button", { name: /포스트 작성/ }).click();

  await expect(page.getByLabel("Repository")).toHaveValue("octo/commit-to-blog");
  await expect(page.getByLabel("Branch")).toHaveValue("main");
  await expect(page.getByText("Add GitHub repository selector")).toBeVisible();

  await page.getByRole("button", { name: /Create Blog/ }).click();
  await expect(page.getByLabel("Title")).toHaveValue(/개발 기록/);
  await expect(page.getByLabel("Content")).toContainText("주요 변경");

  await page.getByRole("button", { name: "저장", exact: true }).click();
  await expect(page.getByRole("heading", { name: /개발 기록/ })).toBeVisible();
  await expect(page.getByText("draft").first()).toBeVisible();

  await page.getByRole("button", { name: /발행/ }).first().click();
  await expect(page.getByText("published").first()).toBeVisible();
});
