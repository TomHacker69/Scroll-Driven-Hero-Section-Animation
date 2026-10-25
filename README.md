# Scroll-Driven Hero Section Animation

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen?logo=github)](https://tomhacker69.github.io/Scroll-Driven-Hero-Section-Animation/)
[![GSAP 3](https://img.shields.io/badge/Animation-GSAP%203%20%2B%20ScrollTrigger-88CE02?logo=greensock)](https://greensock.com/gsap/)

Scroll-driven hero section animation inspired by the reference demo ([https://paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation)).

---

## 🔗 Submission Deliverables

- **Live Webpage:** [https://tomhacker69.github.io/Scroll-Driven-Hero-Section-Animation/](https://tomhacker69.github.io/Scroll-Driven-Hero-Section-Animation/)
- **GitHub Repository:** [https://github.com/TomHacker69/Scroll-Driven-Hero-Section-Animation](https://github.com/TomHacker69/Scroll-Driven-Hero-Section-Animation)

---

## 🎯 Functional Requirements Implemented

1. **Hero Section Layout:**
   - Full-screen pinned layout (`100vh`) with letter-spaced `W E L C O M E   I T Z F I Z Z` headline.
   - Four impact statistics floating on the track:
     - **58%** Increase in pick up point use
     - **23%** Decreased in customer phone calls
     - **27%** Increase in pick up point use
     - **40%** Decreased in customer phone calls

2. **Initial Load Animation:**
   - Headline appears smoothly with staggered fade and slide.
   - Statistics animate in one by one with a subtle delay.

3. **Scroll-Based Animation (Core Feature):**
   - The supercar moves smoothly across the highway tied directly to scroll position via GSAP ScrollTrigger (`scrub: 1`).
   - Neon trail expands in real time behind the vehicle.
   - Letters in `W E L C O M E   I T Z F I Z Z` illuminate as the car passes each character.
   - Metric cards highlight with scale on scroll progression.

4. **Motion & Performance:**
   - Smooth, performant `transform` properties (`translateX`, `translateY`, `scale`).
   - Zero layout reflows during scroll events.

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **GSAP 3 & ScrollTrigger**
- **React / Next.js Component:** [`HeroSection.jsx`](HeroSection.jsx)

---

## 🚀 Local Run

```bash
# Using Python built-in server
python -m http.server 3000

# Or open index.html directly in any browser
```
