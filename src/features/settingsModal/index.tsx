import React, { useContext } from 'react';
import { Config } from '../../api/config/defaultConfig';
import { ModalGenerator } from '../../globalTypes';
import ConfigContext from '../initializer/ConfigContext';
import PathInput from '../modal/PathInput';
import Select from '../modal/Select';

type Props = {
  disableTabIndex: boolean;
  updateConfig: (updateData: Partial<Config>) => void;
};

function SettingsModal({
  disableTabIndex,
  updateConfig,
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
        setSelectedOption={(option) => updateConfig({ startWeekOn: option })}
      />
      <div className="modal-container-subtext">Theme</div>
      <Select
        className="modal-container-select"
        options={themeOptions}
        selectedOption={theme}
        setSelectedOption={(option) => updateConfig({ theme: option })}
      />
      <div className="modal-container-subtext">Style</div>
      <Select
        className="modal-container-select"
        options={styleOptions}
        selectedOption={style}
        setSelectedOption={(option) => updateConfig({ style: option })}
      />
    </>
  );
}

type States = {
  updateConfig: (updateData: Partial<Config>) => void;
};

export default function createSettingsModalGenerator({ updateConfig }: States): ModalGenerator {
  return function settingsModalGenerator(disableTabIndex: boolean) {
    return (
      <SettingsModal
        disableTabIndex={disableTabIndex}
        updateConfig={updateConfig}
      />
    );
  };
}
