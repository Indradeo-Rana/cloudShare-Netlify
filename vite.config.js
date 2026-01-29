import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // import Tailwind CSS 


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],   // add Tailwind CSS plugin
})
