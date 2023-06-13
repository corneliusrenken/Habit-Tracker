export default function checkModifierKeyWhitelist(
  e: KeyboardEvent,
  whitelist?: {
    alt?: boolean;
    altGraph?: boolean;
    control?: boolean;
    meta?: boolean;
    os?: boolean;
    shift?: boolean;
  },
) {
  const modifierStates = {
    alt: e.getModifierState('Alt'),
    altGraph: e.getModifierState('AltGraph'),
    control: e.getModifierState('Control'),
    meta: e.getModifierState('Meta'),
    os: e.getModifierState('OS'),
    shift: e.getModifierState('Shift'),
  };

  const modifierKeys = Object.keys(modifierStates) as Array<keyof typeof modifierStates>;

  for (let i = 0; i < modifierKeys.length; i += 1) {
    const modifierKey = modifierKeys[i];
    const modifierState = modifierStates[modifierKey];
    const isWhitelisted = Boolean(whitelist?.[modifierKey]);
    if (modifierState !== isWhitelisted) return false;
  }

  return true;
}
