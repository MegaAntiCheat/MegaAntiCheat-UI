import { FC } from 'react';
import { Unplug } from 'lucide-react';
import { Tooltip } from '@components/General';

interface PlayerTimeProps {
  disconnected: boolean;
  displayTime: string;
}

export const PlayerTime: FC<PlayerTimeProps> = ({
  disconnected,
  displayTime,
}) => {
  return (
    <div className={'flex justify-end pr-2'}>
      {disconnected ? (
        // TODO: i18 stringify // TOOLTIP GETS OVERFLOW CLIPPED SHOULD BE A REACT MODAL
        <Tooltip content={'Player Disconnected'} direction={'left'}>
          <Unplug className="size-4" />
        </Tooltip>
      ) : (
        // TODO: use a mono font, so we don't get layout shift.
        <p className="player-time hidden overflow-hidden truncate text-ellipsis whitespace-nowrap xs:[display:unset]">
          {displayTime}
        </p>
      )}
    </div>
  );
};
