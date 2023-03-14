import React = require('react');
import Icon from '../icon';

type Props = {
  path: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  disableTabIndex: boolean;
  className?: string;
};

export default function PathInput({
  path,
  onClick,
  disableTabIndex,
  className,
}: Props) {
  const classNamePrefix = className || 'path-input';

  return (
    <button
      type="button"
      className={classNamePrefix}
      onClick={onClick}
      tabIndex={disableTabIndex ? -1 : undefined}
    >
      <div className={`${classNamePrefix}-path`}>
        {path}
      </div>
      <Icon
        className={`${classNamePrefix}-icon`}
        icon="open"
      />
    </button>
  );
}

PathInput.defaultProps = {
  className: undefined,
};
