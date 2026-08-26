import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";

var pre = document.querySelector(".preloader");
if (pre) {
  var countEl = pre.querySelector(".preloader__count");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    pre.hidden = true;
    document.documentElement.style.overflow = "";
    document.dispatchEvent(new CustomEvent("preloader:done"));
  }

  if (reduceMotion) {
    finish();
  } else {
    pre.hidden = false;
    document.documentElement.style.overflow = "hidden";
    setTimeout(finish, 5000);

    var counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 1.3,
      ease: "power2.out",
      onUpdate: function () {
        if (countEl) countEl.textContent = String(Math.floor(counter.val)).padStart(3, "0");
      },
      onComplete: function () {
        gsap.to(pre, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
          onComplete: finish,
        });
      },
    });
  }
} else {
  document.dispatchEvent(new CustomEvent("preloader:done"));
}
