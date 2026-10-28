import type { Config } from "tailwindcss";

// Identidade Carvieal: chocolate, avelã, marfim.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        choco: { DEFAULT: "#4F2C1D", deep: "#3A1F14", soft: "#6B4434" },
        avela: { DEFAULT: "#C9B198", light: "#DCCBB8", pale: "#EDE3D7" },
        marfim: { DEFAULT: "#F6F1EA", claro: "#FBF8F3" },
        tinta: "#2B1810",
        prata: "#A9A6A1",
      },
      fontFamily: {
        display: ["var(--font-display)", "Didot", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      opacity: { 15: ".15", 35: ".35", 45: ".45", 55: ".55", 65: ".65", 85: ".85" },
      letterSpacing: { marca: ".18em" },
      keyframes: {
        sobe: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "none" } },
        entra: { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
        entraEsq: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(0)" } },
        fade: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        sobe: "sobe .9s cubic-bezier(.2,.7,.2,1) both",
        entra: "entra .35s cubic-bezier(.2,.7,.2,1) both",
        entraEsq: "entraEsq .35s cubic-bezier(.2,.7,.2,1) both",
        fade: "fade .3s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
