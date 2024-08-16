import de_DE from './de_DE.json';
import en_US from './en_US.json';
import es_ES from './es_ES.json';
import fr_FR from './fr_FR.json';
import ru_RU from './ru_RU.json';
import tr_TR from './tr_TR.json';
import ja_JP from './ja_JP.json';
import ja_RYU from './ja_RYU.json';
import uk_UA from './uk_UA.json';
import nl_NL from './nl_NL.json';
import ko_KR from './ko_KR.json';
import pt_BR from './pt_BR.json';

import { tos_EN } from './tos/en_US.js';

let currentLang = 'English';
interface Translations {
  [key: string]: string;
}

const translations: { [key: string]: Translations } = {
  German: de_DE,
  English: { ...en_US, tos: tos_EN },
  Spanish: es_ES,
  Russian: ru_RU,
  Turkish: tr_TR,
  Japanese: ja_JP,
  Uchinaguchi: ja_RYU,
  Ukrainian: uk_UA,
  Dutch: nl_NL,
  Korean: ko_KR,
  French: fr_FR,
  Portuguese: pt_BR,
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

  // If an entry isn't translated, it defaults to English and logs a warning
  if (translations[lang][key]) {
    return translations[lang][key];
  } else {
    console.warn(`No translation for ${key} in ${lang}`);
    return translations['English'][key];
  }
};

export { currentLang, setLanguage, t, translations };
