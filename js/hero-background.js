(function () {
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var width = 0;
  var height = 0;
  var points = [];
  var pointer = { x: null, y: null };
  var rafId = null;

  var DENSITY = 22000; // px^2 per point — restrained, not a starfield
  var LINK_DISTANCE = 120;
  var POINTER_RADIUS = 160;
  var SPEED = 0.12;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedPoints();
  }

  function seedPoints() {
    var count = Math.max(18, Math.round((width * height) / DENSITY));
    points = [];
    for (var i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.2 + 0.6,
      });
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(140, 160, 190, 0.35)";
    points.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    points.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    ctx.fillStyle = "rgba(160, 180, 205, 0.55)";
    points.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        var a = points[i];
        var b = points[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          ctx.strokeStyle = "rgba(124, 196, 232, " + (0.16 * (1 - dist / LINK_DISTANCE)) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (pointer.x !== null) {
        var pdx = points[i].x - pointer.x;
        var pdy = points[i].y - pointer.y;
        var pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < POINTER_RADIUS) {
          ctx.strokeStyle = "rgba(124, 196, 232, " + (0.35 * (1 - pdist / POINTER_RADIUS)) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function handlePointerMove(event) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  }

  function handlePointerLeave() {
    pointer.x = null;
    pointer.y = null;
  }

  function start() {
    resize();
    if (reduceMotion) {
      drawStatic();
      return;
    }
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(step);
      }
    });
    rafId = requestAnimationFrame(step);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (reduceMotion) drawStatic();
    }, 150);
  });

  start();
})();
