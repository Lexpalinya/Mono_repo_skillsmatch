import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), TanStackRouterVite()],
  resolve: {
    alias: {

      "@": path.resolve(__dirname, "./src"),
      "@skillsmatch/ui": path.resolve(__dirname, "../../packages/ui"),
    },
  },
})
