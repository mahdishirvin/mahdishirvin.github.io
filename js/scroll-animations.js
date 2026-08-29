import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import ScrollTrigger from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";
import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.16/dist/lenis.mjs";

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

/* ── Smooth scroll, wired to ScrollTrigger ───────────── */
if (!reduceMotion) {
  var lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

/* ── Hero reveal (fires after preloader) ─────────────── */
function playHeroReveal() {
  var lines = document.querySelectorAll('.hero__title .line span');
  var rest  = document.querySelectorAll('.hero__eyebrow, .hero__bio, .hero__actions, .hero__scroll-cue');

  if (reduceMotion || !lines.length) return;

  gsap.set(lines, { yPercent: 110 });
  gsap.set(rest,  { opacity: 0, y: 16 });

  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(lines, { yPercent: 0, duration: 1.1, stagger: 0.1 })
    .to(rest,  { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, '-=0.6');
}

document.addEventListener('preloader:done', playHeroReveal);

/* ── Skills ticker marquee ───────────────────────────── */
var tickerTrack = document.querySelector('.ticker__track');
if (tickerTrack && !reduceMotion) {
  gsap.to(tickerTrack, {
    x: '-50%',
    duration: 22,
    ease: 'none',
    repeat: -1
  });
}

/* ── Work tile marquee ───────────────────────────────── */
var marqueeTrack = document.querySelector('.marquee-track');
var marqueeOuter = document.querySelector('.marquee-outer');

if (marqueeTrack) {
  if (reduceMotion) {
    /* Static: just show as a scrollable row */
    marqueeOuter.style.overflowX = 'auto';
  } else {
    var workAnim = gsap.to(marqueeTrack, {
      x: '-50%',
      duration: 32,
      ease: 'none',
      repeat: -1
    });

    /* Slow on hover */
    marqueeOuter.addEventListener('mouseenter', function () {
      gsap.to(workAnim, { timeScale: 0.25, duration: 0.5, ease: 'power2.out' });
    });
    marqueeOuter.addEventListener('mouseleave', function () {
      gsap.to(workAnim, { timeScale: 1, duration: 0.8, ease: 'power2.inOut' });
    });
  }
}

/* ── Generic .reveal scroll animations ───────────────── */
if (!reduceMotion) {
  document.querySelectorAll('.reveal').forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 36 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      }
    });
  });
}

/* ── Timeline stagger ────────────────────────────────── */
if (!reduceMotion) {
  gsap.utils.toArray('.timeline__item').forEach(function (item, i) {
    gsap.from(item, {
      opacity: 0,
      x: -20,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 92%',
      },
      delay: i * 0.04
    });
  });
}

/* ── Magnetic buttons ────────────────────────────────── */
if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.magnetic').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width  / 2;
      var y = e.clientY - rect.top  - rect.height / 2;
      gsap.to(el, { x: x * 0.25, y: y * 0.3, duration: 0.35, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', function () {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
