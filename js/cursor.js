/**
 * Custom glowing cursor (dot + trailing ring).
 * Uses translate3d instead of left/top so it stays smooth
 * even on long, animation-heavy pages.
 */
(function () {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener(
    'mousemove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`;
    },
    { passive: true }
  );

  function ringLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
    requestAnimationFrame(ringLoop);
  }
  ringLoop();

  document.querySelectorAll('a,button').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
})();
