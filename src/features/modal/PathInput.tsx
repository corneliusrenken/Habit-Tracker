import React = require('react');
import Icon from '../icon';

type Props = {
  path: string,
  setPath: (path: string) => void,
  disableTabIndex: boolean;
  className?: string;
};

export default function PathInput({
  path,
  setPath,
  disableTabIndex,
  className,
}: Props) {
  const [dialogWindowOpen, setDialogWindowOpen] = React.useState(false);
  const classNamePrefix = className || 'path-input';

  return (
    <button
      type="button"
      className={classNamePrefix}
      tabIndex={disableTabIndex ? -1 : undefined}
      onClick={dialogWindowOpen ? undefined : async () => {
        setDialogWindowOpen(true);
        const { filePath } = await window.electron['choose-directory-path']();
        setDialogWindowOpen(false);
        if (filePath) {
          setPath(filePath);
        }
      }}
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
