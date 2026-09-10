import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this project from /taskflow/, not the domain root.
  // Without a matching base the built asset URLs resolve to / and 404.
  base: '/taskflow/',
})
