/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /(bg|text|border|ring)-(emerald|blue|purple|amber|rose)-(50|100|200|400|500|600|700)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

