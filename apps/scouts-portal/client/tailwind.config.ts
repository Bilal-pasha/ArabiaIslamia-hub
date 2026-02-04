import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecf0ff",
          100: "#dde3ff",
          200: "#c2cbff",
          300: "#9ca8ff",
          400: "#7579ff",
          500: "#635BFF",
          600: "#4d36f5",
          700: "#422ad8",
          800: "#3625ae",
          900: "#2f2689",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite-react/plugin")],
};
export default config;
