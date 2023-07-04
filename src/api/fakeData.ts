export const fakedata: ServerInfoResponse = {
  hostname: "bing chilling",
  ip: "127.0.0.1",
  map: "vsh_2towers",
  maxPlayers: 32,
  numPlayers: 18,
  players: [
    {
      steamID64: "6679025623542",
      isSelf: false,
      name: "TestPlayer",
      tags: ["Convict"],
      gameInfo: {
        deaths: 0,
        state: "Joining",
        kills: 0,
        team: 0,
        loss: 0,
        ping: 40,
        userid: "0"
      }
    },
    {
      steamID64: "456822423554124",
      isSelf: true,
      name: "Sammy",
      tags: ["Convict"],
      gameInfo: {
        deaths: 0,
        state: "Joining",
        kills: 0,
        team: 0,
        loss: 0,
        ping: 40,
        userid: "0"
      }
    },
    {
      steamID64: "54822487235354124",
      isSelf: false,
      name: "FakeSammy",
      tags: ["Convict"],
      gameInfo: {
        deaths: 0,
        state: "Joining",
        kills: 0,
        team: 1,
        loss: 0,
        ping: 40,
        userid: "0"
      }
    },
    {
      steamID64: "5842421335354124",
      isSelf: false,
      name: "FakeSammy",
      tags: ["Convict"],
      gameInfo: {
        deaths: 0,
        state: "In-Game",
        kills: 0,
        team: 1,
        loss: 0,
        ping: 40,
        userid: "0"
      }
    },
    {
      steamID64: "980724235354124",
      isSelf: false,
      name: "OtherSammy",
      tags: ["Convict"],
      gameInfo: {
        deaths: 0,
        state: "In-Game",
        kills: 0,
        team: 0,
        loss: 0,
        ping: 40,
        userid: "0"
      }
    },
    {
      steamID64: "32415354124",
      isSelf: false,
      name: "FakeSammy3",
      tags: ["Convict"],
      gameInfo: {
        deaths: 0,
        state: "In-Game",
        kills: 0,
        team: 1,
        loss: 0,
        ping: 40,
        userid: "0"
      }
    }
  ]
}

export const emptyData: ServerInfoResponse = {
  hostname: "",
  ip: "",
  map: "",
  maxPlayers: 32,
  numPlayers: 0,
  players: []
}