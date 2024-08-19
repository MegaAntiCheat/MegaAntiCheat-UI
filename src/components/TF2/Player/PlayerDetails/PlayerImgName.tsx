import { FC } from 'react';
import { Tooltip } from '@components/General';
import { displayNamesList } from '@components/TF2/Player/playerutils';
import { Info } from 'lucide-react';
import { PlayerImage } from '@components/TF2/Player/PlayerDetails/PlayerImage';

interface PlayImgNameProps {
  callback: () => void;
  player: PlayerInfo;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  handleContextMenu: (event: MouseEvent<HTMLDivElement>) => void;
}

export const PlayerImgName: FC<PlayImgNameProps> = ({
  callback,
  player,
  handleContextMenu,
}) => {
  const displayName = player.customData?.alias || player.name;
  const showAlias =
    (player.previousNames?.filter((v) => v != player.customData?.alias)
      .length ?? 0) >= 1;

  return (
    <div onClick={callback}>
      <div
        className="flex cursor-pointer select-none items-center gap-2"
        key={player.steamID64}
        onContextMenu={handleContextMenu}
      >
        <PlayerImage
          steamID64={player.steamID64}
          pfp={player.steamInfo?.pfp}
          size={24}
        />

        <div className={'flex items-center gap-1'}>
          <div className="select-none overflow-hidden text-ellipsis whitespace-nowrap">
            {displayName}
          </div>

          {showAlias && (
            <Tooltip
              className="bottom-[1px] ml-1"
              content={displayNamesList(player)}
            >
              <Info color="grey" size={16} />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};
