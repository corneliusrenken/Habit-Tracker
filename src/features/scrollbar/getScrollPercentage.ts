export default function getScrollPercentage() {
  if (document.documentElement.scrollHeight === window.innerHeight) {
    return {
      fromTop: 0,
      fromBottom: 0,
    };
  }

  const fromTop = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

  return {
    fromTop: Math.round(fromTop * 100),
    fromBottom: Math.round((1 - fromTop) * 100),
  };
}
