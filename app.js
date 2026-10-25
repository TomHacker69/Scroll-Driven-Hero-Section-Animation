/**
 * Scroll-Driven Hero Section Animation
 * ITZFIZZ Assignment Implementation
 * Powered by GSAP & ScrollTrigger
 */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const car = document.getElementById('car');
  const trail = document.getElementById('trail');
  const letters = gsap.utils.toArray('.value-letter');
  const valueAdd = document.querySelector('.value-add');

  const box1 = document.getElementById('box1');
  const box2 = document.getElementById('box2');
  const box3 = document.getElementById('box3');
  const box4 = document.getElementById('box4');
  const boxes = [box1, box2, box3, box4];

  let valueRect = valueAdd.getBoundingClientRect();
  let letterOffsets = letters.map((letter) => letter.offsetLeft);
  let roadWidth = window.innerWidth;
  let carWidth = car.offsetWidth || 180;
  let endX = roadWidth - carWidth;

  function calculateDimensions() {
    valueRect = valueAdd.getBoundingClientRect();
    letterOffsets = letters.map((letter) => letter.offsetLeft);
    roadWidth = window.innerWidth;
    carWidth = car.offsetWidth || 180;
    endX = roadWidth - carWidth;
  }

  // 1. Initial Load Animation (Requirement #2)
  function playInitialLoadAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Headline letters staggered entrance
    tl.fromTo(letters, 
      { opacity: 0, y: 15 },
      { opacity: 0.15, y: 0, stagger: 0.04, duration: 0.6 }
    );

    // Initial car entrance
    tl.from(car, {
      x: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: calculateDimensions
    }, '-=0.4');

    // Statistics animate in one by one with a subtle delay
    tl.fromTo(boxes,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(1.1)' },
      '-=0.3'
    );
  }

  // 2. Scroll-Based Animation (Core Feature - Requirement #3)
  function initScrollAnimation() {
    calculateDimensions();

    // Car drives across the road tied to scroll
    gsap.to(car, {
      scrollTrigger: {
        trigger: '.section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '.track',
      },
      x: () => endX,
      ease: 'none',
      onUpdate: function () {
        const carX = gsap.getProperty(car, 'x') + (carWidth * 0.55);

        // Illuminates letters as car passes them
        letters.forEach((letter, i) => {
          const letterX = valueRect.left + letterOffsets[i];
          if (carX >= letterX) {
            letter.style.opacity = '1';
          } else {
            letter.style.opacity = '0.15';
          }
        });

        // Expands green trail directly behind car
        gsap.set(trail, { width: carX });
      },
    });

    // Box 1 highlight on scroll
    gsap.to(box1, {
      scrollTrigger: {
        trigger: '.section',
        start: 'top+=150 top',
        end: 'top+=450 top',
        scrub: true,
      },
      opacity: 1,
      scale: 1.05,
    });

    // Box 2 highlight on scroll
    gsap.to(box2, {
      scrollTrigger: {
        trigger: '.section',
        start: 'top+=350 top',
        end: 'top+=650 top',
        scrub: true,
      },
      opacity: 1,
      scale: 1.05,
    });

    // Box 3 highlight on scroll
    gsap.to(box3, {
      scrollTrigger: {
        trigger: '.section',
        start: 'top+=550 top',
        end: 'top+=850 top',
        scrub: true,
      },
      opacity: 1,
      scale: 1.05,
    });

    // Box 4 highlight on scroll
    gsap.to(box4, {
      scrollTrigger: {
        trigger: '.section',
        start: 'top+=750 top',
        end: 'top+=1050 top',
        scrub: true,
      },
      opacity: 1,
      scale: 1.05,
    });
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    calculateDimensions();
    ScrollTrigger.refresh();
  });

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      playInitialLoadAnimation();
      initScrollAnimation();
    });
  } else {
    playInitialLoadAnimation();
    initScrollAnimation();
  }
})();
