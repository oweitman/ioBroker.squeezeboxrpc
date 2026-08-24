import en from './i18n/en.json';
import de from './i18n/de.json';

// I18n recognizes a language-based dictionary only if at least en, de and ru
// are present. Until a dedicated Russian translation exists, English is the
// fallback. The prefix must be the actual string, not a boolean flag.
export default { en, de, ru: en, prefix: 'squeezeboxrpc_' };
