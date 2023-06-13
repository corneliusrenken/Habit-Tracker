/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */

// trigger reflow - https://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily

export default function triggerElementReflow(element = document.documentElement) {
  element.offsetHeight;
}
