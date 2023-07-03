import React from "react";
import "./Player.css";

import { Flex, Select, TextItem } from "../../General";

const playerTag = [
  {
    name: "Player",
    value: "player",
  },
  {
    name: "Bot",
    value: "bot",
  },
  {
    name: "Cheater",
    value: "cheater",
  },
  {
    name: "Suspicious",
    value: "suspicious",
  },
  {
    name: "Trusted",
    value: "trusted",
  },
];

const Player = ({
  pfp = "https://cdn.discordapp.com/icons/1112665618869661726/d6a0255dfca479cbde6707908fbc9a2a.webp",
  icon = "https://cdn.discordapp.com/attachments/1123073876897824848/1123080561435611199/icon_friend.png",
  verdict = "Player",
  name = "Megascatterbomb",
  status = "Joining",
  time = "00:00",
  you = false,
  color = "",
}) => {
  return (
    <Flex className={`player-item`} style={{ backgroundColor: color }}>
      <Select
        className="player-verdict"
        options={playerTag}
        placeholder={verdict}
      />
      <Flex className="player-profile">
        <img className="player-pfp" width={24} height={24} src={pfp}></img>
        <div className="player-name">{name}</div>
      </Flex>
      <img className="player-badge" width={12} height={12} src={icon} />
      <div className="player-status">{status}</div>
      <div>{time}</div>
    </Flex>
  );
};

export default Player;
