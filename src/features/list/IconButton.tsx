import React from 'react';
import Icon from '../icon';
import iconPaths from '../icon/iconPaths';

type Props = {
  icon: keyof typeof iconPaths;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  classNameAdditions?: string;
  hidden?: boolean;
};

export default function IconButton({
  icon, onClick, onMouseDown, classNameAdditions, hidden,
}: Props) {
  let buttonClassName = 'icon-button';
  if (classNameAdditions) buttonClassName += ` ${classNameAdditions}`;
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
  classNameAdditions: undefined,
  hidden: false,
};
