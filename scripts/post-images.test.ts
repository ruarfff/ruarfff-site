// @vitest-environment node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { createServer } from "vite";
import { expect, it } from "vitest";
import postImages from "./post-images";

it("derives dimensions and responsive candidates from synthetic images", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "image-fixture-"));
  const original = process.cwd();
  const folder = path.join(directory, "posts/example");
  await fs.mkdir(folder, { recursive: true });
  await sharp({
    create: { width: 1600, height: 800, channels: 3, background: "#345678" },
  })
    .png()
    .toFile(path.join(folder, "sample.png"));
  await fs.writeFile(
    path.join(folder, "vector.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect width="100" height="50" fill="red"/></svg>'
  );

  const frames = await sharp({
    create: { width: 20, height: 40, channels: 3, background: "red" },
  })
    .raw()
    .toBuffer();

  frames.fill(0, frames.length / 2);
  await sharp(frames, {
    raw: { width: 20, height: 40, channels: 3, pageHeight: 20 },
  })
    .gif()
    .toFile(path.join(folder, "animated.gif"));
  process.chdir(directory);
  const plugin = postImages();
  process.chdir(original);

  const server = await createServer({
    root: directory,
    configFile: false,
    plugins: [plugin],
    server: { middlewareMode: true, ws: false },
    optimizeDeps: { noDiscovery: true },
  });

  try {
    const { default: images } = await server.ssrLoadModule(
      "virtual:post-images"
    );

    expect(images.example["sample.png"]).toMatchObject({
      width: 1600,
      height: 800,
    });
    expect(images.example["sample.png"].srcSet).toContain(
      "sample.png-480.webp 480w"
    );
    expect(images.example["sample.png"].srcSet).toContain(
      "sample.png-1600.webp 1600w"
    );
    expect(images.example["sample.png"].srcSet).not.toContain("1792w");
    expect(images.example["vector.svg"]).toEqual({ width: 100, height: 50 });
    expect(images.example["animated.gif"]).toEqual({ width: 20, height: 20 });
  } finally {
    await server.close();
    process.chdir(original);
    await fs.rm(directory, { recursive: true, force: true });
  }
});
