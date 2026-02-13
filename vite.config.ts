import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Custom domain is the root, so use "/" in production.
  base: mode === "production" ? "/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  assetsInclude: [
    "**/*.MOV",
    "**/*.mov",
    "**/*.JPG",
    "**/*.jpg",
    "**/*.JPEG",
    "**/*.jpeg",
    "**/*.PNG",
    "**/*.png",
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
