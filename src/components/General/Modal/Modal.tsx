import React from 'react';
import Modal from 'react-modal';
import './Modal.css';
import ReactModal from 'react-modal';

import { useModal } from '@context/ModalContext';

interface ModalOptions {
  dismissable?: boolean;
}

interface ModalProps {
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
  show?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  modalOptions?: ModalOptions;
}

Modal.setAppElement('#root');

const ModalWrapper = ({
  className,
  onClose,
  modalOptions = { dismissable: true },
}: ModalProps) => {
  const ModalRef = React.useRef<HTMLDivElement>(null);
  const { closeModal, modalContent } = useModal();

  const handleClickOutside = (e: MouseEvent) => {
    if (ModalRef.current && !ModalRef.current.contains(e.target as Node)) {
      onClose?.();
    }
  };

  React.useEffect(() => {
    if (modalOptions.dismissable) {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);

  return (
    <>
      <ReactModal
        isOpen={!!modalContent}
        className={`modal ${className}`}
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        onRequestClose={closeModal}
      >
        <div ref={ModalRef}>{modalContent}</div>
      </ReactModal>
    </>
  );
};

export { ModalWrapper as Modal };
