import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative assets keep the same build working on both the custom domain
  // and the GitHub Pages project URL.
  base: "./",
  plugins: [vue(), tailwindcss()],
});
