import React from 'react';
import { updatePlayer } from '@api/players';
import { Button, TextInput } from '@components/General';
import { useModal } from '../../../../Context';

interface ChangeAliasModalProps {
  steamID64: string;
  name?: string;
}

const ChangeAliasModal = ({ steamID64, name }: ChangeAliasModalProps) => {
  const [alias, setAlias] = React.useState('');

  const { closeModal } = useModal();

  return (
    <div className="text-center">
      <div className="mb-3">
        Change Alias for Player:
        <div className="font-bold">{name ?? steamID64}</div>
      </div>
      <div className="mb-4">
        <TextInput onChange={(e) => setAlias(e)} />
      </div>
      <div>
        <Button
          onClick={() => {
            updatePlayer(steamID64, undefined, { alias });
            closeModal();
          }}
        >
          Change
        </Button>
      </div>
    </div>
  );
};

export default ChangeAliasModal;
