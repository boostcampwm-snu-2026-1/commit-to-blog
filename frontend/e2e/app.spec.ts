import { expect, test } from "@playwright/test";

test("creates, saves, and publishes a generated blog post", async ({ page }) => {
  const title = `블로그 생성 MVP ${Date.now()}`;

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Commitgram" })).toBeVisible();
  await page.getByRole("link", { name: "Continue with GitHub" }).first().click();
  await expect(page.getByRole("button", { name: /mock-octocat/ })).toBeVisible();
  await page.getByRole("button", { name: /Studio/ }).click();

  await expect(page.getByLabel("Repository")).toHaveValue("octo/commit-to-blog");
  await expect(page.getByLabel("Branch")).toHaveValue("main");
  await expect(page.getByText("Add GitHub repository selector")).toBeVisible();

  await page.getByRole("button", { name: /Create Blog/ }).click();
  await expect(page.getByLabel("Title")).toHaveValue(/블로그 생성 MVP/);
  await expect(page.getByLabel("Markdown Body")).toContainText("커밋 하이라이트");
  await page.getByLabel("Title").fill(title);

  await page.getByRole("button", { name: "저장", exact: true }).click();
  const post = page.getByRole("article").filter({ has: page.getByRole("heading", { name: title }) });
  await expect(post).toBeVisible();
  await expect(post.getByText("draft")).toBeVisible();

  await post.getByTitle("좋아요").click();
  await expect(post.getByTitle("좋아요")).toContainText("1");
  await post.getByTitle("댓글").click();
  await expect(post.getByTitle("댓글")).toContainText("1");

  await post.getByRole("button", { name: /발행/ }).click();
  await expect(post.getByText("published")).toBeVisible();

  await page.getByRole("button", { name: "Published" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await page.getByRole("button", { name: "Drafts" }).click();
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
});
