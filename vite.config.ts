import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './src',
  base: './',
  build: {
    outDir: '../dist',
    assetsDir: '',
  },
  publicDir: '../public',
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/Context'),
      '@i18n': path.resolve(__dirname, './i18n'),
    },
  },
  server: {
    port: 3621,
  },
});
