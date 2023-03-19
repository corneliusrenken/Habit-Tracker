import React from 'react';
import Keybind from './Keybind';

type Props = {
  className?: string;
  name: string;
  shortcuts: {
    keydownCode: string;
    altKey?: boolean;
  }[];
};

export default function Shortcut({ className, name, shortcuts }: Props) {
  const classNamePrefix = className || 'shortcut';

  const keybindElements = shortcuts.reduce<JSX.Element[]>((elements, shortcut) => {
    const shortcutElements: JSX.Element[] = [];

    if (shortcut.altKey) {
      shortcutElements.push(
        <Keybind
          key={`${JSON.stringify(shortcut)}-alt`}
          className={`${classNamePrefix}-keybinds-keybind`}
          keydownKey="Alt"
        />,
      );
    }

    shortcutElements.push(
      <Keybind
        key={shortcut.keydownCode}
        className={`${classNamePrefix}-keybinds-keybind`}
        keydownCode={shortcut.keydownCode}
      />,
    );

    if (elements.length !== 0) {
      // divider
      shortcutElements.unshift(
        <div
          key={`${JSON.stringify(shortcut)}-divider`}
          className={`${classNamePrefix}-keybinds-divider`}
        >
          or
        </div>,
      );
    }

    return elements.concat(shortcutElements);
  }, []);

  return (
    <div className={classNamePrefix}>
      <div className={`${classNamePrefix}-name`}>{name}</div>
      <div className={`${classNamePrefix}-line`} />
      <div className={`${classNamePrefix}-keybinds`}>
        {keybindElements}
      </div>
    </div>
  );
}

Shortcut.defaultProps = {
  className: undefined,
};
