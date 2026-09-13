import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Plugin } from "vite";

type Image = { width: number; height: number; srcSet?: string };

async function prepareImages(root: string) {
  const metadata: Record<string, Record<string, Image>> = {};
  const assets = new Map<string, Buffer>();

  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const images: Record<string, Image> = {};

    for (const file of await fs.readdir(path.join(root, entry.name))) {
      if (!/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file)) continue;
      const source = path.join(root, entry.name, file);
      const info = await sharp(source).metadata();
      const { width, height } = info.autoOrient;
      const image: Image = { width, height: info.pageHeight ?? height };
      images[file] = image;

      if (info.format === "svg" || (info.pages ?? 1) > 1) continue;
      const candidates = [];

      for (const size of [
        ...new Set([480, 960, 1792, Math.min(width, 1792)]),
      ].sort((a, b) => a - b)) {
        if (size > width) continue;
        const filename = `images/responsive/${entry.name}/${file}-${size}.webp`;

        const bytes = await sharp(source)
          .autoOrient()
          .resize({ width: size, withoutEnlargement: true })
          .webp({ quality: 90 })
          .toBuffer();

        assets.set(filename, bytes);
        candidates.push(
          `/${filename.split("/").map(encodeURIComponent).join("/")} ${size}w`
        );
      }

      image.srcSet = candidates.join(", ");
    }

    metadata[entry.name] = images;
  }

  return { metadata, assets };
}

export default function postImages(): Plugin {
  const root = path.resolve("posts");
  let prepared: ReturnType<typeof prepareImages> | undefined;

  const prepare = () => {
    prepared ??= prepareImages(root).catch((error) => {
      prepared = undefined;
      throw error;
    });

    return prepared;
  };

  return {
    name: "post-images",
    resolveId(id) {
      if (id === "virtual:post-images") return "\0virtual:post-images";
    },
    async load(id) {
      if (id === "\0virtual:post-images") {
        return `export default ${JSON.stringify((await prepare()).metadata)}`;
      }
    },
    async generateBundle() {
      if (this.environment.name !== "client") return;

      for (const [fileName, source] of (await prepare()).assets) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        try {
          const pathname = new URL(request.url ?? "/", "http://localhost")
            .pathname;

          if (!pathname.startsWith("/images/responsive/")) return next();

          const bytes = (await prepare()).assets.get(
            decodeURI(pathname.slice(1))
          );

          if (!bytes) return next();
          response.setHeader("Content-Type", "image/webp");
          response.end(bytes);
        } catch (error) {
          next(error);
        }
      });
      server.watcher.on("all", (_event, filename) => {
        if (
          filename.startsWith(`${root}${path.sep}`) &&
          /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(filename)
        ) {
          prepared = undefined;
          server.moduleGraph.invalidateAll();
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}
