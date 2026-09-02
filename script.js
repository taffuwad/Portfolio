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


// About section horizontal scroll---------------------------------------- 
gsap.to(".about", {
    xPercent: -100,
    ease: "none",

    

    scrollTrigger: {
        trigger: ".about",
        start: "top top",
        end: () => `+=${window.innerWidth}`,
        pin: true,
        scrub: 1.5,
    }
});


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
