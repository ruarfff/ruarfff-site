import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { test } from "node:test";
import express from "express";

test("published images and client assets serve the expected MIME type and bytes", async () => {
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
    const files = [...images, "profile-pic.jpg", "icon.png"].map((file) => `images/${file}`);

    for (const file of await fs.readdir("build/client/assets")) {
      if (/\.(js|css)$/.test(file)) files.push(`assets/${file}`);
    }

    for (const file of files) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}/${file}`);
      assert.equal(response.status, 200);
      const mime = file.endsWith(".css") ? /^text\/css/ : file.endsWith(".js") ? /^(text|application)\/javascript/ : /^image\//;
      assert.match(response.headers.get("content-type"), mime);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), await fs.readFile(path.join("build/client", file)));
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
