import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6767,
    proxy: {
      // All /api requests go to Express — React has no idea Go exists
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      }
    }
  }
})
