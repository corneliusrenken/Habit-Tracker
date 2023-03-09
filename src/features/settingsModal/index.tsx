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
        Start weekn on
      </div>
      <select>
        <option selected>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>
      <div className="modal-subtext">
        Theme
      </div>
      <select>
        <option selected>System</option>
        <option>Light</option>
        <option>Dark</option>
      </select>
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
