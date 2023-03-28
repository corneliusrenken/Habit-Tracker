import React from 'react';
import Icon from '../icon';
import iconPaths from '../icon/iconPaths';

type Props = {
  icon: keyof typeof iconPaths;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  hidden?: boolean;
};

export default function IconButton({
  icon, onClick, onMouseDown, className, hidden,
}: Props) {
  let buttonClassName = className || 'icon-button';

  if (hidden) buttonClassName += ' hidden';

  return (
    <button
      tabIndex={-1}
      type="button"
      className={buttonClassName}
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
  className: undefined,
  hidden: false,
};
