import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { test } from "node:test";
import express from "express";

test("published image output contains the source bytes and serves images", async () => {
  const images = [];

  for (const entry of await fs.readdir("posts", { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    for (const file of await fs.readdir(path.join("posts", entry.name))) {
      if (!/\.(png|jpg|jpeg|gif|svg|webp)$/.test(file)) continue;
      const relative = path.join(entry.name, file);
      const source = await fs.readFile(path.join("posts", relative));
      const output = await fs.readFile(path.join("build/client/images", relative));
      assert.deepEqual(output, source, relative);
      images.push(relative);
    }
  }

  assert.ok(images.length > 0);

  for await (const file of await fs.glob("build/client/**/*.md")) {
    assert.fail(`Markdown must not be public: ${file}`);
  }

  const app = express();
  app.use(express.static("build/client"));
  const server = http.createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    for (const file of [images[0], "get-started-with-mastadon/servers.png", "profile-pic.jpg"]) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}/images/${file}`);
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /^image\//);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), await fs.readFile(path.join("build/client/images", file)));
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
