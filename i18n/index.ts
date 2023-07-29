import en_US from './en_US.json';
import de_DE from './de_DE.json';
import ru_RU from './ru_RU.json';
import tr_TR from './tr_TR.json';

let currentLang = 'English';
interface Translations {
  [key: string]: string;
}

const translations: { [key: string]: Translations } = {
  English: en_US,
  German: de_DE,
  Russian: ru_RU,
  Turkish: tr_TR,
};

const setLanguage = (lang: string) => {
  if (!translations[lang]) {
    throw new Error('Nuh uh');
  }

  currentLang = lang;
};

const t = (key: string, lang: string = currentLang) => {
  if (!translations[lang]) {
    throw new Error(`Failed to load Language for ${lang}`);
  }

  return translations[lang][key] || key;
};

export { t, translations, currentLang, setLanguage };
