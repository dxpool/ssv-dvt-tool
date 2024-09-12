/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ['./src/react/**/*.{ts,tsx,html}'],
  theme: {
    colors: {
      cyan: "cyan",
      gray: "gray",
      transparent: "transparent",
      gray1: "#F1F6FE",
      gray2: "#E3EBF7",
      gray3: "#d0dae8",
      gray4: "#ACBED5",
      gray5: '#ACACAC',
      grayText: "#A4A4A4",
      darkGray: "#3F3F46",
      textDark: "#0B1E58",
      primaryBlue: "#3366FF",
      primaryBlueDark: "#174BE6",
      darkBlue: "#0f4c75",
      mediumBlue: "#3282b8",
      lightBlue: "#19a5f8",
      white: "#FFFFFF",
      red: "#fa1e0e",
      darkRed: "#ec1c26",
      lightGreen: "#52b788",
      background: "#1B262C",
      backgroundLight: "#FAFAFA",
      buttonColor: "#bbe1fa",
      buttonHover: "#52b788",
      heading:  "#3282b8",
      mainContent: "#d0dae8",
      mainContentAlert: "#fa1e0e",
      black: "#000000",
      disabledButton: "#0f4c75",
      yellow: "#FFA600",
      orange: "#F2994A",
      teal: "#00CDD0",
    },
    extend: {
      fontSize: {
        xxs: ".625rem",
      },
      keyframes: {
        OnlinePulse: {
          "0%": {
            "background-color": "rgba(250, 30, 14, 0.7)",
            "width": "0px",
            "height": "0px"
          },
          "70%": {
            "background-color": "rgba(250, 30, 14, 0)",
            "width": "50px",
            "height": "50px",
            "margin": "-25px"
          },
          "100%": {
            "background-color": "rgba(250, 30, 14, 0)",
            "width": "60px",
            "height": "60px",
            "margin": "-30px"
          }
        },
      },
      animation: {
        LoaderSpin: "spin 2s linear infinite",
        OnlinePulse: "OnlinePulse 3s infinite"
      }
    }
  },
  plugins: [],
}
