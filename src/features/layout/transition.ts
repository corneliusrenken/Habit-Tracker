/* eslint-disable no-param-reassign */
import { ViewType } from '../../globalTypes';
import triggerElementReflow from './triggerElementReflow';

type TransitionOptions = {
  from: ViewType;
  to: ViewType;
  currentScrollPosition: number;
  layout: HTMLDivElement;
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>,
};

/**
 * @param options: duration in ms
 */
export default function transition(options: TransitionOptions) {
  const {
    from,
    to,
    currentScrollPosition,
    layout,
    setInTransition,
  } = options;

  setInTransition(true);

  if (to === 'occurrence') {
    window.scrollTo({
      top: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    });
  } else {
    window.scrollTo({ top: 0 });
  }

  layout.classList.remove(`${from}-view`);
  layout.classList.add(`${to}-view`);

  if (to === 'occurrence') {
    document.documentElement.style.setProperty('--list-offset', `${-currentScrollPosition}px`);
  }
  document.documentElement.style.setProperty(
    '--transition-offset',
    to === 'list'
      ? `calc(50vh - var(--latched-list-view-margin-height, 0px) - 50px - 25px + ${currentScrollPosition}px)`
      : 'calc(-1 * (50vh - var(--latched-list-view-margin-height, 0px) - 50px - 25px))',
  );

  triggerElementReflow();

  document.documentElement.style.setProperty('--transition-offset', '');

  layout.classList.add('in-transition');

  setTimeout(() => {
    layout.classList.remove('in-transition');
    setInTransition(false);
  }, Number(getComputedStyle(document.documentElement).getPropertyValue('--transition-duration').slice(0, -2)));
}
