import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#080D17",
          elevated: "#0F1929",
          card: "#162035",
          overlay: "#1A2840",
        },
        primary: {
          DEFAULT: "#00A859",
          dim: "#007A40",
          subtle: "rgba(0, 168, 89, 0.09)",
        },
        accent: {
          DEFAULT: "#F5A623",
          dim: "#C4830A",
          subtle: "rgba(245, 166, 35, 0.09)",
        },
        danger: "#E8394B",
        success: "#00C977",
        info: "#4EA8E0",
        text: {
          primary: "#F0F4FF",
          secondary: "#8FA3C0",
          tertiary: "#4E6480",
          inverse: "#080D17",
        },
        border: {
          DEFAULT: "#1E2E42",
          strong: "#2A3F57",
          focus: "#00A859",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        bengali: ["var(--font-bengali)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
