import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth':   'http://localhost:3001',
      '/upload': 'http://localhost:3001',
      '/posts':  'http://localhost:3001',
      '/admin':  'http://localhost:3001',
    },
  },
});
