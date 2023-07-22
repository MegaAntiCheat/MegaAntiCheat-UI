import en_US from './en_US.json';
import de_DE from './de_DE.json';

let currentLang = 'English';

interface Translations {
  [key: string]: string;
}

const setLanguage = (lang: string) => {
  if (!translations[lang]) {
    throw new Error('Nuh uh');
  }

  currentLang = lang;
};

const translations: { [key: string]: Translations } = {
  English: en_US,
  German: de_DE,
};

const t = (key: string, lang: string = currentLang) => {
  if (!translations[lang]) {
    throw new Error(`Failed to load Language for ${lang}`);
  }

  return translations[lang][key] || key;
};

export { t, translations, currentLang, setLanguage };
