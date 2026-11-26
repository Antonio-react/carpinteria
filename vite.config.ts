import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { preloadCritical } from './vite/preloadCritical.ts'
import { seoFiles } from './vite/seoFiles.ts'
import { seoHead } from './vite/seoHead.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Variables de .env y, en Netlify, las del panel (allí tienen prioridad las del panel).
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [
      react(),
      tailwindcss(),
      preloadCritical(),
      seoHead(env.VITE_SITE_DOMAIN),
      seoFiles(env.VITE_SITE_DOMAIN),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
