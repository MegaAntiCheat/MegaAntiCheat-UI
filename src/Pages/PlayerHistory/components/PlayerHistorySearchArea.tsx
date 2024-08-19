import React, { Dispatch, FC, SetStateAction } from 'react';
import { Search, Tooltip } from '@components/General';
import { t } from '@i18n';
import { useModal } from '@context';
import { CaseLower, CaseSensitive } from 'lucide-react';
import { AddPlayerModal } from '@components/TF2';

interface PlayerHistorySearchAreaProps {
  handleSearch: (query: string) => void;
  playerToAdd: string | undefined;
  caseSensitive: boolean;
  setCaseSensitive: Dispatch<SetStateAction<boolean>>;
}

export const PlayerHistorySearchArea: FC<PlayerHistorySearchAreaProps> = ({
  handleSearch,
  playerToAdd,
  caseSensitive,
  setCaseSensitive,
}) => {
  const { openModal } = useModal();

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-outline/30 bg-primary px-4 py-[7px]">
      <div className={'relative flex items-center'}>
        {/***
         TODO: this is not very clear to the user!
         Nothing that suggests that you can input a steamID to add a player.
         I would consider unlinking the functionality of these.
         Add player should function as expected and open a modal where a user inputs
         a player steamID and the place holder is indicative of that.
         **/}
        <Search
          placeholder={t('PLAYER_SEARCH')}
          className="w-fit pr-16"
          onChange={handleSearch}
        />

        <div
          onClick={() => {
            setCaseSensitive(!caseSensitive);
          }}
          className="absolute right-0 top-1/2 -translate-y-[50%] cursor-pointer rounded-r-md border-l border-highlight/10 bg-primary/30 px-4 py-2"
        >
          {caseSensitive ? <CaseSensitive /> : <CaseLower />}
        </div>
      </div>

      <Tooltip
        direction="bottom-left"
        className="items-center"
        content={t('ADD_PLAYER_HELP')}
        noWrap={true}
        isButton={true}
      >
        <button
          className={`select-none items-center rounded-md border border-highlight/10 bg-secondary px-4 py-2 ${playerToAdd ? '' : 'cursor-not-allowed opacity-60'}`}
          disabled={!playerToAdd}
          onClick={() => {
            playerToAdd &&
              openModal(<AddPlayerModal steamID64={playerToAdd} />, {
                dismissable: true,
              });
          }}
        >
          {t('ADD_PLAYER')}
        </button>
      </Tooltip>
    </div>
  );
};
