export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        heaven: {
          light: '#F0E6FF',
          base: '#C084FC',
          dark: '#7C3AED',
          glow: '#A855F7',
        },
        hell: {
          light: '#FFF0E6',
          base: '#FB923C',
          dark: '#C2410C',
          glow: '#EF4444',
        },
        void: '#0A0A0F',
        surface: '#12121A',
        panel: '#1A1A26',
        border: '#2A2A3A',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-heaven': 'pulseHeaven 2s ease-in-out infinite',
        'pulse-hell': 'pulseHell 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow-heaven': 'glowHeaven 2s ease-in-out infinite',
        'glow-hell': 'glowHell 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseHeaven: {
          '0%, 100%': { boxShadow: '0 0 15px #A855F750' },
          '50%': { boxShadow: '0 0 30px #A855F7AA' },
        },
        pulseHell: {
          '0%, 100%': { boxShadow: '0 0 15px #EF444450' },
          '50%': { boxShadow: '0 0 30px #EF4444AA' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowHeaven: {
          '0%, 100%': { textShadow: '0 0 10px #A855F780' },
          '50%': { textShadow: '0 0 20px #A855F7' },
        },
        glowHell: {
          '0%, 100%': { textShadow: '0 0 10px #EF444480' },
          '50%': { textShadow: '0 0 20px #EF4444' },
        },
      },
    },
  },
  plugins: [],
}
