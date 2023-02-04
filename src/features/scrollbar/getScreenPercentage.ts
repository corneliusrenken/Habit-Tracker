export default function getScreenPercentage() {
  return (window.innerHeight / document.body.scrollHeight) * 100;
}
