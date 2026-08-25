// Click-to-zoom for Mermaid diagrams. Vanilla JS, no dependencies.
//
// Material's own Mermaid renderer (bundle.min.js's Zn()) puts each
// diagram's <svg> inside a *closed* shadow root on a `div.mermaid` host
// (attachShadow({mode: "closed"})). Two consequences:
//
// 1. Click events from inside a closed shadow tree are retargeted for
//    outside listeners: event.target here is always the shadow HOST
//    (the div), never the inner <svg>. That part is standard,
//    reliable shadow-DOM event retargeting, true for open and closed
//    roots alike.
// 2. "closed" mode blocks *all* external access to the shadow content,
//    not just `.shadowRoot` -- composedPath() also stops at the shadow
//    boundary for closed roots (an earlier version of this file
//    assumed composedPath() leaked through; that's only true for
//    `mode: "open"`). There is no supported way to read or clone the
//    actual <svg> markup from out here.
//
// So this doesn't try to read the SVG at all. It zooms the host div
// itself in place: fixed-position, center it, and transform: scale()
// it over a backdrop. transform is a paint/compositing-level
// operation -- it scales whatever is already rendered inside the
// element, shadow content included, regardless of DOM/shadow-tree
// access. The div returns to its normal in-flow position automatically
// once `position: fixed` is removed, so no placeholder/reparenting
// bookkeeping is needed.

function closeMermaidZoom() {
  var zoomed = document.querySelector('.mermaid.mermaid-zoomed');
  if (!zoomed) return false;
  zoomed.classList.remove('mermaid-zoomed');
  zoomed.style.removeProperty('--mermaid-zoom-scale');
  zoomed.style.removeProperty('width');
  zoomed.style.removeProperty('height');
  var backdrop = document.querySelector('.mermaid-zoom-backdrop');
  if (backdrop) backdrop.remove();
  document.body.classList.remove('mermaid-zoom-active');
  return true;
}

document.addEventListener('click', function (event) {
  // Any click while zoomed closes it -- on the backdrop, or on the
  // zoomed diagram itself.
  if (closeMermaidZoom()) return;

  var host = event.target.closest('.mermaid');
  if (!host) return;

  var rect = host.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  var scale = Math.min(
    (window.innerWidth * 0.9) / rect.width,
    (window.innerHeight * 0.9) / rect.height,
    3
  );
  if (scale <= 1.05) return; // already fills most of the viewport -- not worth it

  var backdrop = document.createElement('div');
  backdrop.className = 'mermaid-zoom-backdrop';
  document.body.appendChild(backdrop);

  // Freeze the box at its current in-flow size before taking it out of
  // flow (position: fixed) -- otherwise it could reflow against the
  // (mostly unconstrained) fixed-position containing block first.
  host.style.width = rect.width + 'px';
  host.style.height = rect.height + 'px';
  host.style.setProperty('--mermaid-zoom-scale', String(scale));
  host.classList.add('mermaid-zoomed');
  document.body.classList.add('mermaid-zoom-active');
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') closeMermaidZoom();
});
