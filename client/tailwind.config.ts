import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        midground: "var(--midground)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        h1: [
          "4.5rem", // 72px
          { lineHeight: "95%", letterSpacing: "-0.03em" },
        ],
        h2: [
          "3.5rem", // 56px
          { lineHeight: "105%", letterSpacing: "-0.03em" },
        ],
        h3: [
          "3rem", // 48px
          { lineHeight: "115%", letterSpacing: "-0.03em" },
        ],
        h4: [
          "2rem", // 32px
          { lineHeight: "135%", letterSpacing: "-0.03em" },
        ],
        h5: [
          "1.5rem", // 24px
          { lineHeight: "135%", letterSpacing: "-0.03em" },
        ],
        h6: [
          "1rem", // 16px
          { lineHeight: "135%", letterSpacing: "-0.03em" },
        ],
        // Override default text-sm
        sm: [
          "0.875rem", // 14px (default Tailwind sm size)
          {
            lineHeight: "135%",
            letterSpacing: "-0.03em",
          },
        ],
        // Custom text-desc
        desc: [
          "0.625rem", // 10px
          {
            lineHeight: "135%",
            letterSpacing: "-0.03em",
          },
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
