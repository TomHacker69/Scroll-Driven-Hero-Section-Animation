/**
 * ITZFIZZ — SCROLL-DRIVEN SUPERCAR HERO SECTION ANIMATION
 * Core Interaction & Physics Engine
 * 
 * Powered by GSAP 3 & ScrollTrigger
 * Built with Vanilla ES6+ Web Technologies
 */

(function () {
  'use strict';

  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not loaded');
    return;
  }

  // Register GSAP plugins
  if (typeof ScrollToPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  } else {
    gsap.registerPlugin(ScrollTrigger);
  }

  // DOM Elements
  const heroWrapper = document.getElementById('hero-container');
  const viewport = document.getElementById('viewport');
  const road = document.getElementById('road');
  const car = document.getElementById('car');
  const carImg = document.getElementById('carImg');
  const trail = document.getElementById('trail');
  const valueText = document.getElementById('valueText');
  const letters = gsap.utils.toArray('.value-letter');

  const box1 = document.getElementById('box1');
  const box2 = document.getElementById('box2');
  const box3 = document.getElementById('box3');
  const box4 = document.getElementById('box4');

  // HUD Elements
  const hudProgressBar = document.getElementById('hudProgressBar');
  const hudPercentText = document.getElementById('hudPercentText');
  const hudSpeed = document.getElementById('hudSpeed');
  const hudGear = document.getElementById('hudGear');
  const hudRpmBar = document.getElementById('hudRpmBar');
  const hudRpmText = document.getElementById('hudRpmText');

  // Buttons & Controls
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');
  const autoDriveBtn = document.getElementById('autoDriveBtn');
  const resetScrollBtn = document.getElementById('resetScrollBtn');
  const colorDots = document.querySelectorAll('.color-dot');

  // State Variables
  let roadWidth = window.innerWidth;
  let carWidth = 180;
  let endX = roadWidth - carWidth;
  let letterPositions = [];
  let currentSpeed = 0;
  let targetSpeed = 0;
  let isSoundActive = false;
  let audioCtx = null;
  let engineOsc1 = null;
  let engineOsc2 = null;
  let engineFilter = null;
  let engineGain = null;
  let isAutoDriving = false;

  /**
   * Recalculate dimensions & letter offsets for collision detection
   */
  function calculateDimensions() {
    roadWidth = road.offsetWidth || window.innerWidth;
    const carRect = car.getBoundingClientRect();
    carWidth = carRect.width || 180;
    endX = roadWidth - carWidth;

    const roadRect = road.getBoundingClientRect();
    // Cache the horizontal left position of each letter relative to the road
    letterPositions = letters.map((letter) => {
      const rect = letter.getBoundingClientRect();
      return rect.left - roadRect.left;
    });
  }

  /**
   * Animate metric counter numbers (e.g., 0% to 58%)
   */
  const animatedCounters = new Set();
  function triggerCounter(boxElement) {
    if (animatedCounters.has(boxElement)) return;
    animatedCounters.add(boxElement);

    const counterSpan = boxElement.querySelector('.counter-val');
    if (!counterSpan) return;

    const targetVal = parseInt(counterSpan.getAttribute('data-target') || '0', 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: targetVal,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        counterSpan.textContent = Math.round(obj.val) + '%';
      }
    });
  }

  /**
   * 1. INITIAL LOAD ANIMATION (Requirement #2)
   * Staggered smooth reveal on page load
   */
  function playInitialLoadAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Header reveal
    tl.from('#navbar', {
      y: -40,
      opacity: 0,
      duration: 0.8,
      delay: 0.1
    });

    // Headline letters subtle initial fade & slide
    tl.from(letters, {
      opacity: 0,
      y: 20,
      stagger: 0.03,
      duration: 0.6,
      ease: 'back.out(1.2)'
    }, '-=0.4');

    // Car initial engine-start subtle vibration & slight slide-in
    tl.from(car, {
      x: -120,
      opacity: 0,
      duration: 1.0,
      ease: 'power4.out',
      onComplete: () => {
        calculateDimensions();
      }
    }, '-=0.5');

    // Subtle teaser of the first metric card
    tl.fromTo(box1, 
      { opacity: 0, y: 30, scale: 0.9 },
      { 
        opacity: 0.4, 
        y: 0, 
        scale: 0.96, 
        duration: 0.6,
        onComplete: () => {
          gsap.to(box1, { opacity: 0, duration: 0.5, delay: 0.8 });
        }
      }, 
      '-=0.3'
    );
  }

  /**
   * 2. SCROLL-DRIVEN MAIN ANIMATION (Requirement #3 & #4)
   * High performance transform3d interpolation
   */
  function initScrollAnimation() {
    calculateDimensions();

    // Primary timeline scrubbed with scroll position
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroWrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1, // Smooth inertia scrub
        pin: viewport,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: handleScrollUpdate,
      }
    });

    // Car horizontal translation across the road
    mainTimeline.to(car, {
      x: () => endX,
      ease: 'none',
      force3D: true,
    });

    // Metric Box 1: Appears at ~20% - 40%
    ScrollTrigger.create({
      trigger: heroWrapper,
      start: '15% top',
      end: '42% top',
      onEnter: () => { box1.classList.add('show'); triggerCounter(box1); },
      onLeave: () => { box1.classList.remove('show'); },
      onEnterBack: () => { box1.classList.add('show'); },
      onLeaveBack: () => { box1.classList.remove('show'); },
    });

    // Metric Box 2: Appears at ~35% - 60%
    ScrollTrigger.create({
      trigger: heroWrapper,
      start: '32% top',
      end: '62% top',
      onEnter: () => { box2.classList.add('show'); triggerCounter(box2); },
      onLeave: () => { box2.classList.remove('show'); },
      onEnterBack: () => { box2.classList.add('show'); },
      onLeaveBack: () => { box2.classList.remove('show'); },
    });

    // Metric Box 3: Appears at ~55% - 80%
    ScrollTrigger.create({
      trigger: heroWrapper,
      start: '54% top',
      end: '82% top',
      onEnter: () => { box3.classList.add('show'); triggerCounter(box3); },
      onLeave: () => { box3.classList.remove('show'); },
      onEnterBack: () => { box3.classList.add('show'); },
      onLeaveBack: () => { box3.classList.remove('show'); },
    });

    // Metric Box 4: Appears at ~75% - 100%
    ScrollTrigger.create({
      trigger: heroWrapper,
      start: '74% top',
      end: '99% top',
      onEnter: () => { box4.classList.add('show'); triggerCounter(box4); },
      onLeave: () => { box4.classList.remove('show'); },
      onEnterBack: () => { box4.classList.add('show'); },
      onLeaveBack: () => { box4.classList.remove('show'); },
    });
  }

  /**
   * High-Frequency Update Handler for Trail & Letter Illumination
   */
  function handleScrollUpdate(self) {
    const progress = self.progress;

    // Get current car position in pixels
    const currentCarX = gsap.getProperty(car, 'x') || 0;
    // Car active center point for illumination trigger
    const carCenter = currentCarX + (carWidth * 0.55);

    // 1. Expand neon trail to match car position
    trail.style.width = Math.max(0, currentCarX + 25) + 'px';

    // 2. Letter illumination logic
    // When car passes a letter, illuminate it
    letters.forEach((letter, i) => {
      const letterLeft = letterPositions[i];
      if (carCenter >= letterLeft) {
        letter.classList.add('revealed');
      } else {
        letter.classList.remove('revealed');
      }
    });

    // 3. Telemetry HUD Progress Bar
    const percentInt = Math.round(progress * 100);
    hudProgressBar.style.width = percentInt + '%';
    hudPercentText.textContent = percentInt + '%';

    // 4. Calculate Scroll Velocity for Speedometer & RPM
    const scrollVelocity = Math.abs(self.getVelocity());
    // Convert scroll velocity to realistic supercar km/h (0 to 315 km/h)
    targetSpeed = Math.min(315, Math.round((scrollVelocity / 15) + (progress * 40)));
    
    // Update Web Audio engine tone if active
    if (isSoundActive) {
      updateEngineAudio(targetSpeed);
    }
  }

  /**
   * Smooth Telemetry HUD Interpolation (RequestAnimationFrame loop)
   */
  function updateTelemetryLoop() {
    // Smooth lerp speed toward target speed
    currentSpeed += (targetSpeed - currentSpeed) * 0.12;
    if (currentSpeed < 1) currentSpeed = 0;

    const displaySpeed = Math.round(currentSpeed);
    hudSpeed.textContent = displaySpeed;

    // Gear indicator calculation based on speed
    let gear = 'N';
    if (displaySpeed === 0) gear = 'N';
    else if (displaySpeed < 45) gear = '1';
    else if (displaySpeed < 90) gear = '2';
    else if (displaySpeed < 140) gear = '3';
    else if (displaySpeed < 195) gear = '4';
    else if (displaySpeed < 250) gear = '5';
    else if (displaySpeed < 290) gear = '6';
    else gear = '7';
    hudGear.textContent = gear;

    // RPM calculation (idle 850 RPM to 8200 RPM max redline)
    const rpm = displaySpeed === 0 ? 850 : Math.round(1200 + (displaySpeed / 315) * 6800);
    hudRpmText.textContent = rpm;
    const rpmPercent = Math.min(100, Math.round((rpm / 8200) * 100));
    hudRpmBar.style.width = rpmPercent + '%';

    // Decay target speed gradually when user stops scrolling
    targetSpeed = Math.max(0, targetSpeed * 0.94);

    requestAnimationFrame(updateTelemetryLoop);
  }

  /**
   * 3. PROCEDURAL WEB AUDIO V8 ENGINE SYNTHESIZER
   * Generates realistic dynamic engine exhaust & rumble with zero external files
   */
  function initAudioEngine() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      // Dual oscillator for rich V8 harmonic drone
      engineOsc1 = audioCtx.createOscillator();
      engineOsc2 = audioCtx.createOscillator();
      engineFilter = audioCtx.createBiquadFilter();
      engineGain = audioCtx.createGain();

      engineOsc1.type = 'sawtooth';
      engineOsc1.frequency.setValueAtTime(45, audioCtx.currentTime); // Low idle rumble

      engineOsc2.type = 'triangle';
      engineOsc2.frequency.setValueAtTime(90, audioCtx.currentTime); // Harmonic octave

      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(260, audioCtx.currentTime);

      engineGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      engineOsc1.connect(engineFilter);
      engineOsc2.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(audioCtx.destination);

      engineOsc1.start();
      engineOsc2.start();
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  function updateEngineAudio(speed) {
    if (!audioCtx || !engineOsc1) return;
    const now = audioCtx.currentTime;
    // Map speed to pitch: idle 45Hz -> high rev 280Hz
    const pitch = 45 + (speed / 315) * 220;
    engineOsc1.frequency.setTargetAtTime(pitch, now, 0.05);
    engineOsc2.frequency.setTargetAtTime(pitch * 1.5, now, 0.05);
    // Open lowpass filter slightly during high speed for bright rev
    engineFilter.frequency.setTargetAtTime(260 + (speed / 315) * 700, now, 0.05);
  }

  function toggleSound() {
    if (!isSoundActive) {
      if (!audioCtx) {
        initAudioEngine();
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      isSoundActive = true;
      soundLabel.textContent = 'Sound On';
      soundIcon.setAttribute('data-lucide', 'volume-2');
      soundToggleBtn.classList.add('border-[#def54f]', 'text-[#def54f]');
    } else {
      if (audioCtx) {
        audioCtx.suspend();
      }
      isSoundActive = false;
      soundLabel.textContent = 'Sound Off';
      soundIcon.setAttribute('data-lucide', 'volume-x');
      soundToggleBtn.classList.remove('border-[#def54f]', 'text-[#def54f]');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * 4. AUTO-DRIVE DEMO MODE
   * Automatically drives down the hero section with smooth acceleration and returns
   */
  function triggerAutoDrive() {
    if (isAutoDriving) return;
    isAutoDriving = true;

    autoDriveBtn.classList.add('opacity-50', 'pointer-events-none');
    const startScroll = window.scrollY;
    const heroBottom = heroWrapper.offsetTop + heroWrapper.offsetHeight - window.innerHeight;

    // Smooth scroll down through hero section
    gsap.to(window, {
      scrollTo: { y: heroBottom, autoKill: false },
      duration: 4.5,
      ease: 'power2.inOut',
      onComplete: () => {
        // Pause briefly at end of run, then return
        setTimeout(() => {
          gsap.to(window, {
            scrollTo: { y: 0, autoKill: false },
            duration: 3,
            ease: 'power2.inOut',
            onComplete: () => {
              isAutoDriving = false;
              autoDriveBtn.classList.remove('opacity-50', 'pointer-events-none');
            }
          });
        }, 1200);
      }
    });
  }

  /**
   * 5. COLOR PICKER FOR NEON TRAIL
   */
  function initColorCustomizer() {
    colorDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const color = dot.getAttribute('data-color');
        document.documentElement.style.setProperty('--neon-trail', color);

        colorDots.forEach((d) => d.classList.remove('ring-2', 'ring-white/80'));
        dot.classList.add('ring-2', 'ring-white/80');

        // Flash car headlight cone or trail glow
        gsap.fromTo(trail, { opacity: 0.6 }, { opacity: 1, duration: 0.3 });
      });
    });
  }

  /**
   * Event Listeners & Lifecycle Setup
   */
  function init() {
    // Initial load animation
    playInitialLoadAnimation();

    // Setup scroll driven interactions
    initScrollAnimation();

    // Start telemetry RAF loop
    updateTelemetryLoop();

    // Setup customizer
    initColorCustomizer();

    // Event listeners
    if (soundToggleBtn) soundToggleBtn.addEventListener('click', toggleSound);
    if (autoDriveBtn) autoDriveBtn.addEventListener('click', triggerAutoDrive);
    if (resetScrollBtn) {
      resetScrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Debounced window resize recalculations
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        calculateDimensions();
        ScrollTrigger.refresh();
      }, 150);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
