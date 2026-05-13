import { expect, test } from "@playwright/test";

test("creates, saves, and publishes a generated blog post", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Commitgram")).toBeVisible();
  await page.getByRole("button", { name: /Studio/ }).click();

  await expect(page.getByLabel("Repository")).toHaveValue("octo/commit-to-blog");
  await expect(page.getByLabel("Branch")).toHaveValue("main");
  await expect(page.getByText("Add GitHub repository selector")).toBeVisible();

  await page.getByRole("button", { name: /Create Blog/ }).click();
  await expect(page.getByLabel("Title")).toHaveValue(/블로그 생성 MVP/);
  await expect(page.getByLabel("Markdown Body")).toContainText("커밋 하이라이트");

  await page.getByRole("button", { name: "저장", exact: true }).click();
  await expect(page.getByRole("heading", { name: /블로그 생성 MVP/ })).toBeVisible();
  await expect(page.getByText("draft").first()).toBeVisible();

  await page.getByTitle("좋아요").click();
  await expect(page.getByTitle("좋아요")).toContainText("1");
  await page.getByTitle("댓글").click();
  await expect(page.getByTitle("댓글")).toContainText("1");

  await page.getByRole("button", { name: /발행/ }).first().click();
  await expect(page.getByText("published").first()).toBeVisible();

  await page.getByRole("button", { name: "Published" }).click();
  await expect(page.getByRole("heading", { name: /블로그 생성 MVP/ })).toBeVisible();
  await page.getByRole("button", { name: "Drafts" }).click();
  await expect(page.getByText("아직 저장된 포스트가 없습니다.")).toBeVisible();
});
