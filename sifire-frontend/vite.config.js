import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/usuarios':  { target: 'http://localhost:8081', changeOrigin: true },
      '/api/reportes':  { target: 'http://localhost:8082', changeOrigin: true },
      '/api/monitoreo': { target: 'http://localhost:8083', changeOrigin: true },
      '/api/alertas':   { target: 'http://localhost:8084', changeOrigin: true },
    }
  }
})
