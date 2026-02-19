
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#3D0301",
        "accent-dark": "#B03052",
        "accent-light": "#D76C82",
        "background-light": "#EBE8DB",
        "background-dark": "#23100f",
      },
      fontFamily: {
        "display": ["var(--font-manrope)", "sans-serif"],
        "serif": ["var(--font-playfair-display)", "serif"],
        "mono": ["var(--font-jetbrains-mono)", "monospace"],
        "handwriting": ["var(--font-la-belle)", "cursive"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
