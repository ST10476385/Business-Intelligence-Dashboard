import sdkPlugin from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Vite configuration for the DataPulse application.
// This file defines plugins and build settings for the development server.
export default defineConfig({
  logLevel: 'error', // Reduce console noise by only showing errors.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    sdkPlugin({
      // Optional support for legacy SDK import paths, if required.
      legacySDKImports: process.env.KHANYISA_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ]
});