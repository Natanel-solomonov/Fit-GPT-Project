import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api/v1': {
  //       target: 'https://fit-gpt-backend.onrender.com',
  //       changeOrigin: true
      
  //     }
  //   }
  // },
  plugins: [react()],
})
