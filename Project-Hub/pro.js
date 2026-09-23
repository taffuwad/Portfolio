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
