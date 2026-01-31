import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/', // ✅ Ensures correct paths when served via Nginx or any server
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/**/*.{png,jpg,jpeg,webp,gif,svg}', // ✅ Copies all assets
          dest: 'assets'
        }
      ]
    })
  ],
  server: {
    host: '0.0.0.0', // ✅ Allows Docker container to expose the dev server
    port: 5173, // ✅ Change as needed
    fs: {
      strict: false // ✅ Allows accessing files outside the root directory
    }
  },
  build: {
    outDir: '../server/public', // ✅ Ensures build output goes to "dist/"
    emptyOutDir: true, // ✅ Cleans old build files before each build
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index-[hash].js', // ✅ Ensures correct hashed filenames
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  },
  esbuild: {
    legalComments: 'none' // ✅ Removes unnecessary comments for cleaner builds
  },
  resolve: {
    alias: {
      '@': '/src' // ✅ Allows imports like '@/components/Button'
    }
  },
  define: {
    'process.env': {} // ✅ Fixes "process is not defined" error
  },
  proxy: {
      "/payment": {
        target: "http://localhost:9000", // 👈 backend
        changeOrigin: true,
        secure: false,
      },
    },
});
