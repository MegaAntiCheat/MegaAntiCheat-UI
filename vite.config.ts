import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './src',
  base: '/',
  build: {
    outDir: '../dist',
  },
  publicDir: '../public',
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'), // replace with actual path
      '@components': path.resolve(__dirname, './src/components'), // replace with actual path
      '@context': path.resolve(__dirname, './src/Context'), // replace with actual path
      '@i18n': path.resolve(__dirname, './i18n'), // replace with actual path
      // add more aliases as needed
    },
  },
});
