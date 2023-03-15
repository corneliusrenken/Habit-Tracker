import { Config } from '../../../api/config/defaultConfig';
import { ModalGenerator } from '../../../globalTypes';
import createSettingsModalGenerator from '../../settingsModal';

type States = {
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function openSettings({ setModal, setConfig }: States) {
  const modalGenerator = createSettingsModalGenerator({ setConfig });
  setModal(() => modalGenerator);
}
