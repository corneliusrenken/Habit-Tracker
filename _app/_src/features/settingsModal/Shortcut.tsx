import React from 'react';
import Keybind from './Keybind';

type Props = {
  name: string;
  shortcuts: {
    keydownCode: string;
    altKey?: boolean;
  }[];
};

export default function Shortcut({ name, shortcuts }: Props) {
  const keybindElements = shortcuts.reduce<JSX.Element[]>((elements, shortcut) => {
    const shortcutElements: JSX.Element[] = [];

    if (shortcut.altKey) {
      shortcutElements.push(
        <Keybind
          key={`${JSON.stringify(shortcut)}-alt`}
          className="keybind"
          keydownKey="Alt"
        />,
      );
    }

    shortcutElements.push(
      <Keybind
        key={shortcut.keydownCode}
        className="keybind"
        keydownCode={shortcut.keydownCode}
      />,
    );

    if (elements.length !== 0) {
      // divider
      shortcutElements.unshift(
        <div
          key={`${JSON.stringify(shortcut)}-divider`}
          className="divider"
        >
          or
        </div>,
      );
    }

    return elements.concat(shortcutElements);
  }, []);

  return (
    <div className="shortcut">
      <div className="name">{name}</div>
      <div className="line" />
      <div className="keybinds">
        {keybindElements}
      </div>
    </div>
  );
}
