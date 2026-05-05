/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        // ENTERPRISE THEMING: 
      // Map Tailwind classes (e.g., 'bg-brand-primary') to native CSS variables.
      // This allows the CMS to control the UI without recompiling CSS.
      colors: {
        brand: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          bg: 'var(--color-background)',
          text: 'var(--color-text)',
        },
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      }
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }