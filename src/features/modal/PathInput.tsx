import React from 'react';
import Icon from '../icon';

type Props = {
  path: string,
  setPath: (path: string) => void,
  disableTabIndex: boolean;
};

export default function PathInput({
  path,
  setPath,
  disableTabIndex,
}: Props) {
  const [dialogWindowOpen] = React.useState(false);

  let buttonClassName = 'path-input';
  if (dialogWindowOpen) buttonClassName += ' dialog-open';

  return (
    <button
      type="button"
      className={buttonClassName}
      tabIndex={disableTabIndex ? -1 : undefined}
      onClick={() => {}} // not needed for web demo
    >
      <div className="path">
        {path}
      </div>
      <Icon
        className="icon"
        icon="open"
      />
    </button>
  );
}
