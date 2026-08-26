import * as THREE from "three";

var canvas = document.getElementById("hero-canvas");
if (canvas && canvas.getContext) {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 6;

  function makeSpriteTexture() {
    var size = 128;
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  var COUNT = 1500;
  var positions = new Float32Array(COUNT * 3);
  var colors = new Float32Array(COUNT * 3);
  var colorA = new THREE.Color("#8b5cf6");
  var colorB = new THREE.Color("#22d3ee");

  for (var i = 0; i < COUNT; i++) {
    var t = i / COUNT;
    var phi = Math.acos(1 - 2 * t);
    var theta = Math.PI * (1 + Math.sqrt(5)) * i;
    var r = 2.5 + (Math.random() - 0.5) * 0.7;
    var x = r * Math.sin(phi) * Math.cos(theta);
    var y = r * Math.sin(phi) * Math.sin(theta);
    var z = r * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    var mixed = colorA.clone().lerp(colorB, t);
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: 0.065,
    map: makeSpriteTexture(),
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  var points = new THREE.Points(geometry, material);
  points.rotation.x = 0.3;
  scene.add(points);

  function resize() {
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var targetRotY = 0;
  var targetRotX = 0.3;
  window.addEventListener("pointermove", function (e) {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.7;
    targetRotX = 0.3 + (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  if (reduceMotion) {
    renderer.render(scene, camera);
  } else {
    (function animate() {
      points.rotation.y += 0.0009;
      points.rotation.x += (targetRotX - points.rotation.x) * 0.02;
      points.rotation.y += (targetRotY - 0) * 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  }
}
