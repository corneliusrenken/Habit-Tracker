/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ModalGenerator } from '../../globalTypes';
import useLatch from '../common/useLatch';

type Props = {
  forceOpen: true,
  modal: ModalGenerator,
} | {
  modal: ModalGenerator | undefined,
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>,
};

export default function Modal(props: Props) {
  const { modal } = props;

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

  const modalContent = useMemo(() => {
    if (latchedModal === undefined) {
      return null;
    }
    if (displayingModal) {
      return latchedModal(false);
    }
    return latchedModal(true);
  }, [displayingModal, latchedModal]);

  let modalClassName = 'modal';
  if (!displayingModal) modalClassName += ' hidden';

  useEffect(() => {
    if (displayingModal) {
      window.scrollTo({ top: 0 });
    }
  }, [displayingModal]);

  return (
    <div className={modalClassName}>
      <div
        ref={modalBackgroundRef}
        className="modal-backdrop"
        onClick={'forceOpen' in props ? undefined : (e) => {
          const { setModal } = props;
          if (e.target === modalBackgroundRef.current) {
            setModal(undefined);
          }
        }}
      />
      <div
        className="modal-container"
        key={displayingModal.toString()} // modal is re-rendered -> tab index is reset
      >
        {modalContent}
      </div>
    </div>
  );
}
