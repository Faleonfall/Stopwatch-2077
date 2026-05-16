import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative assets keep the build working on the GitHub Pages project URL.
  base: "./",
  plugins: [vue(), tailwindcss()],
});
