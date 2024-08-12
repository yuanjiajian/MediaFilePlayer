import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ['APP_ENV', 'BASE_API']);
  return {
    // vite 配置
    define: Object.keys(env).reduce((acc, key) => {
      acc[`import.meta.env.${key}`] = JSON.stringify(env[key]);
      return acc;
    }, {}),
    plugins: [vue()],
    server: {
      port: 8080
    },
  }
})
