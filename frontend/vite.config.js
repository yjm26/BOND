import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  plugins: [react()],
  base: '/',
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Split stable, rarely-changing vendors into their own long-cached chunks.
        // App code changes every deploy; react/ethers almost never do → keep them
        // in separate files so returning users re-download only what actually changed.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'vendor-react'
          }
          if (/[\\/]node_modules[\\/]ethers[\\/]/.test(id)) return 'vendor-ethers'
          return undefined
        },
      },
    },
  },
}))
