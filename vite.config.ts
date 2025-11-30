import netlifyPlugin from "@netlify/vite-plugin-react-router";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    netlifyPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "posts/*/*.{png,jpg,jpeg,gif,svg,webp}",
          dest: "images",
          rename: (
            fileName: string,
            fileExtension: string,
            fullPath: string
          ) => {
            const match = fullPath.match(/posts\/([^/]+)\//);
            const slug = match ? match[1] : "";
            return `${slug}/${fileName}.${fileExtension}`;
          },
        },
      ],
    }),
  ],
});
