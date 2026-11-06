(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [...document.querySelectorAll(".reveal")];

  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-enabled");
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const progress = document.querySelector(".reading-progress span");
  if (progress) {
    let scheduled = false;
    const updateProgress = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        const amount = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 1;
        progress.style.transform = `scaleX(${amount})`;
        scheduled = false;
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    const link = target instanceof Element ? target.closest("a[href]") : null;
    if (!link || link.target || link.hasAttribute("download")) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname || destination.hash) return;
    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => { window.location.href = destination.href; }, 140);
  });
})();
