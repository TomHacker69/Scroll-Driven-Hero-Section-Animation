# 🏎️ ITZFIZZ — Scroll-Driven Supercar Hero Section Animation

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen?logo=github)](https://tomhacker69.github.io/Scroll-Driven-Hero-Section-Animation/)
[![GSAP 3](https://img.shields.io/badge/Animation-GSAP%203%20%2B%20ScrollTrigger-88CE02?logo=greensock)](https://greensock.com/gsap/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20%2B%20Vanilla%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An ultra-smooth, scroll-driven interactive hero section animation inspired by high-end automotive launch pages and the reference demo. Built with pure vanilla web technologies, GSAP 3 ScrollTrigger, and React/Next.js architecture.

---

## 🔗 Live Links & Submission Deliverables

- **Live Webpage (GitHub Pages):** [https://tomhacker69.github.io/Scroll-Driven-Hero-Section-Animation/](https://tomhacker69.github.io/Scroll-Driven-Hero-Section-Animation/)
- **GitHub Repository:** [https://github.com/TomHacker69/Scroll-Driven-Hero-Section-Animation](https://github.com/TomHacker69/Scroll-Driven-Hero-Section-Animation)

---

## 🎯 Assignment Functional Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **1. Hero Section Layout** | Occupies full viewport height (`100vh`) with letter-spaced `W E L C O M E   I T Z F I Z Z` headline and four high-impact metric boxes. | ✅ Complete |
| **2. Initial Load Animation** | Fluid staggered entrance of navbar, letter-spaced headline typography, and supercar idle positioning with smooth easing. | ✅ Complete |
| **3. Scroll-Based Animation (Core)** | Pinned track system; supercar position tied directly to scroll progress with sub-millisecond inertia smoothing (`scrub: 1.1`). | ✅ Complete |
| **4. Collision Illumination** | Letters dynamically illuminate with high-contrast text stamped onto the expanding neon trail as the supercar passes each character. | ✅ Complete |
| **5. Motion & Performance** | Strictly GPU-accelerated transforms (`translate3d`, `will-change: transform`), pre-computed bounding coordinates, zero scroll layout thrashing. | ✅ Complete |
| **6. Tech Stack Compliance** | HTML5, CSS3, JavaScript (ES6+), GSAP 3 & ScrollTrigger, Tailwind CSS, plus modular React / Next.js component (`HeroSection.jsx`). | ✅ Complete |

---

## ✨ Standout Features & Enhancements

### 1. 🏎️ Realistic Supercar Physics & Trail
- High-resolution top-down McLaren 720S hypercar rendering with front **headlight illumination beams** and rear **taillight brake bloom**.
- Dynamic neon slipstream trail (`#trail`) that expands with sub-pixel precision directly behind the vehicle.

### 2. 🔠 Interactive Letter Collision Engine
- As the vehicle travels across the highway, real-time spatial collision checks detect when the car's center reaches each character of `W E L C O M E   I T Z F I Z Z`, stamping bold typography into the illuminated neon slipstream.

### 3. 📊 Floating Impact Metric Milestones
- **58%** — Increase in pick up point use *(Acid Lime)*
- **23%** — Decreased in customer phone calls *(Hyper Cyan)*
- **27%** — Boost in customer repeat frequency *(Dark Carbon)*
- **40%** — Drop in logistical delivery latency *(Sunset Orange)*
- Each card features animated numerical counters that roll up smoothly upon entrance.

### 4. 🕹️ Cockpit Telemetry HUD
- **Real-Time Speedometer:** Measures instantaneous scroll velocity via `ScrollTrigger.getVelocity()` to simulate speeds up to **315 km/h**.
- **Dynamic Gear Shift:** Automatically transitions through gears (`N` → `1` → `2` → `3` → `4` → `5` → `6` → `7`).
- **Tachometer (RPM) Bar:** Sweeps from an 850 RPM idle to 8,200 RPM redline.
- **Scroll Progression:** Visual percentage gauge (`0%` → `100%`).

### 5. 🔊 Procedural V8 Engine Audio Synthesizer (Web Audio API)
- Zero external audio files or dependencies.
- Dual harmonic oscillators with a dynamic lowpass biquad filter modulate pitch and revs in direct response to scroll velocity.
- Easy 1-click sound toggle in the top navigation bar.

### 6. 🎨 Neon Trail Customizer
- Real-time color switcher allowing users to toggle between:
  - **Acid Green** (Original reference style: `#45db7d`)
  - **Papaya Orange** (McLaren heritage: `#ff7300`)
  - **Hyper Cyan** (Cyberpunk: `#6ac9ff`)
  - **Neon Magenta** (Synthwave: `#ff2a85`)

### 7. 🎬 Auto-Drive Demo Mode
- A dedicated **"Auto Drive"** button in the header smoothly scrolls through the entire hero experience and returns back to the top for presentation reviews.

---

## 📁 Repository File Structure

```text
Scroll-Driven-Hero-Section-Animation/
├── index.html          # Semantic HTML5 with Pinned Hero, Track, and HUD
├── style.css           # GPU-accelerated CSS3 animations & responsive layouts
├── app.js              # GSAP ScrollTrigger timeline, collision logic & Web Audio
├── HeroSection.jsx     # Modern React / Next.js implementation with Tailwind
├── car.png             # Crisp isolated McLaren 720S supercar asset
├── package.json        # NPM scripts for running and previewing
└── README.md           # Documentation and submission links
```

---

## 🚀 Quick Start / Local Setup

Clone the repository and run locally using your preferred method:

### Method 1: Using Python Built-in Server
```bash
git clone https://github.com/TomHacker69/Scroll-Driven-Hero-Section-Animation.git
cd Scroll-Driven-Hero-Section-Animation
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Method 2: Using NPM
```bash
git clone https://github.com/TomHacker69/Scroll-Driven-Hero-Section-Animation.git
cd Scroll-Driven-Hero-Section-Animation
npm run dev
```

### Method 3: Direct File Opening
Double-click `index.html` to open it in any modern web browser.

---

## 🛠️ Technology Stack Details

- **Core:** HTML5, CSS3, JavaScript (ES6+)
- **Animation Engine:** [GSAP 3.12](https://greensock.com/) & [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **CSS Framework:** Tailwind CSS & Custom CSS Custom Properties
- **Audio Synthesis:** Web Audio API (Lowpass Biquad Filter + Dual Oscillators)
- **Framework Port:** React / Next.js (`HeroSection.jsx`)
- **Hosting:** GitHub Pages

---

## 👨‍💻 Author

**Ankit Singh Tomar**  
- GitHub: [@TomHacker69](https://github.com/TomHacker69)
- Repository: [Scroll-Driven-Hero-Section-Animation](https://github.com/TomHacker69/Scroll-Driven-Hero-Section-Animation)
