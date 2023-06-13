import React, { useState } from 'react';
import App from '../app';
import ConfigContext from './ConfigContext';
import { Config } from '../../globalTypes';
import { config as _config } from '../../webUserData';

export default function ConfigLoader() {
  const [config, setConfig] = useState<Config>(_config);

  return (
    <ConfigContext.Provider value={config}>
      <App
        setConfig={setConfig}
      />
    </ConfigContext.Provider>
  );
}
