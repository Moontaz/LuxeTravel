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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
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
