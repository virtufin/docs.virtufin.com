// Click-to-zoom for Mermaid diagrams. Vanilla JS, no dependencies --
// operates on whatever SVG the Mermaid renderer produces.
//
// Material's own Mermaid renderer (bundle.min.js's Zn()) puts each
// diagram's <svg> inside a *closed* shadow root on a `div.mermaid` host
// (attachShadow({mode: "closed"})). Click events originating inside a
// closed shadow tree are retargeted for listeners outside it: this
// document-level listener only ever sees event.target as the shadow
// HOST (the div), never the <svg> -- so `event.target.closest('.mermaid
// svg')` can never match. `.shadowRoot` is also null from out here
// (that's what "closed" means). The one thing that still exposes nodes
// inside a closed shadow tree is event.composedPath(): closed mode only
// gates the .shadowRoot property getter, not the event dispatch path.
function svgFromComposedPath(event) {
  var path = event.composedPath ? event.composedPath() : [];
  var svg = null;
  var inMermaid = false;
  for (var i = 0; i < path.length; i++) {
    var node = path[i];
    if (!svg && node.tagName === 'svg') svg = node;
    if (node.classList && node.classList.contains('mermaid')) inMermaid = true;
  }
  return inMermaid ? svg : null;
}

document.addEventListener('click', function (event) {
  var overlay = document.querySelector('.mermaid-zoom-overlay');
  if (overlay) {
    // Any click while zoomed closes it (links inside the diagram still
    // navigate normally -- this only fires for clicks that don't).
    overlay.remove();
    document.body.classList.remove('mermaid-zoom-active');
    return;
  }

  var svg = svgFromComposedPath(event);
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
