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
    databaseDirectoryPath,
  } = config;

  const weekStartOptions: Config['startWeekOn'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const themeOptions: Config['theme'][] = ['System', 'Light', 'Dark'];

  return (
    <>
      <div className="heading">Settings</div>
      <div className="subheading">Save location</div>
      <PathInput
        path={databaseDirectoryPath}
        setPath={(path) => updateConfig({ databaseDirectoryPath: path })}
        disableTabIndex={disableTabIndex}
      />
      <div className="subheading">Start week on</div>
      <Select
        disableTabIndex={disableTabIndex}
        options={weekStartOptions}
        selectedOption={startWeekOn}
        setSelectedOption={(option) => updateConfig({ startWeekOn: option })}
      />
      <div className="subheading">Theme</div>
      <Select
        disableTabIndex={disableTabIndex}
        options={themeOptions}
        selectedOption={theme}
        setSelectedOption={(option) => updateConfig({ theme: option })}
      />
      <div className="header">Shortcuts</div>
      <div className="subheading">Global</div>
      <Shortcut
        name="Go to today"
        shortcuts={[{ keydownCode: 'KeyT' }]}
      />
      <Shortcut
        name="Go to yesterday"
        shortcuts={[{ keydownCode: 'KeyY' }]}
      />
      <Shortcut
        name="Edit habits"
        shortcuts={[{ keydownCode: 'KeyE' }]}
      />
      <Shortcut
        name="View history"
        shortcuts={[{ keydownCode: 'KeyH' }]}
      />
      <Shortcut
        name="View selected habit's history"
        shortcuts={[{ keydownCode: 'KeyF' }]}
      />
      <Shortcut
        name="Open settings & shortcuts"
        shortcuts={[{ keydownCode: 'Comma' }]}
      />
      <Shortcut
        name="Close popup"
        shortcuts={[{ keydownCode: 'Escape' }]}
      />
      <Shortcut
        name="Traverse habits"
        shortcuts={[{ keydownCode: 'ArrowUp' }, { keydownCode: 'ArrowDown' }]}
      />
      <div className="subheading">While editing habits</div>
      <Shortcut
        name="Rename habit"
        shortcuts={[{ keydownCode: 'KeyR' }]}
      />
      <Shortcut
        name="Toggle habit visibility"
        shortcuts={[{ keydownCode: 'KeyV' }]}
      />
      <Shortcut
        name="Create new habit"
        shortcuts={[{ keydownCode: 'KeyC' }]}
      />
      <Shortcut
        name="Delete habit"
        shortcuts={[{ keydownCode: 'Backspace' }, { keydownCode: 'Delete' }]}
      />
      <Shortcut
        name="Move habit"
        shortcuts={[{ keydownCode: 'ArrowUp', altKey: true }, { keydownCode: 'ArrowDown', altKey: true }]}
      />
      <div className="subheading">While renaming or creating habits</div>
      <Shortcut
        name="Confirm"
        shortcuts={[{ keydownCode: 'Enter' }]}
      />
      <Shortcut
        name="Cancel"
        shortcuts={[{ keydownCode: 'Escape' }]}
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
