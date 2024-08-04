import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/ap1/v1': 'https://fit-gpt-backend.onrender.com'
    }
  },
  plugins: [react()],
})
