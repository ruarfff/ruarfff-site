import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.green.400"),
            a: {
              color: theme("colors.emerald.300"),
              "&:hover": {
                color: theme("colors.emerald.200"),
              },
            },
            h1: {
              color: theme("colors.emerald.300"),
            },
            h2: {
              color: theme("colors.emerald.300"),
            },
            h3: {
              color: theme("colors.emerald.300"),
            },
            h4: {
              color: theme("colors.emerald.300"),
            },
            h5: {
              color: theme("colors.emerald.300"),
            },
            h6: {
              color: theme("colors.emerald.300"),
            },
            blockquote: {
              color: theme("colors.emerald.300"),
            },
            ul: {
              color: theme("colors.emerald.300"),
            },
            li: {
              color: theme("colors.emerald.300"),
            },
            strong: {
              color: theme("colors.emerald.300"),
            },
            pre: {
              color: theme("colors.emerald.300"),
            },
            code: {
              color: theme("colors.emerald.300"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
