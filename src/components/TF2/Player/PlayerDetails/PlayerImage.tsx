import React, { FC } from 'react';
import { getDefaultOrImg } from '@lib/utils';
import { DEFAULT_PROFILE_IMG } from '@lib/globals';

interface PlayerDetailImgProps {
  steamID64: string;
  pfp: string | undefined;
  size: number;
  className?: string;
}

export const PlayerImage: FC<PlayerDetailImgProps> = ({
  steamID64,
  pfp,
  size,
  className,
}) => {
  const [src, setSrc] = React.useState<string>(getDefaultOrImg(pfp));

  return (
    <a
      className="flex-shrink-0"
      target="_blank"
      href={`https://steamcommunity.com/profiles/${steamID64}`}
    >
      <img
        className={className}
        src={src}
        onError={() => setSrc(DEFAULT_PROFILE_IMG)}
        width={size}
        height={size}
      />
    </a>
  );
};
