// smoooth scroll =---------------------------- 

const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.05,
    });

gsap.registerPlugin(ScrollTrigger, SplitText);


(function() {
        "use strict";

        // ----- DOM refs -----
        const leftPupil = document.getElementById('leftPupil');
        const rightPupil = document.getElementById('rightPupil');
        const leftEye = document.getElementById('leftEye');
        const rightEye = document.getElementById('rightEye');

        // ----- eye geometry cache -----
        let leftEyeRect = leftEye.getBoundingClientRect();
        let rightEyeRect = rightEye.getBoundingClientRect();

        // ----- update eye rects (on resize/scroll) -----
        function updateEyeRects() {
            leftEyeRect = leftEye.getBoundingClientRect();
            rightEyeRect = rightEye.getBoundingClientRect();
        }

        // ----- move pupils based on mouse/touch -----
        function movePupils(clientX, clientY) {
            if (!leftEyeRect || !rightEyeRect) return;

            // ----- LEFT EYE -----
            const leftCx = leftEyeRect.left + leftEyeRect.width / 2;
            const leftCy = leftEyeRect.top + leftEyeRect.height / 2;
            const eyeRadius = leftEyeRect.width / 2;          // ~75px
            const pupilRadius = leftPupil.offsetWidth / 2;    // ~30px
            const maxDist = eyeRadius - pupilRadius - 2;

            const dxLeft = clientX - leftCx;
            const dyLeft = clientY - leftCy;
            const distLeft = Math.hypot(dxLeft, dyLeft);

            let leftX = 0, leftY = 0;
            if (distLeft > 1) {
                const clampedDist = Math.min(distLeft, maxDist);
                const ratio = clampedDist / distLeft;
                leftX = dxLeft * ratio;
                leftY = dyLeft * ratio;
            }
            leftPupil.style.transform = `translate(calc(-50% + ${leftX}px), calc(-50% + ${leftY}px))`;

            // ----- RIGHT EYE -----
            const rightCx = rightEyeRect.left + rightEyeRect.width / 2;
            const rightCy = rightEyeRect.top + rightEyeRect.height / 2;
            const dxRight = clientX - rightCx;
            const dyRight = clientY - rightCy;
            const distRight = Math.hypot(dxRight, dyRight);

            let rightX = 0, rightY = 0;
            if (distRight > 1) {
                const clampedDist = Math.min(distRight, maxDist);
                const ratio = clampedDist / distRight;
                rightX = dxRight * ratio;
                rightY = dyRight * ratio;
            }
            rightPupil.style.transform = `translate(calc(-50% + ${rightX}px), calc(-50% + ${rightY}px))`;
        }

        // ----- mouse move handler (throttled by rAF) -----
        let rafId = null;
        function onMouseMove(e) {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                movePupils(e.clientX, e.clientY);
                rafId = null;
            });
        }

        // ----- reset pupils to center when mouse leaves window -----
        function onMouseLeave() {
            leftPupil.style.transform = 'translate(-50%, -50%)';
            rightPupil.style.transform = 'translate(-50%, -50%)';
        }

        // ----- refresh rects on resize / scroll -----
        function refreshRects() {
            updateEyeRects();
        }

        // ----- attach events -----
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);

        window.addEventListener('resize', refreshRects);
        window.addEventListener('scroll', refreshRects);
        window.addEventListener('orientationchange', () => {
            setTimeout(refreshRects, 200);
        });
        window.addEventListener('load', refreshRects);

        // initial capture
        refreshRects();
        setTimeout(refreshRects, 100);
        setTimeout(refreshRects, 400);

        // ----- TOUCH SUPPORT (no text) -----
        function onTouchMove(e) {
            e.preventDefault();  // prevent scroll while touching eyes
            const touch = e.touches[0];
            if (!touch) return;
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                movePupils(touch.clientX, touch.clientY);
                rafId = null;
            });
        }

        function onTouchEnd() {
            leftPupil.style.transform = 'translate(-50%, -50%)';
            rightPupil.style.transform = 'translate(-50%, -50%)';
        }

        const container = document.getElementById('eyeContainer');
        container.addEventListener('touchmove', onTouchMove, { passive: false });
        container.addEventListener('touchend', onTouchEnd);
        container.addEventListener('touchcancel', onTouchEnd);

        console.log('👀 Mouse tracking eyes (no bg, no text)');
    })();


// About ------------------------------------------------------------------
// The two About panels share one pinned, scroll-controlled sequence on larger
// screens.  Each text block is split into words so its reveal stays tied to
// the visitor's scroll position instead of firing as a one-off animation.
const aboutMedia = gsap.matchMedia();

aboutMedia.add(
    {
        desktop: "(min-width: 1025px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
        const { desktop, reduceMotion } = context.conditions;
        const about = document.querySelector(".about");

        if (!about || reduceMotion) return;

        const splitText = (selector) =>
            gsap.utils.toArray(selector).map(
                (element) =>
                    new SplitText(element, {
                        type: "lines,words",
                        mask: "lines",
                        linesClass: "about-line",
                        wordsClass: "about-word",
                    })
            );

        const firstPanelSplits = splitText(
            ".about1 .left h1, .about1 .left p, .about1 .right h1, .about1 .right h4, .about1 .right p"
        );
        const secondPanelSplits = splitText(
            ".about2 .left1 h1, .about2 .right1 h3, .about2 .right1 p"
        );
        const firstPanelWords = firstPanelSplits.flatMap((split) => split.words);
        const secondPanelWords = secondPanelSplits.flatMap((split) => split.words);

        if (desktop) {
            const aboutTimeline = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: about,
                    start: "top top",
                    end: () => `+=${window.innerWidth * 2.6}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            aboutTimeline
                .from(".about1 .about-img", {
                    scale: 0.82,
                    autoAlpha: 0,
                    duration: 0.55,
                })
                .from(
                    ".about1 .about-img img",
                    { scale: 1.28, duration: 0.7, ease: "power2.out" },
                    "<"
                )
                .from(
                    firstPanelWords,
                    {
                        yPercent: 115,
                        autoAlpha: 0,
                        stagger: 0.012,
                        duration: 0.5,
                    },
                    "<0.1"
                )
                .from(
                    ".about1 .eye-container",
                    {
                        scale: 0,
                        rotate: -18,
                        autoAlpha: 0,
                        stagger: 0.1,
                        duration: 0.32,
                    },
                    "<0.1"
                )
                .to(".about > *", {
                    xPercent: -100,
                    duration: 1.05,
                    ease: "none",
                })
                .from(
                    ".about2 .left1 .image",
                    {
                        clipPath: "inset(0 100% 0 0)",
                        scale: 1.08,
                        duration: 0.65,
                    },
                    "<0.2"
                )
                .from(
                    ".about2 .skill-cata",
                    {
                        xPercent: 22,
                        autoAlpha: 0,
                        stagger: 0.12,
                        duration: 0.42,
                    },
                    "<0.12"
                )
                .from(
                    secondPanelWords,
                    {
                        yPercent: 115,
                        autoAlpha: 0,
                        stagger: 0.008,
                        duration: 0.48,
                    },
                    "<"
                );
        } else {
            // On touch-sized layouts, keep the natural vertical flow and give
            // each panel an enter/leave reveal rather than pinning the page.
            gsap.from(firstPanelWords, {
                yPercent: 115,
                autoAlpha: 0,
                stagger: 0.012,
                duration: 0.5,
                scrollTrigger: {
                    trigger: ".about1",
                    start: "top 78%",
                    toggleActions: "play none none reverse",
                },
            });
            gsap.from(secondPanelWords, {
                yPercent: 115,
                autoAlpha: 0,
                stagger: 0.009,
                duration: 0.48,
                scrollTrigger: {
                    trigger: ".about2",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            });
            gsap.from(".about1 .about-img, .about1 .eye-container", {
                y: 40,
                scale: 0.94,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.55,
                scrollTrigger: {
                    trigger: ".about1",
                    start: "top 78%",
                    toggleActions: "play none none reverse",
                },
            });
            gsap.from(".about2 .left1 .image, .about2 .skill-cata", {
                y: 36,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.5,
                scrollTrigger: {
                    trigger: ".about2",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            });
        }

        return () => {
            firstPanelSplits.forEach((split) => split.revert());
            secondPanelSplits.forEach((split) => split.revert());
        };
    }
);


// works--------------------------------------------------- 

gsap.to(".works-wrapper",{

    scrollTrigger:{
        // trigger: ".works",
        start: "top top",
        end: () => `+=${window.innerWidth}`,
        pin: true,
        
        scrub: 1.5,

    }
})



// Home----------------------------------------------------------- 
const split = new SplitText(".home h1", {
  type: "chars"
});

const tl = gsap.timeline();
tl.fromTo(
  ".home",
  {
    clipPath: "polygon(17% 38%, 60% 36%, 62% 79%, 16% 80%)",
  },
  {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1.2,
    ease: "power4.inOut",
  }
);

tl.from(split.chars,{
    y: 100,
  opacity: 0,
  duration: 1,
  stagger: {
    from: "random",
    amount: 1
  },
  ease: "power4.out"
})
tl.from('nav ',{
    y:-200,
    stagger:0.05,
    ease:"elastic.out"
})

// About--------------------------------------------------------------- 

