import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { markdown } from './plugins/markdown.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [markdown(), react()],
})
