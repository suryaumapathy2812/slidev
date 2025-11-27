// Import Slidev's UnoCSS config to reuse shortcuts
import slidevConfig from '@slidev/client/uno.config'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetIcons, presetTypography, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: {
    // Core Slidev shortcuts for slide content styling
    'bg-main': 'bg-white dark:bg-[#121212]',
    'bg-active': 'bg-gray-400/10',
    'border-main': 'border-gray/20',
    'text-main': 'text-[#181818] dark:text-[#ddd]',
    'text-primary': 'color-$slidev-theme-primary',
    'bg-primary': 'bg-$slidev-theme-primary',
    'border-primary': 'border-$slidev-theme-primary',
    // Extend with any additional Slidev shortcuts
    ...(slidevConfig.shortcuts || {}),
    // Cloud-specific UI shortcuts
    'btn': 'px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    'btn-primary': 'px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    'btn-icon': 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer',
    'input': 'px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500',
    'card': 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: '#3b82f6',
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },
})
