import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2f7780',
        secondary: '#1f5f67',
        terracotta: '#2f7780',
        gold: '#C7AF65',
        cream: '#fcf9f3',
        'cream-dark': '#f0ebe1',
        'on-primary': '#ffffff',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        mono: ['var(--font-space-grotesk)', 'monospace'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
};
export default config;
