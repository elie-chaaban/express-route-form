// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // <-- Important for Azure Static Web Apps
  build: {
    outDir: "dist",
  },
});
