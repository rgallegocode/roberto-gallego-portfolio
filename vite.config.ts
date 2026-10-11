import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites under /<repo-name>/. CI sets VITE_BASE from the repository name.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/roberto-gallego-portfolio/',
  plugins: [react()],
})
