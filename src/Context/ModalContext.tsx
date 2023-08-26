import React, { ReactNode, useState } from 'react';

interface ModalContextProps {
  openModal: (content: React.ReactNode, modalOptions?: ModalOptions) => void;
  closeModal: () => void;
  modalContent: ReactNode;
  modalOptions?: ModalOptions;
}

interface ModalOptions {
  dismissable?: boolean;
}

const ModalContext = React.createContext<ModalContextProps | undefined>(
  undefined,
);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({});

  const openModal = (content: ReactNode, options?: ModalOptions) => {
    setModalContent(content);
    setModalOptions(options ?? {});
  };

  const closeModal = () => {
    setModalContent(null);
    setModalOptions({});
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, modalContent, modalOptions }}
    >
      {children}
      {modalContent}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
