import { defineConfig } from 'vite';
import path from 'path-browserify';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname),
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      path: 'path-browserify',
      '@': path.resolve(__dirname, 'src'),
    },
  },
});