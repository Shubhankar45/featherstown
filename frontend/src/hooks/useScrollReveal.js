import { useEffect } from "react";

/* ═══════════════════════════════════════════════════
   Real-time reveal engine for `.rv` elements.

   Instead of polling scroll position (which only catches
   elements present at the moment a listener fires), this
   sets up ONE global IntersectionObserver that:
     • reveals any `.rv` element the instant it scrolls
       into view, on any page
     • is paired with a MutationObserver that watches the
       whole document for newly-added `.rv` nodes — so it
       keeps working automatically for: route changes,
       async data (reviews loading from the API), filtered
       grids (search/category), and dynamically rendered
       compare results — all without needing a dependency
       array or per-page wiring.

   The setup runs exactly once per page load (singleton
   guard) no matter how many components call the hook.
═══════════════════════════════════════════════════ */

let _booted = false;

function bootGlobalReveal() {
  if (_booted) return;
  _booted = true;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("on");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -6% 0px" }
  );

  const observe = (el) => {
    if (el.classList.contains("on")) return;
    io.observe(el);
  };

  const scan = (root) => {
    if (root.matches?.(".rv")) observe(root);
    root.querySelectorAll?.(".rv").forEach(observe);
  };

  // catch everything already on the page
  scan(document.body);

  // catch everything added later, on any page, at any time
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) scan(node);
      });
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* Mount once (in PageChrome) to activate the engine app-wide.
   Safe to call from multiple components too — it's a no-op
   after the first call. */
export default function useScrollReveal() {
  useEffect(() => {
    bootGlobalReveal();
  }, []);
}
