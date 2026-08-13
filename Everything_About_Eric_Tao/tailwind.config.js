/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Swiss style: every corner is square. Pinning the whole scale here
      // squares all 115 `rounded-*` usages at once — revert this block (and
      // --radius in app/globals.css) to bring the curves back.
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },
      fontFamily: {
        saffron: ["var(--font-saffron)", "Times New Roman", "Times", "serif"],
        inter: ["var(--font-inter)"],
        sans: ["var(--font-inter)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // The whole row is revealed by a clip travelling right to left, so the
        // orange overlay riding on top is what the eye sees arriving. Revealing
        // the row this way — rather than snapping it visible — is what stops the
        // black slab appearing first and the orange reading as a second pass.
        "nav-row-in": {
          "0%": { clipPath: "inset(0 0 0 100%)" },
          "45%": { clipPath: "inset(0 0 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        // Hero grid burst: the square flips edge-on to face-on, holds ~3s, then
        // flips back out. Percentages are tied to the 3.6s duration below — 8%
        // ≈ 290ms in, 92% ≈ 3.31s, so the orange face is held for almost exactly
        // three seconds. Perspective lives in the transform so each cell keeps
        // its own vanishing point rather than sharing the container's.
        //
        // Diagonal hinge: one rotation about the vector (1,1,0), the "\" diagonal
        // running top-left to bottom-right. Use `rotate3d(1,-1,0,…)` to hinge on
        // the "/" diagonal instead. Do NOT express this as rotateX + rotateY —
        // those compose rather than blend, with the second turning inside the
        // space the first already twisted, which tumbles unpredictably at 90°.
        "grid-cell-flip": {
          "0%": { opacity: "0", transform: "perspective(300px) rotate3d(1, -1, 0, 90deg)" },
          "15%": { opacity: "1", transform: "perspective(300px) rotate3d(1, -1, 0, 0deg)" },
          "85%": { opacity: "1", transform: "perspective(300px) rotate3d(1, -1, 0, 0deg)" },
          "100%": { opacity: "0", transform: "perspective(300px) rotate3d(1, -1, 0, -90deg)" },
        },
        // Diagnostic only (app/blend-test). rotate(45)/scaleY/rotate(-45)
        // collapses the square along the "\" diagonal using a plain 2D matrix —
        // deliberately no perspective() or rotate3d(), so this is the control
        // for whether the 3D transform is what breaks blending on WebKit.
        // Opacity is still animated here, matching grid-cell-flip, so the only
        // variable between the two is 2D vs 3D.
        "flip-2d": {
          "0%": { opacity: "0", transform: "rotate(45deg) scaleY(0) rotate(-45deg)" },
          "15%": { opacity: "1", transform: "rotate(45deg) scaleY(1) rotate(-45deg)" },
          "85%": { opacity: "1", transform: "rotate(45deg) scaleY(1) rotate(-45deg)" },
          "100%": { opacity: "0", transform: "rotate(45deg) scaleY(0) rotate(-45deg)" },
        },
        // Route curtain, budgeted to 4800ms end to end. Generic: any project
        // with its own accent can play it, not just SENTINEL.
        // Bands use the same right-to-left clip as the nav rows; the veil holds
        // opaque until 83% (4000ms) then clears to reveal the page beneath.
        "curtain-band": {
          "0%": { clipPath: "inset(0 0 0 100%)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "curtain-word": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "curtain-veil": {
          "0%": { opacity: "1" },
          "83%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // Holds while the row lands, then wipes out the way it came in: its right
        // edge sweeps left until the band is gone, uncovering the black row
        // behind it. A clip rather than a fade, so the orange reads as leaving
        // rather than dissolving in place.
        "nav-row-wipe": {
          "0%": { clipPath: "inset(0 0 0 0)" },
          "65%": { clipPath: "inset(0 0 0 0)" },
          "100%": { clipPath: "inset(0 100% 0 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // `both` holds the start frame through the stagger delay, so a card
        // stays hidden until its turn instead of flashing in first.
        "fade-in-up": "fade-in-up 0.3s ease-out both",
        "grid-cell-flip": "grid-cell-flip 3.6s ease-out both",
        // Diagnostic only (app/blend-test) — same shape as grid-cell-flip but
        // squashed along the diagonal with a 2D transform, so the cell never
        // needs a 3D compositing layer. Delete with that route.
        "flip-2d": "flip-2d 3.6s ease-out both",
        "curtain-band": "curtain-band 0.5s ease-out both",
        "curtain-word": "curtain-word 0.5s ease-out both",
        "curtain-veil": "curtain-veil 2.4s linear both",
        "nav-row-in": "nav-row-in 0.6s linear both",
        "nav-row-wipe": "nav-row-wipe 0.6s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
