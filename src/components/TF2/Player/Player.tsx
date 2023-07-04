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
  icon = "",
  verdict = "Player",
  name = "Player",
  state = "Joining",
  time = "00:00",
  you = false,
  color = "",
  className = "",
}) => {
  return (
    <Flex
      className={`player-item ${className}`}
      style={{ backgroundColor: color }}
    >
      <Select
        className="player-verdict"
        options={playerTag}
        placeholder={verdict}
      />
      <Flex className="player-profile">
        <img className="player-pfp" width={24} height={24} src={pfp}></img>
        <div className="player-name">{name}</div>
      </Flex>
      {icon ? (
        <img className="player-badge" width={12} height={12} src={icon} />
      ) : (
        <div />
      )}
      <div className="player-status">{state}</div>
      <div>{time}</div>
    </Flex>
  );
};

export default Player;
