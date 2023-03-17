import React, { useContext } from 'react';
import { Config } from '../../api/config/defaultConfig';
import { ModalGenerator } from '../../globalTypes';
import ConfigContext from '../initializer/ConfigContext';
import PathInput from '../modal/PathInput';
import Select from '../modal/Select';
import Shortcut from './Shortcut';

type Props = {
  disableTabIndex: boolean;
  updateConfig: (updateData: Parameters<typeof window.electron['update-config']>[0]) => void;
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
    databaseDirectoryPath,
  } = config;

  const weekStartOptions: Config['startWeekOn'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const themeOptions: Config['theme'][] = ['System', 'Light', 'Dark'];
  const styleOptions: Config['style'][] = ['Complete', 'Minimal'];

  return (
    <>
      <div className="modal-container-header">Settings</div>
      <div className="modal-container-subtext">Save location</div>
      <PathInput
        path={databaseDirectoryPath}
        disableTabIndex={disableTabIndex}
        onClick={async () => {
          const { filePath } = await window.electron['choose-directory-path']();
          if (filePath) {
            updateConfig({ databaseDirectoryPath: filePath });
          }
        }}
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
      <div className="modal-container-header">Shortcuts</div>
      <div className="modal-container-subtext">Universal</div>
      <Shortcut
        className="modal-container-shortcut"
        name="Remove habit"
        keybinds={[['shift', 'A'], ['B']]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Create habit"
        keybinds={[['C']]}
      />
    </>
  );
}

type States = {
  updateConfig: (updateData: Parameters<typeof window.electron['update-config']>[0]) => void;
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
