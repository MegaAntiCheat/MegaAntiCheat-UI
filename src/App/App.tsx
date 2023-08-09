import React from 'react';
import './App.css';

import { isBackendConfigured, useFakedata, verifyBackend } from '@api/globals';
import { Button, Flex, SideMenu, TextInput } from '@components/General';
import {
  ContentPageContainer,
  PlayerHistory,
  PlayerList,
  Preferences,
} from '../Pages';
import { Modal } from '@components/Modal/Modal';
import useModal from '@components/Modal/ModalHook';
import { setLanguage, t } from '@i18n';
import { getAllSettings, setSettingKey } from '@api/preferences';

const CantConnectModal = () => {
  return (
    <div className="App-modal">
      <h2 style={{ textAlign: 'center' }}>Waiting for Backend</h2>

      <div className="spinner" />
      <p>Please make sure the backend is running.</p>
    </div>
  );
};

interface ConfigurationModalProps {
  closeModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConfigurationModal = ({ closeModal }: ConfigurationModalProps) => {
  const [steamAPIKey, setSteamAPIKey] = React.useState('');
  const [rconPassword, setRconPassword] = React.useState('');

  return (
    <div className="App-modal">
      <h2 style={{ top: '-10px', position: 'relative' }}>
        {t('CONFIGURATION')}
      </h2>
      <p>{t('CONF_FIRST_TIME')}</p>
      <p>{t('CONF_FIRST_TIME_DESC')}</p>
      <div style={{ marginBottom: '30px' }} />
      <div>
        <Flex
          style={{
            display: 'grid',
            gridTemplateColumns: '45% 30%',
            overflow: 'hidden',
          }}
        >
          <a
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            className="link"
            href="https://steamcommunity.com/dev/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('PREF_STEAM_API_KEY')}
          </a>
          <TextInput type="password" onChange={(e) => setSteamAPIKey(e)} />
        </Flex>
        <div style={{ marginTop: '10px' }} />
        <Flex
          style={{
            display: 'grid',
            gridTemplateColumns: '45% 30%',
            overflow: 'hidden',
          }}
        >
          <div>{t('PREF_RCON_PASSWORD')}</div>
          <TextInput onChange={(e) => setRconPassword(e)} />
        </Flex>

        <div style={{ marginTop: '20px' }} />
        <Button
          className="mac-button middle"
          onClick={() => {
            if (!steamAPIKey.trim() || !rconPassword.trim()) return;

            setSettingKey('steamApiKey', steamAPIKey, 'internal');
            setSettingKey('rconPassword', rconPassword, 'internal');
            closeModal();
          }}
        >
          Save
        </Button>
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

  const isBackendConnected = async () => {
    try {
      const backendRunning = await verifyBackend();
      if (!backendRunning) throw new Error('Backend not running');
      return true;
    } catch (e) {
      console.error('Error verifying backend connection', e);
      // Close any previous modal
      modal.closeModal();
      modal.openModal(<CantConnectModal />);
      return false;
    }
  };

  const verifyConfigured = async () => {
    try {
      const configured = await isBackendConfigured();
      if (!configured) throw new Error('Backend not configured');
      modal.closeModal();
      return true;
    } catch (e) {
      console.error('Error verifying backend configuration', e);
      // Close any previous modal
      modal.closeModal();
      modal.openModal(<ConfigurationModal closeModal={modal.closeModal} />);
      return false;
    }
  };

  const verificationRoutine = async () => {
    let connected = false;
    do {
      connected = await isBackendConnected();
      if (!connected) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    } while (!connected);
    verifyConfigured();
  };

  React.useEffect(() => {
    // Set language from settings
    const setLanguageFromSettings = async () => {
      const settings = await getAllSettings();
      if (settings.external.language) {
        setLanguage(settings.external.language);
      }
    };
    setLanguageFromSettings();

    // Don't verify backend if we're using fakedata (dev environment)
    if (useFakedata) return;

    verificationRoutine();
    const intervalId = setInterval(verificationRoutine, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentPage]);

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
