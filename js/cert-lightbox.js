// Certificate click-to-enlarge lightbox + View All grid toggle
// Cards never get removed for any reason (viewed or broken image).
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var lightbox = document.getElementById('certLightbox');
    var backdrop = document.getElementById('certLightboxBackdrop');
    var closeBtn = document.getElementById('certLightboxClose');
    var imgEl = document.getElementById('certLightboxImg');
    var captionEl = document.getElementById('certLightboxCaption');
    var stage = document.getElementById('certStage');
    var viewAllBtn = document.getElementById('certViewAllBtn');
    var coverflow = document.getElementById('certCoverflow');
    var gridAll = document.getElementById('certsGridAll');
    var certificatesCol = document.getElementById('certificates');
    var acGrid = certificatesCol ? certificatesCol.closest('.ac-grid') : null;
    var achievementsCol = acGrid ? acGrid.querySelector(':scope > div:first-child') : null;

    if (!lightbox) return;

    function openLightbox(src, caption) {
      imgEl.src = src;
      imgEl.alt = caption ? caption + ' certificate enlarged view' : 'Certificate enlarged view';
      captionEl.textContent = caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (!lightbox.classList.contains('open')) {
          imgEl.src = '';
        }
      }, 400);
    }

    // ---- Coverflow (top carousel): click-to-enlarge ----
    if (stage) {
      stage.addEventListener('click', function (e) {
        var img = e.target.closest('.cert-preview img');
        if (!img) return;
        var card = e.target.closest('.cert-coverflow-card');
        var isCenter = card && card.classList.contains('is-center');
        if (!isCenter) return;

        var titleEl = card.querySelector('.cert-info h4');
        var subEl = card.querySelector('.cert-info p');
        var caption = titleEl ? titleEl.textContent : '';
        if (subEl) caption += '  •  ' + subEl.textContent;

        openLightbox(img.src, caption);
      });
    }

    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });

    // ---- View All Certifications: dedicated full-width screen ----
    if (viewAllBtn && coverflow && gridAll) {
      var showingGrid = false;

      viewAllBtn.addEventListener('click', function () {
        showingGrid = !showingGrid;
        if (showingGrid) {
          coverflow.style.display = 'none';
          gridAll.style.display = 'grid';
          gridAll.classList.add('show');

          if (achievementsCol) achievementsCol.style.display = 'none';
          if (acGrid) {
            acGrid.style.gridTemplateColumns = '1fr';
            acGrid.style.maxWidth = '1300px';
          }
          if (certificatesCol) certificatesCol.style.gridColumn = '1 / -1';

          var cards = gridAll.querySelectorAll('.cert-card2');
          cards.forEach(function (card, i) {
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = '';
            card.style.animationDelay = (i * 0.05) + 's';
          });
          viewAllBtn.innerHTML = 'Back to Achievements <svg data-lucide="layout-grid"></svg>';
        } else {
          gridAll.classList.remove('show');
          gridAll.style.display = 'none';
          coverflow.style.display = '';

          if (achievementsCol) achievementsCol.style.display = '';
          if (acGrid) {
            acGrid.style.gridTemplateColumns = '';
            acGrid.style.maxWidth = '';
          }
          if (certificatesCol) certificatesCol.style.gridColumn = '';

          viewAllBtn.innerHTML = 'View All Certifications <svg data-lucide="grid-3x3"></svg>';
        }
        if (window.lucide) lucide.createIcons();
      });

      // ---- Grid card click: grow, then open lightbox. Card always stays. ----
      gridAll.addEventListener('click', function (e) {
        var card = e.target.closest('.cert-card2');
        if (!card) return;

        card.classList.remove('growing');
        void card.offsetWidth;
        card.classList.add('growing');

        var img = card.querySelector('.cert-preview img');
        var title = card.getAttribute('data-title') || '';
        var sub = card.getAttribute('data-sub') || '';
        var caption = sub ? title + '  •  ' + sub : title;

        setTimeout(function () {
          if (img) openLightbox(img.src, caption);
        }, 220);
      });
    }
  });
})();