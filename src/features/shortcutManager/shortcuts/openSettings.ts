import { ModalGenerator } from '../../../globalTypes';
import createSettingsModalGenerator from '../../settingsModal';

type States = {
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
};

export default function openSettings({ setModal }: States) {
  const modalGenerator = createSettingsModalGenerator();
  setModal(() => modalGenerator);
}
