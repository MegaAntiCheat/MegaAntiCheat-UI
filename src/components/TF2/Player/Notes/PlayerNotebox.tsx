import React from 'react';
import { CheckCircle, RefreshCw, SendHorizonal, XCircle } from 'lucide-react';
import { updatePlayer } from '@api/players';
import { Search } from '@components/General';

enum SentState {
  IDLE = 0,
  SENDING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

interface StatusIconProps {
  status: SentState;
}

function SentStatusIcon({ status }: StatusIconProps) {
  const iconProps = {
    className: 'p-1 hover:bg-secondary rounded',
    width: 40,
    height: 40,
  };

  switch (status) {
    case SentState.IDLE:
      return <SendHorizonal {...iconProps} />;
    case SentState.SENDING:
      return <RefreshCw {...iconProps} className="animate-spin" />;
    case SentState.SUCCESS:
      return <CheckCircle {...iconProps} color="green" />;
    case SentState.FAILED:
      return <XCircle {...iconProps} color="red" />;
    default:
      return null;
  }
}

interface PlayerNoteBoxProps {
  player: PlayerInfo;
}

const PlayerNotebox = ({ player }: PlayerNoteBoxProps) => {
  const [playerNote, setPlayerNote] = React.useState(
    player.customData.playerNote,
  );

  const [noteSentStatus, setNoteSentStatus] = React.useState<SentState>(
    SentState.IDLE,
  );
  return (
    <div className="flex mx-2.5 items-center relative">
      <Search
        className="relative w-full mr-1"
        placeholder="Add Player Note"
        value={playerNote}
        onChange={(e) => setPlayerNote(e)}
      />
      <div
        className="hover:cursor-pointer"
        onClick={async () => {
          if (noteSentStatus != SentState.IDLE) return;
          const old = player.customData.playerNote;
          player.customData.playerNote = playerNote;
          setNoteSentStatus(SentState.SENDING);

          try {
            const res = await updatePlayer(player.steamID64, undefined, {
              playerNote: playerNote,
            });

            if (!res) throw new Error('Failed to Update player note');

            setNoteSentStatus(SentState.SUCCESS); // Success
          } catch (e) {
            setNoteSentStatus(SentState.FAILED); // Failed
            player.customData.playerNote = old;
          }

          setTimeout(() => {
            setNoteSentStatus(0); // Idle
          }, 3000);
        }}
      >
        <SentStatusIcon status={noteSentStatus} />
      </div>
    </div>
  );
};

export default PlayerNotebox;
