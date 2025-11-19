import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ✅ use esbuild-based plugin
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../shared")
    }
  },
  root: path.resolve(__dirname),
  
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true
  },
  server: {
  
    port: 5174,
  
    proxy: {
    '/api': 'http://localhost:3000'
  },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  
});


  