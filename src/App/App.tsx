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
import { ContextMenuProvider } from '@components/General/ContextMenu/ContextMenuProvider';
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
          <TextInput type="password" onChange={(e) => setRconPassword(e)} />
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
  const [, setLoading] = React.useState(true);

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

  const verifyConnection = async () => {
    try {
      const backendRunning = await verifyBackend();
      if (!backendRunning) throw new Error('Backend not running');
      setLoading(false);
      // Verify configuration if the backend is running
      verifyConfigured();
    } catch (e) {
      console.error('Error verifying backend connection', e);
      setLoading(false);
      modal.openModal(<CantConnectModal />);
    }
  };

  const verifyConfigured = async () => {
    try {
      const configured = await isBackendConfigured();
      if (!configured) throw new Error('Backend not configured');
      setLoading(false);
    } catch (e) {
      console.error('Error verifying backend configuration', e);
      setLoading(false);
      modal.openModal(<ConfigurationModal closeModal={modal.closeModal} />);
    }
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

    // Don't verify backend if we're on the preferences page
    // or if we're using fakedata (dev environment)
    if (useFakedata) return;
    if (currentPage === 'preferences') return;

    verifyConnection();

    const intervalId = setInterval(verifyConnection, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentPage]);

  return (
    <ContextMenuProvider>
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
    </ContextMenuProvider>
  );
}

export default App;
