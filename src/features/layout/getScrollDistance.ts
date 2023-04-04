export default function getScrollDistance() {
  return {
    fromTop: window.scrollY,
    fromBottom: document.body.scrollHeight - window.scrollY - window.innerHeight,
  };
}
