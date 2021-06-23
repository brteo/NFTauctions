import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const en = require('../lang/en/common.json');
const it = require('../lang/it/common.json');

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		debug: true,
		whitelist: ['en', 'it']
	});

i18n.addResourceBundle('en', 'translation', en, true, true);
i18n.addResourceBundle('it', 'translation', it, true, true);
export default i18n;
