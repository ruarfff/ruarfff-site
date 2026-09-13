import { expect, test } from "@playwright/test";

for (const route of ["/", "/personal", "/about", "/posts/angular-and-redux"]) {
  test(`viewport metadata survives route metadata on ${route}`, async ({
    page,
    request,
  }) => {
    const response = await request.get(route);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html.match(/<meta\b[^>]*name="viewport"[^>]*>/g) ?? []).toHaveLength(
      1
    );
    await page.goto(route);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      "content",
      "width=device-width,initial-scale=1"
    );
    expect(await page.evaluate(() => window.innerWidth)).toBe(
      page.viewportSize()?.width
    );
  });
}

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
    await expect(heading).toHaveText("Tech blog");
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

  test("site and code themes are independent and persist across navigation", async ({
    page,
  }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.locator("summary").filter({ hasText: "Theme" }).click();
    const site = page.getByRole("switch", { name: "Site theme" });
    const code = page.getByRole("switch", { name: "Code theme" });
    const html = page.locator("html");
    await expect(site).toHaveAttribute("aria-checked", "false");
    await expect(code).toHaveAttribute("aria-checked", "true");
    await site.click();
    await expect(html).toHaveClass(/dark/);
    await expect(code).toHaveAttribute("aria-checked", "true");
    await code.click();
    await expect(html).toHaveAttribute("data-code-theme", "light");
    await expect(site).toHaveAttribute("aria-checked", "true");
    await page.reload();
    await expect(html).toHaveClass(/dark/);
    await expect(html).toHaveAttribute("data-code-theme", "light");

    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });

    await navigation
      .getByRole("link", { name: "Personal", exact: true })
      .click();
    await expect(page).toHaveURL(/\/personal$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Personal"
    );
    await navigation
      .getByRole("link", { name: "Tech blog", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Tech blog"
    );
    await expect(html).toHaveClass(/dark/);
    await expect(html).toHaveAttribute("data-code-theme", "light");
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
