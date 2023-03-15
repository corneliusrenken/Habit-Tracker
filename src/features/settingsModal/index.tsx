import React, { useContext } from 'react';
import { Config } from '../../api/config/defaultConfig';
import { ModalGenerator } from '../../globalTypes';
import ConfigContext from '../initializer/ConfigContext';
import PathInput from '../modal/PathInput';
import Select from '../modal/Select';

type Props = {
  disableTabIndex: boolean;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

// todo: use taskqueue
// todo: use taskqueue
// todo: use taskqueue
// todo: use taskqueue
// todo: use taskqueue
function updateConfig(
  updateData: Partial<Config>,
  states: {
    config: Config;
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
  },
) {
  const { config, setConfig } = states;
  // technically breaks if updateData is passed keys with undefined as value
  const newConfig = { ...config, ...updateData };
  window.electron['update-config'](updateData);
  setConfig(newConfig);
}

function SettingsModal({
  disableTabIndex,
  setConfig,
}: Props) {
  const config = useContext(ConfigContext);
  const {
    startWeekOn,
    theme,
    style,
  } = config;

  const weekStartOptions: Config['startWeekOn'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const themeOptions: Config['theme'][] = ['System', 'Light', 'Dark'];
  const styleOptions: Config['style'][] = ['Complete', 'Minimal'];

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
        options={weekStartOptions}
        selectedOption={startWeekOn}
        setSelectedOption={(option) => updateConfig({ startWeekOn: option }, { config, setConfig })}
      />
      <div className="modal-container-subtext">Theme</div>
      <Select
        className="modal-container-select"
        options={themeOptions}
        selectedOption={theme}
        setSelectedOption={(option) => updateConfig({ theme: option }, { config, setConfig })}
      />
      <div className="modal-container-subtext">Style</div>
      <Select
        className="modal-container-select"
        options={styleOptions}
        selectedOption={style}
        setSelectedOption={(option) => updateConfig({ style: option }, { config, setConfig })}
      />
    </>
  );
}

type States = {
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function createSettingsModalGenerator({ setConfig }: States): ModalGenerator {
  return function deleteHabitModalGenerator(disableTabIndex: boolean) {
    return (
      <SettingsModal
        disableTabIndex={disableTabIndex}
        setConfig={setConfig}
      />
    );
  };
}
