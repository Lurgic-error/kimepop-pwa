import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    srcDir: 'src',
    filename: 'service-worker.js',
    manifest: {
      name: "Kimepop PWA",
      theme_color: "#c3c3c3"
    },
    workbox: {
      sourcemap: true
    },
    strategies: 'injectManifest',
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
      /* other options */
    },
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
