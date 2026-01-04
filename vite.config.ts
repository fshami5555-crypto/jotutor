import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY || ""),
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY || ""),
      'process.env.VITE_IMGBB_KEY': JSON.stringify(env.VITE_IMGBB_KEY || ""),
      'process.env.VITE_MASTERCARD_MERCHANT_ID': JSON.stringify(env.VITE_MASTERCARD_MERCHANT_ID || ""),
      'process.env.VITE_MASTERCARD_USERNAME': JSON.stringify(env.VITE_MASTERCARD_USERNAME || ""),
      'process.env.VITE_MASTERCARD_PASSWORD': JSON.stringify(env.VITE_MASTERCARD_PASSWORD || "")
    }
  }
})