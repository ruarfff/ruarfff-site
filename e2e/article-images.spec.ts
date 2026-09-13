import { expect, test } from "@playwright/test";

test("article images reserve space and defer images below the viewport", async ({
  page,
}) => {
  await page.route("**/images/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.continue();
  });
  await page.goto("/posts/big-companies-bad");
  const images = page.locator("article img");
  const first = images.first();
  await expect(first).toHaveAttribute("loading", "eager");
  await expect(first).toHaveAttribute("width", /^[1-9]\d*$/);
  await expect(first).toHaveAttribute("height", /^[1-9]\d*$/);
  await expect(first).toHaveAttribute("srcset", /\.webp \d+w/);
  const last = images.last();
  await expect(last).toHaveAttribute("loading", "lazy");
  expect(
    await last.evaluate(
      (image) => image instanceof HTMLImageElement && image.complete
    )
  ).toBe(false);

  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((element) =>
          element instanceof HTMLImageElement ? element.naturalWidth : 0
        )
      )
      .toBeGreaterThan(0);

    const dimensions = await image.evaluate((element) => {
      if (!(element instanceof HTMLImageElement))
        throw new Error("Expected image");
      const image = element;

      return {
        rendered: image.width / image.height,
        intrinsic:
          Number(image.getAttribute("width")) /
          Number(image.getAttribute("height")),
      };
    });

    expect(Math.abs(dimensions.rendered - dimensions.intrinsic)).toBeLessThan(
      0.02
    );
  }
});

test("delayed image bytes do not move following content", async ({ page }) => {
  await page.goto("/posts/big-companies-bad");

  const markup = await page
    .locator("article img")
    .first()
    .evaluate((image) => image.outerHTML);

  let release = () => {};

  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });

  await page.route("**/images/**", async (route) => {
    await ready;
    await route.continue();
  });
  await page.setContent(
    `<style>img {max-width:100%;height:auto}</style><div style="width:320px">${markup}<p id="following">Following content</p></div>`,
    { waitUntil: "domcontentloaded" }
  );

  const before = await page
    .locator("#following")
    .evaluate((element) => element.getBoundingClientRect().top);

  release();
  await expect
    .poll(() => page.locator("img").evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);

  const after = await page
    .locator("#following")
    .evaluate((element) => element.getBoundingClientRect().top);

  expect(after).toBe(before);
});
