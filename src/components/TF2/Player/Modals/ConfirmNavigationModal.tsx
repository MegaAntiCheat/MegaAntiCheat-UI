import { Button, Checkbox } from '@components/General';
import { useModal } from '@context';
import React from 'react';

interface ConfirmNavigationModalProps {
  link: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDontShowAgain?: () => void;
}

const ConfirmNavigationModal = ({
  link,
  onConfirm,
  onCancel,
  onDontShowAgain,
}: ConfirmNavigationModalProps) => {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  const { closeModal } = useModal();

  const handleAction = () => {
    if (dontShowAgain) {
      onDontShowAgain?.();
    }
    closeModal();
  };

  return (
    <div>
      <div className="mb-5 text-lg">
        You are about to open a link to an external site:{' '}
        {new URL(link).hostname}.
        <br />
        Are you sure you want to continue?
      </div>
      <div className="w-full flex gap-3 justify-end items-center">
        Don't show this again
        <Checkbox
          checked={dontShowAgain}
          onChange={(checked) => {
            setDontShowAgain(checked);
          }}
        />
        <Button
          onClick={() => {
            handleAction();
            onCancel?.();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAction();
            onConfirm?.();
          }}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ConfirmNavigationModal;
