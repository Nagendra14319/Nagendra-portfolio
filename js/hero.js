/**
 * Hero section behaviour:
 *  - avatar tilts slightly toward the mouse (parallax)
 *  - a ring of tech icons is generated and positioned around the photo
 *  - the role line types/deletes through a list of phrases
 */
(function () {
  // ---- Avatar parallax tilt ----
  const avatarFrame = document.getElementById('avatarFrame');
  const heroRight = document.querySelector('.hero-right');
  if (avatarFrame && heroRight) {
    // Cache the rect on enter/resize instead of calling getBoundingClientRect()
    // on every mousemove — that call forces a synchronous layout read, and
    // mousemove can fire dozens of times per frame.
    let heroRect = heroRight.getBoundingClientRect();
    let tiltTicking = false;
    let lastX = 0, lastY = 0;

    function refreshHeroRect() { heroRect = heroRight.getBoundingClientRect(); }
    heroRight.addEventListener('mouseenter', refreshHeroRect, { passive: true });
    window.addEventListener('resize', refreshHeroRect, { passive: true });

    heroRight.addEventListener('mousemove', (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!tiltTicking) {
        tiltTicking = true;
        requestAnimationFrame(() => {
          const px = (lastX - heroRect.left - heroRect.width / 2) / (heroRect.width / 2);
          const py = (lastY - heroRect.top - heroRect.height / 2) / (heroRect.height / 2);
          avatarFrame.style.transform = `translate(-50%,-50%) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
          tiltTicking = false;
        });
      }
    }, { passive: true });
    heroRight.addEventListener('mouseleave', () => {
      avatarFrame.style.transform = 'translate(-50%,-50%) rotateY(0) rotateX(0)';
    });
  }

  // ---- Orbiting tech icon ring ----
  const iconRing = document.getElementById('iconRing');
  if (iconRing) {
    // Edit this list to change which tech logos float around your photo.
    // "dev" = Devicon class suffix (real brand logo). "icon" = Lucide icon name (generic).
    const ringIcons = [
      { dev: 'python-plain', color: '#3776AB', tint: 'rgba(55,118,171,.18)' },
      { dev: 'react-original', color: '#61dafb', tint: 'rgba(34,211,238,.18)' },
      { dev: 'fastapi-plain', color: '#10b981', tint: 'rgba(16,185,129,.18)' },
      { dev: 'nodejs-plain', color: '#8cc84b', tint: 'rgba(140,200,75,.18)' },
      { dev: 'mongodb-plain', color: '#4ade80', tint: 'rgba(71,162,72,.18)' },
      { dev: 'docker-plain', color: '#38bdf8', tint: 'rgba(36,150,237,.18)' },
      { dev: 'git-plain', color: '#f0502b', tint: 'rgba(240,80,50,.18)' },
      { dev: 'tensorflow-original', color: '#f97316', tint: 'rgba(249,115,22,.18)' },
    ];

    const RING_RADIUS = 220;
    const CENTER = 200;

    ringIcons.forEach((item, i) => {
      const angle = (i / ringIcons.length) * Math.PI * 2 - Math.PI / 2;
      const x = CENTER + RING_RADIUS * Math.cos(angle) - 25;
      const y = CENTER + RING_RADIUS * Math.sin(angle) - 25;

      const el = document.createElement('div');
      el.className = 'float-icon';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = item.color;
      el.style.background = item.tint;
      el.style.animationDelay = `${i * 0.4}s`;
      el.innerHTML = item.img
        ? `<img src="${item.img}" width="32" height="32" alt="" style="display:block;"/>`
        : item.dev
        ? `<i class="devicon-${item.dev} colored"></i>`
        : `<svg data-lucide="${item.icon}"></svg>`;

      iconRing.appendChild(el);
    });

    if (window.lucide) lucide.createIcons();
  }

  // ---- Typewriter role text ----
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    // Edit this list to change the roles that cycle under your name.
    const phrases = [
      'Python Developer',
      'AI Engineer',
      'Data Analyst',
      'Full Stack Developer',
      'Machine Learning Engineer',
      'FastAPI Developer',
      'Generative AI Developer',
      'Cybersecurity Enthusiast',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 60);
    }
    typeLoop();
  }
})();