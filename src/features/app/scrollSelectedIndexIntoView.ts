export default function scrollSelectedIndexIntoView(selectedIndex: number) {
  const marginHeight = Number(
    document.documentElement.style.getPropertyValue('--margin-height').slice(0, -2),
  );
  const selectedListItemPosition = marginHeight + 100 + selectedIndex * 50 - window.scrollY;
  const selectedItemBounds = {
    top: selectedListItemPosition,
    bottom: selectedListItemPosition + 50,
  };
  const listBounds = {
    top: marginHeight + 100,
    bottom: window.innerHeight - marginHeight,
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
