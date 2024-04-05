import { verifyImageExists } from "@api/utils";
import { Tooltip } from "@components/General";
import { get } from "http";
import { Info } from "lucide-react";
import React from "react";
import Player from "./Player";
import PlayerDetails from "./LivePlayerDetails";
import { buildIconList, displayColor, displayNamesList, formatTimeToString } from "./playerutils";
import LivePlayerDetails from "./LivePlayerDetails";
import { kickPlayer } from "@api/commands";

interface LivePlayerProps {
    player: PlayerInfo;
    icon?: string;
    className?: string;
    onImageLoad?: () => void;
    playerColors?: Record<string, string>;
    openInApp?: boolean;
    userSteamID?: string;
    cheatersInLobby: PlayerInfo[];
    relevance?: string | undefined
  }
  
  const LivePlayer = ({
    player,
    className,
    onImageLoad,
    playerColors,
    openInApp,
    cheatersInLobby,
    relevance
  }: LivePlayerProps) => {

    const isFirstRefresh = React.useRef(true);

    let verdict = player.localVerdict ?? "Player";
    if(player.isSelf) verdict = "Self";
    else if(player.convicted) verdict = "Convict"; 

    const [playtime, setPlaytime] = React.useState(-1);
    const [pfp, setPfp] = React.useState<string>('./person.webp');

    const disconnected = player.gameInfo?.state === "Disconnected";

    let color;
    if(playerColors !== undefined) {
      color = displayColor(playerColors, player, cheatersInLobby);
    }

    let onVerdictChange = (newVerdict: string) => {
      player.localVerdict = newVerdict;
      return displayColor(playerColors, player, cheatersInLobby)
    }

    // Update playtime every second
    React.useEffect(() => {
      const interval = setInterval(() => {
        if (disconnected) return;
        setPlaytime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }, [disconnected]);

    // Update pfp on mount
    React.useEffect(() => {
      if (!player.steamInfo?.pfp) return;

      verifyImageExists(player.steamInfo?.pfp, './person.webp').then((src) => {
        setPfp(src);

        if (onImageLoad) onImageLoad();
      });
    }, [player.steamInfo?.pfp]);

    // Sync time if not yet set or out of sync (e.g. switched servers)
    React.useEffect(() => {
      if (
        !isFirstRefresh.current &&
        Math.abs(playtime - (player.gameInfo?.time ?? playtime)) <= 3
      ) {
        return;
      }

      setPlaytime(player.gameInfo?.time ?? 0);
      isFirstRefresh.current = false;
    }, [player.gameInfo?.time]);

    let note: React.JSX.Element | undefined;
    if ((player.previousNames?.filter((v) => v != player.customData?.alias).length ?? 0 ) >= 1 ) {
      note = (
        <Tooltip
          className="ml-1 bottom-[1px]"
          content={displayNamesList(player)}
        >
          <Info color="grey" width={16} height={16} />
        </Tooltip>
      );
    }

    let details = LivePlayerDetails({
      player: player,
      bgColor: color}
    )

    let extraData = "N/A";
    if(player.gameInfo?.time !== undefined) {
      setPlaytime(player.gameInfo.time);
      extraData = formatTimeToString(player.gameInfo.time);
    } else {
      extraData = "?";
    }

    let extraMenuItems = [];
    
    if(!disconnected && player.gameInfo?.userid !== undefined) {
      extraMenuItems.push({
        label: 'Votekick Player',
        multiOptions: [
          {
            label: 'Cheating',
            onClick: () => kickPlayer(player.gameInfo!.userid, 'cheating'),
          },
          {
            label: 'Scamming',
            onClick: () => kickPlayer(player.gameInfo!.userid, 'scamming'),
          },
          {
            label: 'Idle',
            onClick: () => kickPlayer(player.gameInfo!.userid, 'idle'),
          },
          {
            label: 'No Reason',
            onClick: () => kickPlayer(player.gameInfo!.userid, 'none'),
          },
        ],
      });
    }

    return (
    <>
      <Player
        steamID64={player.steamID64}
        name={player.name}
        verdict={verdict}
        icons={buildIconList(player, cheatersInLobby)}
        bgColor={color}
        extraData={extraData}
        grayedOut={disconnected}
        image={pfp}
        columnSpacing='player'
        note={note}
        className={className}
        details={details}
        extraMenuItems={extraMenuItems}
        openInApp={openInApp}
        onImageLoad={onImageLoad}
        onVerdictChange={onVerdictChange}
      />
    </>
    )
  }