import React from "react";
import "./App.css";

import { SideMenu } from "../components/General";
import { ContentPageContainer, PlayerList } from "../Pages";

function App() {
  return (
    <div className="App">
      <SideMenu />
      <ContentPageContainer>
        <PlayerList />
      </ContentPageContainer>
    </div>
  );
}

export default App;
