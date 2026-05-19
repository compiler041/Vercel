import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/deploy": { target: "http://localhost:3000", changeOrigin: true },
      "/status": { target: "http://localhost:3000", changeOrigin: true },
      "/deployments": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});