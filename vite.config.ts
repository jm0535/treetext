import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    server: {
      host: "::",
      port: 8080,
      cors: true,
      // Ensure proper MIME types are set
      fs: {
        strict: true,
      },
    },
    preview: {
      port: 4173,
      open: true,
      // Ensure proper MIME types are set
      fs: {
        strict: true,
      },
    },
    build: {
      // Improve build performance and output
      minify: isProduction,
      sourcemap: !isProduction,
      // Handle WASM imports
      assetsInlineLimit: 0,
      // Disable code splitting entirely
      rollupOptions: {
        output: {
          inlineDynamicImports: true
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },


    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/setupTests.ts'],
      },
    },
  };
});
