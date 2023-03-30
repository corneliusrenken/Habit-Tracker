type BezierCurve = { x1: number, y1: number, x2: number, y2: number };

let activeScrollInfo: null | {
  start: number,
  target: number,
  direction: 1 | -1,
  startTime: number,
  lastY: number,
} = null;

export default function customSmoothScroll(
  y: number,
  duration: number,
  refreshRate: number,
  curve: BezierCurve,
) {
  if (activeScrollInfo?.target === y) return;

  const isActive = activeScrollInfo !== null;

  const currentY = window.scrollY;
  const direction = y - currentY > 0 ? 1 : -1;

  activeScrollInfo = {
    start: currentY,
    target: y,
    direction,
    startTime: performance.now(),
    lastY: currentY,
  };

  if (isActive) return;

  function ease(t: number): number {
    const { y1, y2 } = curve;
    return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3;
  }

  function animate() {
    if (activeScrollInfo === null) return;

    const {
      start, target, startTime, lastY,
    } = activeScrollInfo;

    if (window.scrollY !== lastY) return; // cancel scroll if user has scrolled during animation

    const currentTime = performance.now();
    const elapsed = currentTime - startTime;

    const t = Math.min(1, elapsed / duration);

    const changeY = target - start;
    const newY = Math.round(start + changeY * ease(t));
    window.scrollTo({ top: newY });
    activeScrollInfo.lastY = newY;
    if (t < 1) {
      setTimeout(animate, refreshRate);
    } else {
      activeScrollInfo = null;
    }
  }

  animate();
}
