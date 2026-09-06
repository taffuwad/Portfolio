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
