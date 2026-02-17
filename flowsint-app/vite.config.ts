import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const serverProxyApiUrl = env.VITE_SERVER_PROXY_API_URL
  const serverProxyApiIsSecure = env.VITE_SERVER_PROXY_API_IS_SECURE === 'true'
  const serverAllowedHosts = env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS
    ? env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS.split(',')
    : []

  return {
    plugins: [
    tailwindcss(),
    {
      ...tanstackRouter({
        target: 'react',
        routesDirectory: 'src/routes',
        generatedRouteTree: 'src/routeTree.gen.ts',
        // routeFileIgnorePrefix: '_',
        autoCodeSplitting: true,
        verboseFileRoutes: false,
        quoteStyle: 'double',
        semicolons: true
      }),
      enforce: 'pre'
    },
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"]
      }
    })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      open: true,
      allowedHosts: serverAllowedHosts,
      proxy: {
        '/api': {
          target: serverProxyApiUrl,
          changeOrigin: true,
          secure: serverProxyApiIsSecure
        }
      }
    },
    preview: {
      open: false,
      host: '0.0.0.0',
      port: 5173
    }
  }
})
