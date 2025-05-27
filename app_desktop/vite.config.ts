import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // Output directory for the build
    assetsDir: "./", // Relative path for assets
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
    watch: {
      ignored: ["**/editor_db.db"], // Adjust path if needed
    },
  },
});
