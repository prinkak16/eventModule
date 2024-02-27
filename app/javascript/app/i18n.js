import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import English from "./i18n-translation/en/translation.json";
import Hindi from "./i18n-translation/hn/translation.json";
import Marathi from './i18n-translation/mr/translation.json'
import Telugu from './i18n-translation/te/translation.json'
import Kannada from './i18n-translation/kn/translation.json'
import Tamil from './i18n-translation/ta/translation.json'
import Bengali from './i18n-translation/bn/translation.json'
import Odia from './i18n-translation/or/translation.json'
import Gujarati from './i18n-translation/gu/transalation.json'
import Punjabi from './i18n-translation/pa/translation.json'
import Malayalam from './i18n-translation/ml/translation.json'
import Assamese from './i18n-translation/as/translation.json'


// the translations
// (tip move them in a JSON file and import them,
const resources = {
    en: {
        translation: English,
    },
    hn: {
        translation: Hindi,
    },
    bn: {
        translation: Bengali,
    },
    as: {
        translation: Assamese,
    },
    gu: {
        translation: Gujarati,
    },
    kn: {
        translation: Kannada,
    },
    ml: {
        translation: Malayalam,
    },
    mr: {
        translation: Marathi,
    },
    or: {
        translation: Odia,
    },
    pa: {
        translation:Punjabi ,
    },
    ta: {
        translation: Tamil,
    },
    te: {
        translation: Telugu,
    },


};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources, lng: "en", fallbackLng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
