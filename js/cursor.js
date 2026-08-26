(function () {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  var dot = document.querySelector(".cursor-dot");
  var ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;

  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
  });

  function raf() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var interactive = 'a, button, input, textarea, [role="button"], .magnetic';
  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(interactive)) ring.classList.add("is-active");
  });
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(interactive)) ring.classList.remove("is-active");
  });
})();
