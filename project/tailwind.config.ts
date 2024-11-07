import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
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
    },
  },
  plugins: [daisyui],
};

export default config;
