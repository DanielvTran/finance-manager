import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        lg: "1024px", // Small Desktop
        xl: "1280px", // Large Desktop
        "2xl": "1536px", // Extra Large Desktop
        "3xl": "1920px", // Ultra Large Screens
      },
      colors: {
        primary: "#323E42",
        secondary: "#98FF98",
      },
      keyframes: {
        hovertilt: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(10deg)" },
          "75%": { transform: "rotate(-10deg)" },
        },
        tilt: {
          "0%, 100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        hovertilt: "hovertilt 0.5s ease-in-out infinite",
        tilt: "hovertilt 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [daisyui],
} satisfies Config;
