import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { test } from "node:test";
import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handle = createRequestHandler(build, "production");

test("health checks never contact a caller-supplied host", async () => {
  const requests = [];

  const server = http.createServer((request, response) => {
    requests.push(request.url);
    response.end("listener");
  });

  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const authority = `127.0.0.1:${server.address().port}`;

  try {
    for (const headers of [
      { "X-Forwarded-Host": authority },
      { Host: authority },
      { "X-Forwarded-Host": "[malformed" },
      {},
    ]) {
      for (const method of ["GET", "HEAD"]) {
        const response = await handle(
          new Request("http://site.test/healthcheck", { method, headers })
        );

        assert.equal(response.status, 200);
        assert.equal(await response.text(), method === "HEAD" ? "" : "OK");
        assert.deepEqual(requests, []);
      }
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});


test("production article requests cannot escape the content root", async () => {
  const originalDirectory = process.cwd();
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "route-security-"));

  try {
    for (const slug of ["posts/valid", "posts/draft", "outside"]) {
      await fs.mkdir(path.join(directory, slug), { recursive: true });
      await fs.writeFile(path.join(directory, slug, "index.md"),
        `---\ntitle: Sentinel\ndate: 2026-09-13\ndraft: ${slug === "posts/draft"}\n---\nOUTSIDE_SENTINEL\n`);
    }

    process.chdir(directory);
    const fixtureBuild = await import("../build/server/index.js?security-fixture");
    const fixtureHandler = createRequestHandler(fixtureBuild, "production");

    for (const slug of ["..%2Foutside", "%2e%2e%2foutside", "..%5Coutside", "%252e%252e%252foutside", "%zz", "absent", "draft"]) {
      for (const suffix of ["", ".data"]) {
        const response = await fixtureHandler(new Request(`http://site.test/posts/${slug}${suffix}`));
        assert.equal(response.status, 404, slug);
        assert.ok(!(await response.text()).includes("OUTSIDE_SENTINEL"));
      }
    }

    const response = await fixtureHandler(new Request("http://site.test/posts/valid"));
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes("OUTSIDE_SENTINEL"));
  } finally {
    process.chdir(originalDirectory);
    await fs.rm(directory, { recursive: true, force: true });
  }
});
