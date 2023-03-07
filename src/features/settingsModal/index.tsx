import React from 'react';
import { ModalGenerator } from '../../globalTypes';
import PathInput from '../modal/PathInput';

type Props = {
  disableTabIndex: boolean;
};

function SettingsModal({
  disableTabIndex,
}: Props) {
  return (
    <>
      <div className="modal-header">
        Settings
      </div>
      <div className="modal-subtext">
        Save location
      </div>
      <PathInput
        path="/Users/Cornelius/GitHub/habit-tracker/src/features/settingsModal/index.tsx"
        disableTabIndex={disableTabIndex}
        onClick={() => {}}
      />
      <div className="modal-subtext">
        Theme
      </div>
    </>
  );
}

export default function createSettingsModalGenerator(): ModalGenerator {
  return function deleteHabitModalGenerator(disableTabIndex: boolean) {
    return (
      <SettingsModal
        disableTabIndex={disableTabIndex}
      />
    );
  };
}
