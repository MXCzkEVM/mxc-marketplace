import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from 'i18next-browser-languagedetector'
import { browserLangToLocaleKey } from './i18nLocal'

import de from "../locales/de.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";
import id from "../locales/id.json";
import it from "../locales/it.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import nl from "../locales/nl.json";
import pt from "../locales/pt.json";
import ro from "../locales/ro.json";
import ru from "../locales/ru.json";
import tr from "../locales/tr.json";
import vi from "../locales/vi.json";
import zh_CN from "../locales/zh_CN.json";
import zh_TW from "../locales/zh_TW.json";

const customDetector = {
    name: 'customDetector',
    lookup() {
        const detectedLang = typeof window !== 'undefined' ? navigator.language : 'en';
        return browserLangToLocaleKey[detectedLang];
    }
};

const languageDetectorCls = new LanguageDetector();
languageDetectorCls.addDetector(customDetector);

i18n.use(languageDetectorCls).use(initReactI18next).init({
    // lng: "en",
    fallbackLng: "en",
    resources: {
        "de": {
            translation: de
        },
        "en": {
            translation: en
        },
        "es": {
            translation: es
        },
        "fr": {
            translation: fr
        },
        "id": {
            translation: id
        },
        "it": {
            translation: it
        },
        "ja": {
            translation: ja
        },
        "ko": {
            translation: ko
        },
        "nl": {
            translation: nl
        },
        "pt": {
            translation: pt
        },
        "ro": {
            translation: ro
        },
        "ru": {
            translation: ru
        },
        "tr": {
            translation: tr
        },
        "vi": {
            translation: vi
        },
        "zh_CN": {
            translation: zh_CN
        },
        "zh_TW": {
            translation: zh_TW
        }
    },
    interpolation: {
        escapeValue: false,
    },
    detection: {
        order: ['customDetector', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
    }
})

export default i18n;