import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handle = createRequestHandler(build, "production");

test("public document and data responses have CDN caching", async () => {
  process.env.NODE_ENV = "production";

  for (const pathname of ["/", "/personal", "/posts", "/posts/big-companies-bad"]) {
    for (const suffix of ["", ".data?_routes=root"]) {
      for (const method of ["GET", "HEAD"]) {
        const url = pathname + suffix;
        const response = await handle(new Request(`http://site.test${url}`, { method }));
        assert.equal(response.status, 200, url);
        assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
        assert.equal(response.headers.get("netlify-cdn-cache-control"), "public, durable, max-age=3600, stale-while-revalidate=120");
        await response.text();
      }
    }
  }
});

test("errors, health checks and development responses are not publicly cached", async () => {
  process.env.NODE_ENV = "production";

  for (const pathname of ["/healthcheck", "/healthcheck.data", "/posts/missing", "/posts/missing.data"]) {
    const response = await handle(new Request(`http://site.test${pathname}`));
    assert.equal(response.headers.get("netlify-cdn-cache-control"), null);
    await response.text();
  }

  process.env.NODE_ENV = "development";

  try {
    for (const pathname of ["/", "/personal.data", "/posts/big-companies-bad"]) {
      const response = await handle(new Request(`http://site.test${pathname}`));
      assert.equal(response.headers.get("netlify-cdn-cache-control"), null);
      await response.text();
    }
  } finally {
    process.env.NODE_ENV = "production";
  }
});

test("cache middleware preserves variation and excludes failed or private responses", async () => {
  const middleware = build.routes.root.module.middleware[0];

  for (const status of [200, 404, 500]) {
    for (const method of ["GET", "POST"]) {
      const response = new Response("body", { status, headers: { Vary: "Accept", "X-Test": "retained" } });
      const result = await middleware({ request: new Request("http://site.test/", { method }) }, async () => response);
      assert.equal(result.headers.get("Vary"), "Accept");
      assert.equal(result.headers.get("X-Test"), "retained");
      assert.equal(result.headers.has("Netlify-CDN-Cache-Control"), status === 200 && method === "GET");
    }
  }

  const response = new Response("private", { headers: { "Set-Cookie": "fixture=value" } });
  const result = await middleware({ request: new Request("http://site.test/") }, async () => response);
  assert.equal(result.headers.has("Netlify-CDN-Cache-Control"), false);
});
