/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ Active le mode sombre via la classe "dark"
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        // ✅ Police par défaut : Inter
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        inter: ['Inter', 'sans-serif'], // Pour un usage explicite si besoin
      },
      colors: {
        // ✅ Palette personnalisée inspirée d’Uber
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        white: '#ffffff',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        primary: '#000000', // ✅ Fond noir Uber
        primaryDark: '#0d0d0d', // ✅ Optionnel : noir plus profond
        accent: '#10b981', // ✅ Vert émeraude (remplace le jaune pour te différencier)
        muted: '#f5f5f5',
        danger: '#E53E3E',
        light: '#f9fafb', // ✅ Fond clair minimal
        dark: '#0d0d0d',   // ✅ Fond foncé sobre
        border: '#e5e7eb', // ✅ Gris très clair pour bordures légères
      },
      borderColor: {
        DEFAULT: '#e5e7eb', // ✅ Bordure discrète par défaut
      },
      boxShadow: {
        // ✅ OMBRE DOUCE MODERNE
        soft: '0 4px 20px rgba(0, 0, 0, 0.05)',
        sm: '0 4px 6px rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #f0f4ff 0%, #e0f2fe 100%)', // ✅ Dégradé doux
      },
      backdropBlur: {
        sm: '4px', // ✅ Flou doux
      },
    },
  },
  plugins: [],
};

