export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeOutThenShrink: {
          '0%': {
            opacity: '1',
            transform: 'scaleY(1)',
            maxHeight: '200px',
            marginBottom: '1rem',
            paddingTop: '1.25rem',
            paddingBottom: '1.25rem',
            borderWidth: '2px',
          },
          '40%': {
            opacity: '0',
            transform: 'scaleY(1)',
            maxHeight: '200px',
            marginBottom: '1rem',
            paddingTop: '1.25rem',
            paddingBottom: '1.25rem',
            borderWidth: '2px',
          },
          '100%': {
            opacity: '0',
            transform: 'scaleY(0)',
            maxHeight: '0',
            marginBottom: '0',
            paddingTop: '0',
            paddingBottom: '0',
            borderWidth: '0',
          },
        },
        fadeInAndGrow: {
          '0%': {
            opacity: '0',
            maxHeight: '0',
            overflow: 'hidden',
          },
          '100%': {
            opacity: '1',
            maxHeight: '200px',
            overflow: 'visible',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      animation: {
        fadeOutThenShrink: 'fadeOutThenShrink 500ms ease-in-out forwards',
        fadeInAndGrow: 'fadeInAndGrow 500ms ease-out forwards',
        fadeIn: 'fadeIn 300ms ease-out forwards',
      }
    },
  },
  plugins: [
    // Any plugins...
  ]
}
