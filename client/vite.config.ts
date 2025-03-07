import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/v1': {
          target: env.VITE_BACKEND_URL || 'http://localhost:87',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
