import React from 'react';
import './App.css';

import { SideMenu } from '../components/General';
import {
  ContentPageContainer,
  PlayerHistory,
  PlayerList,
  Preferences,
} from '../Pages';

function App() {
  const [currentPage, setCurrentPage] = React.useState('');

  const renderPage = () => {
    switch (currentPage) {
      case 'playerlist':
        return <PlayerList />;
      case 'preferences':
        return <Preferences />;
      case 'playerhistory':
        return <PlayerHistory />;
      default:
        return <PlayerList />;
    }
  };

  return (
    <div className="App">
      <div className="App-sidebar">
        <SideMenu setCurrentPage={setCurrentPage} />
      </div>
      <div className="App-content">
        <ContentPageContainer>{renderPage()}</ContentPageContainer>
      </div>
    </div>
  );
}

export default App;
