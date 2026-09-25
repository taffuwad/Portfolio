const projectLoader = document.querySelector('.loader-screen');

const hideProjectLoader = () => {
    if (!projectLoader) return;

    projectLoader.classList.add('is-hidden');
    window.setTimeout(() => projectLoader.remove(), 1500);
};

// Keep the loader up until the Project Hub's media and other page assets load.
window.addEventListener('load', hideProjectLoader, { once: true });

// This also handles pages inserted after the document has already loaded.
if (document.readyState === 'complete') {
    hideProjectLoader();
}

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

// page1-------------------------------------------------------------------------------------------------------- 

let home = document.querySelector('.home');
let contact = document.querySelector('.Contact');

home.addEventListener('click',()=>{
  window.location.href = '../index.html';
})

contact.addEventListener('click', () => {
  const message = encodeURIComponent(
    "Hello TAF Fuwad, I would like to discuss a project with you."
  );

  window.open(
    `https://wa.me/8801920409685?text=${message}`,
    '_blank'
  );
});

// -------------------------------------------------------------------------------------------------------

// Page 3 sliders: use the duplicated cards as a measured, seamless loop.

(function(){
  'use strict';

  /* ==========================================================
     REGISTER
     ========================================================== */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================
     REFS
     ========================================================== */
  var section       = document.getElementById('showcase');
  var textSections  = gsap.utils.toArray('.text-section');
  var clusters      = gsap.utils.toArray('.image-cluster');
  var railFill      = document.getElementById('railFill');
  var counterCurrent= document.getElementById('counterCurrent');
  var scrollHint    = document.getElementById('scrollHint');

  var total = textSections.length;
  if (!total) return;

  /* ==========================================================
     INITIAL STATES
     Hidden text slides start lower and transparent.
     Hidden clusters start rotated + translated off-screen.
     ========================================================== */
  gsap.set(textSections.slice(1), { opacity: 0, y: 30 });
  gsap.set(clusters.slice(1), {
    rotation: 45,
    x: 180,
    y: -180,
    opacity: 0
  });
  gsap.set(clusters, { transformOrigin: '150% 120%' });

  /* Only the first cluster is initially interactive */
  clusters.forEach(function(c, i){
    c.style.pointerEvents = i === 0 ? 'auto' : 'none';
  });

  /* ==========================================================
     MASTER TIMELINE — scrubbed by scroll, pinned
     Each transition fades the previous text out and the next in,
     and swings the previous cluster away while the next swings in.
     ========================================================== */
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=' + ((total - 1) * 100) + '%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function(self){
        /* Which slide is active based on progress */
        var active = Math.min(total - 1, Math.round(self.progress * (total - 1)));

        /* Only the active cluster receives pointer events */
        clusters.forEach(function(c, i){
          c.style.pointerEvents = (i === active) ? 'auto' : 'none';
        });

        /* Progress rail fill */
        railFill.style.transform = 'scaleY(' + self.progress + ')';

        /* Counter */
        counterCurrent.textContent = String(active + 1).padStart(2, '0');

        /* Hide scroll hint once user starts scrolling */
        if (self.progress > 0.02) {
          scrollHint.classList.add('hidden');
        } else {
          scrollHint.classList.remove('hidden');
        }
      }
    }
  });

  /* Build a transition block per slide (skipping the first) */
  textSections.forEach(function(textSec, i){
    if (i === 0) return;

    var prevText    = textSections[i - 1];
    var prevCluster = clusters[i - 1];
    var currentText = textSec;
    var currentCluster = clusters[i];

    var label = 's' + i;
    tl.add(label);

    /* Previous text out */
    tl.to(prevText, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.out'
    }, label);

    /* Current text in (slightly delayed so the crossfade overlaps) */
    tl.to(currentText, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out'
    }, label + '+=0.25');

    /* Previous cluster swings out (down-left) */
    tl.to(prevCluster, {
      rotation: -45,
      x: -180,
      y: 180,
      opacity: 0,
      duration: 0.95,
      ease: 'power2.inOut'
    }, label);

    /* Current cluster swings in to rest */
    tl.to(currentCluster, {
      rotation: 0,
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.95,
      ease: 'power2.inOut'
    }, label);
  });

  /* ==========================================================
     REFRESH ON LOAD / RESIZE
     ========================================================== */
  window.addEventListener('load', function(){
    ScrollTrigger.refresh();
  });

  /* ==========================================================
     KEYBOARD ACCESSIBILITY
     Space/Enter on cluster anchor works natively via <a href>.
     We only need to ensure focus styles remain and pointer-events
     are correctly assigned (handled in onUpdate above).
     ========================================================== */

})();


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


// page5--------------------------------------------------------------------------------------------------


/* =========================================================
   TOONHUB — Hero carousel (responsive)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Data ---------- */
  const IMAGES = [
    {
      src: 'pro-component/p5-images/real-state-demo.jpg',
      bg: '#111',
    },
    {
      src: 'pro-component/p5-images/returent-demo.jpg',
      bg: '#2A2515',
    },
    {
      src: 'pro-component/p5-images/gym-demo.jpg',
      bg: '#8A741E',
    },
    {
      src: 'pro-component/p5-images/clinic-demo.jpg',
      bg: '#FFD43B',
    },
  ];

  /* ---------- Preload ---------- */
  IMAGES.forEach(({ src }) => {
    const img = new Image();
    img.src = src;
  });

  /* ---------- State ---------- */
  const state = {
    activeIndex: 0,
    isAnimating: false,
    breakpoint: 'lg',      // recalculated on resize
    vw: window.innerWidth,
    vh: window.innerHeight,
  };

  /* ---------- Elements ---------- */
  const root = document.getElementById('toonhubRoot');
  const carousel = document.getElementById('toonhubCarousel');
  let btnPrev = document.getElementById('btnPrev');
  let btnNext = document.getElementById('btnNext');

  /* ---------- Build DOM for each image ---------- */
  IMAGES.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'toonhub-item';
    item.dataset.imgIndex = String(index);
    item.setAttribute('aria-hidden', 'true');

    const el = document.createElement('img');
    el.src = img.src;
    el.alt = '';
    el.draggable = false;
    el.decoding = 'async';
    el.fetchPriority = index === 0 ? 'high' : 'auto';

    item.appendChild(el);
    carousel.appendChild(item);
  });

  /* ---------- Breakpoints ----------
     xs  : < 400px   (small phones)
     sm  : 400–639px (regular phones)
     md  : 640–1023px (tablets / small laptops)
     lg  : 1024–1439px (laptops)
     xl  : >= 1440px  (desktops)
     uxl : >= 1920px  (ultra-wide)
  */
  function getBreakpoint(w) {
    if (w < 400) return 'xs';
    if (w < 640) return 'sm';
    if (w < 1024) return 'md';
    if (w < 1440) return 'lg';
    if (w < 1920) return 'xl';
    return 'uxl';
  }

  /* ---------- Role → style per breakpoint ----------
     h  = height as % of stage
     b  = bottom offset as % of stage
     sc = transform scale
     bl = blur px
     op = opacity
     z  = z-index
     px = left position as %
  */
  const STYLES = {
    xs: {
      center: { h: '46%', b: '28%', sc: 1.05, bl: 0, op: 1,    z: 20, px: 50 },
      left:   { h: '13%', b: '35%', sc: 0.85, bl: 2, op: 0.85, z: 10, px: 15 },
      right:  { h: '13%', b: '35%', sc: 0.85, bl: 2, op: 0.85, z: 10, px: 85 },
      back:   { h: '10%', b: '35%', sc: 0.9,  bl: 4, op: 1,    z: 5,  px: 50 },
    },
    sm: {
      center: { h: '54%', b: '24%', sc: 1.15, bl: 0, op: 1,    z: 20, px: 50 },
      left:   { h: '15%', b: '33%', sc: 0.9,  bl: 2, op: 0.85, z: 10, px: 18 },
      right:  { h: '15%', b: '33%', sc: 0.9,  bl: 2, op: 0.85, z: 10, px: 82 },
      back:   { h: '12%', b: '33%', sc: 0.95, bl: 4, op: 1,    z: 5,  px: 50 },
    },
    md: {
      center: { h: '72%', b: '10%', sc: 1.4,  bl: 0, op: 1,    z: 20, px: 50 },
      left:   { h: '22%', b: '18%', sc: 1,    bl: 2, op: 0.85, z: 10, px: 22 },
      right:  { h: '22%', b: '18%', sc: 1,    bl: 2, op: 0.85, z: 10, px: 78 },
      back:   { h: '16%', b: '18%', sc: 1,    bl: 4, op: 1,    z: 5,  px: 50 },
    },
    lg: {
      center: { h: '88%', b: '0%',  sc: 1.6,  bl: 0, op: 1,    z: 20, px: 50 },
      left:   { h: '26%', b: '12%', sc: 1,    bl: 2, op: 0.85, z: 10, px: 28 },
      right:  { h: '26%', b: '12%', sc: 1,    bl: 2, op: 0.85, z: 10, px: 72 },
      back:   { h: '20%', b: '12%', sc: 1,    bl: 4, op: 1,    z: 5,  px: 50 },
    },
    xl: {
      center: { h: '92%', b: '0%',  sc: 1.68, bl: 0, op: 1,    z: 20, px: 50 },
      left:   { h: '28%', b: '12%', sc: 1,    bl: 2, op: 0.85, z: 10, px: 30 },
      right:  { h: '28%', b: '12%', sc: 1,    bl: 2, op: 0.85, z: 10, px: 70 },
      back:   { h: '22%', b: '12%', sc: 1,    bl: 4, op: 1,    z: 5,  px: 50 },
    },
    uxl: {
      center: { h: '94%', b: '0%',  sc: 1.72, bl: 0, op: 1,    z: 20, px: 50 },
      left:   { h: '30%', b: '10%', sc: 1.05, bl: 2, op: 0.85, z: 10, px: 30 },
      right:  { h: '30%', b: '10%', sc: 1.05, bl: 2, op: 0.85, z: 10, px: 70 },
      back:   { h: '24%', b: '10%', sc: 1.05, bl: 4, op: 1,    z: 5,  px: 50 },
    },
  };

  /* ---------- Role mapping ---------- */
  function rolesFor(activeIndex) {
    return {
      center: activeIndex,
      left: (activeIndex + 3) % 4,
      right: (activeIndex + 1) % 4,
      back: (activeIndex + 2) % 4,
    };
  }

  /* ---------- Apply one style to one element ---------- */
  function applyStyle(item, cfg) {
    item.style.transform = `translateX(-50%) scale(${cfg.sc})`;
    item.style.filter = cfg.bl ? `blur(${cfg.bl}px)` : 'none';
    item.style.opacity = String(cfg.op);
    item.style.zIndex = String(cfg.z);
    item.style.left = cfg.px + '%';
    item.style.height = cfg.h;
    item.style.bottom = cfg.b;
  }

  /* ---------- Render ---------- */
  function render() {
    const bp = state.breakpoint;
    const styles = STYLES[bp] || STYLES.lg;

    // 1. Background color
    root.style.backgroundColor = IMAGES[state.activeIndex].bg;

    // 2. Role assignment
    const roles = rolesFor(state.activeIndex);
    const indexToRole = {};
    Object.keys(roles).forEach((role) => {
      indexToRole[roles[role]] = role;
    });

    // 3. Apply styles
    const items = carousel.querySelectorAll('.toonhub-item');
    items.forEach((item) => {
      const idx = Number(item.dataset.imgIndex);
      const role = indexToRole[idx] || 'back';
      applyStyle(item, styles[role]);
    });
  }



  // -------------interactive images----------------
  const demoLinks = ['https://realstatedemo01.netlify.app/', 'https://sairacafe.netlify.app/', 'https://new-gym-demo.vercel.app/', 'https://democlinic001.netlify.app/'];
  const demoWeb = document.querySelectorAll('.toonhub-item');
  demoWeb.forEach((item, idx) => {
    item.addEventListener('click', () => {
      window.open(demoLinks[idx], '_blank');
    });
  });


  // -------------p5-bgtext-----------


  const demowebNames = [
    'Real State',
    'Cafe',
    'GYM',
    'Clinic'
  ];

  const p5BgText = document.getElementById('p5-bg-text');

  let currentIndex = 0;

  p5BgText.textContent = demowebNames[currentIndex];

  btnNext.addEventListener('click', () => {
    currentIndex++;

    // Loop back to the first item
    if (currentIndex >= demowebNames.length) {
      currentIndex = 0;
    }

    updateDemo();
    // p5BgText.textContent = demowebNames[currentIndex];
  });

  btnPrev.addEventListener('click', () => {
    currentIndex--;

    // Loop to the last item
    if (currentIndex < 0) {
      currentIndex = demowebNames.length - 1;
    }

    updateDemo();

    // p5BgText.textContent = demowebNames[currentIndex];
  });

    function updateDemo() {
    gsap.to(p5BgText, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.3,
      ease: "power3",
      onComplete: () => {
        p5BgText.textContent = demowebNames[currentIndex];

        gsap.fromTo(
          p5BgText,
          {
            opacity: 0,
            y: -50,
            scale: 1.2
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3"
          }
        );
      }
    });
  }
  


  /* ---------- Navigate ---------- */
  function navigate(direction) {
    if (state.isAnimating) return;
    state.isAnimating = true;

    state.activeIndex = direction === 'next'
      ? (state.activeIndex + 1) % 4
      : (state.activeIndex + 3) % 4;

    render();

    window.setTimeout(() => {
      state.isAnimating = false;
    }, 650);
  }

  /* ---------- Events ---------- */
  btnPrev.addEventListener('click', () => navigate('prev'));
  btnNext.addEventListener('click', () => navigate('next'));

  // Keyboard support — ignore when typing in inputs (defensive, harmless here)
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
    if (e.key === 'ArrowLeft')  navigate('prev');
    else if (e.key === 'ArrowRight') navigate('next');
  });

  // Touch swipe support on the stage (nice-to-have, matches the "carousel" feel)
  (function attachSwipe() {
    const stage = document.querySelector('.toonhub-stage');
    if (!stage) return;
    let startX = null, startY = null, locked = false;

    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      locked = false;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (startX === null || locked) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      // Lock to horizontal only if horizontal movement dominates
      if (!locked && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        locked = true;
      }
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      if (startX === null || !locked) { startX = null; return; }
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
      const dx = endX - startX;
      if (Math.abs(dx) > 50) {
        navigate(dx < 0 ? 'next' : 'prev');
      }
      startX = null;
      locked = false;
    }, { passive: true });
  })();

  /* ---------- Resize handling ---------- */
  let resizeTimer;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nextBp = getBreakpoint(w);

      // Re-render only if breakpoint or dimensions meaningfully changed
      const bpChanged = nextBp !== state.breakpoint;
      const sizeChanged =
        Math.abs(w - state.vw) > 40 || Math.abs(h - state.vh) > 40;

      state.breakpoint = nextBp;
      state.vw = w;
      state.vh = h;

      if (bpChanged || sizeChanged) {
        render();
      }
    }, 120);
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', () => {
    // Delay slightly so the new viewport dimensions are settled
    window.setTimeout(onResize, 150);
  });

  /* ---------- Initial paint ---------- */
  state.breakpoint = getBreakpoint(window.innerWidth);
  state.vw = window.innerWidth;
  state.vh = window.innerHeight;
  render();
})();