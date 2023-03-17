import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Config } from '../../api/config/defaultConfig';
import App from '../app';
import Modal from '../modal';
import createSetDatabasePathModalGenerator from '../setDatabasePathModal';
import ConfigContext from './ConfigContext';
import tempDefaultConfig from './tempDefaultConfig';

export default function Initializer() {
  const loadedConfig = useRef(false);

  const [config, setConfig] = useState<Config>(tempDefaultConfig);
  const [databaseExists, setDatabaseExists] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const c = await window.electron['get-config']();
      const dbExists = await window.electron['check-if-database-exists']();
      if (dbExists) {
        await window.electron['initialize-database']();
      }
      setConfig(c);
      setDatabaseExists(dbExists);
      loadedConfig.current = true;
    })();
  }, []);

  if (!loadedConfig.current) return null;

  if (!databaseExists) {
    const { databaseDirectoryPath } = config;

    return (
      <Modal
        forceOpen
        modal={createSetDatabasePathModalGenerator({
          placeholderPath: databaseDirectoryPath,
          onConfirm: async (path: string) => {
            await window.electron['update-config']({
              databaseDirectoryPath: path,
            });
            await window.electron['initialize-database']();
            setConfig((previousConfig) => {
              const newConfig = JSON.parse(JSON.stringify(previousConfig));
              newConfig.databaseDirectoryPath = path;
              return newConfig;
            });
            setDatabaseExists(true);
          },
        })}
      />
    );
  }

  return (
    <ConfigContext.Provider value={config}>
      <App
        setConfig={setConfig}
      />
    </ConfigContext.Provider>
  );
}
