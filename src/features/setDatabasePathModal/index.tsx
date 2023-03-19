import React, { useState } from 'react';
import { ModalGenerator } from '../../globalTypes';
import PathInput from '../modal/PathInput';

type Props = {
  disableTabIndex: boolean;
  placeholderPath: string;
  onConfirm: (path: string) => void;
};

function SetDatabasePathModal({
  disableTabIndex,
  placeholderPath,
  onConfirm,
}: Props) {
  const [path, setPath] = useState<string>();

  return (
    <>
      <div className="modal-container-header">
        Where would you like to save your data?
      </div>
      <div className="modal-container-subtext">
        The location can later be updated in the settings
      </div>
      <PathInput
        path={path !== undefined ? path : placeholderPath}
        onClick={async () => {
          const { filePath } = await window.electron['choose-directory-path']();
          if (filePath) {
            setPath(filePath);
          }
        }}
        disableTabIndex={disableTabIndex}
        className="modal-container-path-input"
      />
      <div className="modal-container-dialog-button-group">
        <button
          disabled={path === undefined}
          tabIndex={disableTabIndex ? -1 : undefined}
          type="button"
          onClick={path !== undefined ? () => onConfirm(path) : undefined}
        >
          Confirm
        </button>
      </div>
    </>
  );
}

export default function createSetDatabasePathModalGenerator({
  placeholderPath,
  onConfirm,
} : {
  placeholderPath: string,
  onConfirm: (path: string) => void,
}): ModalGenerator {
  return function setDatabasePathModalGenerator(disableTabIndex: boolean) {
    return (
      <SetDatabasePathModal
        disableTabIndex={disableTabIndex}
        placeholderPath={placeholderPath}
        onConfirm={onConfirm}
      />
    );
  };
}
