/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Your Core Brand Colors
        'system-purple': '#6B21A8', // The Pax Vault Purple
        'twitch': '#9146FF',
        'youtube': '#FF0000',
        'tiktok': '#00f2ea',
        'slate-900-transparent': 'rgba(15, 23, 42, 0.7)', // Semi-transparent background
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
};
