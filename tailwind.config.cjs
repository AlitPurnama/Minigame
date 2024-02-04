import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        bebas: ["'Bebas Neue', sans-serif"],
        nerdsymbol: ["'NerdSymbol'"]
      }
    },
  },
  plugins: [
    plugin(function({ addVariant, matchUtilities, theme }) {
      addVariant('hocus', ['&:hover', '&:focus']);
      // Square utility
      matchUtilities(
        {
          square: (value) => ({
            width: value,
            height: value,
          }),
        },
        { values: theme('spacing') }
      );
    }),
  ],
};

module.exports = config;
