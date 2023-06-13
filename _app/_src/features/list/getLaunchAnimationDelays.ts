// linear

import getLaunchAnimationTime from '../common/getLaunchAnimationTime';
import getVerticalMarginHeight from '../common/getVerticalMarginHeight';

export default function getLaunchAnimationDelays(habitCount: number) {
  const visibleListHeight = window.innerHeight - 2 * getVerticalMarginHeight() - 100;
  const habitsInView = Math.min(habitCount, Math.ceil(visibleListHeight / 50));

  const launchAnimationTime = getLaunchAnimationTime();

  const minDelay = 400;
  const maxDelay = 0.6 * launchAnimationTime;

  const delayPerStep = (maxDelay - minDelay) / Math.max(1, (habitsInView - 1));

  return new Array(habitCount).fill(0).map((v, index) => (
    minDelay + Math.round(delayPerStep * index)
  ));
}

// old bezier version

// type BezierCurve = { x1: number, y1: number, x2: number, y2: number };

// function interpolateValue(
//   step: number,
//   maxSteps: number,
//   minValue: number,
//   maxValue: number,
//   curve: BezierCurve,
// ): number {
//   function ease(t: number): number {
//     const { x1, x2 } = curve;
//     return 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3;
//   }

//   const t = Math.max(0, Math.min(1, step / maxSteps));

//   return ease(t) * (maxValue - minValue) + minValue;
// }

// function getLaunchAnimationDelays(habitCount: number): number[] {
//   const curve: BezierCurve = {
//     x1: 0.45, y1: 0.3, x2: 0.68, y2: 0.95,
//   };

//   const visibleListHeight = window.innerHeight - 2 * getVerticalMarginHeight() - 100;
//   const habitsInView = Math.min(habitCount, Math.ceil(visibleListHeight / 50));

//   const launchAnimationTime = getLaunchAnimationTime();

//   const minDelay = 400;
//   const maxDelay = 0.6 * launchAnimationTime;

//   return new Array(habitCount).fill(0).map((v, index) => (
//     // -1 as the last habit in view should have max delay
//     Math.round(interpolateValue(index, habitsInView - 1, minDelay, maxDelay, curve))
//   ));
// }
