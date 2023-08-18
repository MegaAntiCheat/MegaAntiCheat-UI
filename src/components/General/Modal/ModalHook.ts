import React from 'react';

const useModal = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [dismissable, setDismissable] = React.useState(true);
  const [modalContent, setModalContent] =
    React.useState<React.ReactNode | null>(null);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setDismissable(dismissable);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setShowModal(false);
  };

  return {
    showModal,
    openModal,
    closeModal,
    modalContent,
    dismissable,
  };
};

export default useModal;
