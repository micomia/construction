// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";   // ← 追加

// __dirname 相当を自力で作る（ESM 用）
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),   // "@/…" を <root>/src にマッピング
      // 必要なら "src": resolve(__dirname, "src") もここに追加
    },
  },
});
