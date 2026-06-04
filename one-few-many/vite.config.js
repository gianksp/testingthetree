import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  console.log('VITE mode:', mode)
  console.log('VITE_BASE_PATH:', env.VITE_BASE_PATH)

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
  }
})