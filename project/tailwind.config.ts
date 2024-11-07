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
      colors: {
        primary: "#323E42", // Main color (Muted Dark Gray)
        secondary: "#98FF98", // Secondary color (Primary Mint Green)
      },
    },
  },
  plugins: [daisyui],
};

export default config;
