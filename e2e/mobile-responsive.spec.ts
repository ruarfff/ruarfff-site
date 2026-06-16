import { expect, test } from "@playwright/test";

test.describe("Mobile Responsiveness", () => {
  test("blog list page has no horizontal scroll", async ({ page }) => {
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("blog list title is visible", async ({ page }) => {
    await page.goto("/");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Blog Posts");
  });

  test("blog post titles are readable size", async ({ page }) => {
    await page.goto("/");

    const firstPostLink = page.locator("li a").first();
    await expect(firstPostLink).toBeVisible();

    const fontSize = await firstPostLink.evaluate(
      (el) => window.getComputedStyle(el).fontSize
    );
    // text-xl is 1.25rem = 20px
    expect(Number.parseInt(fontSize, 10)).toBeGreaterThanOrEqual(20);
  });

  test("blog post prose text is readable", async ({ page }) => {
    await page.goto("/posts/a-gaggle-of-agents");

    const prose = page.locator(".prose");
    await expect(prose).toBeVisible();

    const fontSize = await prose.evaluate(
      (el) => window.getComputedStyle(el).fontSize
    );
    // prose-lg base is 18px
    expect(Number.parseInt(fontSize, 10)).toBeGreaterThanOrEqual(18);
  });

  test("blog post page has no horizontal scroll", async ({ page }) => {
    await page.goto("/posts/a-gaggle-of-agents");

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("blog post content is readable", async ({ page }) => {
    await page.goto("/posts/a-gaggle-of-agents");

    // Check that the main content is visible
    const article = page.locator("article");
    await expect(article).toBeVisible();

    // Check that the title is visible
    const title = page.locator("h1");
    await expect(title).toBeVisible();
  });

  test("legacy paths redirect to posts", async ({ page }) => {
    await page.goto("/angular-and-redux");
    await expect(page).toHaveURL(/\/posts\/angular-and-redux$/);
  });

  test("dark mode toggles theme class on html", async ({ page }) => {
    await page.goto("/about");
    const htmlElement = page.locator("html");
    const button = page.locator("button.js-change-theme");
    await expect(button).toBeVisible();

    const initialIsDark = await htmlElement.evaluate((el) =>
      el.classList.contains("dark")
    );

    await button.click();
    const afterClickIsDark = await htmlElement.evaluate((el) =>
      el.classList.contains("dark")
    );
    expect(afterClickIsDark).toBe(!initialIsDark);

    await button.click();
    const afterSecondClickIsDark = await htmlElement.evaluate((el) =>
      el.classList.contains("dark")
    );
    expect(afterSecondClickIsDark).toBe(initialIsDark);
  });

  test("blog post headings have id attributes for anchor links", async ({
    page,
  }) => {
    await page.goto("/posts/a-gaggle-of-agents");
    const heading = page.locator("h2#example-project-setup");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Example Project Setup");
  });
});
