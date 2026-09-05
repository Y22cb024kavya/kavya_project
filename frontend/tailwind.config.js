/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Montserrat"', 'sans-serif'],
        body: ['"Open Sans"', '"Lato"', 'sans-serif'],
        nav: ['Arial', 'Helvetica', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // Main Prussian Blue (#003366), Deep Sky-Blue/Teal (#157082), Dark Charcoal Gray (#333333)
        prussian: {
          50: '#F0F5FA',
          100: '#CCE0F5',
          200: '#99C2EB',
          300: '#66A3E0',
          400: '#3385D6',
          500: '#0066CC',
          600: '#00509E',
          700: '#004080',
          800: '#003366',
          900: '#002244',
          950: '#001A33',
          DEFAULT: '#003366',
        },
        teal: {
          50: '#F2FAFC',
          100: '#D4F3F7',
          200: '#A1E2EA',
          300: '#68CEDB',
          400: '#35B5CD',
          500: '#1E94AB',
          600: '#157082',
          700: '#126373',
          800: '#0F5563',
          900: '#0B3A44',
          950: '#06252C',
          DEFAULT: '#157082',
        },
        charcoal: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#333333',
          900: '#262626',
          950: '#1A1A1A',
          DEFAULT: '#333333',
        },
        // Legacy alias maps to enforce new palette across all component utility classes
        purple: {
          50: '#F0F5FA',
          100: '#CCE0F5',
          200: '#99C2EB',
          300: '#68CEDB',
          400: '#35B5CD',
          500: '#1E94AB',
          600: '#157082',
          700: '#00509E',
          800: '#004080',
          900: '#003366',
          950: '#001A33',
          DEFAULT: '#003366',
          deep: '#001A33',
          dark: '#003366',
          light: '#157082',
          soft: '#F0F5FA',
          border: '#CCE0F5',
        },
        violet: {
          50: '#F0F5FA',
          100: '#CCE0F5',
          200: '#99C2EB',
          300: '#68CEDB',
          400: '#35B5CD',
          500: '#157082',
          600: '#157082',
          700: '#00509E',
          800: '#004080',
          900: '#003366',
          950: '#001A33',
          DEFAULT: '#003366',
        },
        indigo: {
          50: '#F0F5FA',
          100: '#CCE0F5',
          200: '#99C2EB',
          300: '#68CEDB',
          400: '#35B5CD',
          500: '#157082',
          600: '#157082',
          700: '#00509E',
          800: '#004080',
          900: '#003366',
          950: '#001A33',
          DEFAULT: '#003366',
        },
        lavender: {
          DEFAULT: '#CCE0F5',
          light: '#F0F5FA',
          border: '#CCE0F5',
        },
        navy: {
          DEFAULT: '#003366',
          deep: '#001A33',
        },
        gold: {
          DEFAULT: '#D9A23B',
          light: '#F2C46D',
        },
        ivory: '#F8FAF9',
        ink: '#333333',
        whatsapp: '#25D366',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: '#003366',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#157082',
          foreground: '#FFFFFF'
        },
        muted: {
          DEFAULT: '#F0F5FA',
          foreground: '#333333'
        },
        accent: {
          DEFAULT: '#157082',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: '#CCE0F5',
        input: '#CCE0F5',
        ring: '#157082',
        chart: {
          '1': '#003366',
          '2': '#157082',
          '3': '#68CEDB',
          '4': '#333333',
          '5': '#CCE0F5'
        }
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
