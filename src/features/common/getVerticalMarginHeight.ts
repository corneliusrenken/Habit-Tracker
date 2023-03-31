export default function getVerticalMarginHeight() {
  let verticalMargin: number;
  const propertyValue = window.getComputedStyle(document.documentElement).getPropertyValue('--layout-vertical-margin');
  if (propertyValue.slice(-2) === 'px') {
    verticalMargin = Number(
      propertyValue.slice(0, -2),
    );
  } else if (propertyValue.slice(-2) === 'vh') {
    verticalMargin = (Number(
      propertyValue.slice(0, -2),
    ) * window.innerHeight) / 100;
  } else {
    throw new Error(`${propertyValue} is invalid. Vertical margin must be in px or vh`);
  }
  return verticalMargin;
}
