import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: true, // bắt buộc để lắng nghe 0.0.0.0
    port: 4173,
    allowedHosts: ['app.sugarnest.io.vn', 'dashboard.sugarnest.io.vn'],
  },
});
