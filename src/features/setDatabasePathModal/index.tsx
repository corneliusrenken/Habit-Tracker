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
      <div className="modal-header">
        Where would you like to save your data?
      </div>
      <div className="modal-subtext">
        You can update the location at a later date in the settings
      </div>
      <PathInput
        path={path !== undefined ? path : placeholderPath}
        onClick={async () => {
          const test = await window.electron['choose-directory-path']();
          if (test.filePath) {
            setPath(test.filePath);
          }
        }}
        disableTabIndex={disableTabIndex}
      />
      <div className="button-group">
        <button
          disabled={path === undefined}
          className="dialog-button"
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
