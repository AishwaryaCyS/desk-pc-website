import type { Config } from 'tailwindcss'
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: {
    // hot and ice follow --h, which slowly cycles through the desk's LED colours (see globals.css)
    colors: { ink: '#0c0e14', panel: '#161922', snow: '#F2F3F7', mute: '#9AA0B2',
      hot: 'hsl(var(--h) 95% 62%)', ice: 'hsl(calc(var(--h) + 140) 90% 62%)' },
    fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] },
  } },
} satisfies Config
