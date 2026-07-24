/**
 * Projects Showcase — self-contained module for the Projects section only.
 * Does not touch or depend on animations.js, hero.js, or theme logic.
 * Add real screenshots later by setting `image: "assets/images/projects/xxx.png"`
 * on any project below — the placeholder visual is used automatically
 * whenever `image` is null.
 */
(function () {
  const PROJECTS = [
    {
      number: '01',
      name: 'Smart City Assistant',
      category: 'AI • Full stack',
      description: 'AI-powered smart city platform with predictive analytics, voice assistance, and an interactive dashboard.',
      highlights: [
        'Natural language interactions powered by Gemini AI',
        'Real-time city insights with predictive ML analytics',
        'FastAPI backend with responsive Streamlit dashboard'
      ],
      tech: ['Python', 'FastAPI', 'OpenAI'],
      icon: 'bot',
      gradA: '#4f7cff',
      gradB: '#00e5ff',
      image: 'assets/images/projects/Smart City Assistant.png',
      demo: 'https://github.com/Nagendra14319/smart-city-assistant',
      github: 'https://github.com/Nagendra14319/smart-city-assistant',
      featured: true,
    },
    {
      number: '02',
      name: 'Smart Water Analytics',
       category: 'Data Analytics',
       description: 'AI-powered water quality monitoring system with analysis, visualization, and automated reporting.',
       highlights: [
       'Real-time analysis of drinking water quality parameters',
       'Interactive dashboard with charts and data insights',
      'Automated report generation for quality assessment',
       ],
      tech: ['Python', 'Pandas', 'Streamlit'],
      icon: 'layout-template',
      gradA: '#8b5cf6',
      gradB: '#4f7cff',
      image: 'assets/images/projects/Smart Water Analytics.png',
      demo: 'https://nagendra14319.github.io/DRinkinh-water-quality-analysis-and-reporting-system/',
      github: 'https://github.com/Nagendra14319/DRinkinh-water-quality-analysis-and-reporting-system',
      featured: false,
    },
   {
  number: '03',
  name: 'SpamShield AI',
  category: 'AI / Machine Learning',
  description: 'AI-powered email spam detection system that classifies messages as spam or legitimate using Natural Language Processing and Machine Learning.',
  highlights: [
     'NLP-based email text classification',
  'ML-powered spam detection engine',
  'Real-time prediction with Streamlit UI',
  ],
  tech: ['Python', 'Scikit-learn', 'NLP', 'Streamlit', 'Pandas'],
  icon: 'shield',
  gradA: '#00e5ff',
  gradB: '#22d3ee',
  image: '/assets/images/projects/SpamShield AI.png',
  demo: 'https://nagendra-varma-email.streamlit.app/',
  github: 'https://github.com/Nagendra14319/email-spam-classifier',
  featured: false,
},
   {
  number: '04',
  name: 'IntelliSQL',
  category: 'Artificial Intelligence',
  description: 'An AI-powered SQL Query Assistant that converts natural language into SQL queries',
  highlights: [
  'AI-powered text-to-SQL conversion',
  'Real-time SQLite query execution',
  'Interactive Streamlit dashboard',
  ],
  tech: ['Python', 'Streamlit', 'SQLite', 'Google Gemini AI'],
  icon: 'database',
  gradA: '#06b6d4',
  gradB: '#3b82f6',
  image: 'assets/images/projects/Intelli SQL.png',
  demo: 'https://nagendra-varma-intellisql.streamlit.app/',
  github: 'https://github.com/Nagendra14319/IntelliSQL',
  featured: true,
},
  
  ];

  const GITHUB_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.17 0 1.56-.02 2.82-.02 3.2 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z"/></svg>';

  function init() {
    const sidebar = document.getElementById('pwSidebar');
    const sidebarWrap = document.getElementById('pwSidebarWrap');
    const navUpBtn = document.getElementById('pwNavUp');
    const navDownBtn = document.getElementById('pwNavDown');
    const frameVisual = document.getElementById('pwFrameVisual');
    const details = document.getElementById('pwDetails');
    const counter = document.getElementById('pwCounter');
    if (!sidebar || !frameVisual || !details) return;

    let active = 0;
    let windowStart = 0;      // index of the first project currently shown in the 4-slot window
    let isShifting = false;   // true while a shift/typewriter animation is in progress
    let pendingDirection = null; // queues at most one extra nav action during an animation

    function visibleCount() { return Math.min(4, PROJECTS.length); }
    function maxWindowStart() { return Math.max(0, PROJECTS.length - visibleCount()); }
    function currentWindowIndexes() {
      const count = visibleCount();
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(windowStart + i);
      return arr;
    }

    function renderCounter() {
      if (!counter) return;
      const current = String(active + 1).padStart(2, '0');
      const total = String(PROJECTS.length).padStart(2, '0');
      counter.textContent = `${current} / ${total} PROJECTS`;
    }

    function attachItemEvents(container) {
      container.querySelectorAll('.pw-item').forEach((btn) => {
        btn.addEventListener('click', () => switchProject(parseInt(btn.dataset.index, 10)));
        btn.addEventListener('mouseenter', () => switchProject(parseInt(btn.dataset.index, 10)));
      });
    }

    function itemMarkup(i, isActive) {
      const p = PROJECTS[i];
      return `<button class="pw-item${isActive ? ' is-active' : ''}" data-index="${i}" role="tab" aria-selected="${isActive}">
        <span class="pw-item-num">${p.number}</span>
        <span class="pw-item-info">
          <span class="pw-item-name">${p.name}</span>
          <span class="pw-item-cat">${p.category}</span>
        </span>
        <span class="pw-item-dot"></span>
      </button>`;
    }

    function updateNavButtons() {
      if (!navUpBtn || !navDownBtn) return;
      const hide = PROJECTS.length <= visibleCount();
      navUpBtn.classList.toggle('pw-nav-hidden', hide);
      navDownBtn.classList.toggle('pw-nav-hidden', hide);
      navUpBtn.disabled = windowStart <= 0;
      navDownBtn.disabled = windowStart >= maxWindowStart();
    }

    // Instant render — used on initial load and whenever the active
    // highlight changes without the visible window itself shifting.
    function renderSidebar() {
      const indexes = currentWindowIndexes();
      sidebar.innerHTML = `<div class="pw-sidebar-track">${indexes.map((i) => itemMarkup(i, i === active)).join('')}</div>`;
      attachItemEvents(sidebar);
      updateNavButtons();
    }

    function fadeInText(el, text, delay) {
      return new Promise((resolve) => {
        el.textContent = text;
        el.classList.add('pw-fade-reveal');
        setTimeout(() => {
          el.classList.add('pw-fade-reveal-in');
          setTimeout(resolve, 320); // matches the CSS transition duration below
        }, delay);
      });
    }

    // Shifts the visible window by one project, fading/sliding the list,
    // then types the newly-revealed card's title and category into place.
    function shiftWindow(direction) {
      if (isShifting) { pendingDirection = direction; return; }
      const atTop = windowStart <= 0;
      const atBottom = windowStart >= maxWindowStart();
      if ((direction === 'up' && atTop) || (direction === 'down' && atBottom)) return;

      isShifting = true;
      const track = sidebar.querySelector('.pw-sidebar-track');
      if (track) track.classList.add(direction === 'down' ? 'pw-shift-down' : 'pw-shift-up');

      setTimeout(() => {
        windowStart += direction === 'down' ? 1 : -1;
        const indexes = currentWindowIndexes();
        const newEntryPos = direction === 'down' ? indexes.length - 1 : 0;

        const newTrack = document.createElement('div');
        newTrack.className = 'pw-sidebar-track';
        let enteringBtn = null;
        let enteringProject = null;

        indexes.forEach((i, pos) => {
          const p = PROJECTS[i];
          const isEntering = pos === newEntryPos;
          const btn = document.createElement('button');
          btn.className = 'pw-item' + (i === active ? ' is-active' : '');
          btn.dataset.index = String(i);
          btn.setAttribute('role', 'tab');
          btn.setAttribute('aria-selected', String(i === active));
          btn.innerHTML = `<span class="pw-item-num">${p.number}</span>
            <span class="pw-item-info">
              <span class="pw-item-name">${isEntering ? '' : p.name}</span>
              <span class="pw-item-cat">${isEntering ? '' : p.category}</span>
            </span>
            <span class="pw-item-dot" style="${isEntering ? 'opacity:0' : ''}"></span>`;
          newTrack.appendChild(btn);
          if (isEntering) { enteringBtn = btn; enteringProject = p; }
        });

        sidebar.innerHTML = '';
        sidebar.appendChild(newTrack);
        attachItemEvents(sidebar);
        updateNavButtons();

        if (enteringBtn && enteringProject) {
          const nameEl = enteringBtn.querySelector('.pw-item-name');
          const catEl = enteringBtn.querySelector('.pw-item-cat');
          const dotEl = enteringBtn.querySelector('.pw-item-dot');
          fadeInText(nameEl, enteringProject.name, 40)
            .then(() => fadeInText(catEl, enteringProject.category, 60))
            .then(() => {
              dotEl.style.transition = 'opacity .3s ease';
              dotEl.style.opacity = '';
              isShifting = false;
              if (pendingDirection) {
                const next = pendingDirection;
                pendingDirection = null;
                shiftWindow(next);
              }
            });
        } else {
          isShifting = false;
        }
      }, 300);
    }

    function navDown() { shiftWindow('down'); }
    function navUp() { shiftWindow('up'); }

    if (navDownBtn) navDownBtn.addEventListener('click', navDown);
    if (navUpBtn) navUpBtn.addEventListener('click', navUp);

    if (sidebarWrap) {
      let wheelLock = false;
      sidebarWrap.addEventListener('wheel', (e) => {
        if (PROJECTS.length <= visibleCount()) return;
        e.preventDefault();
        if (wheelLock) return;
        wheelLock = true;
        if (e.deltaY > 0) navDown(); else navUp();
        setTimeout(() => { wheelLock = false; }, 350);
      }, { passive: false });

      let touchStartY = null;
      sidebarWrap.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      sidebarWrap.addEventListener('touchend', (e) => {
        if (touchStartY === null) return;
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dy) > 30) { if (dy > 0) navDown(); else navUp(); }
        touchStartY = null;
      });

      sidebarWrap.setAttribute('tabindex', '0');
      sidebarWrap.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); navDown(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); navUp(); }
      });
    }

    function renderFrame(p) {
      if (p.image) {
        frameVisual.innerHTML = `<img src="${p.image}" alt="${p.name} screenshot" style="width:100%;height:100%;object-fit:cover;">`;
      } else {
        frameVisual.innerHTML = `
          <div class="pw-frame-visual-inner" style="--pw-grad-a:${p.gradA};--pw-grad-b:${p.gradB};"></div>
          <div class="pw-frame-icon-wrap"><svg data-lucide="${p.icon}"></svg></div>
        `;
      }
      if (window.lucide) lucide.createIcons();
    }

    function renderDetails(p) {
      details.innerHTML = `
        ${p.featured ? '<span class="pw-badge">Featured Project</span>' : ''}
        <h3 class="pw-proj-title">${p.name}</h3>
        <p class="pw-proj-desc">${p.description}</p>
        <ul class="pw-highlights">${p.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
        <div class="pw-tech-row">
          ${p.tech.map((t, i) => `<span class="pw-chip" style="--i:${i}">${t}</span>`).join('')}
        </div>
        <div class="pw-actions">
          <a href="${p.demo}" target="_blank" rel="noopener" class="pw-btn pw-btn-primary">Live Demo <svg data-lucide="arrow-up-right"></svg></a>
          <a href="${p.github}" target="_blank" rel="noopener" class="pw-btn pw-btn-secondary">${GITHUB_SVG} GitHub</a>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    }

    function switchProject(index) {
      if (index === active || index < 0 || index >= PROJECTS.length) return;
      active = index;

      sidebar.querySelectorAll('.pw-item').forEach((btn) => {
        const isActive = parseInt(btn.dataset.index, 10) === active;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive);
      });
      renderCounter();

      frameVisual.classList.add('pw-fade');
      details.classList.add('pw-fade');

      setTimeout(() => {
        renderFrame(PROJECTS[active]);
        renderDetails(PROJECTS[active]);
        frameVisual.classList.remove('pw-fade');
        details.classList.remove('pw-fade');
      }, 220);
    }

    renderSidebar();
    renderCounter();
    updateNavButtons();
    renderFrame(PROJECTS[active]);
    renderDetails(PROJECTS[active]);
    if (window.lucide) lucide.createIcons();
  }
   // Lock the showcase row height to the sidebar's real rendered height.
  function pwLockHeightToSidebar() {
    const showcase = document.getElementById('pwShowcase');
    const sidebarWrap = document.querySelector('.pw-sidebar-wrap');
    if (!showcase || !sidebarWrap) return;
    showcase.style.height = 'auto';
    const naturalHeight = sidebarWrap.scrollHeight;
    showcase.style.height = naturalHeight + 'px';
  }
  window.addEventListener('load', () => {
    pwLockHeightToSidebar();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(pwLockHeightToSidebar);
    }
  });
  let pwResizeTimer = null;
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1080) return;
    clearTimeout(pwResizeTimer);
    pwResizeTimer = setTimeout(pwLockHeightToSidebar, 150);
  }, { passive: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();