import type { Config } from "tailwindcss";
//import { colors } from "@/tokens/colors";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))"
        //...colors
      }
    }
  },
  plugins: []
};

export default config;
