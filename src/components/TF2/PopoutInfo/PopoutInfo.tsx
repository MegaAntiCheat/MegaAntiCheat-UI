import React from 'react';
import { Player } from '@components/TF2';
import './PopoutInfo.css';
import { t } from '@i18n';

interface PopoutInfoProps {
  player: PlayerInfo;
  className?: string;
}

const PopoutInfo = ({ player, className }: PopoutInfoProps) => {
  const [showPopout, setShowPopout] = React.useState(false);
  const popoutRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setShowPopout(true);
  };

  const handleMouseLeave = () => {
    setShowPopout(false);
  };

  const shouldRenderOptionsBelow = () => {
    if (!popoutRef.current) return true;
    const { top, height } = popoutRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - top - height - 200;
    return spaceBelow >= height;
  };

  return (
    <div
      ref={popoutRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`popoutinfo-container ${className}`}
      style={{ position: 'relative' }}
    >
      {<Player player={player} />}
      {showPopout && (
        <div
          className={`popoutinfo-content ${
            shouldRenderOptionsBelow() ? 'below' : 'above'
          }`}
        >
          <div>
            {t('KILLS')}: {player.gameInfo?.kills ?? 0}
          </div>
          <div>
            {t('DEATHS')}: {player.gameInfo?.deaths ?? 0}
          </div>
          <div>
            K/D:{' '}
            {(
              (player.gameInfo?.kills ?? 1) / (player.gameInfo?.deaths ?? 1)
            ).toPrecision(2)}
          </div>
          <div>
            {t('PING')}: {player.gameInfo?.ping ?? 0}ms
          </div>
          <div>
            Bans:{' '}
            {(player.steamInfo?.gameBans ?? 0) +
              (player.steamInfo?.vacBans ?? 0)}
          </div>
          <div>
            {t('COUNTRY')}: {player.steamInfo?.countryCode ?? t('UNKNOWN')}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopoutInfo;
