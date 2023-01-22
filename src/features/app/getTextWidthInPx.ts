export default function getTextWidthInPx(text: string | number, fontSize: number): number {
  const el = document.createElement('div');
  document.body.appendChild(el);

  el.style.fontSize = `${fontSize}px`;
  el.style.height = 'auto';
  el.style.width = 'auto';
  el.style.position = 'absolute';
  el.style.whiteSpace = 'no-wrap';
  el.innerHTML = text.toString();
  const width = el.clientWidth;
  document.body.removeChild(el);
  return width;
}
