import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Build robust HMR options from env vars or frontend URL.
  const disableHmr = (env.DISABLE_HMR || 'false') === 'true';

  const parsedFrontendUrl = env.VITE_FRONTEND_URL || env.FRONTEND_URL || '';
  let inferredHmrHost: string | undefined = undefined;
  if (parsedFrontendUrl) {
    try {
      inferredHmrHost = new URL(parsedFrontendUrl).hostname;
    } catch (e) {
      inferredHmrHost = undefined;
    }
  }

  const hmrHost = (env.VITE_HMR_HOST || env.HMR_HOST || inferredHmrHost) || undefined;
  const hmrPort = env.VITE_HMR_PORT ? Number(env.VITE_HMR_PORT) : env.VITE_PORT ? Number(env.VITE_PORT) : undefined;
  const hmrProtocol = env.VITE_HMR_PROTOCOL || env.HMR_PROTOCOL || undefined; // 'ws' or 'wss'
  const hmrClientPort = env.VITE_HMR_CLIENT_PORT ? Number(env.VITE_HMR_CLIENT_PORT) : undefined;

  const hmrOption = disableHmr
    ? false
    : {
        protocol: hmrProtocol,
        host: hmrHost,
        port: hmrPort,
        clientPort: hmrClientPort,
      };

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './frontend/src'),
      },
    },
    server: {
      // HMR: either fully disabled, or an options object that forces client to connect
      // to the LAN IP when needed (useful for mobile testing).
      hmr: hmrOption,
      host: true,
      port: Number(env.VITE_PORT || 5173),
      strictPort: true,
      proxy: {
        '/api': {
          // Prefer IPv4 to avoid localhost/IPv6 ECONNREFUSED on some Windows setups.
          target: env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
        '/outputs': {
          target: env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
