export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury gold instead of bright yellow
        gold: {
          50: '#FFFBF0',
          100: '#FFF7E0',
          200: '#FFEAD4',
          300: '#FFD89B',
          400: '#FFC55C',
          500: '#FFB81C', // Primary gold
          600: '#E6A800',
          700: '#CC8F00',
          800: '#997000',
          900: '#6B4D00',
        },
        // Enhanced grayscale for premium feel
        slate: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Luxury typography scale
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '52px' }],
        '6xl': ['60px', { lineHeight: '66px' }],
        '7xl': ['72px', { lineHeight: '78px' }],
      },
      spacing: {
        // Premium spacing scale
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '80px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        // Luxury shadows
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'base': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'md': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'lg': '0 20px 25px rgba(0, 0, 0, 0.15)',
        'xl': '0 25px 50px rgba(0, 0, 0, 0.2)',
        'gold-glow': '0 0 20px rgba(255, 184, 28, 0.2)',
        'gold-glow-lg': '0 0 40px rgba(255, 184, 28, 0.3)',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      opacity: {
        5: '0.05',
        10: '0.1',
      },
    },
  },
  plugins: [],
};
