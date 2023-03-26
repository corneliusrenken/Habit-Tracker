export default function getScreenPercentage() {
  if (document.body.scrollHeight === 0) return 100;
  return (window.innerHeight / document.body.scrollHeight) * 100;
}
