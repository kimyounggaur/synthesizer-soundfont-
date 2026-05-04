import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/synthesizer-soundfont-/',
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: 'index.source.html',
    },
  },
  plugins: [react()],
});
