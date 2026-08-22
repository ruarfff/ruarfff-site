import { afterEach, describe, expect, it, vi } from "vitest";
import { getPost, getPosts } from "~/post";

const draftSlug = "being-too-productive-is-unproductive";

function setNodeEnv(value: "development" | "production") {
  vi.stubEnv("NODE_ENV", value);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("draft posts", () => {
  it("includes drafts during local development", async () => {
    setNodeEnv("development");

    const posts = await getPosts();

    expect(posts).toContainEqual(
      expect.objectContaining({
        slug: `/posts/${draftSlug}`,
        draft: true,
      })
    );
  });

  it("excludes drafts from production post lists", async () => {
    setNodeEnv("production");

    const posts = await getPosts();

    expect(posts).not.toContainEqual(
      expect.objectContaining({ slug: `/posts/${draftSlug}` })
    );
  });

  it("returns drafts during local development", async () => {
    setNodeEnv("development");

    const post = await getPost(draftSlug);

    expect(post.draft).toBe(true);
  });

  it("returns not found for a draft URL in production", async () => {
    setNodeEnv("production");

    await expect(getPost(draftSlug)).rejects.toMatchObject({ status: 404 });
  });
});
