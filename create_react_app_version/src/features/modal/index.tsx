// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useMemo, useRef } from 'react';
import { ModalContentGenerator } from '../../globalTypes';
import './modal.css';

function generateModalContent(contentGenerator: ModalContentGenerator, allowTabTraversal: boolean) {
  return contentGenerator(allowTabTraversal);
}

type Props = {
  modalContentGenerator: ModalContentGenerator | undefined;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
};

export default function Modal({ modalContentGenerator, setModalContentGenerator }: Props) {
  const displayingModal = modalContentGenerator !== undefined;

  useEffect(() => {
    // https://github.com/Microsoft/TypeScript/issues/5901#issuecomment-431649653
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [displayingModal]);

  const modalBackgroundRef = useRef<HTMLDivElement>(null);
  const latchedContentGenerator = useRef<ModalContentGenerator>(() => <div />);
  if (displayingModal) latchedContentGenerator.current = modalContentGenerator;
  const latchedContent = useMemo(() => (
    generateModalContent(latchedContentGenerator.current, displayingModal)
  ), [displayingModal]);

  let modalBackgroundClassName = 'modal-background';
  modalBackgroundClassName += displayingModal
    ? ' modal-shown'
    : ' modal-hidden';

  return (
    <div // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, max-len
      ref={modalBackgroundRef}
      className={modalBackgroundClassName}
      onClick={(e) => {
        if (e.target === modalBackgroundRef.current) {
          setModalContentGenerator(undefined);
        }
      }}
    >
      <div className="modal-container">
        {latchedContent}
      </div>
    </div>
  );
}
