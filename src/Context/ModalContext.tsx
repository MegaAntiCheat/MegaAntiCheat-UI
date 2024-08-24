import React, { ReactNode, useState } from 'react';

interface ModalContextProps {
  openModal: (content: React.ReactNode, modalOptions?: ModalOptions) => void;
  closeModal: () => void;
  modalContent: ReactNode;
  modalOptions?: ModalOptions;
}

interface ModalOptions {
  dismissable?: boolean;
  closeCallback?: () => void;
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
    if (modalOptions.closeCallback) {
      modalOptions.closeCallback();
    }
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        modalContent,
        modalOptions,
      }}
    >
      {children}
      {/* A hidden, offscreen copy of the modal will be opened in #root if we include this */}
      {/* {modalContent} */}
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
