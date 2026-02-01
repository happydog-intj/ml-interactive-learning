import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ml-blue': '#58C4DD',
        'ml-yellow': '#FFFF00',
        'ml-red': '#FC6255',
        'ml-green': '#83C167',
        'ml-purple': '#C59DF6',
        'ml-bg-dark': '#1a1a1a',
        'ml-bg-secondary': '#2d2d2d',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
