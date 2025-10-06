/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          light: 'hsl(var(--primary-light))',
          dark: 'hsl(var(--primary-dark))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          hover: 'hsl(var(--secondary-hover))',
          light: 'hsl(var(--secondary-light))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        success: {
          DEFAULT: 'hsl(var(--success))',
          hover: 'hsl(var(--success-hover))',
          light: 'hsl(var(--success-light))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          hover: 'hsl(var(--destructive-hover))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          light: 'hsl(var(--warning-light))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          light: 'hsl(var(--accent-light))',
        },
        input: {
          border: 'hsl(var(--input-border))',
          focus: 'hsl(var(--input-focus))',
          bg: 'hsl(var(--input-bg))',
        },
        card: {
          bg: 'hsl(var(--card-bg))',
          border: 'hsl(var(--card-border))',
        },
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
};
