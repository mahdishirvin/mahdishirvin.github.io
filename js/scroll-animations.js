import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import ScrollTrigger from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";
import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.16/dist/lenis.mjs";

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
gsap.registerPlugin(ScrollTrigger);

/* Smooth scroll, wired to ScrollTrigger */
if (!reduceMotion) {
  var lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* Hero title reveal */
function playHeroReveal() {
  var lines = document.querySelectorAll(".hero__title .line span");
  var rest = document.querySelectorAll(".hero__eyebrow, .hero__bio, .hero__actions, .hero__scroll-cue");

  if (reduceMotion || !lines.length) {
    return;
  }

  gsap.set(lines, { yPercent: 110 });
  gsap.set(rest, { opacity: 0, y: 20 });

  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.to(lines, { yPercent: 0, duration: 1, stagger: 0.08 }).to(
    rest,
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
    "-=0.5"
  );
}

document.addEventListener("preloader:done", playHeroReveal);

/* Generic scroll reveals */
if (!reduceMotion) {
  document.querySelectorAll(".reveal").forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });
}

/* Magnetic buttons */
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".magnetic").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.4, duration: 0.4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", function () {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* Work — horizontal scroll gallery, progressive enhancement */
var wrapper = document.querySelector(".work-pin-wrapper");
var track = document.querySelector(".work-track");

if (wrapper && track) {
  if (reduceMotion) {
    wrapper.setAttribute("data-mode", "scroll");
  } else {
    wrapper.setAttribute("data-mode", "pin");

    var setupPin = function () {
      var distance = track.scrollWidth - window.innerWidth + 64;
      if (distance <= 0) return null;

      return gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=" + distance,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    };

    var pinTween = setupPin();
    window.addEventListener("resize", function () {
      if (pinTween) pinTween.scrollTrigger.kill();
      gsap.set(track, { x: 0 });
      pinTween = setupPin();
      ScrollTrigger.refresh();
    });
  }
}

/* Timeline stagger */
if (!reduceMotion) {
  gsap.utils.toArray(".timeline__item").forEach(function (item, i) {
    gsap.from(item, {
      opacity: 0,
      x: -24,
      duration: 0.6,
      delay: i * 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
      },
    });
  });
}
