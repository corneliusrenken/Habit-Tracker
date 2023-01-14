export default function noModifierKeysPressed(e: KeyboardEvent) {
  return (
    e.getModifierState('Alt') === false
    && e.getModifierState('AltGraph') === false
    && e.getModifierState('Control') === false
    && e.getModifierState('Meta') === false
    && e.getModifierState('OS') === false
    && e.getModifierState('Shift') === false
  );
}
