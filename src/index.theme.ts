import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  theme: {
    screens: {
      mobile: "480px",
      tablet: "768px",
      laptop: "976px",
      desktop: "1440px",
    },

    fontFamily: {
      sans: "var(--font-sans)",
      heading: "var(--font-heading)",
      mono: "var(--font-mono)",
    },

    colors: {
      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring)",
      background: "var(--background)",
      foreground: "var(--foreground)",

      primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--primary-foreground)",
      },

      secondary: {
        DEFAULT: "var(--secondary)",
        foreground: "var(--secondary-foreground)",
      },

      destructive: {
        DEFAULT: "var(--destructive)",
        foreground: "var(--destructive-foreground)",
      },

      muted: {
        DEFAULT: "var(--muted)",
        foreground: "var(--muted-foreground)",
      },

      accent: {
        DEFAULT: "var(--accent)",
        foreground: "var(--accent-foreground)",
      },

      popover: {
        DEFAULT: "var(--popover)",
        foreground: "var(--popover-foreground)",
      },

      card: {
        DEFAULT: "var(--card)",
        foreground: "var(--card-foreground)",
      },
    },

    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
} as const satisfies Partial<Config>
