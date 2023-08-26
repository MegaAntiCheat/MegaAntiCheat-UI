import React from 'react';
import { updatePlayer } from '@api/players';
import { Button, TextInput } from '@components/General';

interface ChangeAliasModalProps {
  player: PlayerInfo;
}

export const ChangeAliasModal = ({ player }: ChangeAliasModalProps) => {
  const [alias, setAlias] = React.useState('');

  return (
    <div className="text-center">
      <div className="mb-3">
        Change Alias for Player:
        <div className="font-bold">{player.name}</div>
      </div>
      <div className="mb-4">
        <TextInput onChange={(e) => setAlias(e)} />
      </div>
      <div>
        <Button
          onClick={() => updatePlayer(player.steamID64, undefined, { alias })}
        >
          Change
        </Button>
      </div>
    </div>
  );
};
