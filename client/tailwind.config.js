module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    fontFamily: {
        "main": ["Poppins", "sans-serif"]
    }
  },
  plugins: [ require('@tailwindcss/typography'),require("daisyui")],

  daisyui: {
    styled: true,
    themes: ["dark", "night", "dracula", "light", "retro", "bumblebee", "cyberpunk"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
