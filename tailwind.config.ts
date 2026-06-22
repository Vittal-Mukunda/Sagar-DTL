import type { Config } from "tailwindcss";

/**
 * Bauhaus design tokens — the single source of truth for colors, shadows and
 * the geometric type scale. Components reference these names instead of raw hex.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F0F0F0",
        foreground: "#121212",
        bauhaus: {
          red: "#D02020",
          blue: "#1040C0",
          yellow: "#F0C020",
        },
        muted: "#E0E0E0",
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #121212",
        "hard-sm": "3px 3px 0px 0px #121212",
        "hard-md": "6px 6px 0px 0px #121212",
        "hard-lg": "8px 8px 0px 0px #121212",
      },
      borderColor: {
        DEFAULT: "#121212",
      },
      transitionTimingFunction: {
        mechanical: "cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
