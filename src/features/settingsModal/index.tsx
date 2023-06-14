import React, { useContext } from 'react';
import { Config, ModalGenerator } from '../../globalTypes';
import ConfigContext from '../configLoader/ConfigContext';
import PathInput from '../modal/PathInput';
import Select from '../modal/Select';
import Shortcut from './Shortcut';

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
  } = config;

  const weekStartOptions: Config['startWeekOn'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const themeOptions: Config['theme'][] = ['System', 'Light', 'Dark'];

  return (
    <>
      <div className="heading">Settings</div>
      <div className="subheading">Save location (disabled in web demo)</div>
      <PathInput
        path={'/Documents'}
        setPath={() => {}} // not needed for web demo
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
      <div className="heading">Shortcuts</div>
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
      <div className="subheading">While typing</div>
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
  updateConfig: (updateData: Partial<Config>) => void
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
