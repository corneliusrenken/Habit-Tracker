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
      <div className="modal-container-subheading">Save location</div>
      <PathInput
        path={databaseDirectoryPath}
        setPath={(path) => updateConfig({ databaseDirectoryPath: path })}
        disableTabIndex={disableTabIndex}
        className="modal-container-path-input"
      />
      <div className="modal-container-subheading">Start week on</div>
      <Select
        className="modal-container-select"
        options={weekStartOptions}
        selectedOption={startWeekOn}
        setSelectedOption={(option) => updateConfig({ startWeekOn: option })}
      />
      <div className="modal-container-subheading">Theme</div>
      <Select
        className="modal-container-select"
        options={themeOptions}
        selectedOption={theme}
        setSelectedOption={(option) => updateConfig({ theme: option })}
      />
      <div className="modal-container-subheading">Style</div>
      <Select
        className="modal-container-select"
        options={styleOptions}
        selectedOption={style}
        setSelectedOption={(option) => updateConfig({ style: option })}
      />
      <div className="modal-container-header">Shortcuts</div>
      <div className="modal-container-subheading">Global</div>
      <Shortcut
        className="modal-container-shortcut"
        name="Go to today"
        shortcuts={[{ keydownCode: 'KeyT' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Go to yesterday"
        shortcuts={[{ keydownCode: 'KeyY' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="View history"
        shortcuts={[{ keydownCode: 'KeyH' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="View current habit's history"
        shortcuts={[{ keydownCode: 'KeyF' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Edit habits"
        shortcuts={[{ keydownCode: 'KeyE' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Open settings & shortcuts"
        shortcuts={[{ keydownCode: 'Comma' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Close popup"
        shortcuts={[{ keydownCode: 'Escape' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Traverse habits"
        shortcuts={[{ keydownCode: 'ArrowUp' }, { keydownCode: 'ArrowDown' }]}
      />
      <div className="modal-container-subheading">While editing habits</div>
      <Shortcut
        className="modal-container-shortcut"
        name="Rename habit"
        shortcuts={[{ keydownCode: 'KeyR' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Toggle habit visibility"
        shortcuts={[{ keydownCode: 'KeyV' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Delete habit"
        shortcuts={[{ keydownCode: 'Backspace' }, { keydownCode: 'Delete' }]}
      />
      <Shortcut
        className="modal-container-shortcut"
        name="Move habit"
        shortcuts={[{ keydownCode: 'ArrowUp', altKey: true }, { keydownCode: 'ArrowDown', altKey: true }]}
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
