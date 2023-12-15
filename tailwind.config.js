/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        alLight: {
          primary: "#1d4ed8",

          secondary: "#4b5563",

          accent: "#b45309",

          neutral: "#182619",

          "base-100": "#f3f4f6",

          info: "#0e7490",

          success: "#15803d",

          warning: "#a16207",

          error: "#b91c1c",
        },
      },
      {
        alDark: {
          primary: "#1d4ed8",

          secondary: "#4b5563",

          accent: "#b45309",

          neutral: "#182619",

          "base-100": "#1f2937",

          info: "#0e7490",

          success: "#15803d",

          warning: "#a16207",

          error: "#b91c1c",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
