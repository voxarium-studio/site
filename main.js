(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* Hero parallax: cubes drift against the pointer by depth.
     JS only sets the target, the CSS transition smooths and retargets it. */

  const hero = document.querySelector(".hero");
  const layers = hero ? hero.querySelectorAll("[data-depth]") : [];

  if (!hero || !layers.length) return;

  const enabled = () => finePointer.matches && !reduceMotion.matches;

  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const update = () => {
    frame = 0;
    const rect = hero.getBoundingClientRect();
    const x = (pointerX - rect.left) / rect.width - 0.5;
    const y = (pointerY - rect.top) / rect.height - 0.5;
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth);
      layer.style.transform = `translate(${(-x * depth).toFixed(1)}px, ${(-y * depth).toFixed(1)}px)`;
    });
  };

  hero.addEventListener("pointermove", (event) => {
    if (!enabled()) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(update);
  });

  const reset = () => {
    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    layers.forEach((layer) => {
      layer.style.transform = "";
    });
  };

  hero.addEventListener("pointerleave", reset);
  reduceMotion.addEventListener("change", reset);
  finePointer.addEventListener("change", reset);
})();
