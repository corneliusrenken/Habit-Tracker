import React from 'react';
import {
  hiddenPath, moreOptionsPath, movePath, renamePath, visiblePath, trashPath,
} from './iconPaths';

// https://icons.radix-ui.com/

const iconPaths = {
  move: movePath,
  'more options': moreOptionsPath,
  visible: visiblePath,
  hidden: hiddenPath,
  rename: renamePath,
  trash: trashPath,
};

type Props = {
  icon: keyof typeof iconPaths;
  allowTabTraversal: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  classes?: string[];
  hidden?: boolean;
};

export default function Icon({
  icon, allowTabTraversal, onClick, onMouseDown, classes, hidden,
}: Props) {
  let className = 'icon';

  if (classes && classes.length > 0) className += ` ${classes.join(' ')}`;

  if (hidden) className += ' hidden';

  return (
    <button
      tabIndex={allowTabTraversal ? undefined : -1}
      type="button"
      className={className}
      onClick={onClick ? (e) => onClick(e) : undefined}
      onMouseDown={onMouseDown ? (e) => onMouseDown(e) : undefined}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={iconPaths[icon]}
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

Icon.defaultProps = {
  onClick: undefined,
  onMouseDown: undefined,
  classes: undefined,
  hidden: false,
};
