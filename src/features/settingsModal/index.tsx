import React from 'react';
import { Config } from '../../api/config/defaultConfig';
import { ModalGenerator } from '../../globalTypes';
import PathInput from '../modal/PathInput';
import Select from '../modal/Select';

type Props = {
  // config: Config;
  disableTabIndex: boolean;
};

function SettingsModal({
  // config,
  disableTabIndex,
}: Props) {
  return (
    <>
      <div className="modal-container-header">Settings</div>
      <div className="modal-container-subtext">Save location</div>
      <PathInput
        path="/Users/Cornelius/GitHub/habit-tracker/src/features/settingsModal/index.tsx"
        disableTabIndex={disableTabIndex}
        onClick={() => {}}
        className="modal-container-path-input"
      />
      <div className="modal-container-subtext">Start week on</div>
      <Select
        className="modal-container-select"
        selectedIndex={1}
        options={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
      />
      <div className="modal-container-subtext">Theme</div>
      <Select
        className="modal-container-select"
        selectedIndex={1}
        options={['Auto', 'Light', 'Dark']}
      />
      <div className="modal-container-subtext">Style</div>
      <Select
        className="modal-container-select"
        selectedIndex={1}
        options={['Complete', 'Minimal']}
      />
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
