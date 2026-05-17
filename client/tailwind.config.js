/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#AAFF00",
        "primary-dark": "#88cc00",
        background: "#0a0a0a",
        card: "#111111",
        border: "#1e1e1e",
        muted: "#888888",
        foreground: "#f0f0f0",
        destructive: "#e53e3e",
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "Fira Code", "monospace"],
      },
      animation: {
        "progress-bar": "progress 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
