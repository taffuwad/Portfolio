const lenis = new Lenis({
    duration: 1.2,          // Scroll duration (seconds)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease-out
    orientation: 'vertical', // 'vertical' or 'horizontal'
    smoothWheel: true,      // Enable smooth wheel scrolling
    wheelMultiplier: 1,     // Scroll speed multiplier
    touchMultiplier: 2,     // Touch scroll speed
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Sweep the page 2 heading across the screen on a soft, curved path.
gsap.registerPlugin(ScrollTrigger);

const page2 = document.querySelector('.page2');
const page2Heading = document.querySelector('.page2 .text-anim h1');

if (page2 && page2Heading) {
    const viewportWidth = () => window.innerWidth;
    const exitPosition = () => -page2Heading.scrollWidth - viewportWidth() * 0.2;

    gsap.set(page2Heading, {
        x: () => viewportWidth() * 1.1,
        y: '8vh',
        rotation: 8,
        transformOrigin: '50% 50%'
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: page2,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    })
        .to(page2Heading, {
            x: () => viewportWidth() * 0.4,
            y: '-11vh',
            rotation: -3,
            duration: 0.5,
            ease: 'none'
        })
        .to(page2Heading, {
            x: () => -viewportWidth() * 0.55,
            y: '10vh',
            rotation: 3,
            duration: 0.5,
            ease: 'none'
        })
        .to(page2Heading, {
            x: exitPosition,
            y: '-5vh',
            rotation: -2,
            duration: 0.5,
            ease: 'none'
        });
}




// -------------------------------------------------------------------------------------------------------

// Page 3 sliders: use the duplicated cards as a measured, seamless loop.
// Buttons nudge the loop without restarting its continuous movement.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('.slider-shell').forEach((shell) => {
  const marquee = shell.querySelector('.marquee');
  const track = shell.querySelector('.marquee-track');
  const cards = track ? Array.from(track.children) : [];

  if (!marquee || !track || cards.length < 2) return;

  // The second half is present only to complete the visual loop.
  cards.slice(Math.floor(cards.length / 2)).forEach((card) => {
    card.setAttribute('aria-hidden', 'true');
    card.querySelectorAll('a').forEach((link) => { link.tabIndex = -1; });
  });

  let loopWidth = 0;
  let offset = 0;
  let pendingShift = 0;
  let lastTime = performance.now();
  let paused = false;
  const direction = marquee.dataset.direction === 'reverse' ? 1 : -1;

  const normaliseOffset = () => {
    if (!loopWidth) return;
    while (offset <= -loopWidth) offset += loopWidth;
    while (offset > 0) offset -= loopWidth;
  };

  const measure = () => {
    // The first repeated card marks the exact point at which the sequence repeats.
    loopWidth = cards[Math.floor(cards.length / 2)].offsetLeft - cards[0].offsetLeft;
    if (!loopWidth) return;
    offset = direction === 1 ? -loopWidth : 0;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  shell.querySelectorAll('.slider-control').forEach((button) => {
    button.addEventListener('click', () => {
      const step = Math.min(cards[0].getBoundingClientRect().width * 0.9, marquee.clientWidth * 0.85);
      pendingShift += button.dataset.slide === 'next' ? -step : step;
    });
  });

  shell.addEventListener('pointerenter', () => { paused = true; });
  shell.addEventListener('pointerleave', () => { paused = false; });
  shell.addEventListener('focusin', () => { paused = true; });
  shell.addEventListener('focusout', () => { paused = false; });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure, { once: true });

  const animate = (time) => {
    const elapsed = Math.min(time - lastTime, 64);
    lastTime = time;
    const nudge = pendingShift * Math.min(1, elapsed / 180);
    pendingShift -= nudge;
    const speed = paused || reduceMotion.matches ? 0 : direction * 0.035 * elapsed;
    offset += speed + nudge;
    normaliseOffset();
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    requestAnimationFrame(animate);
  };

  measure();
  requestAnimationFrame(animate);
});

const sliderImage = document.querySelectorAll('.work-card');
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHover) {
  sliderImage.forEach((card) => {
    const webLink = card.querySelector('.web-link');

    if (!webLink) return;

    gsap.set(webLink, {
      autoAlpha: 0,
      scale: 0.75,
      xPercent: -50,
      yPercent: -50
    });

    const moveX = gsap.quickTo(webLink, 'left', {
      duration: 0.28,
      ease: 'power3.out'
    });
    const moveY = gsap.quickTo(webLink, 'top', {
      duration: 0.28,
      ease: 'power3.out'
    });

    const moveWebLink = (event) => {
      const rect = card.getBoundingClientRect();
      moveX(event.clientX - rect.left);
      moveY(event.clientY - rect.top);
    };

    card.addEventListener('pointerenter', (event) => {
      moveWebLink(event);
      gsap.to(webLink, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.25,
        ease: 'back.out(1.5)',
        overwrite: 'auto'
      });
    });

    card.addEventListener('pointermove', moveWebLink);
    card.addEventListener('pointerleave', () => {
      gsap.to(webLink, {
        autoAlpha: 0,
        scale: 0.75,
        duration: 0.18,
        ease: 'power2.in',
        overwrite: 'auto'
      });
    });
  });
}


// Page 4: show each project preview at the pointer on devices with a fine cursor.
const minicircle = document.querySelector('#minicircle');
const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (minicircle && supportsFinePointer) {
  let previousX = 0;
  let previousY = 0;
  let resetTimer;

  window.addEventListener('pointermove', (event) => {
    const xScale = gsap.utils.clamp(0.8, 1.2, event.clientX - previousX);
    const yScale = gsap.utils.clamp(0.8, 1.2, event.clientY - previousY);
    previousX = event.clientX;
    previousY = event.clientY;

    minicircle.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%) scale(${xScale}, ${yScale})`;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      minicircle.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    }, 100);
  });
}

if (supportsFinePointer) {
  document.querySelectorAll('.elem').forEach((elem) => {
    let previousX = 0;

    elem.addEventListener('mouseleave', () => {
    gsap.to(elem.querySelector("img"), {
      opacity: 0,
      ease: Power3,
      duration: 0.5,
    });
    });

    elem.addEventListener('pointermove', (event) => {
      const image = elem.querySelector('img');
      const relativeY = event.clientY - elem.getBoundingClientRect().top;
      const rotation = gsap.utils.clamp(-20, 20, (event.clientX - previousX) * 0.5);
      previousX = event.clientX;

      gsap.to(image, {
        opacity: 1,
        ease: Power3,
        top: relativeY,
        left: event.clientX,
        rotate: rotation,
        overwrite: 'auto'
      });
    });
  });
}
