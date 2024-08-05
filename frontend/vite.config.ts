import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const isDevelopment = process.env.NODE_ENV !== 'production';
const backendURL = isDevelopment ? 'http://localhost:8766' : 'https://fit-gpt-backend.onrender.com';
export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        
        target: backendURL,
        changeOrigin: true,
       
      }
    }
  },
  plugins: [react()],
})
