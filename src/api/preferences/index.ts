import { PREF_ENDPOINT } from '@api/globals';

async function setSettingKey(
  key: string,
  value: unknown,
  type: 'internal' | 'external' = 'external',
) {
  try {
    const formBody = {
      [type]: {
        [key]: value,
      },
    };

    const options = {
      method: 'PUT',
      body: JSON.stringify(formBody),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(PREF_ENDPOINT, options);
    console.log(response);

    if (!response.ok) throw new Error('Failed to set setting.');

    //return response.json();
  } catch (e) {
    console.error(e);
  }
}

async function setSettings(newSettings: PreferenceResponse) {
  try {
    const options = {
      method: 'PUT',
      body: JSON.stringify(newSettings),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(PREF_ENDPOINT, options);
    console.log(response);

    if (!response.ok) throw new Error('Failed to set setting.');

    //return response.json();
  } catch (e) {
    console.error(e);
  }
}

interface PreferenceResponse {
  internal: {
    tf2Directory: string;
    rconPassword: string;
    steamApiKey: string;
  };
  external: Settings;
}

interface Settings {
  language: string;
  openInApp: boolean;
  colors: {
    You: string;
    Player: string;
    Trusted: string;
    Suspicious: string;
    Cheater: string;
    Bot: string;
  };
}

export const defaultSettings: PreferenceResponse = {
  external: {
    language: 'English',
    openInApp: false,
    colors: {
      You: '##69c669',
      Player: 'none',
      Trusted: '#00ff00',
      Suspicious: '#ffff00',
      Cheater: '#ff0000',
      Bot: '#6f0307',
    },
  },
  internal: {
    tf2Directory: '',
    steamApiKey: '',
    rconPassword: '',
  },
};

// Merge settings with default settings
function mergeWithDefaults(
  settings: Partial<PreferenceResponse>,
): PreferenceResponse {
  const mergedSettings: PreferenceResponse = {
    external: {
      ...defaultSettings.external,
      ...settings.external,
      colors: {
        ...defaultSettings.external.colors,
        ...settings.external?.colors,
      },
    },
    internal: {
      ...defaultSettings.internal,
      ...settings.internal,
    },
  };
  return mergedSettings;
}

async function getAllSettings(): Promise<PreferenceResponse> {
  try {
    const settings = await (await fetch(PREF_ENDPOINT)).json();
    const mergedSettings = mergeWithDefaults(settings);
    return mergedSettings;
  } catch (e) {
    console.error(e);
    return defaultSettings;
  }
}

export { setSettingKey, setSettings, getAllSettings };
