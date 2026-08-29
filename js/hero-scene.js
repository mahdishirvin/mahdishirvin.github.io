/* Canvas 2D — animated data scatter network */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, points, animId;
  var mouse = { x: -9999, y: -9999 };

  var C1 = { r: 109, g: 93,  b: 252 }; /* accent indigo */
  var C2 = { r: 0,   g: 200, b: 184 }; /* accent teal   */
  var POINT_COUNT   = 90;
  var LINK_DIST     = 160;
  var LINK_DIST_SQ  = LINK_DIST * LINK_DIST;
  var MOUSE_PUSH    = 80;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function makePoint(w, h) {
    var t = Math.random();
    return {
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  1.5 + Math.random() * 2.5,
      t:  t,
      /* gradient colour interpolated by t */
      cr: Math.round(lerp(C1.r, C2.r, t)),
      cg: Math.round(lerp(C1.g, C2.g, t)),
      cb: Math.round(lerp(C1.b, C2.b, t)),
      opacity: 0.4 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    points = Array.from({ length: POINT_COUNT }, function () { return makePoint(W, H); });
  }

  function drawGrid() {
    var step = 80;
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = 0; x < W; x += step) {
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
    }
    for (var y = 0; y < H; y += step) {
      ctx.moveTo(0, y); ctx.lineTo(W, y);
    }
    ctx.stroke();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    /* subtle grid */
    drawGrid();

    /* update & draw links */
    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      /* move */
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      /* mouse push */
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist2 = dx * dx + dy * dy;
      if (dist2 < MOUSE_PUSH * MOUSE_PUSH) {
        var dist = Math.sqrt(dist2) || 1;
        var force = (MOUSE_PUSH - dist) / MOUSE_PUSH * 0.6;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      /* links to nearby points */
      for (var j = i + 1; j < points.length; j++) {
        var q = points[j];
        var ex = p.x - q.x;
        var ey = p.y - q.y;
        var ed2 = ex * ex + ey * ey;
        if (ed2 < LINK_DIST_SQ) {
          var alpha = (1 - ed2 / LINK_DIST_SQ) * 0.18;
          var mr = Math.round((p.cr + q.cr) / 2);
          var mg = Math.round((p.cg + q.cg) / 2);
          var mb = Math.round((p.cb + q.cb) / 2);
          ctx.strokeStyle = 'rgba(' + mr + ',' + mg + ',' + mb + ',' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    /* draw points on top */
    for (var k = 0; k < points.length; k++) {
      var pt = points[k];
      pt.pulse += 0.018;
      var pulsed = pt.r + Math.sin(pt.pulse) * 0.5;
      var op = pt.opacity * (0.85 + Math.sin(pt.pulse) * 0.15);

      /* soft glow */
      var grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pulsed * 4);
      grd.addColorStop(0, 'rgba(' + pt.cr + ',' + pt.cg + ',' + pt.cb + ',' + op + ')');
      grd.addColorStop(1, 'rgba(' + pt.cr + ',' + pt.cg + ',' + pt.cb + ',0)');

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pulsed * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      /* core dot */
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pulsed, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + pt.cr + ',' + pt.cg + ',' + pt.cb + ',' + op + ')';
      ctx.fill();
    }

    animId = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    resize();
    tick();
  });

  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /* Respect reduced motion — static snapshot only */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tick();
    cancelAnimationFrame(animId);
    return;
  }

  tick();
})();
