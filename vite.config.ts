import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isRealApiMode = env.VITE_API_MODE === 'real'

  return {
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
        styles: { configFile: 'src/styles/vuetify-settings.scss' },
      }),
      svgLoader(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // The server is deliberately bound to IPv4 loopback. This avoids a
    // localhost/IPv6 mismatch in browsers. The proxy is opt-in for real mode.
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      ...(isRealApiMode
        ? {
            proxy: {
              '/api': {
                target: 'https://test.sofi-assistant.com/api',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
              '/vacancy-parser': {
                target: 'https://test.sofi-assistant.com',
                changeOrigin: true,
                secure: true,
              },
            },
          }
        : {}),
    },
  }
})
