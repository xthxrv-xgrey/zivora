/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#f6f3ee",
          50: "#fbfaf7",
          100: "#f6f3ee",
          200: "#ece6db",
        },
        charcoal: {
          DEFAULT: "#151311",
          700: "#231f1b",
          600: "#3a352f",
        },
        stone: {
          400: "#a39c92",
          500: "#847c70",
          600: "#665f53",
        },
        clay: {
          DEFAULT: "#b5502f",
          50: "#fbeee8",
          600: "#a3451f",
          700: "#8a3a19",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
        widest2: "0.22em",
      },
      transitionTimingFunction: {
        expensive: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};
