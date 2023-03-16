import { Config } from '../../../api/config/defaultConfig';
import { ModalGenerator } from '../../../globalTypes';
import createSettingsModalGenerator from '../../settingsModal';

type States = {
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  updateConfig: (updateData: Partial<Config>) => void;
};

export default function openSettings({ setModal, updateConfig }: States) {
  const modalGenerator = createSettingsModalGenerator({ updateConfig });
  setModal(() => modalGenerator);
}
