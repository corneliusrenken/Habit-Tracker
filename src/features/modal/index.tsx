import React, { useEffect, useMemo, useRef } from 'react';
import { ModalGenerator } from '../../globalTypes';

type Props = {
  modal: ModalGenerator | undefined;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
};

export default function Modal({ modal, setModal }: Props) {
  const modalBackgroundRef = useRef<HTMLDivElement>(null);

  // need the ref for the memo so that it can reference itself
  const latchedModalGeneratorRef = useRef<ModalGenerator | undefined>(undefined);
  const latchedModalGenerator: ModalGenerator | undefined = useMemo(() => {
    if (modal !== undefined) {
      latchedModalGeneratorRef.current = modal;
      return modal;
    }
    return latchedModalGeneratorRef.current;
  }, [modal]);

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
    if (latchedModalGenerator === undefined) {
      return null;
    }
    if (displayingModal) {
      return latchedModalGenerator(false);
    }
    return latchedModalGenerator(true);
  }, [displayingModal, latchedModalGenerator]);

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
