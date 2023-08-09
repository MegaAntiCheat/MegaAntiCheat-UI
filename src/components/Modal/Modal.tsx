import React from 'react';
import Modal from 'react-modal';
import './Modal.css';

interface ModalOptions {
  dismissable?: boolean;
}

interface ModalProps {
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
  show: boolean;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  modalOptions?: ModalOptions;
}

Modal.setAppElement('#root');

const ModalWrapper = ({
  children,
  className,
  onClose,
  modalOptions = { dismissable: true },
}: ModalProps) => {
  const ModalRef = React.useRef<HTMLDivElement>(null);

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
      <Modal
        isOpen={true}
        className={`fixed top-0 left-0 z-[100] w-full h-full bg-transparent/30 ${className}`}
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <div ref={ModalRef}>{children}</div>
      </Modal>
    </>
  );
};

export { ModalWrapper as Modal };
