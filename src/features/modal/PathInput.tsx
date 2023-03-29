import React = require('react');
import { useErrorBoundary } from 'react-error-boundary';
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

  const { showBoundary } = useErrorBoundary();

  let buttonClassName = classNamePrefix;
  if (dialogWindowOpen) buttonClassName += ' dialog-open';

  return (
    <button
      type="button"
      className={buttonClassName}
      tabIndex={disableTabIndex ? -1 : undefined}
      onClick={dialogWindowOpen ? undefined : async () => {
        setDialogWindowOpen(true);
        try {
          const { filePath } = await window.electron['choose-directory-path']();
          setDialogWindowOpen(false);
          if (filePath) {
            setPath(filePath);
          }
        } catch (error) {
          if (error instanceof Error) {
            showBoundary(error);
          } else {
            showBoundary(new Error('Unknown error in task dispatcher'));
          }
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
