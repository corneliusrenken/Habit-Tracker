import { createContext } from 'react';
import { Config } from '../../globalTypes';
import { config } from '../../webUserData';

const ConfigContext = createContext<Config>(config);

export default ConfigContext;
