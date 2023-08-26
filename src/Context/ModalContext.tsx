import React, { ReactNode, useState } from 'react';

interface ModalContextProps {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode;
}

const ModalContext = React.createContext<ModalContextProps | undefined>(
  undefined,
);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalContent }}>
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
