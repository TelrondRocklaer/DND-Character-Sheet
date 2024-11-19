import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#c19976",       // Muddy Waters
        secondary: "#d62828ff",   // Fire Engine Red
        background: "#210124ff",  // Dark Purple
        text: "#f9dbbdff",        // Light Orange
      },
    },
  },
  plugins: [],
};
export default config;