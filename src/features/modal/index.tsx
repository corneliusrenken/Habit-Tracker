import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ModalGenerator } from '../../globalTypes';
import useLatch from '../common/useLatch';

type Props = {
  modal: ModalGenerator | undefined;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
};

export default function Modal({ modal, setModal }: Props) {
  const modalBackgroundRef = useRef<HTMLDivElement>(null);

  const latchedModal = useLatch<ModalGenerator | undefined>(
    undefined,
    useCallback((lastModal) => {
      if (modal !== undefined) {
        return modal;
      }
      return lastModal;
    }, [modal]),
  );

  const displayingModal = modal !== undefined;

  useEffect(() => {
    // https://github.com/Microsoft/TypeScript/issues/5901#issuecomment-431649653
    // if there's an active element (eg. tab index on delete habit button), remove focus
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [displayingModal]);

  let modalBackgroundClassName = 'modal-background';
  modalBackgroundClassName += displayingModal
    ? ' shown'
    : ' hidden';

  const modalContent = useMemo(() => {
    if (latchedModal === undefined) {
      return null;
    }
    if (displayingModal) {
      return latchedModal(false);
    }
    return latchedModal(true);
  }, [displayingModal, latchedModal]);

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={modalBackgroundRef}
      className={modalBackgroundClassName}
      onClick={(e) => {
        if (e.target === modalBackgroundRef.current) {
          setModal(undefined);
        }
      }}
    >
      <div className="modal">
        {modalContent}
      </div>
    </div>
  );
}
