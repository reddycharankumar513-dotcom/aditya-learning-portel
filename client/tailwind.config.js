/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        learnova: {
          bg: {
            primary: '#080B18',
            secondary: '#10162A',
            card: '#151D35',
            cardHover: '#1B2442',
            glass: 'rgba(21, 29, 53, 0.75)',
            input: '#0D1322',
          },
          accent: {
            violet: '#8065FF',
            cyan: '#32C8F5',
            highlight: '#A68BFF',
            glow: 'rgba(128, 101, 255, 0.35)',
            cyanGlow: 'rgba(50, 200, 245, 0.35)',
          },
          text: {
            primary: '#F5F7FF',
            secondary: '#A6B0C8',
            muted: '#6B7A99',
          },
          border: {
            subtle: 'rgba(255, 255, 255, 0.08)',
            glow: 'rgba(128, 101, 255, 0.3)',
            active: '#8065FF',
          },
          state: {
            success: '#30D6A0',
            warning: '#F4B860',
            error: '#FF647C',
            info: '#32C8F5',
          }
        },
        // Preserve existing palette for backward compatibility
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#8065FF',
          600: '#6A4DFF',
          700: '#5332E0',
          800: '#3F22B8',
          900: '#2C1687',
          950: '#170B4E',
        },
        violet: {
          500: '#8065FF',
          600: '#6A4DFF',
          700: '#5332E0',
        },
        cyan: {
          400: '#32C8F5',
          500: '#0EA5E9',
          600: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Manrope', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 35px -5px rgba(128, 101, 255, 0.4)',
        'glow-cyan': '0 0 35px -5px rgba(50, 200, 245, 0.4)',
        'card-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}