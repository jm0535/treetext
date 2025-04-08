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
    },
    build: {
      // Improve build performance and output
      minify: isProduction,
      sourcemap: !isProduction,
      // Increase the warning limit for chunk size
      chunkSizeWarningLimit: 1000,
      // Handle WASM imports
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React and related libraries
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') || 
                id.includes('node_modules/react-router-dom')) {
              return 'vendor-react';
            }
            
            // UI component libraries
            if (id.includes('node_modules/@radix-ui') || 
                id.includes('node_modules/@floating-ui') || 
                id.includes('node_modules/framer-motion')) {
              return 'vendor-ui';
            }
            
            // Utility libraries
            if (id.includes('node_modules/date-fns') || 
                id.includes('node_modules/class-variance-authority') || 
                id.includes('node_modules/clsx') || 
                id.includes('node_modules/tailwind-merge')) {
              return 'vendor-utils';
            }
            
            // Lucide icons
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            
            // Other third-party libraries
            if (id.includes('node_modules/')) {
              return 'vendor-others';
            }
          },
        },
      },
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

    preview: {
      port: 4173,
      open: true,
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
