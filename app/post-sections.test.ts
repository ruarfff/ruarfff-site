import { afterEach, describe, expect, it, vi } from "vitest";
import { getPost, getPosts } from "~/post";

vi.mock("node:fs/promises", () => ({
  default: {
    readdir: vi.fn(async () => [
      "existing-tech",
      "personal-story",
      "personal-draft",
    ]),
    readFile: vi.fn(async (filepath: string) => {
      const personal = filepath.includes("personal-");
      const draft = filepath.includes("personal-draft");
      return Buffer.from(
        `---\ntitle: Example\ndate: 2026-09-13\n${personal ? "section: personal\n" : ""}${draft ? "draft: true\n" : ""}---\nArticle body.`
      );
    }),
  },
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("writing sections", () => {
  it("keeps existing posts in tech and personal posts in their own index", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect((await getPosts("tech")).map((post) => post.slug)).toEqual([
      "/posts/existing-tech",
    ]);
    expect((await getPosts("personal")).map((post) => post.slug)).toEqual([
      "/posts/personal-story",
    ]);
    expect(await getPosts()).toHaveLength(2);
  });

  it("previews personal drafts locally and keeps them out of the tech index", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(await getPosts("personal")).toHaveLength(2);
    expect(await getPosts("tech")).toHaveLength(1);
  });

  it("reads personal articles through their existing post URLs", async () => {
    const post = await getPost("personal-story");
    expect(post).toMatchObject({
      section: "personal",
      markdown: "Article body.",
    });
  });

  it("blocks direct personal draft access in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(getPost("personal-draft")).rejects.toMatchObject({
      status: 404,
    });
  });
});
