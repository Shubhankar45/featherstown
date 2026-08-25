import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      // Dev-only: forward /api/* to the Express backend so the Vite dev
      // server (localhost:5173) can reach it on port 5000. This has NO
      // effect on the production build — in production Express serves the
      // built frontend and the API from the same origin.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
})
