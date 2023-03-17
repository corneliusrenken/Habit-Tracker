import React from 'react';

type Props = {
  className?: string;
  name: string;
  keybinds: string[][];
};

export default function Shortcut({ className, name, keybinds }: Props) {
  const classNamePrefix = className || 'shortcut';

  const keybindElements = keybinds.reduce<JSX.Element[]>((elements, keybind) => {
    const keybindElement = keybind.map((kb) => {
      let keybindClassName = `${classNamePrefix}-keybinds-keybind`;

      if (kb.length === 1) keybindClassName += ' single';

      return (
        <div
          key={`${JSON.stringify(keybind)}-${kb}`}
          className={keybindClassName}
        >
          {kb}
        </div>
      );
    });
    if (elements.length !== 0) {
      const divider = (
        <div
          key={`${JSON.stringify(keybind)}-divider`}
          className={`${classNamePrefix}-keybinds-divider`}
        >
          or
        </div>
      );
      keybindElement.unshift(divider);
    }
    return elements.concat(keybindElement);
  }, []);

  return (
    <div className={classNamePrefix}>
      <div className={`${classNamePrefix}-name`}>{name}</div>
      <div className={`${classNamePrefix}-keybinds`}>
        {keybindElements}
      </div>
    </div>
  );
}

Shortcut.defaultProps = {
  className: undefined,
};
