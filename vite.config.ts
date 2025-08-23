import { reactRouter } from "@react-router/dev/vite";
import netlifyPlugin from "@netlify/vite-plugin-react-router";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    reactRouter(),
    netlifyPlugin(),
  ],
  resolve: {
    alias: {
      "~": "/app",
    },
  },
});