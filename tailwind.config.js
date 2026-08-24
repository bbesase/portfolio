/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08070D',        // page background, near-black with violet cast
        panel: '#121020',      // raised surface
        panel2: '#1A1730',     // raised surface, lighter
        line: '#2A2640',       // hairline borders on dark
        mist: '#9691B0',       // secondary text
        paper: '#F3F1FA',      // primary text on dark
        volt: '#FF5D5D',       // primary accent - coral/vermilion facet
        cyan: '#3FE0D0',       // secondary accent - electric teal facet
        violet: '#8B6BFF',     // tertiary accent - used sparingly for depth
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
