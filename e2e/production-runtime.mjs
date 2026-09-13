import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

test("the generated function starts without automatic module syntax detection", async () => {
  const directory = await fs.mkdtemp(path.resolve("build/server/runtime-test-"));

  try {
    // Netlify loads the server bundle as ESM. Keep that explicit while testing
    // dependency interpretation without local Node's automatic syntax detection.
    const bundle = path.join(directory, "index.mjs");
    await fs.copyFile("build/server/index.js", bundle);
    const entry = await fs.readFile(".netlify/v1/functions/react-router-server.mjs", "utf8");
    const handler = path.join(directory, "handler.mjs");
    await fs.writeFile(handler, entry.replace("../../../build/server/index.js", pathToFileURL(bundle).href));

    const result = spawnSync(process.execPath, [
      "--no-experimental-detect-module", "--input-type=module", "--eval",
      `import assert from "node:assert/strict";
       import handler from ${JSON.stringify(pathToFileURL(handler).href)};
       for (const pathname of ["/", "/personal", "/posts/angular-and-redux"]) {
         const response = await handler(new Request("http://site.test" + pathname), {});
         assert.equal(response.status, 200, pathname);
         const body = await response.text();
         if (pathname.startsWith("/posts/")) {
           assert.ok(body.includes("code-example"));
           assert.ok(body.includes("token keyword"));
         }
       }`,
    ], {
      cwd: process.cwd(),
      env: { PATH: process.env.PATH, NODE_ENV: "production" },
      encoding: "utf8", timeout: 15000,
    });

    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
