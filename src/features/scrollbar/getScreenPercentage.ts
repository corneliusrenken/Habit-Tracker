export default function getScreenPercentage() {
  console.log(document.body.scrollHeight);
  if (document.body.scrollHeight === 0) return 100;
  return (window.innerHeight / document.body.scrollHeight) * 100;
}
