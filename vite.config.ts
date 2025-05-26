// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./", // Or '/your-subdirectory-name/' if applicable
  build: {
    target: "esnext", // Good for modern browsers
  },
});
