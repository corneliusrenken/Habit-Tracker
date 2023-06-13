type BezierCurve = { x1: number, y1: number, x2: number, y2: number };

let activeScrollInfo: null | { lastY: number, cookie: number };

export default function customSmoothScroll(
  y: number,
  duration: number,
  refreshRate: number,
  curve: BezierCurve,
) {
  const startTime = performance.now();
  const startY = window.scrollY;

  activeScrollInfo = { lastY: startY, cookie: Math.random() };

  function ease(t: number): number {
    const { y1, y2 } = curve;
    return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3;
  }

  function animate(cookie: number) {
    if (!activeScrollInfo) return;
    if (activeScrollInfo?.cookie !== cookie) return;

    const { lastY } = activeScrollInfo;

    // cancel scroll if user has scrolled during animation
    if (window.scrollY !== lastY) {
      activeScrollInfo = null;
      return;
    }

    const currentTime = performance.now();
    const elapsed = currentTime - startTime;

    const t = Math.min(1, elapsed / duration);

    const changeY = y - startY;
    const newY = Math.round(startY + changeY * ease(t));
    window.scrollTo({ top: newY });
    activeScrollInfo.lastY = newY;
    if (t < 1) {
      setTimeout(() => animate(cookie), refreshRate);
    } else {
      activeScrollInfo = null;
    }
  }

  animate(activeScrollInfo.cookie);
}
