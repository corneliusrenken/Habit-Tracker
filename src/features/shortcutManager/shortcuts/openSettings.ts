import { ModalGenerator } from '../../../globalTypes';
import createSettingsModalGenerator from '../../settingsModal';

type States = {
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  updateConfig: (updateData: Parameters<typeof window.electron['update-config']>[0]) => void;
};

export default function openSettings({ setModal, updateConfig }: States) {
  const modalGenerator = createSettingsModalGenerator({ updateConfig });
  setModal(() => modalGenerator);
}
