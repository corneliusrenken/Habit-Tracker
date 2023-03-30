export default function scrollSelectedIndexIntoView(selectedIndex: number) {
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

  const selectedListItemPosition = verticalMargin + 100 + selectedIndex * 50 - window.scrollY;
  const selectedItemBounds = {
    top: selectedListItemPosition,
    bottom: selectedListItemPosition + 50,
  };
  const listBounds = {
    top: verticalMargin + 100,
    bottom: window.innerHeight - verticalMargin,
  };
  let scrollAmount = 0;
  if (selectedItemBounds.top < listBounds.top) {
    scrollAmount = selectedItemBounds.top - listBounds.top;
  }
  if (selectedItemBounds.bottom > listBounds.bottom) {
    scrollAmount = selectedItemBounds.bottom - listBounds.bottom;
  }
  window.scrollBy({
    top: scrollAmount,
    behavior: 'smooth',
  });
}
