import { defineConfig } from 'vite'
import { glob } from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        ...Object.fromEntries(
          glob.sync('src/js/**/*.ts').map((file) => [
            path.relative('src/js', file).replace(/\.ts$/, ''),
            path.resolve(file)
          ])
        )
      },
      output: {
        entryFileNames: 'assets/js/[name].js',
      }
    }
  }
})