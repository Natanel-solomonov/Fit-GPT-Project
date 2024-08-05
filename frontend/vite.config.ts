import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// const isDevelopment = process.env.NODE_ENV !== 'production';
// const backendURL = isDevelopment ? 'http://localhost:8766' : 'https://fit-gpt-backend.onrender.com';
export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://fit-gpt-backend.onrender.com',
        changeOrigin: true,
        secure: true, // Use true if your backend is using HTTPS
        headers: {
          // Example headers that might help with forwarding credentials
          'Access-Control-Allow-Origin': 'https://fit-gpt-frontend.onrender.com',
          'Access-Control-Allow-Credentials': 'true',
        },
      },
    },
  },
  plugins: [react()],
});