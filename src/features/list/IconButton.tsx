import React from 'react';
import Icon from '../icon';
import iconPaths from '../icon/iconPaths';

type Props = {
  icon: keyof typeof iconPaths;
  disableTabIndex: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  classes?: string[];
  hidden?: boolean;
};

export default function IconButton({
  icon, disableTabIndex, onClick, onMouseDown, classes, hidden,
}: Props) {
  let className = 'icon-button';

  if (classes && classes.length > 0) className += ` ${classes.join(' ')}`;

  if (hidden) className += ' hidden';

  return (
    <button
      tabIndex={disableTabIndex ? -1 : undefined}
      type="button"
      className={className}
      onClick={onClick ? (e) => onClick(e) : undefined}
      onMouseDown={onMouseDown ? (e) => onMouseDown(e) : undefined}
    >
      <Icon icon={icon} />
    </button>
  );
}

IconButton.defaultProps = {
  onClick: undefined,
  onMouseDown: undefined,
  classes: undefined,
  hidden: false,
};
