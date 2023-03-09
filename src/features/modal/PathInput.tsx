import React = require('react');
import Icon from '../icon';

type Props = {
  path: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  disableTabIndex: boolean;
};

export default function PathInput({
  path,
  onClick,
  disableTabIndex,
}: Props) {
  return (
    <button
      type="button"
      className="path-input"
      onClick={onClick}
      tabIndex={disableTabIndex ? -1 : undefined}
    >
      <div className="path-input-text">
        {path}
      </div>
      <Icon
        icon="open"
      />
    </button>
  );
}
