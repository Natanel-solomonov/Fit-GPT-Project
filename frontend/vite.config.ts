import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://fit-gpt-frontend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '')
      }
    }
  },
  plugins: [react()],
})
