/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A2E',
          light: '#16213E',
        },
        accent: {
          DEFAULT: '#C9A96E',
          soft: '#D4B896',
          hover: '#B89758',
        },
        rose: {
          DEFAULT: '#E8B4B8',
          light: '#F7E7E8',
        },
        clinic: {
          bg: '#FDFBF7',
          'bg-alt': '#F5F0EB',
          text: '#1A1A1A',
          muted: '#6B7280',
          border: 'rgba(201, 169, 110, 0.2)',
          'border-subtle': 'rgba(26, 26, 46, 0.08)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 2px 8px rgba(26, 26, 46, 0.04)',
        md: '0 4px 20px rgba(26, 26, 46, 0.08)',
        lg: '0 12px 36px rgba(26, 26, 46, 0.12)',
        gold: '0 8px 24px rgba(201, 169, 110, 0.25)',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};
