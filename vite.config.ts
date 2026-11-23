import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Two pages: the main site and the /photos/ album page
      input: {
        main: 'index.html',
        photos: 'photos/index.html',
      },
    },
  },
});
