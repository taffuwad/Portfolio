// Keep the loading animation on screen until all page assets are ready.
const pageLoader = document.querySelector(".page-loader");

window.addEventListener("load", () => {
    if (!pageLoader) return;

    window.setTimeout(() => {
        pageLoader.classList.add("is-hidden");
        pageLoader.addEventListener("transitionend", () => pageLoader.remove(), { once: true });
    }, 250);
}, { once: true });

// Animation libraries are loaded from the CDN in index.html.
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;
const lenis = window.Lenis
    ? new window.Lenis({ autoRaf: true, lerp: 0.05 })
    : null;

if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

if (gsap && SplitText) {
    gsap.registerPlugin(SplitText);
}

// Navbar links use Lenis when available and keep the current section visible.
(() => {
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const scrollTriggers = [...document.querySelectorAll("[data-scroll-target]")];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const scrollToTarget = (targetSelector) => {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        if (lenis) {
            lenis.scrollTo(target, { offset: -24 });
        } else {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            scrollToTarget(link.getAttribute("href"));
        });
    });

    scrollTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            scrollToTarget(trigger.dataset.scrollTarget);
        });
    });

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    navLinks.forEach((link) => {
                        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
                        link.toggleAttribute("aria-current", isCurrent);
                    });
                });
            },
            { rootMargin: "-35% 0px -55%", threshold: 0 }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }
})();


// Custom cursor for all headings and paragraphs ------------------------
(() => {
    const cursor = document.getElementById("cursorLine");
    const textTargets = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!cursor || !textTargets.length || !canHover.matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }, { passive: true });

    textTargets.forEach((target) => {
        target.addEventListener("mouseenter", () => cursor.classList.add("is-visible"));
        target.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
    });

    document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
    window.addEventListener("blur", () => cursor.classList.remove("is-visible"));

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
})();



(function() {
        "use strict";

        // ----- DOM refs -----
        const leftPupil = document.getElementById('leftPupil');
        const rightPupil = document.getElementById('rightPupil');
        const leftEye = document.getElementById('leftEye');
        const rightEye = document.getElementById('rightEye');

        // The eye animation is optional; do not let absent markup stop site scripts.
        if (!leftPupil || !rightPupil || !leftEye || !rightEye) return;

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

    })();


// About ------------------------------------------------------------------
// The two About panels share one pinned, scroll-controlled sequence on larger
// screens.  Each text block is split into words so its reveal stays tied to
// the visitor's scroll position instead of firing as a one-off animation.
const about = document.querySelector(".about");

if (gsap && ScrollTrigger && about) {
    const aboutMedia = gsap.matchMedia();

    aboutMedia.add(
        {
            desktop: "(min-width: 1025px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
            const { desktop, reduceMotion } = context.conditions;
            if (reduceMotion) return;

            const panelOne = about.querySelector(".about1");
            const panelTwo = about.querySelector(".about2");
            const firstPanelContent = about.querySelectorAll(
                ".about1 .left h1, .about1 .left p, .about1 .right h1, .about1 .right h4, .about1 .right p"
            );
            const secondPanelContent = about.querySelectorAll(
                ".about2 .left1 h1, .about2 .right1 h3, .about2 .right1 p"
            );

            const animationContext = gsap.context(() => {
                if (desktop) {
                    gsap.timeline({
                        defaults: { ease: "power3.out" },
                        scrollTrigger: {
                            trigger: about,
                            start: "top top",
                            end: () => `+=${window.innerWidth * 2.4}`,
                            pin: true,
                            scrub: 1,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    })
                        .from(".about1 .about-img", { scale: 0.82, autoAlpha: 0, duration: 0.45 })
                        .from(".about1 .about-img img", { scale: 1.18, duration: 0.55 }, "<")
                        .from(firstPanelContent, { y: 42, autoAlpha: 0, stagger: 0.08, duration: 0.38 }, "<0.1")
                        .from(".about1 .eye-container", { scale: 0, rotate: -15, autoAlpha: 0, stagger: 0.1, duration: 0.35 }, "<0.05")
                        .to([panelOne, panelTwo], { xPercent: -100, duration: 0.95, ease: "none" })
                        .from(".about2 .left1 .image", { clipPath: "inset(0 100% 0 0)", scale: 1.06, duration: 0.5 }, "<0.15")
                        .from(".about2 .skill-cata", { x: 42, autoAlpha: 0, stagger: 0.12, duration: 0.35 }, "<0.1")
                        .from(secondPanelContent, { y: 32, autoAlpha: 0, stagger: 0.06, duration: 0.32 }, "<");
                } else {
                    const reveal = (targets, trigger) =>
                        gsap.from(targets, {
                            y: 32,
                            autoAlpha: 0,
                            stagger: 0.08,
                            duration: 0.5,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger,
                                start: "top 78%",
                                toggleActions: "play none none reverse",
                            },
                        });

                    reveal([".about1 .about-img", ".about1 .eye-container", ...firstPanelContent], panelOne);
                    reveal([".about2 .left1 .image", ".about2 .skill-cata", ...secondPanelContent], panelTwo);
                }
            }, about);

            requestAnimationFrame(() => ScrollTrigger.refresh());
            return () => animationContext.revert();
        }
    );
}


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


// Contact -------------------------------------------------
const contactSection = document.querySelector(".contact");

if (contactSection) {
    const contactMedia = gsap.matchMedia();

    contactMedia.add("(prefers-reduced-motion: no-preference)", () => {
        const contactTitle = contactSection.querySelector(".con-top > .text");
        const contactSplit = new SplitText(contactTitle, {
            type: "lines,words",
            linesClass: "contact-title-line",
        });

        const contactTimeline = gsap.timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
                trigger: contactSection,
                start: "top 72%",
                toggleActions: "play none none reverse",
            },
        });

        contactTimeline
            .from(contactSplit.words, {
                yPercent: 125,
                rotate: 2,
                autoAlpha: 0,
                duration: 0.9,
                stagger: 0.06,
            })
            .from(".contact .con-top .box", {
                y: 70,
                autoAlpha: 0,
                duration: 0.85,
            }, "-=0.45")
            .from(".contact .con-top img", {
                scale: 0.82,
                rotate: -7,
                duration: 0.75,
            }, "-=0.65")
            .from(".contact .con-bottom .sec", {
                x: -34,
                autoAlpha: 0,
                duration: 0.55,
                stagger: 0.1,
            }, "-=0.25")
            .from(".contact .send", {
                y: 24,
                scale: 0.92,
                duration: 0.55,
            }, "-=0.15");

        gsap.to(".contact .con-top img", {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
                trigger: contactSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
            },
        });

        return () => contactSplit.revert();
    });
}



// Home----------------------------------------------------------- 
const split = new SplitText(".home h1", {
  type: "chars"
});

const tl = gsap.timeline();
tl.fromTo(
  ".home",
  {
    clipPath: "polygon(0% 0%, 52.83% 47.62%, 100% 99.5%, 43.54% 56.24%)",
  },
  {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1.2,
    ease: "power4.inOut",
  }
)
tl.from(split.chars,{
    y: 200,
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
    ease:"expo.out"
}, '-=0.5');



// Magnetic home title --------------------------------------------------



// About--------------------------------------------------------------- 

// Contact form --------------------------------------------------------
(() => {
    const contactForm = document.querySelector("#contact-form");
    if (!contactForm) return;

    const submitButton = contactForm.querySelector(".send");
    const statusMessage = contactForm.querySelector(".contact-form-status");
    const defaultButtonText = submitButton.textContent;

    const showStatus = (message, isError = false) => {
        statusMessage.textContent = message;
        statusMessage.hidden = false;
        statusMessage.style.color = isError ? "#a12424" : "#222";
    };

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";
        statusMessage.hidden = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" },
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Web3Forms submission failed.");
            }

            contactForm.reset();
            showStatus("MESSAGE SENT — THANK YOU.");
        } catch (error) {
            console.error("Contact form submission failed:", error);
            showStatus("Something went wrong. Please try again.", true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = defaultButtonText;
        }
    });
})();

