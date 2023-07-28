import React from 'react';
import './App.css';

import { useFakedata, verifyBackend } from '@api';
import { Flex, SideMenu, TextInput } from '@components/General';
import {
  ContentPageContainer,
  PlayerHistory,
  PlayerList,
  Preferences,
} from '../Pages';
import { Modal } from '@components/Modal/Modal';
import useModal from '@components/Modal/ModalHook';

const CantConnectModal = () => {
  return (
    <div className="App-modal">
      <h2 style={{ textAlign: 'center' }}>Waiting for Backend</h2>

      <div className="spinner" />
      <p>Please make sure the backend is running.</p>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConfigurationModal = () => {
  return (
    <div className="App-modal">
      <h2 style={{ top: '-10px', position: 'relative' }}>Configuration</h2>
      <p>Looks like this is the first time you're using MegaAntiCheat.</p>
      <p>Let's get everything ready for use!</p>
      <div style={{ marginBottom: '30px' }} />
      <div>
        <Flex
          style={{
            display: 'grid',
            gridTemplateColumns: '45% 30%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            onClick={() => parent.open('https://steamcommunity.com/dev/apikey')}
          >
            Steam Web API Key
          </div>
          <TextInput type="password" />
        </Flex>
        <div style={{ marginTop: '10px' }} />
        <Flex
          style={{
            display: 'grid',
            gridTemplateColumns: '45% 30%',
            overflow: 'hidden',
          }}
        >
          <div
            onClick={() => parent.open('https://steamcommunity.com/dev/apikey')}
          >
            RCON Password
          </div>
          <TextInput type="password" />
        </Flex>
      </div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = React.useState('');

  const modal = useModal();

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

  React.useEffect(() => {
    // Don't verify backend if we're on the preferences page
    // or if we're using fakedata (dev environment)
    if (useFakedata) return;
    if (currentPage === 'preferences') return;

    // Verify if the backend is running
    const verifyConnection = async () => {
      try {
        const backendRunning = await verifyBackend();
        if (!backendRunning) throw new Error('Backend not running');
        modal.closeModal();
        // Verify configuration if the backend is running
        verifyConfigured();
      } catch (e) {
        console.error('Error verifying backend connection', e);
        modal.openModal(<CantConnectModal />);
      }
    };

    // Open configuration modal if not configured
    const verifyConfigured = async () => {
      try {
        const configured = false;
        if (!configured) throw new Error('Backend not configured');
        modal.closeModal();
      } catch (e) {
        console.error('Error verifying backend configuration', e);
        modal.openModal(<ConfigurationModal />);
      }
    };

    verifyConnection()
      .then(() => setInterval(verifyConnection, 5000))
      .catch((e) => {
        console.error('Error verifying backend connection', e);
        modal.openModal(<CantConnectModal />);
      });
  }, []);

  return (
    <div className="App">
      {modal.showModal && (
        <Modal
          modalOptions={{ dismissable: false }}
          show={modal.showModal}
          onClose={modal.closeModal}
        >
          {modal.modalContent}
        </Modal>
      )}
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
