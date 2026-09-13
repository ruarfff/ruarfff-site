// @vitest-environment node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let directory: string;

let originalDirectory: string;

let getPost: typeof import("./post").getPost;

let getPosts: typeof import("./post").getPosts;

beforeEach(async () => {
  originalDirectory = process.cwd();
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "post-test-"));
  await fs.mkdir(path.join(directory, "posts"));
  process.chdir(directory);
  vi.resetModules();
  ({ getPost, getPosts } = await import("./post"));
  vi.stubEnv("NODE_ENV", "production");
});

afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  process.chdir(originalDirectory);
  await fs.rm(directory, { recursive: true, force: true });
});

async function addPost(slug: string, metadata = "", title = "Example") {
  const folder = path.join(directory, "posts", slug);
  await fs.mkdir(folder);
  await fs.writeFile(
    path.join(folder, "index.md"),
    `---\ntitle: ${title}\ndate: 2026-09-13\n${metadata}---\nArticle body.\n`
  );
}

describe("post loading", () => {
  it("normalizes list and detail metadata consistently", async () => {
    await addPost("tech", "description: Example description\n");
    const detail = await getPost("tech");
    const { markdown, ...summary } = detail;
    expect(markdown).toBe("Article body.\n");
    expect(detail).toMatchObject({
      date: "2026-09-13",
      section: "tech",
      draft: false,
    });
    expect(await getPosts("tech")).toEqual([
      { ...summary, slug: "/posts/tech" },
    ]);
  });

  it("keeps personal posts distinct and legacy posts in tech", async () => {
    await addPost("tech");
    await addPost("personal", "section: personal\n");
    expect((await getPosts("tech")).map((p) => p.slug)).toEqual([
      "/posts/tech",
    ]);
    expect((await getPosts("personal")).map((p) => p.slug)).toEqual([
      "/posts/personal",
    ]);
    expect(await getPost("personal")).toMatchObject({ section: "personal" });
  });

  it.each([
    "tech",
    "personal",
  ])("hides %s drafts in production and previews them in development", async (section) => {
    await addPost("draft", `section: ${section}\ndraft: true\n`);
    expect(await getPosts()).toEqual([]);
    await expect(getPost("draft")).rejects.toMatchObject({ status: 404 });
    vi.stubEnv("NODE_ENV", "development");
    expect(await getPosts()).toHaveLength(1);
    expect(await getPost("draft")).toMatchObject({ draft: true, section });
  });

  it("returns not found for an absent article", async () => {
    await expect(getPost("absent")).rejects.toMatchObject({ status: 404 });
  });

  it("preserves unexpected filesystem failures", async () => {
    const error = Object.assign(new Error("Permission denied"), {
      code: "EACCES",
    });

    vi.spyOn(fs, "readFile").mockRejectedValueOnce(error);
    await expect(getPost("unreadable")).rejects.toBe(error);
  });

  it("ignores unrelated files without hiding posts", async () => {
    await addPost("tech");
    await fs.writeFile(path.join(directory, "posts", "README.md"), "Notes");
    expect(await getPosts()).toHaveLength(1);
  });

  it("distinguishes an empty collection from a missing directory", async () => {
    expect(await getPosts()).toEqual([]);
    await fs.rm(path.join(directory, "posts"), { recursive: true });
    await expect(getPosts()).rejects.toMatchObject({ code: "ENOENT" });
  });

  it.each([
    ["title: {nested: value}", "title"],
    ["title: ''", "title"],
    ["date: nonsense", "date"],
    ["date: '2026-02-30'", "date"],
    ["date: 2026-02-30", "date"],
    ["date: 2026-13-01", "date"],
    ["description: [bad]", "description"],
    ["draft: 'true'", "draft"],
    ["section: other", "section"],
  ])("rejects malformed metadata (%s) with a file and field diagnostic", async (line, field) => {
    const folder = path.join(directory, "posts", "invalid");
    await fs.mkdir(folder);

    const attributes = ["title: Example", "date: 2026-09-13"].filter(
      (value) => !value.startsWith(`${field}:`)
    );

    await fs.writeFile(
      path.join(folder, "index.md"),
      `---\n${[...attributes, line].join("\n")}\n---\nText`
    );
    const message = new RegExp(`invalid.*${field}`);
    await expect(getPost("invalid")).rejects.toThrow(message);
    await expect(getPosts()).rejects.toThrow(message);
  });
});
