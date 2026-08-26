(function () {
  var el = document.getElementById("local-clock");
  if (!el) return;

  var formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  function tick() {
    el.textContent = formatter.format(new Date()) + " local";
  }

  tick();
  setInterval(tick, 15000);
})();
