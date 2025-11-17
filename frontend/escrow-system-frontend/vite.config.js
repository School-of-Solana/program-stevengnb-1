import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['@solana/web3.js', 'buffer'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    watch: {
      usePolling: false,
      useFsEvents: true,
    },
    fs: {
      strict: false
    },
    sourcemapIgnoreList: (sourcePath) => {
      return sourcePath.includes('node_modules')
    }
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true
    },
    sourcemap: false
  },
  css: {
    devSourcemap: false
  }
})