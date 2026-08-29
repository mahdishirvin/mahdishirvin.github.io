import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";

var pre    = document.querySelector('.preloader');
var mono   = pre && pre.querySelector('.preloader__monogram');
var label  = pre && pre.querySelector('.preloader__label');
var bar    = pre && pre.querySelector('.preloader__bar');
var count  = pre && pre.querySelector('.preloader__count');

if (!pre) {
  document.dispatchEvent(new CustomEvent('preloader:done'));
} else {
  pre.removeAttribute('hidden');

  var obj = { val: 0 };

  var tl = gsap.timeline({
    onComplete: function () {
      gsap.to(pre, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: function () {
          pre.setAttribute('hidden', '');
          document.dispatchEvent(new CustomEvent('preloader:done'));
        }
      });
    }
  });

  /* Fade in monogram + label */
  tl.to(mono, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0)
    .to(label, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.15)

  /* Animate counter + bar */
    .to(obj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: function () {
        var v = Math.round(obj.val);
        count.textContent = String(v).padStart(3, '0');
        bar.style.width   = v + '%';
      }
    }, 0.2);
}
