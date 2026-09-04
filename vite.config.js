import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  // Tambahkan base pada folder project ketika mau di build contoh "base="/sis/"
  base: "/",
  server: {
    host: true,
    allowedHosts: [
      "localhhost",
    ],
  },
});
