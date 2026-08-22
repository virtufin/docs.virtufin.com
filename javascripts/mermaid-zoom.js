// Click-to-zoom for Mermaid diagrams. Vanilla JS, no dependencies --
// operates on whatever SVG the Mermaid renderer produces.
document.addEventListener('click', function (event) {
  var overlay = document.querySelector('.mermaid-zoom-overlay');
  if (overlay) {
    // Any click while zoomed closes it (links inside the diagram still
    // navigate normally -- this only fires for clicks that don't).
    overlay.remove();
    document.body.classList.remove('mermaid-zoom-active');
    return;
  }

  var svg = event.target.closest('.mermaid svg');
  if (!svg) return;

  var clone = svg.cloneNode(true);
  var overlayEl = document.createElement('div');
  overlayEl.className = 'mermaid-zoom-overlay';
  overlayEl.appendChild(clone);
  document.body.appendChild(overlayEl);
  document.body.classList.add('mermaid-zoom-active');
});

document.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape') return;
  var overlay = document.querySelector('.mermaid-zoom-overlay');
  if (overlay) {
    overlay.remove();
    document.body.classList.remove('mermaid-zoom-active');
  }
});
