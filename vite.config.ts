import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": { target: "http://amu.theaipeople.uk:3001", changeOrigin: true },
      "/ws":  { target: "ws://amu.theaipeople.uk:3001",   changeOrigin: true, ws: true },
    },
  },
})
