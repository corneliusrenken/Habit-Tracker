export default function getScrollDistance() {
  return {
    fromTop: document.documentElement.scrollTop,
    fromBottom: (
      document.documentElement.scrollHeight
      - document.documentElement.clientHeight
      - document.documentElement.scrollTop
    ),
  };
}
