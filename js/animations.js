/**
 * Page-wide interaction behaviour:
 *  - fade/slide-in reveal for elements tagged .reveal
 *  - animated fill for skill progress bars
 *  - contact form fake-submit success state
 *  - nav link highlighting based on scroll position
 *  - theme toggle button (visual placeholder)
 */
(function () {
  // ---- Tech carousel hover-to-grid (zero layout-shift version) ----
  const techInteractive = document.getElementById('techInteractive');
  const techTrack = document.getElementById('techTrack');
  const techCarousel = document.getElementById('techCarousel');
  const techGrid = document.getElementById('techGridExpand');
  if (techInteractive && techTrack && techCarousel && techGrid) {
    let techGridH = 0, techCarH = 0;
    function sizeTechContainer() {
      const wasHidden = techGrid.style.visibility;
      techGrid.style.visibility = 'hidden';
      techGrid.style.position = 'static';
      techGridH = techGrid.scrollHeight;
      techGrid.style.position = '';
      techGrid.style.visibility = wasHidden || '';
      techCarH = techCarousel.scrollHeight;
      techInteractive.style.height = techCarH + 'px';
    }
    sizeTechContainer();
    let techResizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(techResizeTimer);
      techResizeTimer = setTimeout(sizeTechContainer, 150);
    }, { passive: true });

    techInteractive.addEventListener('mouseenter', () => {
      techTrack.style.animationPlayState = 'paused';
      techInteractive.classList.add('expanded');
      techInteractive.style.height = techGridH + 'px';
    });
    techInteractive.addEventListener('mouseleave', () => {
      techInteractive.classList.remove('expanded');
      techTrack.style.animationPlayState = 'running';
      techInteractive.style.height = techCarH + 'px';
    });
  }
  // ---- Pause off-screen animations to reduce idle GPU/CPU load ----
  const pauseWhenHiddenObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  document.querySelectorAll('.tech-matrix-card').forEach((el) => pauseWhenHiddenObserver.observe(el));
  // ---- Scroll reveal ----
  // ---- Certificate 3D Coverflow Carousel ----
  const certStage = document.getElementById('certStage');
  const certCoverflow = document.getElementById('certCoverflow');
  const certPrevBtn = document.getElementById('certPrev');
  const certNextBtn = document.getElementById('certNext');
  if (certStage && certCoverflow && certPrevBtn && certNextBtn) {
    const certCards = Array.from(certStage.querySelectorAll('.cert-coverflow-card'));
    const certCount = certCards.length;
    let certActive = 0;
    let certAutoplayTimer = null;

    function renderCertPositions() {
      certCards.forEach((card, i) => {
        const diff = (i - certActive + certCount) % certCount;
        card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');
        if (diff === 0) card.classList.add('is-center');
        else if (diff === 1) card.classList.add('is-right');
        else if (diff === certCount - 1) card.classList.add('is-left');
        else card.classList.add('is-hidden');
      });
    }

    function goToCert(newIndex) {
      certActive = ((newIndex % certCount) + certCount) % certCount;
      renderCertPositions();
    }
    function nextCert() { goToCert(certActive + 1); }
    function prevCert() { goToCert(certActive - 1); }

    function spawnRipple(btn, e) {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e ? e.clientX - rect.left : rect.width / 2) - size / 2 + 'px';
      ripple.style.top = (e ? e.clientY - rect.top : rect.height / 2) - size / 2 + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    }

    function startCertAutoplay() {
      stopCertAutoplay();
      certAutoplayTimer = setInterval(nextCert, 4000);
    }
    function stopCertAutoplay() {
      if (certAutoplayTimer) clearInterval(certAutoplayTimer);
      certAutoplayTimer = null;
    }

    certNextBtn.addEventListener('click', (e) => { spawnRipple(certNextBtn, e); nextCert(); });
    certPrevBtn.addEventListener('click', (e) => { spawnRipple(certPrevBtn, e); prevCert(); });

    certCards.forEach((card) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('is-left')) prevCert();
        else if (card.classList.contains('is-right')) nextCert();
      });
    });

    certCoverflow.addEventListener('mouseenter', stopCertAutoplay);
    certCoverflow.addEventListener('mouseleave', startCertAutoplay);

    // The autoplay setInterval used to run continuously for the entire
    // page lifetime, even while this section was scrolled far off-screen
    // or the tab was backgrounded. Gate it behind visibility instead.
    const certVisibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !document.hidden) startCertAutoplay();
        else stopCertAutoplay();
      });
    }, { threshold: 0.2 });
    certVisibilityObserver.observe(certCoverflow);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopCertAutoplay();
    });

    renderCertPositions();
  }
  // ---- Stats bar: fade/slide-in + count-up ----
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        const numEl = entry.target.querySelector('h3[data-count]');
        if (numEl) {
          const target = parseInt(numEl.getAttribute('data-count'), 10);
          const suffix = numEl.getAttribute('data-suffix') || '';
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const tick = () => {
            current += step;
            if (current >= target) { numEl.textContent = target + suffix; return; }
            numEl.textContent = current + suffix;
            requestAnimationFrame(tick);
          };
          tick();
        }
        statObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll('.stat-reveal').forEach((el) => statObserver.observe(el));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  

  // ---- Skill bar fill (old section, if still present) ----
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-bar-fill');
          const level = entry.target.getAttribute('data-level');
          requestAnimationFrame(() => { fill.style.width = `${level}%`; });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('.skill-bar-track[data-level]').forEach((el) => skillObserver.observe(el));

  // ---- Tech Matrix bar fill + mouse-follow spotlight ----
  const tmObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.tm-bar-fill');
          const level = entry.target.getAttribute('data-level');
          requestAnimationFrame(() => { fill.style.width = `${level}%`; });
          tmObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('.tm-bar-track[data-level]').forEach((el) => tmObserver.observe(el));

  document.querySelectorAll('.tech-matrix-card').forEach((card) => {
    let spotlightTicking = false;
    let lastMoveEvent = null;
    card.addEventListener('mousemove', (e) => {
      lastMoveEvent = e;
      if (!spotlightTicking) {
        spotlightTicking = true;
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((lastMoveEvent.clientX - rect.left) / rect.width) * 100 + '%');
          card.style.setProperty('--my', ((lastMoveEvent.clientY - rect.top) / rect.height) * 100 + '%');
          spotlightTicking = false;
        });
      }
    }, { passive: true });
  });

  // ---- Contact form ----
  // Sends real emails via Formspree (https://formspree.io) — free, no backend needed.
  // Setup: sign up at formspree.io, create a form, copy your endpoint URL, and paste it
  // into the `action="..."` attribute on the <form id="contactForm"> in index.html.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const successBox = document.getElementById('formSuccess');
      const errorBox = document.getElementById('formError');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;

      successBox.classList.remove('show');
      errorBox.classList.remove('show');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          successBox.classList.add('show');
          contactForm.reset();
        } else {
          errorBox.classList.add('show');
        }
      } catch (err) {
        errorBox.classList.add('show');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
        setTimeout(() => {
          successBox.classList.remove('show');
          errorBox.classList.remove('show');
        }, 5000);
      }
    });
  }
  // ---- AI Portfolio Chatbot: Nendra AI — lazy bootstrap ----
  // The full implementation (KB array, ~15 listeners, DOM building) now
  // lives in js/chatbot.js and is NOT loaded by a <script> tag in the HTML.
  // We only wire up the minimum here: the FAB is clickable immediately,
  // but the actual module is fetched either when the browser goes idle
  // (requestIdleCallback) or the moment the user interacts with the FAB —
  // whichever happens first. This keeps ~180 lines of chatbot setup off
  // the critical path of the initial page render.
  const aiToggle = document.getElementById('aiChatToggle');
  const aiWidget = document.getElementById('aiChatWidget');

  if (aiToggle) {
    let chatbotReady = false;
    let loadStarted = false;

    function ensureChatbotLoaded() {
      if (chatbotReady || loadStarted) return;
      loadStarted = true;
      const script = document.createElement('script');
      script.src = 'js/chatbot.js';
      script.onload = () => {
        chatbotReady = true;
        if (window.initNagendraChatbot) window.initNagendraChatbot();
      };
      document.body.appendChild(script);
    }

    // Handles clicks ONLY until the real chatbot module takes over. Once
    // chatbot.js has loaded and attached its own click listener, this
    // bootstrap listener removes itself instead of re-dispatching a click
    // (re-dispatching was causing an open-then-immediately-close bug when
    // the idle-preload had already finished loading chatbot.js).
    function bootstrapClick() {
      if (chatbotReady) {
        aiToggle.removeEventListener('click', bootstrapClick);
        return; // chatbot.js's own listener handles this click by itself
      }
      aiToggle.dataset.pendingOpen = '1';
      ensureChatbotLoaded();
    }
    aiToggle.addEventListener('click', bootstrapClick);

    if (aiWidget) {
      aiWidget.addEventListener('mouseenter', () => ensureChatbotLoaded(), { once: true });
    }

    // Primary path: load once the main thread is idle after first paint,
    // so it's ready before the user even reaches for it, without costing
    // anything during initial load/scroll/animation.
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => ensureChatbotLoaded(), { timeout: 4000 });
    } else {
      setTimeout(() => ensureChatbotLoaded(), 2500);
    }
  }

  // ---- Scroll progress bar + nav active-link (combined, rAF-batched) ----
  // Previously these were two separate `scroll` listeners, each running
  // synchronously on every native scroll event (which can fire many times
  // per rendered frame) and each reading layout (offsetTop/scrollHeight).
  // Merging them into one handler gated behind requestAnimationFrame means
  // the work runs at most once per frame, and passive:true means the
  // browser never waits on this JS before scrolling.
  const scrollProgressEl = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let scrollTicking = false;

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function updateOnScroll() {
    scrollTicking = false;

    if (scrollProgressEl) {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      scrollProgressEl.style.width = pct + '%';
    }

    if (scrollTopBtn) {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
      scrollTopBtn.classList.toggle('show', nearBottom);
    }

    let current = '';
    const scrollY = window.scrollY;
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateOnScroll);
    }
  }, { passive: true });

  updateOnScroll(); // set correct initial state without waiting for first scroll

 // ---- Theme toggle ----
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('light-preview');
      const icon = themeToggle.querySelector('svg');
      const isLight = document.body.classList.contains('light-preview');
      if (icon) icon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
      if (window.lucide) lucide.createIcons();
    });
  }

  // ---- Let's Talk button ----
  const talkBtn = document.querySelector('.talk-btn');
  if (talkBtn) {
    talkBtn.addEventListener('click', function () {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }
  // ---- Mini stat cards: number count-up + click-to-scroll with highlight ----
  const miniStatCards = document.querySelectorAll('.mini-stat-card');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.mini-stat-num');
        if (!numEl) { countObserver.unobserve(entry.target); return; }
        const target = parseInt(numEl.getAttribute('data-count'), 10);
        const suffix = numEl.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          current += step;
          if (current >= target) { numEl.textContent = target + suffix; return; }
          numEl.textContent = current + suffix;
          requestAnimationFrame(tick);
        };
        tick();
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  miniStatCards.forEach((card) => {
    countObserver.observe(card);
    card.addEventListener('click', () => {
      const target = document.querySelector(card.getAttribute('data-target'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('section-highlight');
      setTimeout(() => target.classList.remove('section-highlight'), 1000);
    });
  });
  
})();