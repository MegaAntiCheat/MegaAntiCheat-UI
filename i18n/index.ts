import de_DE from './de_DE.json';
import en_US from './en_US.json';
import es_ES from './es_ES.json';
import ru_RU from './ru_RU.json';
import tr_TR from './tr_TR.json';
import ja_JP from './ja_JP.json';
import ja_RYU from './ja_RYU.json';
import uk_UA from './uk_UA.json';
import nl_NL from './nl_NL.json';

let currentLang = 'English';
interface Translations {
  [key: string]: string;
}

const translations: { [key: string]: Translations } = {
  German: de_DE,
  English: en_US,
  Spanish: es_ES,
  Russian: ru_RU,
  Turkish: tr_TR,
  Japanese: ja_JP,
  Uchinaguchi: ja_RYU,
  Ukrainian: uk_UA,
  Dutch: nl_NL,
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

  // Always default to English
  return translations[lang][key] || translations['English'][key];
};

export { currentLang, setLanguage, t, translations };
