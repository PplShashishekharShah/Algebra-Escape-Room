/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        skyplay: '#b8ebff',
        inkplay: '#243b53',
        jam: '#ec6f66',
        goldplay: '#ffd166',
        mintplay: '#7be0ad',
      },
      fontFamily: {
        display: ['"Trebuchet MS"', '"Comic Sans MS"', 'ui-sans-serif', 'system-ui'],
        body: ['"Verdana"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(255, 228, 137, 0.65)',
        soft: '0 18px 45px rgba(19, 34, 56, 0.25)',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.65', transform: 'scale(0.96)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shakeSoft: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        sparkle: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.7)' },
          '40%': { opacity: '1', transform: 'translateY(-4px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-18px) scale(1.2)' },
        },
      },
      animation: {
        bob: 'bob 2.8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 1.8s ease-in-out infinite',
        popIn: 'popIn 240ms ease-out forwards',
        shakeSoft: 'shakeSoft 380ms ease-in-out',
        sparkle: 'sparkle 900ms ease-out forwards',
      },
    },
  },
  plugins: [],
}
