import { masterbaseOnlineCheckInterval } from '@api/masterbase/constants';
import { readProvisionKey, status } from '@api/masterbase/masterbase-api';
import React from 'react';
import './App.css';

import { isBackendConfigured, isDevelopment, verifyBackend } from '@api/globals';
import { Button, SideMenu, TextInput } from '@components/General';
import {
  ContentPageContainer,
  PlayerHistory,
  PlayerList,
  Preferences,
} from '../Pages';
import { Modal } from '@components/General/Modal/Modal';
import { useModal } from '../Context';
import { setLanguage, t } from '@i18n';
import { getAllSettings, setSettingKey } from '@api/preferences';
import { useMinimode } from '../Context';
import { PAGES } from '../constants/menuConstants';

const CantConnectModal = () => {
  return (
    <div className="App-modal">
      <h2 className="text-center">Waiting for Backend</h2>

      <div className="spinner" />
      <p>Please make sure the backend is running.</p>
    </div>
  );
};

interface ConfigurationModalProps {
  closeModal: () => void;
}

const ConfigurationModal = ({ closeModal }: ConfigurationModalProps) => {
  const [steamAPIKey, setSteamAPIKey] = React.useState('');
  const [rconPassword, setRconPassword] = React.useState('mac_rcon');

  return (
    <div className="App-modal">
      <h1 className="mb-6 relative text-2xl text-center">
        {t('CONFIGURATION')}
      </h1>
      <p className="text-center">{t('CONF_FIRST_TIME')}</p>
      <p className="text-center mb-6">{t('CONF_FIRST_TIME_DESC')}</p>
      <div className="justify-center items-center">
        <div className="flex justify-center">
          <a
            className="link steam-api-key"
            href="https://steamcommunity.com/dev/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('PREF_STEAM_API_KEY')}
          </a>
          <TextInput
            defaultValue={steamAPIKey}
            type="password"
            onChange={(e) => setSteamAPIKey(e)}
          />
        </div>
        <div style={{ marginTop: '10px' }} />
        <div className="flex justify-center">
          <div className="mr-8">{t('PREF_RCON_PASSWORD')}</div>
          <TextInput
            defaultValue={rconPassword}
            onChange={(e) => setRconPassword(e)}
          />
        </div>

        <div className="text-sm text-gray-500 text-center">
          {t('CONF_REMINDER')}
        </div>

        <div className="mt-5" />
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
  const { isMinimode } = useMinimode();
  const [currentPage, setCurrentPage] = React.useState(PAGES.PLAYER_LIST);
  const [apiKey, setApiKey] = React.useState<string>(readProvisionKey());
  const [isOnline, setIsOnline] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { closeModal, openModal, modalContent } = useModal();

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.PLAYER_LIST:
        return <PlayerList />;
      case PAGES.PREFERENCES:
        return <Preferences />;
      case PAGES.PLAYER_HISTORY:
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
      closeModal();
      openModal(<CantConnectModal />);
      return false;
    }
  };

  const verifyConfigured = async () => {
    try {
      const configured = await isBackendConfigured();
      if (!configured) throw new Error('Backend not configured');
      return true;
    } catch (e) {
      console.error('Error verifying backend configuration', e);
      // Close any previous modal
      closeModal();
      openModal(<ConfigurationModal closeModal={closeModal} />);
      return false;
    }
  };

  const verificationRoutine = async () => {
    let connected = false;
    let dead = false;
    do {
      connected = await isBackendConnected();
      if (!connected) {
        dead = true;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      }
    } while (!connected);
    if (dead) closeModal(); // If backend died, we need to remove the modal once it recovers.
  };
  const masterbaseOnline = async () => {
    return await status()
      .then((res) => res === 'OK')
      .catch(() => false);
  };

  React.useEffect(() => {
    // Set language from settings
    const setLanguageFromSettings = async () => {
      const settings = await getAllSettings();
      if (settings.external.language) {
        setLanguage(settings.external.language);
      }
    };
    const masterbase = async () => {
      setIsOnline(await masterbaseOnline());
    };
    void setLanguageFromSettings();
    void masterbase();
    const masterbaseInterval = setInterval(
      masterbase,
      masterbaseOnlineCheckInterval,
    );
    // Don't verify backend if we're using fakedata (dev environment)
    if (isDevelopment) return;

    void verificationRoutine();
    const intervalId = setInterval(verificationRoutine, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(masterbaseInterval);
    };
  }, [currentPage]);

  return (
    <div className="App">
      <Modal />
      {!isMinimode && (
        <div className="App-sidebar">
          <SideMenu
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            showProvisionPrompt={!apiKey}
            isOnline={isOnline}
          />
        </div>
      )}
      <div className="App-content">
        <ContentPageContainer>{renderPage()}</ContentPageContainer>
      </div>
    </div>
  );
}

export default App;
