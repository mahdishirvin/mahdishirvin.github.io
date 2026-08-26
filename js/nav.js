(function () {
  var toggle = document.querySelector(".site-nav__toggle");
  var links = document.querySelector(".site-nav__center");

  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    links.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function () {
    var isOpen = links.classList.contains("is-open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 640) closeMenu();
  });
})();
