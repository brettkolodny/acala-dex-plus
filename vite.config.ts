import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9090,
  },
  build: {
    target: ["es2020"],
  },
  plugins: [svelte()],
});
