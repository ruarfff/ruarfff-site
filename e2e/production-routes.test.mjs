import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import parseFrontMatter from "front-matter";
import { createRequestHandler } from "react-router";
import netlifyHandler from "../.netlify/v1/functions/react-router-server.mjs";
import * as build from "../build/server/index.js";

process.env.NODE_ENV = "production";

const handle = createRequestHandler(build, "production");

test("all current published articles and legacy routes remain available", async () => {
  for (const entry of await fs.readdir("posts", { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const { attributes } = parseFrontMatter(await fs.readFile(path.join("posts", entry.name, "index.md"), "utf8"));
    const response = await handle(new Request(`http://site.test/posts/${entry.name}`));
    assert.equal(response.status, attributes.draft ? 404 : 200, entry.name);
    await response.text();
  }

  for (const route of Object.values(build.routes)) {
    if (!route.id.startsWith("legacy-")) continue;
    const response = await handle(new Request(`http://site.test/${route.path}`));
    assert.equal(response.status, 302, route.path);
    assert.equal(response.headers.get("location"), `/posts/${route.path}`);
  }

  for (const pathname of ["/", "/posts", "/personal", "/about", "/posts/understanding-python-async", "/healthcheck"]) {
    const response = await netlifyHandler(new Request(`http://site.test${pathname}`), {});
    assert.equal(response.status, 200, pathname);
    assert.equal(response.headers.get("x-nf-runtime"), "Node");
    await response.text();
  }
});

test("personal content, drafts and metadata errors retain production behavior", async () => {
  const original = process.cwd();
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "production-content-"));

  try {
    for (const [slug, metadata, body] of [
      ["tech", "", "TECH_SENTINEL"],
      ["personal", "section: personal\n", "PERSONAL_SENTINEL"],
      ["draft", "draft: true\n", "DRAFT_SENTINEL"],
    ]) {
      await fs.mkdir(path.join(directory, "posts", slug), { recursive: true });
      await fs.writeFile(path.join(directory, "posts", slug, "index.md"), `---\ntitle: ${body}\ndate: 2026-09-13\n${metadata}---\n${body}`);
    }

    process.chdir(directory);
    const fixture = createRequestHandler(await import("../build/server/index.js?content-fixture"), "production");

    for (const [pathname, included, excluded] of [["/", "TECH_SENTINEL", "PERSONAL_SENTINEL"], ["/personal", "PERSONAL_SENTINEL", "TECH_SENTINEL"], ["/posts/personal", "PERSONAL_SENTINEL", "DRAFT_SENTINEL"]]) {
      for (const suffix of ["", ".data"]) {
        const response = await fixture(new Request(`http://site.test${pathname}${suffix}`));
        assert.equal(response.status, 200);
        const body = await response.text();
        assert.ok(body.includes(included));
        assert.ok(!body.includes(excluded));
        assert.ok(!body.includes("DRAFT_SENTINEL"));
      }
    }

    for (const suffix of ["", ".data"]) {
      const response = await fixture(new Request(`http://site.test/posts/draft${suffix}`));
      assert.equal(response.status, 404);
      assert.equal(response.headers.has("Netlify-CDN-Cache-Control"), false);
      assert.ok(!(await response.text()).includes("DRAFT_SENTINEL"));
    }

    await fs.writeFile(path.join(directory, "posts/tech/index.md"), "---\ntitle: Invalid\ndate: invalid\n---\nBody");
    const broken = createRequestHandler(await import("../build/server/index.js?invalid-fixture"), "production");

    for (const pathname of ["/", "/personal.data", "/posts/tech"]) {
      const response = await broken(new Request(`http://site.test${pathname}`));
      assert.equal(response.status, 500);
      assert.equal(response.headers.has("Netlify-CDN-Cache-Control"), false);
      await response.text();
    }
  } finally {
    process.chdir(original);
    await fs.rm(directory, { recursive: true, force: true });
  }
});
