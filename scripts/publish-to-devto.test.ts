// @vitest-environment node
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import parseFrontMatter from "front-matter";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("./publish-to-devto.ts", import.meta.url));

let directory: string;

beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "devto-publisher-test-"));
  await fs.mkdir(path.join(directory, "posts"));
  // Stub every HTTP request in the child process. No request leaves the test.
  await fs.writeFile(
    path.join(directory, "mock-fetch.mjs"),
    `import fs from "node:fs";
globalThis.fetch = async (url, options) => {
  fs.appendFileSync("requests.jsonl", JSON.stringify({ url, method: options.method, body: JSON.parse(options.body) }) + "\\n");
  return new Response(JSON.stringify({ id: 123, url: "https://dev.to/example/tech" }), { status: 200 });
};`
  );
});

describe("publishing metadata", () => {
  it.each([
    { id: "123", url: "https://dev.to/example/tech" },
    { id: 123 },
  ])("does not rewrite front matter for an invalid publishing response: %j", async (response) => {
    await addPost("tech");
    const filename = path.join(directory, "posts/tech/index.md");
    const before = await fs.readFile(filename, "utf8");

    await fs.writeFile(
      path.join(directory, "mock-fetch.mjs"),
      `globalThis.fetch = async () => Response.json(${JSON.stringify(response)});`
    );

    expect(publish("tech").status).toBe(1);
    expect(await fs.readFile(filename, "utf8")).toBe(before);
  });

  it("loads quoted dotenv values and comments with file-over-shell precedence", async () => {
    await addPost("tech");
    await fs.writeFile(
      path.join(directory, ".env"),
      `# Synthetic test configuration only
DEVTO_API_KEY="test-only-file-key" # inline comment
CANONICAL_HOST='https://fixture.example' # inline comment
`
    );
    await fs.writeFile(
      path.join(directory, "mock-fetch.mjs"),
      `
globalThis.fetch = async (_url, options) => {
  const body = JSON.parse(options.body);
  const valid = options.headers["api-key"] === "test-only-file-key" && body.article.canonical_url === "https://fixture.example/posts/tech";
  return Response.json({id:123,url:"https://dev.to/example/tech"}, {status:valid ? 200 : 400});
};`
    );
    const result = publish("tech");
    expect(result.status, result.output).toBe(0);
  });

  it("preserves YAML values and the article body when adding publishing metadata", async () => {
    await addPost("tech");
    const filename = path.join(directory, "posts/tech/index.md");

    const source = `---
title: "true"
date: "2026-09-13"
description: "123"
tags: ["true", "12", "2026-01-01", "a: b"]
custom:
  enabled: false
  label: "null"
  lines: |
    One
    Two
---

Body with **formatting**.\n\n`;

    await fs.writeFile(filename, source);
    const before = parseFrontMatter(source);
    expect(publish("tech").status).toBe(0);
    const after = parseFrontMatter(await fs.readFile(filename, "utf8"));
    expect(after.attributes).toEqual({
      title: "true",
      date: "2026-09-13",
      description: "123",
      tags: ["true", "12", "2026-01-01", "a: b"],
      custom: { enabled: false, label: "null", lines: "One\nTwo\n" },
      devto_id: 123,
      devto_url: "https://dev.to/example/tech",
    });
    expect(after.body).toBe(before.body);
  });

  it.each([
    true,
    false,
  ])("persists a recovered article ID only after a successful retry (%s)", async (success) => {
    await addPost(
      "tech",
      "devto_id: 12\ndevto_url: https://dev.to/example/old\n"
    );
    const filename = path.join(directory, "posts/tech/index.md");
    const original = await fs.readFile(filename, "utf8");
    await fs.writeFile(
      path.join(directory, "mock-fetch.mjs"),
      `
import fs from "node:fs";
globalThis.fetch = async (url) => {
  fs.appendFileSync("urls.jsonl", JSON.stringify(url) + "\\n");
  if (url.endsWith("/12")) return new Response("{}", {status:404});
  if (url.endsWith("/me/all")) return Response.json([{id:123,slug:"tech",title:"tech",url:"https://dev.to/example/tech"}]);
  return Response.json({id:123,url:"https://dev.to/example/tech"}, {status:${success ? 200 : 500}});
};`
    );
    expect(publish("tech", "y\n").status).toBe(success ? 0 : 1);
    const saved = await fs.readFile(filename, "utf8");

    if (!success) {
      expect(saved).toBe(original);

      return;
    }

    expect(parseFrontMatter(saved).attributes).toMatchObject({
      devto_id: 123,
      devto_url: "https://dev.to/example/tech",
    });
    await fs.writeFile(path.join(directory, "urls.jsonl"), "");
    expect(publish("tech", "y\n").status).toBe(0);
    expect(
      (await fs.readFile(path.join(directory, "urls.jsonl"), "utf8")).trim()
    ).toBe(JSON.stringify("https://dev.to/api/articles/123"));
  });
});

afterEach(async () => {
  await fs.rm(directory, { recursive: true, force: true });
});

async function addPost(slug: string, metadata = "") {
  const folder = path.join(directory, "posts", slug);
  await fs.mkdir(folder);
  await fs.writeFile(
    path.join(folder, "index.md"),
    `---\ntitle: ${slug}\ndate: 2026-09-13\n${metadata}---\nTest article body.`
  );
}

function publish(slug?: string, input?: string) {
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--import",
      path.join(directory, "mock-fetch.mjs"),
      script,
      ...(slug ? [slug] : []),
    ],
    {
      cwd: directory,
      // Do not inherit real credentials or Node preload configuration.
      env: { PATH: process.env.PATH, DEVTO_API_KEY: "test-only-fake-key" },
      input,
      encoding: "utf8",
      timeout: 10000,
    }
  );

  expect(result.error).toBeUndefined();

  return { status: result.status, output: result.stdout + result.stderr };
}

describe("Dev.to tech-only publishing", () => {
  it.each([
    "",
    "devto_id: 123\n",
  ])("rejects personal posts by slug, including previously published posts (%s)", async (metadata) => {
    await addPost("tech");
    await addPost("personal", `section: personal\n${metadata}`);

    const original = await fs.readFile(
      path.join(directory, "posts/personal/index.md"),
      "utf8"
    );

    const result = publish("personal");

    expect(result.status).toBe(1);
    expect(result.output).toContain(
      "Only tech blog posts can be sent to Dev.to"
    );
    await expect(
      fs.access(path.join(directory, "requests.jsonl"))
    ).rejects.toThrow();
    expect(
      await fs.readFile(path.join(directory, "posts/personal/index.md"), "utf8")
    ).toBe(original);
  });

  it("excludes personal posts from the interactive menu", async () => {
    await addPost("tech");
    await addPost("private-story", "section: personal\n");

    const result = publish(undefined, "1\n");

    expect(result.status).toBe(0);
    expect(result.output).not.toContain("private-story");

    const request = JSON.parse(
      await fs.readFile(path.join(directory, "requests.jsonl"), "utf8")
    );

    expect(request.body.article.title).toBe("tech");
  });

  it.each([
    "",
    "section: tech\n",
  ])("allows tech posts with supported metadata (%s)", async (metadata) => {
    await addPost("tech", metadata);

    expect(publish("tech").status).toBe(0);

    const request = JSON.parse(
      await fs.readFile(path.join(directory, "requests.jsonl"), "utf8")
    );

    expect(request.method).toBe("POST");
    expect(request.body.article.canonical_url).toBe(
      "https://ruarfff.com/posts/tech"
    );
  });

  it("does not offer unknown sections or an all-personal collection", async () => {
    await addPost("personal", "section: personal\n");
    await addPost("unknown", "section: other\n");

    const result = publish();

    expect(result.status).toBe(1);
    expect(result.output).toContain("No tech blog posts found");
    await expect(
      fs.access(path.join(directory, "requests.jsonl"))
    ).rejects.toThrow();
  });
});
