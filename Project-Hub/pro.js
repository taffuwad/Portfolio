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
