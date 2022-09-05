export default function getTextWidthInPx(text: string | number): number {
  const el = document.createElement('div');
  document.body.appendChild(el);

  el.style.fontFamily = 'DM Sans, sans-serif';
  el.style.fontSize = `${16}px`;
  el.style.height = 'auto';
  el.style.width = 'auto';
  el.style.position = 'absolute';
  el.style.whiteSpace = 'no-wrap';
  el.innerHTML = text.toString();
  const width = el.clientWidth;
  document.body.removeChild(el);
  return width;
}
