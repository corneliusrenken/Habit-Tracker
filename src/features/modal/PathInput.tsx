import React = require('react');
import { useErrorBoundary } from 'react-error-boundary';
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
  const [dialogWindowOpen, setDialogWindowOpen] = React.useState(false);

  const { showBoundary } = useErrorBoundary();

  let buttonClassName = 'path-input';
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
