import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      inset: {
        '100': '100%',
      }
    },
  },
  plugins: [],
} satisfies Config;
