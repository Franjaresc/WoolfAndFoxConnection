/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#fef2f2",      // Very light pink for backgrounds
          "100": "#fee2e2",     // Light pink
          "200": "#fecdd3",     // Soft blush
          "300": "#fda4af",     // Light rose
          "400": "#fb7185",     // Medium rose
          "500": "#f43f5e",     // Main color
          "600": "#e11d48",     // Dark rose
          "700": "#be123c",     // Darker shade
          "800": "#9f1239",     // Very dark shade
          "900": "#881337",     // Almost black
          "950": "#4c0519",     // Deepest shade
        },
        secondary: {
          "50": "#f9fafb",      // Very light gray for backgrounds
          "100": "#e5e7eb",     // Light gray
          "200": "#d1d5db",     // Soft gray
          "300": "#9ca3af",     // Medium gray
          "400": "#6b7280",     // Dark gray
          "500": "#374151",     // Slate gray
          "600": "#1f2937",     // Dark slate gray
          "700": "#111827",     // Very dark gray
          "800": "#0f172a",     // Darker slate
          "900": "#0a0e1e",     // Almost black
        },
        accent: {
          "1": "#4f46e5",       // Indigo
          "2": "#3b82f6",       // Sky blue
          "3": "#06b6d4",       // Light cyan
          "4": "#10b981",       // Emerald green
          "5": "#f59e0b",       // Amber
        },
        background: {
          "light": "#ffffff",   // Light background
          "dark": "#1f2937",    // Dark background
          "neutral": "#f3f4f6", // Neutral background for sections
        },
        text: {
          "light": "#374151",    // Dark text
          "dark": "#ffffff",     // Light text for dark backgrounds
          "muted": "#6b7280",    // Muted text
          "accent": "#f43f5e",   // Use primary color for accent text
        },
        hover: {
          primary: "#e11d48",    // Primary hover
          secondary: "#e5e7eb/80", // Secondary hover
          accent: "#3b82f6/80",   // Accent hover
          muted: "#d1d5db",       // Muted hover
        },
        focus: {
          primary: "#be123c",     // Primary focus
          secondary: "#6b7280",   // Secondary focus
          accent: "#4f46e5",      // Accent focus
          outline: "#f43f5e",     // Outline color for focused elements
        },
        active: {
          primary: "#9f1239",     // Primary active
          secondary: "#374151",    // Secondary active
          accent: "#3b82f6",       // Accent active
        }
        
      },
    },
  },
  plugins: [],
};
