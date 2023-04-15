export default function getReorderTranslateTime() {
  let reorderTranslateTime: number;
  const propertyValue = window.getComputedStyle(document.documentElement).getPropertyValue('--reorder-translate-time');
  if (propertyValue.slice(-2) === 'ms') {
    reorderTranslateTime = Number(
      propertyValue.slice(0, -2),
    );
  } else {
    throw new Error(`${propertyValue} is invalid. Reorder translate time must be in ms`);
  }

  return reorderTranslateTime;
}
