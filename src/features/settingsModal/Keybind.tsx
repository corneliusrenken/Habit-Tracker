import React, { useEffect, useState } from 'react';

type Props = {
  className: string;
  keydownCode: string;
  keydownKey?: undefined;
} | {
  className: string;
  keydownCode?: undefined;
  keydownKey: string;
};

// if you want the shortcut to display a different key than the one that triggers it, add it here
const keybindTransformers: { [keydownCodeOrKey: string]: string } = {
  Escape: 'esc',
  ArrowUp: '↑',
  ArrowDown: '↓',
  // Comma: ',', not legible
};

export default function Keybind({
  className,
  keydownCode,
  keydownKey,
}: Props) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = ({ key, code, repeat }: KeyboardEvent) => {
      if (!repeat && (code === keydownCode || key === keydownKey)) {
        setPressed(true);
      }
    };
    const handleKeyUp = ({ key, code }: KeyboardEvent) => {
      if (code === keydownCode || key === keydownKey) {
        setPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keydownCode, keydownKey]);

  let keybindClassName = className;

  if (pressed) keybindClassName += ' pressed';

  let displayedKeybind: string;

  if (keydownCode !== undefined) {
    displayedKeybind = Object.hasOwnProperty.call(keybindTransformers, keydownCode)
      ? keybindTransformers[keydownCode]
      : keydownCode;

    // if the key is a letter, remove the 'Key' prefix from the key code (e.g. 'KeyA' -> 'A')
    if (displayedKeybind.startsWith('Key')) {
      displayedKeybind = displayedKeybind.slice(3);
    }
  } else {
    displayedKeybind = Object.hasOwnProperty.call(keybindTransformers, keydownKey)
      ? keybindTransformers[keydownKey]
      : keydownKey;
  }

  return (
    <div
      className={`${keybindClassName}${displayedKeybind.length === 1 ? ' single' : ''}`}
    >
      {displayedKeybind}
    </div>
  );
}
