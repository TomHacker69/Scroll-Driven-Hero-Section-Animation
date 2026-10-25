'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll-Driven Hero Section Animation (React / Next.js Component)
 * ITZFIZZ Assignment Implementation
 */
export default function HeroSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const valueAddRef = useRef(null);
  const lettersRef = useRef([]);

  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const box4Ref = useRef(null);

  const headline = "WELCOME ITZFIZZ";

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current;
    const valueAdd = valueAddRef.current;
    const boxes = [box1Ref.current, box2Ref.current, box3Ref.current, box4Ref.current];

    let roadRect = roadRef.current.getBoundingClientRect();
    let letterPositions = [];
    let roadWidth = window.innerWidth;
    let carWidth = car?.offsetWidth || 180;
    let endX = roadWidth - carWidth;

    const calculate = () => {
      roadRect = roadRef.current.getBoundingClientRect();
      roadWidth = window.innerWidth;
      carWidth = car?.offsetWidth || 180;
      endX = roadWidth - carWidth;
      letterPositions = letters.map((l) => {
        if (!l) return 0;
        return l.getBoundingClientRect().left - roadRect.left;
      });
    };

    // Initial Load Animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(letters, 
      { opacity: 0, y: 15 },
      { opacity: 0.15, y: 0, stagger: 0.04, duration: 0.6 }
    );
    tl.from(car, {
      x: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: calculate
    }, '-=0.4');
    tl.fromTo(boxes,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(1.1)' },
      '-=0.3'
    );

    // Scroll-Driven Animation
    gsap.to(car, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: trackRef.current,
      },
      x: () => endX,
      ease: 'none',
      onUpdate: () => {
        const carX = gsap.getProperty(car, 'x') || 0;
        const carFront = carX + (carWidth * 0.6);
        letters.forEach((letter, i) => {
          if (!letter) return;
          letter.style.opacity = carFront >= letterPositions[i] ? '1' : '0.15';
        });
        if (trail) {
          gsap.set(trail, { width: carX + (carWidth * 0.3) });
        }
      },
    });

    const handleResize = () => {
      calculate();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="section">
      <div ref={trackRef} className="track">
        
        {/* Road */}
        <div ref={roadRef} className="road">
          <img
            ref={carRef}
            src="car.png"
            alt="McLaren Car"
            className="car"
          />
          <div ref={trailRef} className="trail" />

          {/* Letter Illumination */}
          <div ref={valueAddRef} className="value-add">
            {headline.split('').map((char, index) => (
              <span
                key={index}
                ref={(el) => (lettersRef.current[index] = el)}
                className="value-letter"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div ref={box1Ref} className="text-box" id="box1">
          <span className="num-box">58%</span>
          <span>Increase in pick up point use</span>
        </div>

        <div ref={box2Ref} className="text-box" id="box2">
          <span className="num-box">23%</span>
          <span>Decreased in customer phone calls</span>
        </div>

        <div ref={box3Ref} className="text-box" id="box3">
          <span className="num-box">27%</span>
          <span>Increase in pick up point use</span>
        </div>

        <div ref={box4Ref} className="text-box" id="box4">
          <span className="num-box">40%</span>
          <span>Decreased in customer phone calls</span>
        </div>

      </div>
    </div>
  );
}
