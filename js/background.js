/**
 * Cinematic Three.js Space Background.
 * Single WebGL scene rendered on the existing #bg-canvas, covering the
 * entire page (canvas is position:fixed;inset:0 via CSS). Contains:
 * starfield, nebula clouds, distant galaxies, space dust, asteroids,
 * shooting stars, a slowly drifting camera, and soft cinematic lighting.
 *
 * This file owns the ONE render loop and ONE canvas for the whole site.
 * No other script should call getContext() on #bg-canvas.
 */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Tunable configuration -------------------------------------------
  const STAR_COUNT      = isMobile ? 2500 : 6000;
  const DUST_COUNT       = isMobile ? 150  : 400;
  const ASTEROID_COUNT   = isMobile ? 4    : 7;
  const NEBULA_COUNT     = 5;
  const GALAXY_COUNT     = 3;
  const MAX_PIXEL_RATIO  = isMobile ? 1.5 : 2;
  const SHOOTING_STAR_POOL = 4;

  // ---- Renderer / Scene / Camera ----------------------------------------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x02030a, 1);

  renderer.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02030a, 0.00035);

  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 4000
  );
  camera.position.set(0, 0, 600);

  // ---- Lighting -----------------------------------------------------------
  scene.add(new THREE.AmbientLight(0x2a3a6b, 0.6));

  const dirLight = new THREE.DirectionalLight(0x6fa8ff, 0.55);
  dirLight.position.set(300, 200, 400);
  scene.add(dirLight);

  const rimLight = new THREE.DirectionalLight(0xa855f7, 0.3);
  rimLight.position.set(-400, -150, -300);
  scene.add(rimLight);

  // ---- Shared helper: soft radial-gradient sprite texture -----------------
  function makeGlowTexture(innerColor, outerColor) {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.4, outerColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  const nebulaTexture = makeGlowTexture('rgba(255,255,255,0.9)', 'rgba(255,255,255,0.25)');

  // ---- Starfield (GPU shader: size, color, per-star twinkle) --------------
  function createStarfield(count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xdbe9ff), // pale blue
      new THREE.Color(0xfff3d6)  // pale yellow
    ];

    for (let i = 0; i < count; i++) {
      const radius = 400 + Math.random() * 1800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 400;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.2 + 0.6;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float size;
        attribute float phase;
        varying vec3 vColor;
        varying float vPhase;
        void main() {
          vColor = color;
          vPhase = phase;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vColor;
        varying float vPhase;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          float twinkle = 0.55 + 0.45 * sin(uTime * 1.4 + vPhase);
          gl_FragColor = vec4(vColor, glow * twinkle);
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
  }

  const stars = createStarfield(STAR_COUNT);
  scene.add(stars);

  // ---- Space dust (subtle, near-static drift) ------------------------------
  function createDust(count) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 1400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800 - 200;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 1.4,
      color: 0x9db4e8,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geometry, material);
  }

  const dust = createDust(DUST_COUNT);
  scene.add(dust);

  // ---- Nebula clouds (soft sprites, behind the stars) ----------------------
  const nebulaColors = [0x4f7cff, 0x8b5cf6, 0xec4899, 0x00e5ff, 0xa855f7];
  const nebulaSprites = [];

  for (let i = 0; i < NEBULA_COUNT; i++) {
    const mat = new THREE.SpriteMaterial({
      map: nebulaTexture,
      color: nebulaColors[i % nebulaColors.length],
      transparent: true,
      opacity: 0.16 + Math.random() * 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    const scale = 1200 + Math.random() * 900;
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 1800,
      (Math.random() - 0.5) * 1000,
      -900 - Math.random() * 700
    );
    sprite.userData.driftSpeed = 0.02 + Math.random() * 0.03;
    sprite.userData.driftOffset = Math.random() * Math.PI * 2;
    sprite.userData.rotSpeed = (Math.random() - 0.5) * 0.0006;
    scene.add(sprite);
    nebulaSprites.push(sprite);
  }

  // ---- Distant galaxies (very faint, far away) ------------------------------
  const galaxySprites = [];
  for (let i = 0; i < GALAXY_COUNT; i++) {
    const mat = new THREE.SpriteMaterial({
      map: nebulaTexture,
      color: 0xd6e2ff,
      transparent: true,
      opacity: 0.05 + Math.random() * 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    const scale = 500 + Math.random() * 400;
    sprite.scale.set(scale, scale * 0.5, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 1500,
      -2200 - Math.random() * 600
    );
    scene.add(sprite);
    galaxySprites.push(sprite);
  }

  // ---- Asteroids (low-poly, rotating, kept toward the edges) ---------------
  const asteroids = [];
  const asteroidGeo = new THREE.IcosahedronGeometry(1, 0);
  const asteroidMat = new THREE.MeshStandardMaterial({
    color: 0x4b4a55,
    roughness: 0.95,
    metalness: 0.08,
    flatShading: true
  });

  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const mesh = new THREE.Mesh(asteroidGeo, asteroidMat);
    const size = 5 + Math.random() * 10;
    mesh.scale.setScalar(size);

    const side = i % 2 === 0 ? -1 : 1;
    mesh.position.set(
      side * (350 + Math.random() * 350),
      (Math.random() - 0.5) * 500,
      -200 - Math.random() * 700
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData.rotSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.004,
      (Math.random() - 0.5) * 0.004,
      (Math.random() - 0.5) * 0.004
    );
    mesh.userData.driftPhase = Math.random() * Math.PI * 2;
    scene.add(mesh);
    asteroids.push(mesh);
  }

  // ---- Shooting stars (small recycled pool) ---------------------------------
  const shootingStars = [];
  for (let i = 0; i < SHOOTING_STAR_POOL; i++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ]);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    line.visible = false;
    scene.add(line);
    shootingStars.push({ line, life: 0, maxLife: 0, dir: new THREE.Vector3(), start: new THREE.Vector3(), active: false });
  }

  let nextShootingStarAt = performance.now() + (3000 + Math.random() * 4000);

  function spawnShootingStar(now) {
    const slot = shootingStars.find((s) => !s.active);
    if (!slot) return;

    slot.start.set(
      (Math.random() - 0.5) * 1200,
      300 + Math.random() * 200,
      -300 - Math.random() * 400
    );
    slot.dir.set(
      -0.6 - Math.random() * 0.4,
      -0.4 - Math.random() * 0.3,
      0
    ).normalize();
    slot.maxLife = 700 + Math.random() * 500;
    slot.life = 0;
    slot.active = true;
    slot.line.visible = true;
    slot.line.material.opacity = 0;

    nextShootingStarAt = now + (4000 + Math.random() * 5000);
  }

  function updateShootingStars(dt, now) {
    if (now >= nextShootingStarAt) spawnShootingStar(now);

    shootingStars.forEach((s) => {
      if (!s.active) return;
      s.life += dt;
      const t = s.life / s.maxLife;

      if (t >= 1) {
        s.active = false;
        s.line.visible = false;
        return;
      }

      const travel = 260 * t;
      const head = s.start.clone().add(s.dir.clone().multiplyScalar(travel));
      const tail = s.start.clone().add(s.dir.clone().multiplyScalar(Math.max(travel - 40, 0)));

      const positions = s.line.geometry.attributes.position;
      positions.setXYZ(0, tail.x, tail.y, tail.z);
      positions.setXYZ(1, head.x, head.y, head.z);
      positions.needsUpdate = true;

      s.line.material.opacity = t < 0.15 ? t / 0.15 : (1 - (t - 0.15) / 0.85);
    });
  }

  // ---- Resize handling ---------------------------------------------------
  function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', handleResize, { passive: true });

  // ---- Render loop (single RAF, pauses when tab hidden) ---------------------
  const clock = new THREE.Clock();
  let running = true;
  let rafId = null;

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!running) return;

    const elapsed = clock.getElapsedTime();
    const dt = clock.getDelta() * 1000;
    const now = performance.now();

    stars.material.uniforms.uTime.value = elapsed;

    if (!reducedMotion) {
      dust.rotation.y += 0.00025;
      dust.rotation.x += 0.00008;

      nebulaSprites.forEach((sprite) => {
        const d = sprite.userData;
        sprite.position.x += Math.sin(elapsed * d.driftSpeed + d.driftOffset) * 0.06;
        sprite.position.y += Math.cos(elapsed * d.driftSpeed + d.driftOffset) * 0.04;
        sprite.material.rotation += d.rotSpeed;
      });

      asteroids.forEach((a) => {
        a.rotation.x += a.userData.rotSpeed.x;
        a.rotation.y += a.userData.rotSpeed.y;
        a.rotation.z += a.userData.rotSpeed.z;
        a.position.y += Math.sin(elapsed * 0.15 + a.userData.driftPhase) * 0.02;
      });

      updateShootingStars(dt, now);

      // Cinematic idle camera drift — never fully static.
      camera.position.x = Math.sin(elapsed * 0.05) * 30;
      camera.position.y = Math.cos(elapsed * 0.04) * 18;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) clock.getDelta(); // avoid a large dt jump after resuming
  });

  animate();
})();