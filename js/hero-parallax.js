(function () {
  var stage = document.querySelector(".hero__stage");
  var frame = document.querySelector(".hero__frame");
  if (!stage || !frame) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var images = Array.prototype.slice.call(frame.querySelectorAll(".hero__img"));

  function setActiveImage(key) {
    var target = null;
    if (key) {
      target = images.filter(function (img) {
        return img.getAttribute("data-preview-img") === key;
      })[0];
    }
    if (!target) {
      target = images.filter(function (img) {
        return img.hasAttribute("data-default");
      })[0];
    }
    images.forEach(function (img) {
      img.classList.toggle("is-active", img === target);
    });
  }

  document.querySelectorAll("[data-preview]").forEach(function (el) {
    var key = el.getAttribute("data-preview");
    el.addEventListener("mouseenter", function () {
      setActiveImage(key);
    });
    el.addEventListener("focus", function () {
      setActiveImage(key);
    });
    el.addEventListener("mouseleave", function () {
      setActiveImage(null);
    });
    el.addEventListener("blur", function () {
      setActiveImage(null);
    });
  });

  if (reduceMotion) return;

  var rafId = null;
  var maxDeg = 8;

  function handlePointerMove(event) {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      var rect = stage.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (event.clientX - cx) / (rect.width / 2);
      var dy = (event.clientY - cy) / (rect.height / 2);
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));
      frame.style.transform = "rotateY(" + (dx * maxDeg).toFixed(2) + "deg) rotateX(" + (-dy * maxDeg).toFixed(2) + "deg)";
      rafId = null;
    });
  }

  function resetTilt() {
    frame.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  stage.addEventListener("pointermove", handlePointerMove);
  stage.addEventListener("pointerleave", resetTilt);
})();
