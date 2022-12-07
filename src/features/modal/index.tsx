import React from 'react';
import './modal.css';

type Props = {
  content: JSX.Element;
};

export default function Modal({ content }: Props) {
  return (
    <div className="modal-background">
      <div className="modal-container">
        {content}
      </div>
    </div>
  );
}
