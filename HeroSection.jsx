'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ITZFIZZ — Scroll-Driven Supercar Hero Section Animation
 * React / Next.js Component with GSAP ScrollTrigger & Tailwind CSS
 * 
 * @component
 */
export default function HeroSection() {
  const heroWrapperRef = useRef(null);
  const viewportRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);

  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const box4Ref = useRef(null);

  // Telemetry HUD State
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState('N');
  const [rpm, setRpm] = useState(850);
  const [progress, setProgress] = useState(0);
  const [trailColor, setTrailColor] = useState('#45db7d');
  const [isSoundActive, setIsSoundActive] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const filterRef = useRef(null);

  const headlineText = "WELCOME ITZFIZZ";

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const heroWrapper = heroWrapperRef.current;
    const viewport = viewportRef.current;
    const road = roadRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current;

    let roadWidth = road.offsetWidth || window.innerWidth;
    let carWidth = car?.getBoundingClientRect().width || 180;
    let endX = roadWidth - carWidth;

    const roadRect = road.getBoundingClientRect();
    const letterPositions = letters.map((letter) => {
      if (!letter) return 0;
      const rect = letter.getBoundingClientRect();
      return rect.left - roadRect.left;
    });

    // 1. Initial Load Timeline
    const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    introTl.from(letters, {
      opacity: 0,
      y: 20,
      stagger: 0.03,
      duration: 0.6,
      delay: 0.2,
    });
    introTl.from(car, {
      x: -120,
      opacity: 0,
      duration: 1.0,
      ease: 'power4.out',
    }, '-=0.4');

    // 2. Scroll-Driven Main Timeline
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroWrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1,
        pin: viewport,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const prog = self.progress;
          const currentCarX = gsap.getProperty(car, 'x') || 0;
          const carCenter = currentCarX + (carWidth * 0.55);

          // Update Trail Width
          if (trail) {
            trail.style.width = `${Math.max(0, currentCarX + 25)}px`;
          }

          // Letter illumination
          letters.forEach((letter, i) => {
            if (!letter) return;
            if (carCenter >= letterPositions[i]) {
              letter.classList.add('revealed');
              letter.style.opacity = '1';
            } else {
              letter.classList.remove('revealed');
              letter.style.opacity = '0';
            }
          });

          // Telemetry
          const percentInt = Math.round(prog * 100);
          setProgress(percentInt);

          const scrollVelocity = Math.abs(self.getVelocity());
          const calcSpeed = Math.min(315, Math.round((scrollVelocity / 15) + (prog * 40)));
          setSpeed(calcSpeed);

          // Compute gear
          if (calcSpeed === 0) setGear('N');
          else if (calcSpeed < 45) setGear('1');
          else if (calcSpeed < 90) setGear('2');
          else if (calcSpeed < 140) setGear('3');
          else if (calcSpeed < 195) setGear('4');
          else if (calcSpeed < 250) setGear('5');
          else if (calcSpeed < 290) setGear('6');
          else setGear('7');

          // Compute RPM
          const calcRpm = calcSpeed === 0 ? 850 : Math.round(1200 + (calcSpeed / 315) * 6800);
          setRpm(calcRpm);

          // Update audio pitch if enabled
          if (audioCtxRef.current && osc1Ref.current) {
            const now = audioCtxRef.current.currentTime;
            const pitch = 45 + (calcSpeed / 315) * 220;
            osc1Ref.current.frequency.setTargetAtTime(pitch, now, 0.05);
            if (osc2Ref.current) {
              osc2Ref.current.frequency.setTargetAtTime(pitch * 1.5, now, 0.05);
            }
          }
        },
      },
    });

    mainTimeline.to(car, {
      x: () => road.offsetWidth - (car?.getBoundingClientRect().width || 180),
      ease: 'none',
      force3D: true,
    });

    // 3. Metric Cards Triggers
    const registerBox = (boxRef, startPct, endPct) => {
      if (!boxRef.current) return;
      ScrollTrigger.create({
        trigger: heroWrapper,
        start: `${startPct}% top`,
        end: `${endPct}% top`,
        onEnter: () => boxRef.current.classList.add('show'),
        onLeave: () => boxRef.current.classList.remove('show'),
        onEnterBack: () => boxRef.current.classList.add('show'),
        onLeaveBack: () => boxRef.current.classList.remove('show'),
      });
    };

    registerBox(box1Ref, 15, 42);
    registerBox(box2Ref, 32, 62);
    registerBox(box3Ref, 54, 82);
    registerBox(box4Ref, 74, 99);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const toggleSound = () => {
    if (!isSoundActive) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(45, ctx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(90, ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        audioCtxRef.current = ctx;
        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        filterRef.current = filter;
        setIsSoundActive(true);
      } catch (e) {
        console.warn('Web Audio error:', e);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsSoundActive(false);
    }
  };

  return (
    <section ref={heroWrapperRef} className="relative h-[260vh] bg-[#0b0c10] text-white">
      {/* Pinned Sticky Viewport */}
      <div ref={viewportRef} className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden select-none">
        
        {/* Top Controls Banner */}
        <div className="relative z-20 w-full px-6 pt-20 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SCROLL ENGINE ACTIVE (REACT/NEXT.JS)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300"
            >
              {isSoundActive ? '🔊 Sound On' : '🔇 Sound Off'}
            </button>
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-full border border-white/10">
              {['#45db7d', '#ff7300', '#6ac9ff', '#ff2a85'].map((color) => (
                <button
                  key={color}
                  onClick={() => setTrailColor(color)}
                  className={`w-3.5 h-3.5 rounded-full ${trailColor === color ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Highway Track Area */}
        <div className="relative w-full flex-1 flex flex-col justify-center items-center overflow-hidden">
          
          {/* Metric Box 1 */}
          <div ref={box1Ref} className="metric-card" style={{ top: '8%', right: '38%' }}>
            <div className="p-5 rounded-2xl bg-[#def54f] text-black shadow-lg min-w-[240px]">
              <div className="font-extrabold text-4xl">58%</div>
              <div className="text-xs font-semibold mt-1">Increase in pick up point use</div>
            </div>
          </div>

          {/* Metric Box 2 */}
          <div ref={box2Ref} className="metric-card" style={{ bottom: '8%', right: '36%' }}>
            <div className="p-5 rounded-2xl bg-[#6ac9ff] text-black shadow-lg min-w-[240px]">
              <div className="font-extrabold text-4xl">23%</div>
              <div className="text-xs font-semibold mt-1">Decreased in customer phone calls</div>
            </div>
          </div>

          {/* Metric Box 3 */}
          <div ref={box3Ref} className="metric-card" style={{ top: '8%', right: '10%' }}>
            <div className="p-5 rounded-2xl bg-[#1e2029] text-white border border-white/10 shadow-lg min-w-[240px]">
              <div className="font-extrabold text-4xl text-[#def54f]">27%</div>
              <div className="text-xs font-semibold mt-1 text-slate-300">Increase in pick up point use</div>
            </div>
          </div>

          {/* Metric Box 4 */}
          <div ref={box4Ref} className="metric-card" style={{ bottom: '8%', right: '12%' }}>
            <div className="p-5 rounded-2xl bg-[#fa7328] text-black shadow-lg min-w-[240px]">
              <div className="font-extrabold text-4xl">40%</div>
              <div className="text-xs font-semibold mt-1">Decreased in customer phone calls</div>
            </div>
          </div>

          {/* Road */}
          <div ref={roadRef} className="relative w-full h-[220px] bg-[#16181f] border-y border-white/10 flex items-center overflow-hidden">
            {/* Center Dashed Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.25)_0px,rgba(255,255,255,0.25)_30px,transparent_30px,transparent_60px)] pointer-events-none" />

            {/* Glowing Neon Trail */}
            <div
              ref={trailRef}
              className="absolute top-0 left-0 h-full w-0 transition-colors duration-300 pointer-events-none"
              style={{ backgroundColor: trailColor }}
            />

            {/* Supercar Element */}
            <div ref={carRef} className="absolute top-1/2 left-0 -translate-y-1/2 h-[180px] z-10 pointer-events-none flex items-center">
              <img src="/car.png" alt="Supercar" className="h-full w-auto object-contain drop-shadow-2xl" />
            </div>

            {/* Headline Letter Illumination */}
            <div className="absolute top-1/2 left-[5%] -translate-y-1/2 z-5 flex items-center gap-2 pointer-events-none">
              {headlineText.split('').map((char, index) => (
                <span
                  key={index}
                  ref={(el) => (lettersRef.current[index] = el)}
                  className="font-black text-6xl lg:text-7xl tracking-widest text-[#111] opacity-0 transition-opacity duration-100"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>

          </div>

        </div>

        {/* Telemetry Cockpit HUD */}
        <div className="relative z-30 w-full px-6 py-4 max-w-7xl mx-auto flex items-center justify-between border-t border-white/5 bg-[#0b0c10]/90 backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">SCROLL PROGRESS:</span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#45db7d]" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-bold">{progress}%</span>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 mr-2">GEAR:</span>
              <span className="text-base font-bold text-[#def54f]">{gear}</span>
            </div>
            <div>
              <span className="text-slate-400 mr-2">SPEED:</span>
              <span className="text-base font-bold text-white">{speed} KM/H</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-400 mr-2">RPM:</span>
              <span>{rpm}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
