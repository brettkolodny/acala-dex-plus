module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFEEEE",
          100: "#FACDCD",
          200: "#F29B9B",
          300: "#E66A6A",
          400: "#D64545",
          500: "#BA2525",
          600: "#A61B1B",
          700: "#911111",
          800: "#780A0A",
          900: "#610404",
        },
        base: {
          50: "#F7F7F7",
          100: "#E1E1E1",
          200: "#CFCFCF",
          300: "#B1B1B1",
          400: "#9E9E9E",
          500: "#7E7E7E",
          600: "#626262",
          700: "#515151",
          800: "#3B3B3B",
          900: "#222222",
        },
      },
      boxShadow: {
        "inner-input": "inset 0px 2px 2px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        tilt: {
          "0%, 100%": {
            transform: "rotateY(0deg)",
          },
          "50%": {
            transform: "rotateY(20deg)",
          },
        },
      },
      animation: {
        tilt: "tilt 0.25s ease-out 1",
      },
    },
  },
  plugins: [],
};
