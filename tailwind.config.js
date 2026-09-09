/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-driven: values come from CSS custom properties on :root
        // (default palette) or [data-theme="..."] (alternates), defined in
        // src/index.css and switched at runtime by src/theme.ts.
        ink: 'var(--color-ink)',        // page background
        panel: 'var(--color-panel)',    // raised surface
        panel2: 'var(--color-panel2)',  // raised surface, lighter
        line: 'var(--color-line)',      // hairline borders on dark
        mist: 'var(--color-mist)',      // secondary text
        paper: 'var(--color-paper)',    // primary text on dark
        volt: 'var(--color-volt)',      // primary accent
        cyan: 'var(--color-cyan)',      // secondary accent
        violet: 'var(--color-violet)',  // tertiary accent - used sparingly
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
