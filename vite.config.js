
import { defineConfig } from 'vituum'

import pug from '@vituum/pug'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  imports: {
    filenamePattern: {
      '+.css': false,
      '+.scss': false,
      '+.js': false
    }
  },
  integrations: [
    pug()
  ],
  templates: {
    format: 'pug'
  },
  plugins: [
    glsl()
  ],
  output: './static',
  vite: {
    base: './',
    publicDir: './public',
    build: {
      modulePreload: false,
      rollupOptions: {
        output: {
          chunkFileNames: '[name].js',
          entryFileNames: '[name].js',
          assetFileNames: ({ name }) => {
            if (/\.css$/.test(name ?? '')) {
              return '[name].css'
            }
            
            return 'assets/[name][extname]'
          },
        },
      },
    },
  },
})
