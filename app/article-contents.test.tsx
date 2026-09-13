import fs from "node:fs/promises";
import { render } from "@testing-library/react";
import parseFrontMatter from "front-matter";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vitest";
import articleContents from "./article-contents";

function renderArticle(markdown: string) {
  return render(
    <ReactMarkdown rehypePlugins={[articleContents]}>{markdown}</ReactMarkdown>
  );
}

describe("article contents", () => {
  it.each([
    "tech-stuff-found-2nd-half-2020",
    "team-secrets",
  ])("renders clean headings and working contents for %s", async (slug) => {
    const source = await fs.readFile(`posts/${slug}/index.md`, "utf8");
    const { container } = renderArticle(parseFrontMatter(source).body);
    const toc = container.querySelector('nav[aria-label="Table of contents"]');
    expect(toc).not.toBeNull();
    expect(container.querySelectorAll("nav")).toHaveLength(1);
    expect(container.querySelectorAll("a[name]")).toHaveLength(0);

    for (const heading of container.querySelectorAll("h2, h3")) {
      expect(heading.textContent).not.toContain("<a");
      expect(heading.textContent).not.toBe("Contents");
    }

    for (const link of toc?.querySelectorAll("a") ?? []) {
      const id = decodeURIComponent(link.hash.slice(1));

      const target = [...container.querySelectorAll("h2, h3")].find(
        (heading) => heading.id === id
      );

      expect(target?.textContent?.trim()).toBe(link.textContent);
    }

    for (const link of container.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]'
    )) {
      expect(
        [...container.querySelectorAll("[id]")].some(
          (node) => node.id === decodeURIComponent(link.hash.slice(1))
        )
      ).toBe(true);
    }
  });

  it("preserves custom legacy anchors and nests subheadings", () => {
    const { container } = renderArticle(
      '## Contents\n\n- [New title](#old-link)\n\n## New title <a name="old-link"></a>\n\n### Detail\n\n## Last section'
    );

    expect(container.querySelector("h2")?.id).toBe("old-link");
    expect(container.querySelector("h2")?.textContent).toBe("New title");
    expect(
      container.querySelector('nav a[href="#old-link"]')?.textContent
    ).toBe("New title");
    expect(
      container.querySelector('nav ul ul a[href="#detail"]')?.textContent
    ).toBe("Detail");
  });

  it("generates unique IDs from formatted headings and leaves code examples intact", () => {
    const { container } = renderArticle(
      '## Use **async** and `await`\n\n## Repeat\n\n## Repeat\n\n```md\n## Example <a name="example"></a>\n```'
    );

    expect(
      [...container.querySelectorAll("h2")].map((heading) => heading.id)
    ).toEqual(["use-async-and-await", "repeat", "repeat-1"]);
    expect(container.querySelector("code.language-md")?.textContent).toContain(
      '<a name="example"></a>'
    );
    expect(container.querySelector("nav")).toBeNull();
  });

  it("keeps named anchors distinct from automatic IDs", () => {
    const { container } = renderArticle(
      '## One <a id="shared"></a>\n\n## Shared\n\n## Three <a name="shared"></a>'
    );

    const ids = [...container.querySelectorAll("h2")].map(
      (heading) => heading.id
    );

    expect(new Set(ids).size).toBe(3);
    expect(ids[0]).toBe("shared");
  });

  it("groups sibling subheadings under their section", () => {
    const { container } = renderArticle(
      "## Table of contents\n\n1. [First](#first)\n\n## First\n\n### One\n\n### Two\n\n#### Detail\n\n## Second"
    );

    const root = container.querySelector("nav details > ul");
    expect(root?.children).toHaveLength(2);
    const nested = root?.children[0].querySelector("ul");
    expect(nested?.children).toHaveLength(2);
    expect(nested?.children[1].querySelector("ul a")?.textContent).toBe(
      "Detail"
    );
  });

  it("does not add contents to short posts or execute raw HTML", () => {
    const { container } = renderArticle(
      '## Only section\n\n<script>alert("example")</script>'
    );

    expect(container.querySelector("nav")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
  });

  it("does not add contents to a real post that has not defined one", async () => {
    const source = await fs.readFile(
      "posts/local-coding-agent-on-macos/index.md",
      "utf8"
    );

    const { container } = renderArticle(parseFrontMatter(source).body);
    expect(container.querySelectorAll("h2").length).toBeGreaterThan(1);
    expect(container.querySelector("nav")).toBeNull();
    expect(container.querySelector("#selecting-a-model")).not.toBeNull();
  });

  it("leaves a Contents heading without a list as ordinary article content", () => {
    const { container } = renderArticle(
      "## Contents\n\nAn ordinary section.\n\n## Another section"
    );

    expect(container.querySelector("nav")).toBeNull();
    expect(container.querySelector("#contents")?.textContent).toBe("Contents");
  });
});
