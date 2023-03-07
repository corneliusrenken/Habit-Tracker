import { ModalGenerator } from '../../../globalTypes';

type States = {
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
};

export default function closeModal({ setModal }: States) {
  setModal(undefined);
}
