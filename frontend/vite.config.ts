import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api/v1': {
        
  //       target: 'http://localhost:8766',
  //       changeOrigin: true,
       
  //     }
  //   }
  // },
  plugins: [react()],
})
