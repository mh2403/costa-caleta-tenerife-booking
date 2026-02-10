import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/costa-caleta-tenerife-booking/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
