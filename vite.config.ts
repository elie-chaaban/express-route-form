// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Or '/your-subdirectory-name/' if applicable
  build: {
    target: "esnext", // Good for modern browsers
  },
});
