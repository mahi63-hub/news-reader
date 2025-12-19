import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",  // Changed from '/news-reader/' to './'
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
