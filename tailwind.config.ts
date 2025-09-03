import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: { fontWeight: "700" },
            h2: { fontWeight: "600" },
            "h1, h2, h3": { color: "#111827" }, // gray-900
            a: { textDecoration: "underline" },
            code: { backgroundColor: "rgba(0,0,0,0.04)", padding: "0.15rem 0.35rem", borderRadius: "0.25rem" },
          },
        },
        indigo: {
          css: {
            "--tw-prose-links": "#4f46e5", // indigo-600
            "--tw-prose-bullets": "#4f46e5",
          },
        },
      },
    },
  },
  plugins: [typography],
};
export default config;
