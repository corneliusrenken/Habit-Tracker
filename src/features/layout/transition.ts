/* eslint-disable no-param-reassign */
import { ViewType } from '../../globalTypes';
import triggerElementReflow from './triggerElementReflow';

type TransitionOptions = {
  from: ViewType;
  to: ViewType;
  duration: number;
  currentScrollPosition: number;
  transitionElements: { [key in 'stickyGroup' | 'list' | 'bottomMask']: HTMLDivElement },
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>,
};

/**
 * @param options: duration in ms
 */
export default function transition(options: TransitionOptions) {
  const {
    from,
    to,
    duration,
    currentScrollPosition,
    transitionElements,
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

  Object.values(transitionElements).forEach((element) => {
    element.classList.remove(`${from}-view`);
    element.classList.add(`${to}-view`);
  });

  if (to === 'occurrence') {
    document.documentElement.style.setProperty('--list-offset', `${-currentScrollPosition}px`);
  }
  document.documentElement.style.setProperty(
    '--transition-offset',
    to === 'list'
      ? `calc(50vh - var(--latched-list-view-margin-height) - 50px - 25px + ${currentScrollPosition}px)`
      : 'calc(-1 * (50vh - var(--latched-list-view-margin-height) - 50px - 25px))',
  );

  triggerElementReflow();

  document.documentElement.style.setProperty('--transition-offset', '');

  Object.values(transitionElements).forEach((element) => {
    element.style.transition = `top ${duration}ms, height ${duration}ms`;
  });

  setTimeout(() => {
    setInTransition(false);
    Object.values(transitionElements).forEach((element) => {
      element.style.transition = '';
    });
  }, duration);
}
