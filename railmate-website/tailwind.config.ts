import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#080D17",
        "bg-elevated": "#0F1929",
        "bg-card": "#162035",
        "bg-overlay": "#1A2840",
        brand: "#00A859",
        "brand-dim": "#007A40",
        accent: "#F5A623",
        "border-subtle": "#1E2E42",
        "border-strong": "#2A3F57",
        "text-primary": "#F0F4FF",
        "text-secondary": "#8FA3C0",
        "text-tertiary": "#4E6480",
        danger: "#E8394B",
        success: "#00C977",
        info: "#4EA8E0",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        bengali: ["var(--font-bengali)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse_slow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-up-delay": "fadeInUp 0.6s ease-out 0.2s forwards",
        "fade-in-up-delay-2": "fadeInUp 0.6s ease-out 0.4s forwards",
        shimmer: "shimmer 1.5s linear infinite",
        pulse_slow: "pulse_slow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
